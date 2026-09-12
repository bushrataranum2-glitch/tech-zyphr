import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import prisma from "../lib/prisma";

export async function getBosses(req: AuthRequest, res: Response) {
  try {
    const bosses = await prisma.boss.findMany({
      orderBy: { level: "asc" },
      include: {
        progress: {
          where: { userId: req.userId }
        }
      }
    });

    const enriched = bosses.map((b) => {
      const userProg = b.progress[0];
      const currentHp = userProg ? userProg.currentHp : b.maxHp;
      const isDefeated = userProg ? userProg.isDefeated : false;
      const timesDefeated = userProg ? userProg.timesDefeated : 0;
      const hpPercent = Math.max(0, Math.floor((currentHp / b.maxHp) * 100));

      return {
        id: b.id,
        name: b.name,
        description: b.description,
        lore: b.lore,
        maxHp: b.maxHp,
        currentHp,
        hpPercent,
        level: b.level,
        difficulty: b.difficulty,
        weaknessCategory: b.weaknessCategory,
        weaknessDesc: b.weaknessDesc,
        xpReward: b.xpReward,
        goldReward: b.goldReward,
        crystalsReward: b.crystalsReward,
        specialReward: b.specialReward,
        imageUrl: b.imageUrl,
        isDefeated,
        timesDefeated
      };
    });

    return res.json({ success: true, bosses: enriched });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to fetch bosses" });
  }
}

export async function getActiveBoss(req: AuthRequest, res: Response) {
  try {
    let progress = await prisma.bossProgress.findFirst({
      where: { userId: req.userId, isDefeated: false },
      include: { boss: true },
      orderBy: { boss: { level: "asc" } }
    });

    if (!progress) {
      // If all are defeated or none initialized, return first boss
      const firstBoss = await prisma.boss.findFirst({ orderBy: { level: "asc" } });
      if (firstBoss) {
        progress = await prisma.bossProgress.findUnique({
          where: {
            userId_bossId: {
              userId: req.userId!,
              bossId: firstBoss.id
            }
          },
          include: { boss: true }
        });
      }
    }

    if (!progress) {
      return res.status(404).json({ success: false, message: "No active boss found" });
    }

    const hpPercent = Math.max(0, Math.floor((progress.currentHp / progress.boss.maxHp) * 100));

    // Also fetch available active quests that can serve as "Attacks" against this boss!
    const availableAttacks = await prisma.quest.findMany({
      where: { userId: req.userId, isCompleted: false },
      take: 6,
      orderBy: { createdAt: "desc" }
    });

    const attacks = availableAttacks.map((q) => {
      const isWeakness =
        q.category.toUpperCase() === progress!.boss.weaknessCategory.toUpperCase() ||
        q.attributeAffected.toUpperCase() === progress!.boss.weaknessCategory.toUpperCase();
      const estimatedDamage = Math.floor(q.xpReward * (isWeakness ? 1.5 : 1.0));

      return {
        questId: q.id,
        title: q.title,
        category: q.category,
        difficulty: q.difficulty,
        damage: estimatedDamage,
        isWeaknessExploit: isWeakness
      };
    });

    return res.json({
      success: true,
      activeBoss: {
        id: progress.boss.id,
        name: progress.boss.name,
        description: progress.boss.description,
        lore: progress.boss.lore,
        maxHp: progress.boss.maxHp,
        currentHp: progress.currentHp,
        hpPercent,
        level: progress.boss.level,
        difficulty: progress.boss.difficulty,
        weaknessCategory: progress.boss.weaknessCategory,
        weaknessDesc: progress.boss.weaknessDesc,
        xpReward: progress.boss.xpReward,
        goldReward: progress.boss.goldReward,
        crystalsReward: progress.boss.crystalsReward,
        specialReward: progress.boss.specialReward,
        imageUrl: progress.boss.imageUrl,
        isDefeated: progress.isDefeated,
        attacks
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to fetch active boss" });
  }
}
