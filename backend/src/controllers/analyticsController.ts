import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import prisma from "../lib/prisma";

export async function getAnalytics(req: AuthRequest, res: Response) {
  try {
    const character = await prisma.character.findUnique({
      where: { userId: req.userId },
      include: { attributes: true }
    });

    const streak = await prisma.streak.findUnique({
      where: { userId: req.userId }
    });

    const completions = await prisma.questCompletion.findMany({
      where: { userId: req.userId },
      include: { quest: true },
      orderBy: { completedAt: "asc" }
    });

    // 1. Category Breakdown
    const categoryCounts: Record<string, number> = {};
    for (const c of completions) {
      const cat = c.quest?.category || "OTHER";
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    }

    // 2. XP & Quest activity over last 7 days
    const last7Days: Record<string, { date: string; xp: number; quests: number }> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const str = d.toISOString().split("T")[0];
      last7Days[str] = { date: str, xp: 0, quests: 0 };
    }

    for (const c of completions) {
      const dateStr = c.completedAt.toISOString().split("T")[0];
      if (last7Days[dateStr]) {
        last7Days[dateStr].xp += c.xpEarned;
        last7Days[dateStr].quests += 1;
      }
    }

    const activityTimeline = Object.values(last7Days);

    // 3. Attribute Distribution
    const attrs = character?.attributes || {
      strength: 10,
      intelligence: 10,
      dexterity: 10,
      wisdom: 10,
      charisma: 10,
      discipline: 10
    };

    const attributeRadar = [
      { subject: "Strength", value: attrs.strength, fullMark: 100 },
      { subject: "Intelligence", value: attrs.intelligence, fullMark: 100 },
      { subject: "Dexterity", value: attrs.dexterity, fullMark: 100 },
      { subject: "Wisdom", value: attrs.wisdom, fullMark: 100 },
      { subject: "Charisma", value: attrs.charisma, fullMark: 100 },
      { subject: "Discipline", value: attrs.discipline, fullMark: 100 }
    ];

    // 4. Boss Stats
    const totalBossDefeats = await prisma.bossProgress.aggregate({
      where: { userId: req.userId },
      _sum: { timesDefeated: true }
    });

    // 5. Total currency stats
    const totalGoldEarned = completions.reduce((acc, c) => acc + c.goldEarned, 0);

    return res.json({
      success: true,
      summary: {
        level: character?.level || 1,
        totalXp: character?.currentXp || 0,
        currentStreak: streak?.currentStreak || 0,
        longestStreak: streak?.longestStreak || 0,
        totalQuestsCompleted: completions.length,
        totalGoldEarned,
        bossesDefeated: totalBossDefeats._sum.timesDefeated || 0
      },
      categoryDistribution: Object.entries(categoryCounts).map(([cat, count]) => ({
        category: cat,
        count
      })),
      activityTimeline,
      attributeRadar
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to fetch analytics" });
  }
}
