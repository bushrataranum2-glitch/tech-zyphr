import prisma from "../lib/prisma";
import {
  DIFFICULTY_REWARDS,
  getXpRequiredForLevel,
  getEvolutionStageForLevel,
  STREAK_MILESTONES
} from "../config/gameConfig";

export interface QuestCompletionResult {
  questId: string;
  questTitle: string;
  xpEarned: number;
  goldEarned: number;
  attributeDelta: Record<string, number>;
  levelUp: {
    occurred: boolean;
    previousLevel: number;
    newLevel: number;
    newTitle: string;
    newStage: string;
    crystalsAwarded: number;
  };
  streak: {
    current: number;
    longest: number;
    milestoneHit?: {
      days: number;
      gold: number;
      crystals: number;
      badge: string;
    };
  };
  bossDamage: {
    dealt: number;
    bossName: string;
    remainingHp: number;
    defeated: boolean;
    bossRewards?: {
      xp: number;
      gold: number;
      crystals: number;
      specialReward?: string | null;
    };
  } | null;
  unlockedAchievements: Array<{
    code: string;
    name: string;
    description: string;
    crystalsReward: number;
  }>;
  unlockedRegions: Array<{
    code: string;
    name: string;
  }>;
}

export async function completeQuestForUser(
  userId: string,
  questId: string
): Promise<QuestCompletionResult> {
  return await prisma.$transaction(async (tx) => {
    // 1. Fetch Quest
    const quest = await tx.quest.findUnique({
      where: { id: questId }
    });

    if (!quest || quest.userId !== userId) {
      throw new Error("Quest not found or does not belong to user");
    }

    if (quest.isCompleted) {
      throw new Error("Quest is already completed");
    }

    // 2. Fetch User, Character, Attributes, and Streak
    const character = await tx.character.findUnique({
      where: { userId },
      include: { attributes: true }
    });

    if (!character || !character.attributes) {
      throw new Error("Character data not found");
    }

    let streakRecord = await tx.streak.findUnique({
      where: { userId }
    });

    if (!streakRecord) {
      streakRecord = await tx.streak.create({
        data: {
          userId,
          currentStreak: 0,
          longestStreak: 0,
          lastActiveDate: null
        }
      });
    }

    // 3. Compute Server-Side Rewards
    const rewardConfig = DIFFICULTY_REWARDS[quest.difficulty] || DIFFICULTY_REWARDS.NORMAL;
    const xpEarned = rewardConfig.xp;
    const goldEarned = rewardConfig.gold;

    const targetAttr = quest.attributeAffected.toLowerCase();
    const attributeDelta: Record<string, number> = {
      discipline: rewardConfig.discipline
    };
    if (targetAttr) {
      attributeDelta[targetAttr] = (attributeDelta[targetAttr] || 0) + rewardConfig.primaryAttr;
    }

    // 4. Update Streak Logic
    const now = new Date();
    const todayDateStr = now.toISOString().split("T")[0];
    let newStreak = streakRecord.currentStreak;
    let milestoneHit: any = null;

    if (!streakRecord.lastActiveDate) {
      newStreak = 1;
    } else {
      const lastDateStr = streakRecord.lastActiveDate.toISOString().split("T")[0];
      if (lastDateStr === todayDateStr) {
        // already counted for today
      } else {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        if (lastDateStr === yesterdayStr) {
          newStreak += 1;
        } else {
          newStreak = 1; // streak broke
        }
      }
    }

    const longestStreak = Math.max(streakRecord.longestStreak, newStreak);

    // Check streak milestones
    if (STREAK_MILESTONES[newStreak] && streakRecord.currentStreak < newStreak) {
      const ms = STREAK_MILESTONES[newStreak];
      milestoneHit = {
        days: newStreak,
        gold: ms.gold,
        crystals: ms.crystals,
        badge: ms.badge
      };
    }

    await tx.streak.update({
      where: { userId },
      data: {
        currentStreak: newStreak,
        longestStreak,
        lastActiveDate: now
      }
    });

    // 5. XP & Level Progression Logic
    let currentXp = character.currentXp + xpEarned;
    let currentLevel = character.level;
    const previousLevel = currentLevel;
    let levelUpOccurred = false;
    let crystalsAwarded = 0;

    let requiredXp = getXpRequiredForLevel(currentLevel);
    while (currentXp >= requiredXp) {
      currentXp -= requiredXp;
      currentLevel += 1;
      levelUpOccurred = true;
      crystalsAwarded += 5; // 5 crystals per level
      requiredXp = getXpRequiredForLevel(currentLevel);
    }

    const evolutionInfo = getEvolutionStageForLevel(currentLevel);

    // Milestone bonus from streak
    let totalGold = character.gold + goldEarned + (milestoneHit ? milestoneHit.gold : 0);
    let totalCrystals = character.crystals + crystalsAwarded + (milestoneHit ? milestoneHit.crystals : 0);

    // Update Character
    await tx.character.update({
      where: { userId },
      data: {
        currentXp,
        level: currentLevel,
        title: evolutionInfo.title,
        evolutionStage: evolutionInfo.stage,
        gold: totalGold,
        crystals: totalCrystals
      }
    });

    // 6. Update Attributes
    const currentAttrs = character.attributes;
    const updatedAttrs: Record<string, number> = {
      strength: currentAttrs.strength + (attributeDelta["strength"] || 0),
      intelligence: currentAttrs.intelligence + (attributeDelta["intelligence"] || 0),
      dexterity: currentAttrs.dexterity + (attributeDelta["dexterity"] || 0),
      wisdom: currentAttrs.wisdom + (attributeDelta["wisdom"] || 0),
      charisma: currentAttrs.charisma + (attributeDelta["charisma"] || 0),
      discipline: currentAttrs.discipline + (attributeDelta["discipline"] || 0)
    };

    await tx.attributes.update({
      where: { characterId: character.id },
      data: updatedAttrs
    });

    // 7. Mark Quest Complete & Log Completion
    await tx.quest.update({
      where: { id: questId },
      data: {
        isCompleted: true,
        completedAt: now
      }
    });

    // 8. Boss Damage Calculation
    let bossDamageSummary: any = null;
    let bossDamageValue = 0;

    // Find user's active/first undefeated boss
    const activeBossProgress = await tx.bossProgress.findFirst({
      where: {
        userId,
        isDefeated: false
      },
      include: { boss: true },
      orderBy: { boss: { level: "asc" } }
    });

    if (activeBossProgress) {
      const boss = activeBossProgress.boss;
      const isWeaknessMatch =
        boss.weaknessCategory.toUpperCase() === quest.category.toUpperCase() ||
        boss.weaknessCategory.toUpperCase() === quest.attributeAffected.toUpperCase();

      const weaknessMultiplier = isWeaknessMatch ? 1.5 : 1.0;
      const streakBonus = Math.min(1.3, 1.0 + (newStreak * 0.02));
      bossDamageValue = Math.floor(xpEarned * weaknessMultiplier * streakBonus);

      const newBossHp = Math.max(0, activeBossProgress.currentHp - bossDamageValue);
      const bossDefeated = newBossHp === 0;

      await tx.bossProgress.update({
        where: { id: activeBossProgress.id },
        data: {
          currentHp: newBossHp,
          isDefeated: bossDefeated,
          defeatedAt: bossDefeated ? now : null,
          timesDefeated: bossDefeated ? activeBossProgress.timesDefeated + 1 : activeBossProgress.timesDefeated
        }
      });

      let bossRewards: any = undefined;
      if (bossDefeated) {
        bossRewards = {
          xp: boss.xpReward,
          gold: boss.goldReward,
          crystals: boss.crystalsReward,
          specialReward: boss.specialReward
        };

        // Add boss rewards to character
        await tx.character.update({
          where: { userId },
          data: {
            gold: { increment: boss.goldReward },
            crystals: { increment: boss.crystalsReward }
          }
        });

        // Record transaction
        await tx.transaction.create({
          data: {
            userId,
            type: "EARN_BOSS",
            currency: "GOLD",
            amount: boss.goldReward,
            description: `Defeated Boss: ${boss.name}`
          }
        });

        await tx.notification.create({
          data: {
            userId,
            type: "BOSS",
            title: "👹 Boss Defeated!",
            message: `You vanquished ${boss.name}! Claimed ${boss.goldReward} Gold & ${boss.crystalsReward} Crystals.`
          }
        });
      }

      bossDamageSummary = {
        dealt: bossDamageValue,
        bossName: boss.name,
        remainingHp: newBossHp,
        defeated: bossDefeated,
        bossRewards
      };
    }

    // Record Quest Completion History
    await tx.questCompletion.create({
      data: {
        userId,
        questId,
        xpEarned,
        goldEarned,
        attributeDelta: JSON.stringify(attributeDelta),
        bossDamageDealt: bossDamageValue,
        completedAt: now
      }
    });

    // Record Ledger Transactions
    await tx.transaction.create({
      data: {
        userId,
        type: "EARN_QUEST",
        currency: "GOLD",
        amount: goldEarned,
        description: `Completed Quest: ${quest.title}`
      }
    });

    // 9. Check Achievements
    const totalCompletions = await tx.questCompletion.count({ where: { userId } });
    const allAchievements = await tx.achievement.findMany();
    const unlockedAchievements = [];

    for (const ach of allAchievements) {
      const alreadyUnlocked = await tx.userAchievement.findUnique({
        where: {
          userId_achievementId: {
            userId,
            achievementId: ach.id
          }
        }
      });

      if (!alreadyUnlocked) {
        let conditionMet = false;

        if (ach.criteriaType === "QUEST_COUNT" && totalCompletions >= ach.criteriaValue) {
          conditionMet = true;
        } else if (ach.criteriaType === "STREAK_DAYS" && newStreak >= ach.criteriaValue) {
          conditionMet = true;
        } else if (ach.criteriaType === "LEVEL_REACHED" && currentLevel >= ach.criteriaValue) {
          conditionMet = true;
        } else if (ach.criteriaType === "GOLD_EARNED" && totalGold >= ach.criteriaValue) {
          conditionMet = true;
        } else if (ach.criteriaType === "BOSS_DEFEATED") {
          const defeatedCount = await tx.bossProgress.count({
            where: { userId, isDefeated: true }
          });
          if (defeatedCount >= ach.criteriaValue) {
            conditionMet = true;
          }
        }

        if (conditionMet) {
          await tx.userAchievement.create({
            data: {
              userId,
              achievementId: ach.id,
              unlockedAt: now
            }
          });

          // Reward Crystals
          await tx.character.update({
            where: { userId },
            data: { crystals: { increment: ach.crystalsReward } }
          });

          await tx.notification.create({
            data: {
              userId,
              type: "ACHIEVEMENT",
              title: "🏆 Achievement Unlocked!",
              message: `${ach.name}: ${ach.description} (+${ach.crystalsReward} Crystals)`
            }
          });

          unlockedAchievements.push({
            code: ach.code,
            name: ach.name,
            description: ach.description,
            crystalsReward: ach.crystalsReward
          });
        }
      }
    }

    // 10. Check World Region Unlocks
    const regions = await tx.worldRegion.findMany();
    const unlockedRegions = [];

    for (const reg of regions) {
      const existingUserRegion = await tx.userRegion.findUnique({
        where: {
          userId_regionId: {
            userId,
            regionId: reg.id
          }
        }
      });

      if ((!existingUserRegion || !existingUserRegion.isUnlocked) && currentLevel >= reg.unlockLevel) {
        if (!existingUserRegion) {
          await tx.userRegion.create({
            data: {
              userId,
              regionId: reg.id,
              isUnlocked: true,
              unlockedAt: now
            }
          });
        } else {
          await tx.userRegion.update({
            where: { id: existingUserRegion.id },
            data: {
              isUnlocked: true,
              unlockedAt: now
            }
          });
        }

        await tx.notification.create({
          data: {
            userId,
            type: "WORLD",
            title: "🗺️ New Region Discovered!",
            message: `You unlocked ${reg.name} (Requires Lv.${reg.unlockLevel}).`
          }
        });

        unlockedRegions.push({
          code: reg.code,
          name: reg.name
        });
      }
    }

    // 11. Notifications for Level Up
    if (levelUpOccurred) {
      await tx.notification.create({
        data: {
          userId,
          type: "LEVEL_UP",
          title: `⚡ LEVEL UP! You reached Level ${currentLevel}!`,
          message: `Title: "${evolutionInfo.title}". Stage: ${evolutionInfo.stage}. +${crystalsAwarded} Crystals awarded!`
        }
      });
    }

    return {
      questId: quest.id,
      questTitle: quest.title,
      xpEarned,
      goldEarned,
      attributeDelta,
      levelUp: {
        occurred: levelUpOccurred,
        previousLevel,
        newLevel: currentLevel,
        newTitle: evolutionInfo.title,
        newStage: evolutionInfo.stage,
        crystalsAwarded
      },
      streak: {
        current: newStreak,
        longest: longestStreak,
        milestoneHit
      },
      bossDamage: bossDamageSummary,
      unlockedAchievements,
      unlockedRegions
    };
  });
}
