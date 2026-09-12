import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import prisma from "../lib/prisma";

export async function getAchievements(req: AuthRequest, res: Response) {
  try {
    const achievements = await prisma.achievement.findMany({
      orderBy: [{ category: "asc" }, { criteriaValue: "asc" }]
    });

    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId: req.userId }
    });

    const unlockedMap = new Map(userAchievements.map((ua) => [ua.achievementId, ua]));

    // Fetch current user metrics for progress tracking
    const questCount = await prisma.questCompletion.count({ where: { userId: req.userId } });
    const streakRecord = await prisma.streak.findUnique({ where: { userId: req.userId } });
    const character = await prisma.character.findUnique({ where: { userId: req.userId } });
    const bossesDefeated = await prisma.bossProgress.count({
      where: { userId: req.userId, isDefeated: true }
    });

    const enriched = achievements.map((ach) => {
      const unlock = unlockedMap.get(ach.id);
      const isUnlocked = !!unlock;

      let currentProgress = 0;
      if (ach.criteriaType === "QUEST_COUNT") currentProgress = questCount;
      else if (ach.criteriaType === "STREAK_DAYS") currentProgress = streakRecord?.currentStreak || 0;
      else if (ach.criteriaType === "LEVEL_REACHED") currentProgress = character?.level || 1;
      else if (ach.criteriaType === "GOLD_EARNED") currentProgress = character?.gold || 0;
      else if (ach.criteriaType === "BOSS_DEFEATED") currentProgress = bossesDefeated;

      const progressPercent = Math.min(100, Math.floor((currentProgress / ach.criteriaValue) * 100));

      return {
        id: ach.id,
        code: ach.code,
        name: ach.name,
        category: ach.category,
        description: ach.description,
        criteriaType: ach.criteriaType,
        criteriaValue: ach.criteriaValue,
        crystalsReward: ach.crystalsReward,
        xpReward: ach.xpReward,
        icon: ach.icon,
        isUnlocked,
        unlockedAt: unlock ? unlock.unlockedAt : null,
        currentProgress,
        progressPercent
      };
    });

    return res.json({
      success: true,
      totalCount: achievements.length,
      unlockedCount: userAchievements.length,
      achievements: enriched
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to fetch achievements" });
  }
}
