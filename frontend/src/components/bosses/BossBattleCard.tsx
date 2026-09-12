import React from "react";
import { Boss } from "../../types";
import { useGame } from "../../context/GameContext";
import { ShieldAlert, Zap, Skull, Swords, Flame } from "lucide-react";

interface BossBattleCardProps {
  boss: Boss;
  onSelectQuest?: (questId: string) => void;
}

export const BossBattleCard: React.FC<BossBattleCardProps> = ({ boss }) => {
  const { completeQuest } = useGame();

  const handleAttack = async (questId: string) => {
    await completeQuest(questId);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-6 border-2 border-slate-700/60 shadow-2xl relative overflow-hidden">
      {/* Background ambient red/purple alert glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Raid Tag */}
      <div className="flex items-center justify-between mb-4 text-xs font-mono">
        <div className="flex items-center space-x-2 bg-rose-950/80 text-rose-300 px-3 py-1 rounded-full border border-rose-500/30">
          <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
          <span className="font-bold tracking-wider uppercase">OBSTACLE RAID BOSS</span>
        </div>
        <div className="text-slate-400 font-mono">
          <span>Lv.{boss.level}</span> • <span className="text-amber-400 font-bold">{boss.difficulty}</span>
        </div>
      </div>

      {/* Boss Identity Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight flex items-center space-x-2">
            <span>{boss.name}</span>
            {boss.isDefeated && (
              <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-1 rounded-full border border-emerald-500/30">
                VANQUISHED
              </span>
            )}
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">{boss.description}</p>
        </div>

        {/* Boss Weakness Badge */}
        <div className="bg-slate-800/80 border border-cyan-500/30 rounded-2xl p-3 text-right flex-shrink-0">
          <span className="text-[10px] font-mono text-cyan-400 uppercase block font-bold">CRITICAL WEAKNESS</span>
          <span className="font-display font-bold text-sm text-cyan-200 flex items-center justify-end space-x-1 mt-0.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>{boss.weaknessCategory} Quests</span>
          </span>
        </div>
      </div>

      {/* Boss Health Bar */}
      <div className="mb-6 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono font-bold">
          <span className="text-slate-400 flex items-center space-x-1">
            <Skull className="w-4 h-4 text-rose-500" />
            <span>BOSS INTEGRITY</span>
          </span>
          <span className="text-rose-400">
            {boss.currentHp.toLocaleString()} / {boss.maxHp.toLocaleString()} HP ({boss.hpPercent}%)
          </span>
        </div>
        <div className="w-full h-4 rounded-full bg-slate-800 border border-slate-700 overflow-hidden relative shadow-inner">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              boss.hpPercent > 50
                ? "bg-gradient-to-r from-emerald-500 via-yellow-500 to-rose-500"
                : "bg-gradient-to-r from-orange-500 to-rose-600 animate-pulse"
            }`}
            style={{ width: `${boss.hpPercent}%` }}
          />
        </div>
      </div>

      {/* "YOUR ATTACKS" Section - Quests as Attacks */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <Swords className="w-4 h-4 text-cyan-400" />
          <h3 className="font-display font-bold text-sm uppercase tracking-wider text-slate-200">
            Your Attacks (Real-World Actions)
          </h3>
        </div>

        {boss.attacks && boss.attacks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {boss.attacks.map((att) => (
              <div
                key={att.questId}
                className="bg-slate-800/90 hover:bg-slate-800 rounded-xl p-3 border border-slate-700 hover:border-cyan-400 transition-all flex items-center justify-between group"
              >
                <div className="min-w-0 flex-1 pr-2">
                  <div className="flex items-center space-x-1.5 mb-1">
                    {att.isWeaknessExploit && (
                      <span className="bg-amber-400/20 text-amber-300 text-[10px] font-mono px-1.5 py-0.2 rounded border border-amber-400/30 font-bold">
                        1.5x WEAKNESS
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-slate-400">{att.category}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white truncate font-display">{att.title}</h4>
                  <span className="text-rose-400 font-mono text-xs font-extrabold flex items-center space-x-1 mt-0.5">
                    <Zap className="w-3 h-3 text-rose-500 fill-rose-500" />
                    <span>{att.damage} Raid DMG</span>
                  </span>
                </div>

                <button
                  onClick={() => handleAttack(att.questId)}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-display font-bold text-xs shadow-md shadow-rose-600/30 group-hover:scale-105 active:scale-95 transition-all flex-shrink-0 flex items-center space-x-1"
                >
                  <span>STRIKE</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-slate-800/40 border border-dashed border-slate-700 text-center text-xs text-slate-400">
            No active quests available to strike this boss. Create a quest aligned with{" "}
            <strong className="text-cyan-300">{boss.weaknessCategory}</strong> to deal heavy damage!
          </div>
        )}
      </div>
    </div>
  );
};
