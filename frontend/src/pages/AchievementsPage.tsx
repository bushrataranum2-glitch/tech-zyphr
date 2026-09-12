import React, { useState, useEffect } from "react";
import { Achievement } from "../types";
import { api } from "../services/api";
import { Award, Trophy, Lock, CheckCircle2, Sparkles, Star } from "lucide-react";

export const AchievementsPage: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [unlockedCount, setUnlockedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getAchievements()
      .then((res) => {
        if (res.success && res.achievements) {
          setAchievements(res.achievements);
          setUnlockedCount(res.unlockedCount);
        }
      })
      .catch((err) => console.error("Failed to load achievements", err))
      .finally(() => setIsLoading(false));
  }, []);

  const categories = ["ALL", "PROGRESS", "CONSISTENCY", "BOSSES", "ECONOMY"];

  const filtered = achievements.filter((a) => {
    if (activeCategory !== "ALL" && a.category !== activeCategory) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Award className="w-6 h-6 text-amber-500" />
            <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Hall of Legends
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Historic milestones and mythic badges awarded for unwavering real-world feats.
          </p>
        </div>

        {/* Completion Counter */}
        <div className="bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3 self-start sm:self-auto">
          <Trophy className="w-5 h-5 text-amber-500" />
          <span className="text-xs font-mono font-bold text-slate-700">
            {unlockedCount} / {achievements.length} Unlocked (
            {achievements.length > 0 ? Math.round((unlockedCount / achievements.length) * 100) : 0}%)
          </span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              activeCategory === c
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((ach) => (
          <div
            key={ach.id}
            className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
              ach.isUnlocked
                ? "bg-white border-amber-300 shadow-md shadow-amber-500/10"
                : "bg-slate-50/70 border-slate-200 opacity-60"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    ach.isUnlocked
                      ? "bg-amber-100 text-amber-600 shadow-inner"
                      : "bg-slate-200 text-slate-400"
                  }`}
                >
                  {ach.isUnlocked ? <Trophy className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                </div>

                <div className="flex items-center space-x-2 text-xs font-mono">
                  <span className="text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded font-bold">
                    +{ach.crystalsReward} 💎
                  </span>
                  <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-bold">
                    +{ach.xpReward} XP
                  </span>
                </div>
              </div>

              <h4 className="font-display font-bold text-base text-slate-900 leading-snug">
                {ach.isUnlocked ? ach.name : "Mystery Legend"}
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {ach.isUnlocked ? ach.description : "Keep progressing to reveal this heroic achievement."}
              </p>
            </div>

            {/* Progress Track */}
            <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>Criteria Progress</span>
                <span className="font-bold text-slate-700">
                  {ach.currentProgress} / {ach.criteriaValue}
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    ach.isUnlocked ? "bg-amber-500" : "bg-cyan-500"
                  }`}
                  style={{ width: `${ach.progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
