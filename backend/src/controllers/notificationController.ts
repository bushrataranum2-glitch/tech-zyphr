import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import prisma from "../lib/prisma";

export async function getNotifications(req: AuthRequest, res: Response) {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
      take: 30
    });

    const unreadCount = await prisma.notification.count({
      where: { userId: req.userId, isRead: false }
    });

    return res.json({ success: true, notifications, unreadCount });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to fetch notifications" });
  }
}

export async function markAsRead(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;

    if (id === "all") {
      await prisma.notification.updateMany({
        where: { userId: req.userId, isRead: false },
        data: { isRead: true }
      });
      return res.json({ success: true, message: "All marked as read" });
    }

    await prisma.notification.update({
      where: { id },
      data: { isRead: true }
    });

    return res.json({ success: true, message: "Marked as read" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to update notification" });
  }
}
