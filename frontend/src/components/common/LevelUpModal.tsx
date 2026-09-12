import React from "react";
import { useGame } from "../../context/GameContext";
import { Sparkles, Trophy, ArrowRight } from "lucide-react";

export const LevelUpModal: React.FC = () => {
  const { levelUpModalData, closeLevelUpModal } = useGame();

  if (!levelUpModalData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-8 text-center shadow-2xl border-2 border-amber-300 overflow-hidden">
        {/* Glow and Aura Rings */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-gradient-to-br from-amber-400/30 to-cyan-400/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-gradient-to-tl from-violet-400/30 to-pink-400/30 rounded-full blur-3xl pointer-events-none" />

        {/* Top Emblem */}
        <div className="relative mx-auto w-24 h-24 mb-4">
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 rounded-full animate-ping opacity-25" />
          <div className="relative w-24 h-24 bg-gradient-to-tr from-amber-500 to-yellow-400 rounded-full flex items-center justify-center text-white shadow-xl shadow-amber-500/40 border-4 border-white">
            <Trophy className="w-12 h-12 text-slate-950 fill-amber-300 drop-shadow" />
          </div>
        </div>

        {/* Cinematic Header */}
        <div className="space-y-1">
          <span className="text-xs font-mono font-bold tracking-widest text-amber-600 uppercase bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            SYSTEM AWAKENING
          </span>
          <h2 className="font-display font-black text-4xl sm:text-5xl text-slate-900 tracking-tight mt-2">
            LEVEL UP!
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Your real-world consistency has broken through reality limits.
          </p>
        </div>

        {/* Level Transition Pill */}
        <div className="my-6 py-4 px-6 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-around shadow-inner">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase block">PREVIOUS</span>
            <span className="font-display font-bold text-2xl text-slate-400">
              Lv. {levelUpModalData.previousLevel}
            </span>
          </div>
          <ArrowRight className="w-6 h-6 text-amber-500 animate-pulse" />
          <div>
            <span className="text-[10px] font-mono text-amber-600 uppercase block font-bold">ASCENDED</span>
            <span className="font-display font-extrabold text-3xl text-amber-600">
              Lv. {levelUpModalData.newLevel}
            </span>
          </div>
        </div>

        {/* Unlocked Attributes / Titles */}
        <div className="space-y-2.5 text-left bg-gradient-to-r from-amber-50/50 to-cyan-50/50 p-4 rounded-2xl border border-slate-100 mb-6">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Evolution Title:</span>
            <span className="font-bold text-slate-800 font-display">{levelUpModalData.newTitle}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Evolution Stage:</span>
            <span className="font-bold text-indigo-600 font-display">{levelUpModalData.newStage}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Bounty Rewards:</span>
            <span className="font-bold text-cyan-600 flex items-center space-x-1">
              <span>+{levelUpModalData.crystalsAwarded} Crystals</span>
              <span>💎</span>
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={closeLevelUpModal}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-display font-bold text-base shadow-lg shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
        >
          <Sparkles className="w-5 h-5" />
          <span>CLAIM EVOLUTION</span>
        </button>
      </div>
    </div>
  );
};
