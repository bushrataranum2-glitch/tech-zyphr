import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import prisma from "../lib/prisma";

export async function getShopItems(req: AuthRequest, res: Response) {
  try {
    const { category } = req.query;
    const where: any = {};
    if (category) where.category = String(category).toUpperCase();

    const items = await prisma.item.findMany({
      where,
      orderBy: [{ category: "asc" }, { price: "asc" }]
    });

    const userInventory = await prisma.inventoryItem.findMany({
      where: { userId: req.userId }
    });
    const inventoryMap = new Map(userInventory.map((i) => [i.itemId, i]));

    const enriched = items.map((it) => {
      const inv = inventoryMap.get(it.id);
      return {
        ...it,
        statBonusParsed: JSON.parse(it.statBonus || "{}"),
        isOwned: !!inv,
        isEquipped: inv ? inv.isEquipped : false,
        quantity: inv ? inv.quantity : 0
      };
    });

    return res.json({ success: true, items: enriched });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to fetch shop items" });
  }
}

export async function purchaseItem(req: AuthRequest, res: Response) {
  try {
    const { itemId } = req.params;

    const item = await prisma.item.findUnique({ where: { id: itemId } });
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    const character = await prisma.character.findUnique({ where: { userId: req.userId } });
    if (!character) {
      return res.status(404).json({ success: false, message: "Character not found" });
    }

    // Check if unique non-consumable item is already owned
    const existing = await prisma.inventoryItem.findUnique({
      where: {
        userId_itemId: {
          userId: req.userId!,
          itemId
        }
      }
    });

    if (existing && item.isEquippable) {
      return res.status(400).json({ success: false, message: "You already own this piece of equipment" });
    }

    // Server-side balance verification
    if (item.currency === "GOLD" && character.gold < item.price) {
      return res.status(400).json({
        success: false,
        message: `Insufficient Gold. Requires ${item.price} Gold (You have: ${character.gold} Gold)`
      });
    }

    if (item.currency === "CRYSTAL" && character.crystals < item.price) {
      return res.status(400).json({
        success: false,
        message: `Insufficient Crystals. Requires ${item.price} Crystals (You have: ${character.crystals} Crystals)`
      });
    }

    // Perform transaction
    const result = await prisma.$transaction(async (tx) => {
      // Deduct currency
      const updateData: any = {};
      if (item.currency === "GOLD") {
        updateData.gold = character.gold - item.price;
      } else {
        updateData.crystals = character.crystals - item.price;
      }

      await tx.character.update({
        where: { userId: req.userId },
        data: updateData
      });

      // Add to inventory
      let inventoryEntry;
      if (existing) {
        inventoryEntry = await tx.inventoryItem.update({
          where: { id: existing.id },
          data: { quantity: existing.quantity + 1 }
        });
      } else {
        inventoryEntry = await tx.inventoryItem.create({
          data: {
            userId: req.userId!,
            itemId,
            quantity: 1,
            isEquipped: false
          }
        });
      }

      // Record transaction
      await tx.transaction.create({
        data: {
          userId: req.userId!,
          type: "SPEND_SHOP",
          currency: item.currency,
          amount: -item.price,
          description: `Purchased item: ${item.name}`
        }
      });

      // Send notification
      await tx.notification.create({
        data: {
          userId: req.userId!,
          type: "SHOP",
          title: "🛍️ Equipment Acquired!",
          message: `Acquired ${item.name} for ${item.price} ${item.currency}.`
        }
      });

      return {
        remainingGold: updateData.gold !== undefined ? updateData.gold : character.gold,
        remainingCrystals: updateData.crystals !== undefined ? updateData.crystals : character.crystals,
        inventoryEntry
      };
    });

    return res.json({
      success: true,
      message: `Successfully purchased ${item.name}!`,
      item,
      remainingGold: result.remainingGold,
      remainingCrystals: result.remainingCrystals
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || "Purchase failed" });
  }
}

export async function equipItem(req: AuthRequest, res: Response) {
  try {
    const { itemId } = req.params;

    const inventoryEntry = await prisma.inventoryItem.findUnique({
      where: {
        userId_itemId: {
          userId: req.userId!,
          itemId
        }
      },
      include: { item: true }
    });

    if (!inventoryEntry) {
      return res.status(404).json({ success: false, message: "Item not in your inventory" });
    }

    const item = inventoryEntry.item;
    if (!item.isEquippable) {
      return res.status(400).json({ success: false, message: "This item cannot be equipped" });
    }

    const newEquippedState = !inventoryEntry.isEquipped;

    await prisma.$transaction(async (tx) => {
      if (newEquippedState) {
        // Unequip any other item in the same slot category
        const sameSlotItems = await tx.inventoryItem.findMany({
          where: {
            userId: req.userId,
            isEquipped: true,
            item: { category: item.category }
          }
        });

        for (const slotItem of sameSlotItems) {
          await tx.inventoryItem.update({
            where: { id: slotItem.id },
            data: { isEquipped: false }
          });
        }
      }

      await tx.inventoryItem.update({
        where: { id: inventoryEntry.id },
        data: { isEquipped: newEquippedState }
      });
    });

    return res.json({
      success: true,
      message: newEquippedState ? `Equipped ${item.name}` : `Unequipped ${item.name}`,
      isEquipped: newEquippedState,
      item
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to equip item" });
  }
}

export async function getUserInventory(req: AuthRequest, res: Response) {
  try {
    const inventory = await prisma.inventoryItem.findMany({
      where: { userId: req.userId },
      include: { item: true },
      orderBy: { acquiredAt: "desc" }
    });

    const parsed = inventory.map((inv) => ({
      ...inv,
      item: {
        ...inv.item,
        statBonusParsed: JSON.parse(inv.item.statBonus || "{}")
      }
    }));

    return res.json({ success: true, inventory: parsed });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to fetch inventory" });
  }
}
