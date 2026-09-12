import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import prisma from "../lib/prisma";

export async function getWorldRegions(req: AuthRequest, res: Response) {
  try {
    const character = await prisma.character.findUnique({
      where: { userId: req.userId }
    });

    if (!character) {
      return res.status(404).json({ success: false, message: "Character not found" });
    }

    const allRegions = await prisma.worldRegion.findMany({
      orderBy: { unlockLevel: "asc" }
    });

    const userRegions = await prisma.userRegion.findMany({
      where: { userId: req.userId }
    });
    const unlockedIds = new Set(userRegions.filter((r) => r.isUnlocked).map((r) => r.regionId));

    const enriched = allRegions.map((reg) => {
      const isUnlocked = unlockedIds.has(reg.id) || character.level >= reg.unlockLevel;
      return {
        ...reg,
        isUnlocked,
        isCurrent: character.level >= reg.unlockLevel && (
          // mark as highest accessible region
          reg.unlockLevel <= character.level
        )
      };
    });

    return res.json({
      success: true,
      currentLevel: character.level,
      regions: enriched
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to fetch world regions" });
  }
}
