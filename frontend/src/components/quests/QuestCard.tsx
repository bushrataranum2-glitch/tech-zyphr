import React, { useState } from "react";
import { Quest } from "../../types";
import { useGame } from "../../context/GameContext";
import { Check, Clock, Sparkles, MoreVertical, Trash2, Edit2, Zap } from "lucide-react";

interface QuestCardProps {
  quest: Quest;
  onEdit?: (quest: Quest) => void;
}

export const QuestCard: React.FC<QuestCardProps> = ({ quest, onEdit }) => {
  const { completeQuest, deleteQuest } = useGame();
  const [isCompleting, setIsCompleting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [floatReward, setFloatReward] = useState<{ xp: number; gold: number } | null>(null);

  const handleComplete = async () => {
    if (quest.isCompleted || isCompleting) return;
    setIsCompleting(true);

    const result = await completeQuest(quest.id);
    if (result) {
      setFloatReward({ xp: result.xpEarned, gold: result.goldEarned });
      setTimeout(() => setFloatReward(null), 2000);
    }
    setIsCompleting(false);
  };

  const getDifficultyBadge = () => {
    switch (quest.difficulty) {
      case "EASY":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "HARD":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "EPIC":
        return "bg-purple-50 text-purple-700 border-purple-200 font-bold";
      case "NORMAL":
      default:
        return "bg-cyan-50 text-cyan-700 border-cyan-200";
    }
  };

  return (
    <div
      className={`relative group bg-white rounded-2xl p-4 border transition-all duration-200 ${
        quest.isCompleted
          ? "border-slate-200/60 bg-slate-50/50 opacity-70"
          : "border-slate-200 hover:border-cyan-400 hover:shadow-lg shadow-sm"
      }`}
    >
      {/* Floating Rewards Animation upon completion */}
      {floatReward && (
        <div className="absolute top-2 right-6 pointer-events-none z-30 animate-bounce flex items-center space-x-2 bg-slate-900 text-white px-3 py-1.5 rounded-full shadow-xl">
          <span className="text-xs font-extrabold text-cyan-400 font-mono">+{floatReward.xp} XP</span>
          <span className="text-xs font-extrabold text-amber-400 font-mono">+{floatReward.gold} 🪙</span>
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        {/* Left Interactive Completion Checkbox */}
        <button
          onClick={handleComplete}
          disabled={quest.isCompleted || isCompleting}
          aria-label={quest.isCompleted ? "Quest completed" : "Complete quest"}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all flex-shrink-0 mt-0.5 ${
            quest.isCompleted
              ? "bg-emerald-500 text-white cursor-default"
              : isCompleting
              ? "bg-cyan-500 text-white animate-spin"
              : "border-2 border-slate-300 hover:border-cyan-500 hover:bg-cyan-50 text-transparent hover:text-cyan-500"
          }`}
        >
          {isCompleting ? <Zap className="w-5 h-5" /> : <Check className="w-5 h-5 stroke-[3]" />}
        </button>

        {/* Quest Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1 flex-wrap gap-y-1">
            <span
              className={`text-[10px] font-mono tracking-wider px-2 py-0.5 rounded border uppercase ${getDifficultyBadge()}`}
            >
              {quest.difficulty}
            </span>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded uppercase">
              {quest.category}
            </span>
            {quest.recurrence !== "NONE" && (
              <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded flex items-center space-x-1">
                <span>🔄 {quest.recurrence}</span>
              </span>
            )}
          </div>

          <h3
            className={`text-sm sm:text-base font-display font-bold leading-snug ${
              quest.isCompleted ? "line-through text-slate-400" : "text-slate-800"
            }`}
          >
            {quest.title}
          </h3>

          {quest.description && (
            <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
              {quest.description}
            </p>
          )}

          {/* Reward Badges & Estimated Time */}
          <div className="flex items-center space-x-3 mt-3 text-xs">
            <div className="flex items-center space-x-1 font-mono font-bold text-cyan-700 bg-cyan-50/80 px-2 py-0.5 rounded border border-cyan-100">
              <Sparkles className="w-3 h-3 text-cyan-500" />
              <span>+{quest.xpReward} XP</span>
            </div>
            <div className="flex items-center space-x-1 font-mono font-bold text-amber-700 bg-amber-50/80 px-2 py-0.5 rounded border border-amber-100">
              <span>🪙 +{quest.goldReward}</span>
            </div>
            <div className="flex items-center space-x-1 text-slate-400 font-mono text-[11px]">
              <Clock className="w-3 h-3" />
              <span>{quest.estimatedMinutes}m</span>
            </div>
            <div className="hidden sm:block text-[11px] font-mono text-slate-400">
              → {quest.attributeAffected}
            </div>
          </div>
        </div>

        {/* More Options dropdown */}
        {!quest.isCompleted && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-7 w-32 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-20">
                {onEdit && (
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onEdit(quest);
                    }}
                    className="w-full px-3 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Quest</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowMenu(false);
                    deleteQuest(quest.id);
                  }}
                  className="w-full px-3 py-1.5 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center space-x-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Abandon</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
