import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import prisma from "../lib/prisma";
import { getXpRequiredForLevel, EVOLUTION_STAGES } from "../config/gameConfig";

export async function getCharacterDetails(req: AuthRequest, res: Response) {
  try {
    const character = await prisma.character.findUnique({
      where: { userId: req.userId },
      include: {
        attributes: true,
        user: {
          include: {
            profile: true,
            streak: true,
            inventory: {
              where: { isEquipped: true },
              include: { item: true }
            }
          }
        }
      }
    });

    if (!character) {
      return res.status(404).json({ success: false, message: "Character not found" });
    }

    const requiredXp = getXpRequiredForLevel(character.level);
    const progressPercent = Math.min(100, Math.floor((character.currentXp / requiredXp) * 100));

    // Calculate equipment bonuses
    const equippedItems = character.user.inventory;
    const gearBonuses: Record<string, number> = {
      strength: 0,
      intelligence: 0,
      dexterity: 0,
      wisdom: 0,
      charisma: 0,
      discipline: 0
    };

    for (const inv of equippedItems) {
      try {
        const parsed = JSON.parse(inv.item.statBonus || "{}");
        for (const [k, v] of Object.entries(parsed)) {
          if (gearBonuses[k] !== undefined) {
            gearBonuses[k] += Number(v);
          }
        }
      } catch (e) {
        // ignore parse error
      }
    }

    const baseAttrs = character.attributes || {
      strength: 10,
      intelligence: 10,
      dexterity: 10,
      wisdom: 10,
      charisma: 10,
      discipline: 10
    };

    const totalAttrs = {
      strength: baseAttrs.strength + gearBonuses.strength,
      intelligence: baseAttrs.intelligence + gearBonuses.intelligence,
      dexterity: baseAttrs.dexterity + gearBonuses.dexterity,
      wisdom: baseAttrs.wisdom + gearBonuses.wisdom,
      charisma: baseAttrs.charisma + gearBonuses.charisma,
      discipline: baseAttrs.discipline + gearBonuses.discipline
    };

    return res.json({
      success: true,
      character: {
        id: character.id,
        level: character.level,
        currentXp: character.currentXp,
        requiredXp,
        progressPercent,
        title: character.title,
        evolutionStage: character.evolutionStage,
        gold: character.gold,
        crystals: character.crystals,
        tokens: character.tokens,
        heroClass: character.user.profile?.heroClass || "WARRIOR",
        heroGender: character.user.profile?.heroGender || "MALE",
        name: character.user.name,
        baseAttributes: baseAttrs,
        gearBonuses,
        totalAttributes: totalAttrs,
        streak: character.user.streak,
        equippedGear: equippedItems.map((inv) => ({
          slot: inv.item.category,
          item: inv.item
        })),
        evolutionTimeline: EVOLUTION_STAGES.map((s) => ({
          ...s,
          isUnlocked: character.level >= s.minLevel
        }))
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to fetch character details" });
  }
}
