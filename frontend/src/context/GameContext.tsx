import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Character, Quest, Boss, NotificationItem, QuestCompletionResult } from "../types";
import { api } from "../services/api";
import { sound } from "../services/soundEngine";
import confetti from "canvas-confetti";
import { useAuth } from "./AuthContext";

interface LevelUpInfo {
  newLevel: number;
  newTitle: string;
  newStage: string;
  crystalsAwarded: number;
  previousLevel: number;
}

interface GameContextType {
  character: Character | null;
  quests: Quest[];
  activeBoss: Boss | null;
  notifications: NotificationItem[];
  unreadCount: number;
  isLoading: boolean;
  levelUpModalData: LevelUpInfo | null;
  closeLevelUpModal: () => void;
  refreshGameData: () => Promise<void>;
  completeQuest: (questId: string) => Promise<QuestCompletionResult | null>;
  createQuest: (questData: Partial<Quest>) => Promise<boolean>;
  deleteQuest: (questId: string) => Promise<boolean>;
  updateQuest: (questId: string, questData: Partial<Quest>) => Promise<boolean>;
  purchaseItem: (itemId: string) => Promise<{ success: boolean; message: string }>;
  equipItem: (itemId: string) => Promise<{ success: boolean; message: string }>;
  unlockSkill: (skillId: string) => Promise<{ success: boolean; message: string }>;
  toast: (title: string, message: string, type?: "info" | "success" | "warning") => void;
  activeToast: { title: string; message: string; type: string } | null;
  isMuted: boolean;
  toggleMute: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [character, setCharacter] = useState<Character | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [activeBoss, setActiveBoss] = useState<Boss | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [levelUpModalData, setLevelUpModalData] = useState<LevelUpInfo | null>(null);
  const [activeToast, setActiveToast] = useState<{ title: string; message: string; type: string } | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(sound.getMuted());

  const toast = useCallback((title: string, message: string, type: "info" | "success" | "warning" = "success") => {
    setActiveToast({ title, message, type });
    setTimeout(() => {
      setActiveToast((curr) => (curr?.title === title ? null : curr));
    }, 4000);
  }, []);

  const toggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const refreshGameData = useCallback(async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const [charRes, questsRes, bossRes, notifRes] = await Promise.all([
        api.getCharacter().catch(() => null),
        api.getQuests().catch(() => null),
        api.getActiveBoss().catch(() => null),
        api.getNotifications().catch(() => null)
      ]);

      if (charRes?.success && charRes.character) setCharacter(charRes.character);
      if (questsRes?.success && questsRes.quests) setQuests(questsRes.quests);
      if (bossRes?.success && bossRes.activeBoss) setActiveBoss(bossRes.activeBoss);
      if (notifRes?.success) {
        setNotifications(notifRes.notifications || []);
        setUnreadCount(notifRes.unreadCount || 0);
      }
    } catch (err) {
      console.error("Failed to refresh game state", err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      refreshGameData();
    } else {
      setCharacter(null);
      setQuests([]);
      setActiveBoss(null);
      setNotifications([]);
    }
  }, [user, refreshGameData]);

  const closeLevelUpModal = () => {
    setLevelUpModalData(null);
  };

  const completeQuest = async (questId: string): Promise<QuestCompletionResult | null> => {
    try {
      sound.playQuestComplete();
      const res = await api.completeQuest(questId);
      if (res.success && res.result) {
        const { result } = res;

        // Play coin sound
        setTimeout(() => sound.playCoin(), 250);

        // Check if boss was hit
        if (result.bossDamage) {
          setTimeout(() => sound.playSlashHit(), 400);
        }

        // Check Level Up
        if (result.levelUp.occurred) {
          setTimeout(() => {
            sound.playLevelUp();
            confetti({
              particleCount: 120,
              spread: 80,
              origin: { y: 0.6 }
            });
            setLevelUpModalData({
              newLevel: result.levelUp.newLevel,
              previousLevel: result.levelUp.previousLevel,
              newTitle: result.levelUp.newTitle,
              newStage: result.levelUp.newStage,
              crystalsAwarded: result.levelUp.crystalsAwarded
            });
          }, 600);
        }

        // Notification toast
        toast(
          "⚔️ Quest Complete!",
          `+${result.xpEarned} XP  •  +${result.goldEarned} Gold  •  Streak: ${result.streak.current}d`,
          "success"
        );

        // Optimistically update local quest status
        setQuests((prev) =>
          prev.map((q) => (q.id === questId ? { ...q, isCompleted: true, completedAt: new Date().toISOString() } : q))
        );

        // Refresh entire authoritative server state
        await refreshGameData();
        return result;
      }
      return null;
    } catch (err: any) {
      toast("Action Failed", err.message || "Could not complete quest", "warning");
      return null;
    }
  };

  const createQuest = async (questData: Partial<Quest>): Promise<boolean> => {
    try {
      const res = await api.createQuest(questData);
      if (res.success && res.quest) {
        toast("Quest Accepted", `"${res.quest.title}" added to your board!`);
        await refreshGameData();
        return true;
      }
      return false;
    } catch (err: any) {
      toast("Creation Failed", err.message || "Unable to create quest", "warning");
      return false;
    }
  };

  const deleteQuest = async (questId: string): Promise<boolean> => {
    try {
      const res = await api.deleteQuest(questId);
      if (res.success) {
        setQuests((prev) => prev.filter((q) => q.id !== questId));
        toast("Quest Abandoned", "Removed from your board.", "info");
        return true;
      }
      return false;
    } catch (err: any) {
      toast("Error", err.message || "Failed to delete quest", "warning");
      return false;
    }
  };

  const updateQuest = async (questId: string, questData: Partial<Quest>): Promise<boolean> => {
    try {
      const res = await api.updateQuest(questId, questData);
      if (res.success && res.quest) {
        setQuests((prev) => prev.map((q) => (q.id === questId ? res.quest : q)));
        toast("Quest Updated", "Changes saved.");
        return true;
      }
      return false;
    } catch (err: any) {
      toast("Error", err.message || "Failed to update quest", "warning");
      return false;
    }
  };

  const purchaseItem = async (itemId: string): Promise<{ success: boolean; message: string }> => {
    try {
      sound.playCoin();
      const res = await api.purchaseItem(itemId);
      if (res.success) {
        toast("🛍️ Purchase Complete", res.message, "success");
        await refreshGameData();
        return { success: true, message: res.message };
      }
      return { success: false, message: "Purchase failed" };
    } catch (err: any) {
      toast("Purchase Failed", err.message || "Insufficient funds or already owned", "warning");
      return { success: false, message: err.message || "Purchase failed" };
    }
  };

  const equipItem = async (itemId: string): Promise<{ success: boolean; message: string }> => {
    try {
      sound.playEquip();
      const res = await api.equipItem(itemId);
      if (res.success) {
        toast("🛡️ Equipment Changed", res.message, "success");
        await refreshGameData();
        return { success: true, message: res.message };
      }
      return { success: false, message: "Equip failed" };
    } catch (err: any) {
      toast("Action Failed", err.message || "Could not equip item", "warning");
      return { success: false, message: err.message || "Could not equip item" };
    }
  };

  const unlockSkill = async (skillId: string): Promise<{ success: boolean; message: string }> => {
    try {
      sound.playSkillUnlock();
      const res = await api.unlockSkill(skillId);
      if (res.success) {
        confetti({ particleCount: 50, spread: 60 });
        toast("🌳 Skill Mastered!", res.message, "success");
        await refreshGameData();
        return { success: true, message: res.message };
      }
      return { success: false, message: "Unlock failed" };
    } catch (err: any) {
      toast("Unlock Blocked", err.message || "Prerequisites not met", "warning");
      return { success: false, message: err.message || "Unlock failed" };
    }
  };

  return (
    <GameContext.Provider
      value={{
        character,
        quests,
        activeBoss,
        notifications,
        unreadCount,
        isLoading,
        levelUpModalData,
        closeLevelUpModal,
        refreshGameData,
        completeQuest,
        createQuest,
        deleteQuest,
        updateQuest,
        purchaseItem,
        equipItem,
        unlockSkill,
        toast,
        activeToast,
        isMuted,
        toggleMute
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return ctx;
};
