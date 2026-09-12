import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { BarChart2, TrendingUp, Zap, Trophy, Flame, Award, Shield } from "lucide-react";

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getAnalytics()
      .then((res) => {
        if (res.success) {
          setData(res);
        }
      })
      .catch((err) => console.error("Failed to load analytics", err))
      .finally(() => setIsLoading(false));
  }, []);

  if (!data) return null;

  const { summary, categoryDistribution, activityTimeline, attributeRadar } = data;

  const maxActivityXp = Math.max(...activityTimeline.map((a: any) => a.xp), 100);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <BarChart2 className="w-6 h-6 text-indigo-600" />
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Progression Analytics
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Quantitative telemetry of your real-world discipline and RPG character ascent.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Character Level", val: `Lv. ${summary.level}`, icon: Zap, color: "text-cyan-600", bg: "bg-cyan-50" },
          { label: "Quests Finished", val: summary.totalQuestsCompleted, icon: Shield, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Current Streak", val: `${summary.currentStreak} Days`, icon: Flame, color: "text-orange-500", bg: "bg-orange-50" },
          { label: "Longest Streak", val: `${summary.longestStreak} Days`, icon: Trophy, color: "text-amber-500", bg: "bg-amber-50" },
          { label: "Total Gold Earned", val: `🪙 ${summary.totalGoldEarned}`, icon: Award, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Bosses Defeated", val: summary.bossesDefeated, icon: TrendingUp, color: "text-rose-500", bg: "bg-rose-50" }
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">{kpi.label}</span>
                <div className={`p-1.5 rounded-lg ${kpi.bg} ${kpi.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="font-display font-black text-xl text-slate-900">{kpi.val}</div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 7-Day XP & Activity Timeline */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-slate-900 text-lg">7-Day XP Trajectory</h3>
            <span className="text-xs text-slate-400 font-mono">Daily Experience Yield</span>
          </div>

          <div className="h-56 flex items-end justify-between gap-3 pt-6 px-2">
            {activityTimeline.map((day: any) => {
              const heightPercent = Math.max(8, Math.round((day.xp / maxActivityXp) * 100));
              const dateLabel = new Date(day.date).toLocaleDateString([], { weekday: "short" });

              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-mono font-bold text-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity">
                    +{day.xp}
                  </span>
                  <div
                    className="w-full max-w-[36px] bg-gradient-to-t from-cyan-600 via-indigo-500 to-violet-500 rounded-xl transition-all duration-300 group-hover:scale-105 shadow-sm"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">{dateLabel}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-slate-900 text-lg">Mission Focus Spheres</h3>
            <span className="text-xs text-slate-400 font-mono">Completed Quests</span>
          </div>

          <div className="space-y-3 pt-2">
            {categoryDistribution.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-10">No quest completion history yet.</p>
            ) : (
              categoryDistribution.map((cat: any) => {
                const totalCompleted = summary.totalQuestsCompleted || 1;
                const pct = Math.round((cat.count / totalCompleted) * 100);
                return (
                  <div key={cat.category} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="font-bold text-slate-700">{cat.category}</span>
                      <span className="text-slate-400">{cat.count} quests ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Attribute Distribution Radar / Hexagon Values */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div>
          <h3 className="font-display font-bold text-slate-900 text-lg">Current Attribute Balance</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Holistic distribution across the six fundamental RPG attributes.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          {attributeRadar.map((attr: any) => (
            <div key={attr.subject} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">{attr.subject}</span>
              <span className="font-display font-black text-2xl text-slate-900 mt-1 block">{attr.value}</span>
              <div className="w-full h-1.5 rounded-full bg-slate-200 mt-2 overflow-hidden">
                <div
                  className="h-full bg-cyan-500 rounded-full"
                  style={{ width: `${Math.min(100, (attr.value / 100) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
