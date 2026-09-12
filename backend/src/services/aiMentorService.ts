import prisma from "../lib/prisma";

export interface AIAdviceContext {
  character: any;
  attributes: any;
  streak: any;
  recentQuests: any[];
  activeBoss: any;
  unlockedSkills: any[];
}

export class AIMentorService {
  /**
   * Builds rich context regarding current character state
   */
  static async getUserContext(userId: string): Promise<AIAdviceContext> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        character: {
          include: { attributes: true }
        },
        streak: true,
        skillUnlocks: {
          include: { skill: true }
        }
      }
    });

    const recentQuests = await prisma.quest.findMany({
      where: { userId },
      take: 10,
      orderBy: { createdAt: "desc" }
    });

    const activeBossProgress = await prisma.bossProgress.findFirst({
      where: { userId, isDefeated: false },
      include: { boss: true },
      orderBy: { boss: { level: "asc" } }
    });

    return {
      character: user?.character,
      attributes: user?.character?.attributes,
      streak: user?.streak,
      recentQuests,
      activeBoss: activeBossProgress,
      unlockedSkills: user?.skillUnlocks || []
    };
  }

  /**
   * Generates tailored Daily Quests based on attribute weaknesses and current boss
   */
  static async generateDailyRecommendation(userId: string) {
    const ctx = await this.getUserContext(userId);
    const attrs = ctx.attributes || {
      strength: 10,
      intelligence: 10,
      dexterity: 10,
      wisdom: 10,
      charisma: 10,
      discipline: 10
    };

    // Find lowest attribute
    const attrEntries = [
      { name: "Strength", value: attrs.strength, category: "FITNESS" },
      { name: "Intelligence", value: attrs.intelligence, category: "CODING" },
      { name: "Dexterity", value: attrs.dexterity, category: "FITNESS" },
      { name: "Wisdom", value: attrs.wisdom, category: "STUDY" },
      { name: "Charisma", value: attrs.charisma, category: "GROWTH" },
      { name: "Discipline", value: attrs.discipline, category: "DISCIPLINE" }
    ];

    attrEntries.sort((a, b) => a.value - b.value);
    const weakest = attrEntries[0];
    const strongest = attrEntries[attrEntries.length - 1];

    let questTitle = "";
    let reason = "";
    let difficulty = "NORMAL";
    let xpReward = 80;
    let goldReward = 20;

    if (weakest.name === "Discipline") {
      questTitle = "Focused 30-Minute Sprint";
      reason = `Your ${strongest.name} (${strongest.value}) leads the way, but your Discipline (${weakest.value}) lags behind. Anchor your day with an early distraction-free session.`;
      difficulty = "NORMAL";
      xpReward = 80;
      goldReward = 20;
    } else if (weakest.name === "Intelligence") {
      questTitle = "Deep Technical Study / DSA Problem";
      reason = `To balance your physical prowess, feed the neural lattice with algorithmic challenges or architecture reading.`;
      difficulty = "HARD";
      xpReward = 150;
      goldReward = 40;
    } else if (weakest.name === "Strength") {
      questTitle = "30-Minute Power Circuit / Calisthenics";
      reason = `Your mind is sharp, yet your physical chassis requires reinforcement. Strengthen your kinetic foundation.`;
      difficulty = "NORMAL";
      xpReward = 80;
      goldReward = 20;
    } else if (weakest.name === "Wisdom") {
      questTitle = "Read 20 Pages of Non-Fiction & Reflect";
      reason = `Deep understanding balances high action. Absorb enduring insights to elevate your strategic decision-making.`;
      difficulty = "NORMAL";
      xpReward = 80;
      goldReward = 20;
    } else if (weakest.name === "Charisma") {
      questTitle = "Share Insights or Present a Project Idea";
      reason = `Your skills deserve visibility. Articulate your vision to peers or draft a knowledge-sharing article.`;
      difficulty = "NORMAL";
      xpReward = 80;
      goldReward = 20;
    } else {
      questTitle = "High-Intensity Ergonomic Walk";
      reason = `Maintain your kinetic agility and clear mental caches with a brisk outdoor stroll.`;
      difficulty = "EASY";
      xpReward = 40;
      goldReward = 10;
    }

    // Check boss weakness adaptation
    if (ctx.activeBoss && ctx.activeBoss.boss) {
      const boss = ctx.activeBoss.boss;
      reason += ` Doing so will also exploit ${boss.name}'s weakness against ${boss.weaknessCategory}!`;
    }

    const recommendation = await prisma.aIRecommendation.create({
      data: {
        userId,
        title: `${weakest.name.toUpperCase()} AWAKENING`,
        reason,
        suggestedQuestTitle: questTitle,
        category: weakest.category,
        difficulty,
        attribute: weakest.name.toUpperCase(),
        xpReward,
        goldReward
      }
    });

    return recommendation;
  }

  /**
   * Interactive "Ask Quest Master" dialogue engine
   */
  static async askQuestMaster(userId: string, question: string): Promise<string> {
    const ctx = await this.getUserContext(userId);
    const { character, attributes, streak, activeBoss } = ctx;

    const lowerQ = question.toLowerCase();

    // Check if API key is provided and try remote LLM
    const apiKey = process.env.AI_API_KEY;
    if (apiKey && apiKey.trim().length > 5) {
      try {
        const prompt = `You are Quest Master, a wise, authoritative, yet encouraging cyberpunk-fantasy mentor in the RPG life progression app 'QuestMe'.
User status:
- Level: ${character?.level} (${character?.title}, Stage: ${character?.evolutionStage})
- XP: ${character?.currentXp}
- Gold: ${character?.gold}, Crystals: ${character?.crystals}
- Stats: STR ${attributes?.strength}, INT ${attributes?.intelligence}, DEX ${attributes?.dexterity}, WIS ${attributes?.wisdom}, CHA ${attributes?.charisma}, DISC ${attributes?.discipline}
- Streak: ${streak?.currentStreak || 0} days
- Active Boss: ${activeBoss?.boss?.name || "None"} (HP: ${activeBoss?.currentHp}/${activeBoss?.boss?.maxHp})

User question: "${question}"
Answer in 2-3 concise, flavorful, actionable paragraphs speaking directly to the user as their RPG mentor.`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        });

        if (response.ok) {
          const data = (await response.json()) as any;
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) return text;
        }
      } catch (err) {
        console.warn("Remote AI service fallback:", err);
      }
    }

    // Intelligent context-aware fallback engine
    if (lowerQ.includes("boss") || lowerQ.includes("procrastination") || lowerQ.includes("defeat")) {
      if (activeBoss) {
        return `Greetings, Champion. You currently face ${activeBoss.boss.name} with ${activeBoss.currentHp} / ${activeBoss.boss.maxHp} HP remaining.
Its primary vulnerability is **${activeBoss.boss.weaknessCategory}**.
To strike decisive blows, complete quests aligned with ${activeBoss.boss.weaknessCategory}. Each completed quest directly channels kinetic damage into the raid gauge, amplified by your current ${streak?.currentStreak || 0}-day streak multiplier. Do not hesitate—strike before the day resets!`;
      } else {
        return `You have subjugated all current active raid bosses! Prepare yourself for higher dimensional rifts in the Null Horizon. Continue honing your Discipline to maintain absolute sovereignty.`;
      }
    }

    if (lowerQ.includes("intelligence") || lowerQ.includes("coding") || lowerQ.includes("study")) {
      return `To sharpen your Intelligence (currently at **${attributes?.intelligence || 10}**), commit to deep, uninterrupted technical study.
I recommend registering quests for algorithmic problem solving, code refactoring, or reading system design literature. Intelligence quests paired with high difficulty grant up to +150 XP and +10 INT per session!`;
    }

    if (lowerQ.includes("discipline") || lowerQ.includes("streak") || lowerQ.includes("habit")) {
      return `Discipline is the spine of character evolution (yours sits at **${attributes?.discipline || 10}**).
Your active streak is **${streak?.currentStreak || 0} days**. Remember that every quest, regardless of difficulty, awards bonus Discipline. Lock down a morning ritual before opening communications, and let momentum carry your evolution.`;
    }

    if (lowerQ.includes("level") || lowerQ.includes("xp") || lowerQ.includes("evolution")) {
      return `You stand at **Level ${character?.level || 1} (${character?.evolutionStage} stage)** with **${character?.currentXp || 0} XP**.
Under our non-linear progression laws, higher tiers demand exponential consistency. To accelerate your ascent, take on HARD and EPIC quests, preserve your daily streak for multipliers, and fell obstacle bosses for massive XP caches!`;
    }

    if (lowerQ.includes("skill") || lowerQ.includes("tree")) {
      return `Your skill lattice responds directly to your highest attributes. If you lean toward the Intellect branch, aim for *Focus Protocol* and *Algorithmic Clarity*. If physical endurance calls, forge *Iron Will*. Spend your stat points deliberately; mastered nodes unlock passive multipliers that affect every subsequent action.`;
    }

    // Default inspirational mentor answer
    return `Listen closely, Hunter. At Level ${character?.level || 1}, with a ${streak?.currentStreak || 0}-day streak, you are actively transmuting routine effort into mythic power.
Today's directive: identify the single task you are most tempted to delay, log it as a Hard Quest, and strike it down immediately. The world of Neo-Alexandria waits for no hesitant soul.`;
  }

  /**
   * Generates periodic progress insights card
   */
  static async getProgressInsights(userId: string) {
    const ctx = await this.getUserContext(userId);
    const completions = await prisma.questCompletion.findMany({
      where: { userId },
      take: 20,
      orderBy: { completedAt: "desc" }
    });

    const totalXpEarned = completions.reduce((acc, c) => acc + c.xpEarned, 0);
    const totalGoldEarned = completions.reduce((acc, c) => acc + c.goldEarned, 0);

    const lowestAttr = Object.entries(ctx.attributes || {})
      .filter(([k]) => ["strength", "intelligence", "dexterity", "wisdom", "charisma", "discipline"].includes(k))
      .sort(([, a], [, b]) => (a as number) - (b as number))[0];

    return {
      completionsCount: completions.length,
      totalXpEarned,
      totalGoldEarned,
      currentStreak: ctx.streak?.currentStreak || 0,
      weakestAttribute: lowestAttr ? lowestAttr[0].toUpperCase() : "DISCIPLINE",
      message: completions.length > 0
        ? `You have harvested ${totalXpEarned} XP and ${totalGoldEarned} Gold across your latest sessions. Elevating your ${lowestAttr ? lowestAttr[0].toUpperCase() : "Discipline"} will unlock next-tier boss raid bonuses.`
        : `Your journey is just beginning. Take on your starter quests to commence the feedback loop.`
    };
  }
}
