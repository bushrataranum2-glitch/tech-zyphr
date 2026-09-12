import React, { useState, useEffect } from "react";
import { Boss } from "../types";
import { api } from "../services/api";
import { BossBattleCard } from "../components/bosses/BossBattleCard";
import { ShieldAlert, Skull, Trophy, CheckCircle2, Flame } from "lucide-react";

export const BossesPage: React.FC = () => {
  const [bosses, setBosses] = useState<Boss[]>([]);
  const [selectedBoss, setSelectedBoss] = useState<Boss | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadBosses = async () => {
    try {
      setIsLoading(true);
      const res = await api.getBosses();
      if (res.success && res.bosses) {
        setBosses(res.bosses);
        // Default to first undefeated boss or first boss
        const active = res.bosses.find((b) => !b.isDefeated) || res.bosses[0];
        if (active) {
          // fetch active with attacks
          const activeRes = await api.getActiveBoss();
          if (activeRes.success && activeRes.activeBoss) {
            setSelectedBoss(activeRes.activeBoss);
          } else {
            setSelectedBoss(active);
          }
        }
      }
    } catch (err) {
      console.error("Failed to load bosses", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBosses();
  }, []);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-6 h-6 text-rose-600" />
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Obstacle Raid Arena
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Vanquish psychological inertia, procrastination, and distraction through real-world quests.
        </p>
      </div>

      {/* Featured Battle Arena Card */}
      {selectedBoss && (
        <div>
          <BossBattleCard boss={selectedBoss} />
        </div>
      )}

      {/* All Obstacle Bosses Roster */}
      <div className="space-y-4">
        <h3 className="font-display font-bold text-slate-900 text-lg flex items-center space-x-2">
          <Skull className="w-5 h-5 text-slate-600" />
          <span>Pantheon of Obstacles</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {bosses.map((boss) => {
            const isSelected = selectedBoss?.id === boss.id;
            return (
              <div
                key={boss.id}
                onClick={() => setSelectedBoss(boss)}
                className={`cursor-pointer p-5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                  isSelected
                    ? "border-rose-500 bg-rose-50/20 shadow-md"
                    : boss.isDefeated
                    ? "border-slate-200 bg-slate-50/70"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">
                      Lv.{boss.level} • {boss.difficulty}
                    </span>
                    {boss.isDefeated ? (
                      <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>SLAIN</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        ACTIVE
                      </span>
                    )}
                  </div>

                  <h4 className="font-display font-black text-base text-slate-900 leading-snug">
                    {boss.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {boss.lore}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Integrity:</span>
                    <span className="font-bold text-rose-600">
                      {boss.currentHp.toLocaleString()} / {boss.maxHp.toLocaleString()} HP
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-rose-600 rounded-full"
                      style={{ width: `${boss.hpPercent}%` }}
                    />
                  </div>

                  <div className="text-[10px] font-mono text-cyan-700 bg-cyan-50/80 p-1.5 rounded flex items-center justify-between">
                    <span>Weakness: {boss.weaknessCategory}</span>
                    <span className="text-amber-600 font-bold">+{boss.goldReward} 🪙</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
