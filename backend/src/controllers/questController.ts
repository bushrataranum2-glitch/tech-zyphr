import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import prisma from "../lib/prisma";
import { completeQuestForUser } from "../services/progressionService";
import { DIFFICULTY_REWARDS } from "../config/gameConfig";

export async function getQuests(req: AuthRequest, res: Response) {
  try {
    const { category, type, completed } = req.query;

    const where: any = { userId: req.userId };
    if (category) where.category = String(category).toUpperCase();
    if (type) where.type = String(type).toUpperCase();
    if (completed !== undefined) where.isCompleted = completed === "true";

    const quests = await prisma.quest.findMany({
      where,
      orderBy: [{ isCompleted: "asc" }, { createdAt: "desc" }]
    });

    return res.json({ success: true, quests });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to fetch quests" });
  }
}

export async function createQuest(req: AuthRequest, res: Response) {
  try {
    const {
      title,
      description = "",
      category = "CAREER",
      difficulty = "NORMAL",
      type = "DAILY",
      dueDate,
      recurrence = "NONE",
      estimatedMinutes = 30,
      attributeAffected = "INTELLIGENCE",
      bossConnectionId
    } = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({ success: false, message: "Quest title cannot be empty" });
    }

    const rewardConfig = DIFFICULTY_REWARDS[difficulty.toUpperCase()] || DIFFICULTY_REWARDS.NORMAL;

    const quest = await prisma.quest.create({
      data: {
        userId: req.userId!,
        title: title.trim(),
        description: description.trim(),
        category: category.toUpperCase(),
        difficulty: difficulty.toUpperCase(),
        type: type.toUpperCase(),
        dueDate: dueDate ? new Date(dueDate) : null,
        recurrence: recurrence.toUpperCase(),
        estimatedMinutes: Number(estimatedMinutes) || 30,
        attributeAffected: attributeAffected.toUpperCase(),
        xpReward: rewardConfig.xp,
        goldReward: rewardConfig.gold,
        bossConnectionId
      }
    });

    return res.status(201).json({ success: true, quest });
  } catch (error: any) {
    console.error("Create quest error:", error);
    return res.status(500).json({ success: false, message: "Failed to create quest" });
  }
}

export async function updateQuest(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const { title, description, category, difficulty, type, estimatedMinutes, attributeAffected } = req.body;

    const existing = await prisma.quest.findUnique({ where: { id } });
    if (!existing || existing.userId !== req.userId) {
      return res.status(404).json({ success: false, message: "Quest not found" });
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (category !== undefined) updateData.category = category.toUpperCase();
    if (type !== undefined) updateData.type = type.toUpperCase();
    if (estimatedMinutes !== undefined) updateData.estimatedMinutes = Number(estimatedMinutes);
    if (attributeAffected !== undefined) updateData.attributeAffected = attributeAffected.toUpperCase();

    if (difficulty !== undefined) {
      const diffKey = difficulty.toUpperCase();
      const rewardConfig = DIFFICULTY_REWARDS[diffKey] || DIFFICULTY_REWARDS.NORMAL;
      updateData.difficulty = diffKey;
      updateData.xpReward = rewardConfig.xp;
      updateData.goldReward = rewardConfig.gold;
    }

    const updated = await prisma.quest.update({
      where: { id },
      data: updateData
    });

    return res.json({ success: true, quest: updated });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to update quest" });
  }
}

export async function deleteQuest(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const existing = await prisma.quest.findUnique({ where: { id } });
    if (!existing || existing.userId !== req.userId) {
      return res.status(404).json({ success: false, message: "Quest not found" });
    }

    await prisma.quest.delete({ where: { id } });
    return res.json({ success: true, message: "Quest deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to delete quest" });
  }
}

export async function completeQuest(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const result = await completeQuestForUser(req.userId!, id);
    return res.json({ success: true, result });
  } catch (error: any) {
    console.error("Complete quest error:", error);
    return res.status(400).json({ success: false, message: error.message || "Failed to complete quest" });
  }
}
