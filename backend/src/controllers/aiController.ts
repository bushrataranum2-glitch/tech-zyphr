import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import prisma from "../lib/prisma";
import { AIMentorService } from "../services/aiMentorService";

export async function getDailyRecommendation(req: AuthRequest, res: Response) {
  try {
    // Check if there is an active recommendation from today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let rec = await prisma.aIRecommendation.findFirst({
      where: {
        userId: req.userId,
        createdAt: { gte: today }
      },
      orderBy: { createdAt: "desc" }
    });

    if (!rec) {
      rec = await AIMentorService.generateDailyRecommendation(req.userId!);
    }

    return res.json({ success: true, recommendation: rec });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to fetch AI recommendation" });
  }
}

export async function acceptRecommendation(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;

    const rec = await prisma.aIRecommendation.findUnique({ where: { id } });
    if (!rec || rec.userId !== req.userId) {
      return res.status(404).json({ success: false, message: "Recommendation not found" });
    }

    // Create quest from recommendation
    const quest = await prisma.quest.create({
      data: {
        userId: req.userId!,
        title: rec.suggestedQuestTitle,
        description: `Quest Master Recommendation: ${rec.reason}`,
        category: rec.category,
        difficulty: rec.difficulty,
        type: "DAILY",
        attributeAffected: rec.attribute,
        xpReward: rec.xpReward,
        goldReward: rec.goldReward
      }
    });

    return res.json({
      success: true,
      message: "Quest accepted and added to your board!",
      quest
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to accept recommendation" });
  }
}

export async function chatWithQuestMaster(req: AuthRequest, res: Response) {
  try {
    const { message } = req.body;
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    // Save user message to conversation history
    await prisma.aIConversation.create({
      data: {
        userId: req.userId!,
        role: "USER",
        content: message.trim()
      }
    });

    // Get mentor response
    const reply = await AIMentorService.askQuestMaster(req.userId!, message.trim());

    // Save assistant reply
    await prisma.aIConversation.create({
      data: {
        userId: req.userId!,
        role: "ASSISTANT",
        content: reply
      }
    });

    return res.json({
      success: true,
      reply,
      timestamp: new Date()
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      reply: "⚠️ The Quest Master is temporarily recalibrating its neural lattice. Your character data remains safe.",
      message: error.message
    });
  }
}

export async function getConversationHistory(req: AuthRequest, res: Response) {
  try {
    const history = await prisma.aIConversation.findMany({
      where: { userId: req.userId },
      take: 20,
      orderBy: { createdAt: "asc" }
    });

    return res.json({ success: true, history });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to fetch chat history" });
  }
}

export async function getInsights(req: AuthRequest, res: Response) {
  try {
    const insights = await AIMentorService.getProgressInsights(req.userId!);
    return res.json({ success: true, insights });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to fetch AI insights" });
  }
}
