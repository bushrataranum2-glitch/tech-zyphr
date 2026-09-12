import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";
import { AuthRequest } from "../middleware/auth";
import { getXpRequiredForLevel } from "../config/gameConfig";

const JWT_SECRET = process.env.JWT_SECRET || "questme_super_secret_jwt_key_2026_rpg_evolution";

const CLASS_STARTER_STATS: Record<string, { str: number; int: number; dex: number; wis: number; cha: number; disc: number }> = {
  WARRIOR: { str: 18, int: 8, dex: 12, wis: 8, cha: 10, disc: 16 },
  SAGE: { str: 8, int: 18, dex: 10, wis: 18, cha: 10, disc: 14 },
  TECHMANCER: { str: 8, int: 20, dex: 14, wis: 12, cha: 10, disc: 14 },
  RANGER: { str: 14, int: 10, dex: 18, wis: 12, cha: 10, disc: 14 },
  MAGE: { str: 6, int: 16, dex: 10, wis: 18, cha: 12, disc: 12 },
  CREATOR: { str: 8, int: 14, dex: 14, wis: 12, cha: 18, disc: 12 }
};

export async function register(req: Request, res: Response) {
  try {
    const {
      email,
      password,
      name,
      heroGender = "MALE",
      heroClass = "TECHMANCER",
      selectedGoals = [],
      initialDifficulty = "NORMAL"
    } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ success: false, message: "Email, password, and name are required" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ success: false, message: "User with this email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const starterStats = CLASS_STARTER_STATS[heroClass.toUpperCase()] || CLASS_STARTER_STATS.WARRIOR;

    const user = await prisma.$transaction(async (tx) => {
      // 1. Create User
      const newUser = await tx.user.create({
        data: {
          email,
          passwordHash,
          name
        }
      });

      // 2. Create Profile
      await tx.profile.create({
        data: {
          userId: newUser.id,
          heroGender,
          heroClass,
          selectedGoals: JSON.stringify(selectedGoals),
          initialDifficulty
        }
      });

      // 3. Create Character & Attributes
      const newChar = await tx.character.create({
        data: {
          userId: newUser.id,
          level: 1,
          currentXp: 0,
          title: "Novice Adventurer",
          evolutionStage: "Novice",
          gold: 100, // Starter gold
          crystals: 15,
          tokens: 0
        }
      });

      await tx.attributes.create({
        data: {
          characterId: newChar.id,
          strength: starterStats.str,
          intelligence: starterStats.int,
          dexterity: starterStats.dex,
          wisdom: starterStats.wis,
          charisma: starterStats.cha,
          discipline: starterStats.disc
        }
      });

      // 4. Create Streak
      await tx.streak.create({
        data: {
          userId: newUser.id,
          currentStreak: 0,
          longestStreak: 0,
          lastActiveDate: null
        }
      });

      // 5. Initialize Boss Progress for all bosses
      const allBosses = await tx.boss.findMany();
      for (const b of allBosses) {
        await tx.bossProgress.create({
          data: {
            userId: newUser.id,
            bossId: b.id,
            currentHp: b.maxHp,
            isDefeated: false,
            timesDefeated: 0
          }
        });
      }

      // 6. Unlock Starting World Region
      const startRegion = await tx.worldRegion.findFirst({ where: { unlockLevel: 1 } });
      if (startRegion) {
        await tx.userRegion.create({
          data: {
            userId: newUser.id,
            regionId: startRegion.id,
            isUnlocked: true,
            unlockedAt: new Date()
          }
        });
      }

      // 7. Generate Starter Quests
      const starterQuests = [
        {
          title: "🌱 First Step into the Rift",
          description: "Complete your first real-world task to calibrate your neural interface.",
          category: "GROWTH",
          difficulty: "EASY",
          type: "DAILY",
          attributeAffected: "DISCIPLINE",
          xpReward: 50,
          goldReward: 15,
          recurrence: "NONE",
          estimatedMinutes: 15
        },
        {
          title: "🧠 Mind Awakening",
          description: "Read 15 pages of a non-fiction book, documentation, or study paper.",
          category: "STUDY",
          difficulty: "EASY",
          type: "DAILY",
          attributeAffected: "WISDOM",
          xpReward: 40,
          goldReward: 10,
          recurrence: "DAILY",
          estimatedMinutes: 20
        },
        {
          title: "⚡ Focus Initiation",
          description: "Engage in 25 minutes of deep focus without social media interruptions.",
          category: "DISCIPLINE",
          difficulty: "NORMAL",
          type: "DAILY",
          attributeAffected: "DISCIPLINE",
          xpReward: 80,
          goldReward: 20,
          recurrence: "DAILY",
          estimatedMinutes: 25
        },
        {
          title: "🏃 Kinetic Activation",
          description: "Complete a 15-minute walk, run, or stretching circuit.",
          category: "FITNESS",
          difficulty: "EASY",
          type: "DAILY",
          attributeAffected: "STRENGTH",
          xpReward: 50,
          goldReward: 15,
          recurrence: "DAILY",
          estimatedMinutes: 15
        },
        {
          title: "💻 Code Matrix Link",
          description: "Write clean code or solve 1 algorithmic problem.",
          category: "CODING",
          difficulty: "NORMAL",
          type: "MAIN",
          attributeAffected: "INTELLIGENCE",
          xpReward: 80,
          goldReward: 20,
          recurrence: "NONE",
          estimatedMinutes: 45
        }
      ];

      for (const q of starterQuests) {
        await tx.quest.create({
          data: {
            ...q,
            userId: newUser.id
          }
        });
      }

      // 8. Welcome Notification
      await tx.notification.create({
        data: {
          userId: newUser.id,
          type: "LEVEL_UP",
          title: "⚔️ Welcome to QuestMe!",
          message: `Hero registered as ${heroClass}. Your journey begins now. Complete your starter quests to awaken your true potential.`
        }
      });

      return newUser;
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

    return res.status(201).json({
      success: true,
      message: "Hero registered successfully",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to register hero" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
        character: {
          include: { attributes: true }
        }
      }
    });

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profile: user.profile,
        character: user.character
      }
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Login failed" });
  }
}

export async function getMe(req: AuthRequest, res: Response) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: {
        profile: true,
        character: {
          include: { attributes: true }
        },
        streak: true,
        inventory: {
          where: { isEquipped: true },
          include: { item: true }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const requiredXp = getXpRequiredForLevel(user.character?.level || 1);

    return res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profile: user.profile,
        character: {
          ...user.character,
          requiredXp
        },
        streak: user.streak,
        equippedGear: user.inventory
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to get user profile" });
  }
}

export async function updateProfile(req: AuthRequest, res: Response) {
  try {
    const { heroGender, heroClass, bio, avatarUrl } = req.body;
    const updated = await prisma.profile.update({
      where: { userId: req.userId },
      data: {
        ...(heroGender && { heroGender }),
        ...(heroClass && { heroClass }),
        ...(bio !== undefined && { bio }),
        ...(avatarUrl !== undefined && { avatarUrl })
      }
    });

    return res.json({ success: true, profile: updated });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to update profile" });
  }
}
