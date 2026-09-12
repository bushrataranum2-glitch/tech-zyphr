import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import prisma from "../lib/prisma";

export async function getSkills(req: AuthRequest, res: Response) {
  try {
    const character = await prisma.character.findUnique({
      where: { userId: req.userId },
      include: { attributes: true }
    });

    if (!character || !character.attributes) {
      return res.status(404).json({ success: false, message: "Character not found" });
    }

    const allSkills = await prisma.skill.findMany({
      orderBy: [{ branch: "asc" }, { tier: "asc" }]
    });

    const userUnlocks = await prisma.skillUnlock.findMany({
      where: { userId: req.userId }
    });
    const unlockedIds = new Set(userUnlocks.map((u) => u.skillId));

    const userAttrs: Record<string, number> = {
      strength: character.attributes.strength,
      intelligence: character.attributes.intelligence,
      dexterity: character.attributes.dexterity,
      wisdom: character.attributes.wisdom,
      charisma: character.attributes.charisma,
      discipline: character.attributes.discipline
    };

    const enrichedSkills = allSkills.map((skill) => {
      const isUnlocked = unlockedIds.has(skill.id);
      const attrKey = skill.requiredAttr.toLowerCase();
      const currentAttrVal = userAttrs[attrKey] || 0;
      const meetsLevel = character.level >= skill.requiredLevel;
      const meetsAttr = currentAttrVal >= skill.requiredAttrVal;

      return {
        ...skill,
        statBonusParsed: JSON.parse(skill.statBonus || "{}"),
        isUnlocked,
        canUnlock: !isUnlocked && meetsLevel && meetsAttr,
        meetsLevel,
        meetsAttr,
        currentAttrVal
      };
    });

    return res.json({ success: true, skills: enrichedSkills });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to fetch skills" });
  }
}

export async function unlockSkill(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;

    const skill = await prisma.skill.findUnique({ where: { id } });
    if (!skill) {
      return res.status(404).json({ success: false, message: "Skill not found" });
    }

    const existingUnlock = await prisma.skillUnlock.findUnique({
      where: {
        userId_skillId: {
          userId: req.userId!,
          skillId: id
        }
      }
    });

    if (existingUnlock) {
      return res.status(400).json({ success: false, message: "Skill is already unlocked" });
    }

    const character = await prisma.character.findUnique({
      where: { userId: req.userId },
      include: { attributes: true }
    });

    if (!character || !character.attributes) {
      return res.status(404).json({ success: false, message: "Character not found" });
    }

    // Check level requirement
    if (character.level < skill.requiredLevel) {
      return res.status(400).json({
        success: false,
        message: `Requires Character Level ${skill.requiredLevel} (Current: ${character.level})`
      });
    }

    // Check attribute requirement
    const attrKey = skill.requiredAttr.toLowerCase() as keyof typeof character.attributes;
    const currentAttrVal = (character.attributes[attrKey] as number) || 0;
    if (currentAttrVal < skill.requiredAttrVal) {
      return res.status(400).json({
        success: false,
        message: `Requires ${skill.requiredAttr} ${skill.requiredAttrVal} (Current: ${currentAttrVal})`
      });
    }

    // Unlock skill and apply permanent stat bonus in transaction
    const result = await prisma.$transaction(async (tx) => {
      const unlock = await tx.skillUnlock.create({
        data: {
          userId: req.userId!,
          skillId: id
        }
      });

      const statBonus = JSON.parse(skill.statBonus || "{}");
      const currentAttrs = character.attributes!;

      const updatedAttrs: any = {};
      for (const [k, v] of Object.entries(statBonus)) {
        if ((currentAttrs as any)[k] !== undefined) {
          updatedAttrs[k] = (currentAttrs as any)[k] + Number(v);
        }
      }

      await tx.attributes.update({
        where: { id: currentAttrs.id },
        data: updatedAttrs
      });

      await tx.notification.create({
        data: {
          userId: req.userId!,
          type: "SKILL",
          title: "🌳 Skill Mastered!",
          message: `You unlocked ${skill.name} from the ${skill.branch} branch!`
        }
      });

      return { unlock, updatedAttrs };
    });

    return res.json({
      success: true,
      message: `Successfully unlocked ${skill.name}!`,
      skill,
      updatedAttributes: result.updatedAttrs
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || "Failed to unlock skill" });
  }
}
