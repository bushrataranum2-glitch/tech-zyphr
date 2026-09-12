import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import * as authController from "../controllers/authController";
import * as questController from "../controllers/questController";
import * as characterController from "../controllers/characterController";
import * as skillController from "../controllers/skillController";
import * as bossController from "../controllers/bossController";
import * as shopController from "../controllers/shopController";
import * as worldController from "../controllers/worldController";
import * as achievementController from "../controllers/achievementController";
import * as analyticsController from "../controllers/analyticsController";
import * as aiController from "../controllers/aiController";
import * as notificationController from "../controllers/notificationController";

const router = Router();

// Public Auth routes
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);

// Protected Auth & Profile routes
router.get("/auth/me", authMiddleware, authController.getMe);
router.patch("/auth/profile", authMiddleware, authController.updateProfile);

// Quest Routes
router.get("/quests", authMiddleware, questController.getQuests);
router.post("/quests", authMiddleware, questController.createQuest);
router.patch("/quests/:id", authMiddleware, questController.updateQuest);
router.delete("/quests/:id", authMiddleware, questController.deleteQuest);
router.post("/quests/:id/complete", authMiddleware, questController.completeQuest);

// Character Routes
router.get("/character", authMiddleware, characterController.getCharacterDetails);

// Skill Tree Routes
router.get("/skills", authMiddleware, skillController.getSkills);
router.post("/skills/:id/unlock", authMiddleware, skillController.unlockSkill);

// Boss Raid Routes
router.get("/bosses", authMiddleware, bossController.getBosses);
router.get("/bosses/active", authMiddleware, bossController.getActiveBoss);

// Shop & Inventory Routes
router.get("/shop/items", authMiddleware, shopController.getShopItems);
router.post("/shop/:itemId/purchase", authMiddleware, shopController.purchaseItem);
router.post("/shop/:itemId/equip", authMiddleware, shopController.equipItem);
router.get("/inventory", authMiddleware, shopController.getUserInventory);

// World Map Routes
router.get("/world/regions", authMiddleware, worldController.getWorldRegions);

// Achievements Routes
router.get("/achievements", authMiddleware, achievementController.getAchievements);

// Analytics Routes
router.get("/analytics", authMiddleware, analyticsController.getAnalytics);

// AI Quest Master Routes
router.get("/ai/recommendation", authMiddleware, aiController.getDailyRecommendation);
router.post("/ai/recommendation/:id/accept", authMiddleware, aiController.acceptRecommendation);
router.post("/ai/chat", authMiddleware, aiController.chatWithQuestMaster);
router.get("/ai/chat/history", authMiddleware, aiController.getConversationHistory);
router.get("/ai/insights", authMiddleware, aiController.getInsights);

// Notifications Routes
router.get("/notifications", authMiddleware, notificationController.getNotifications);
router.patch("/notifications/:id/read", authMiddleware, notificationController.markAsRead);

export default router;
