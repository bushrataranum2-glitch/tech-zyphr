import React, { useState, useEffect } from "react";
import { Skill } from "../types";
import { api } from "../services/api";
import { useGame } from "../context/GameContext";
import {
  Layers,
  Lock,
  Check,
  Sparkles,
  Zap,
  ShieldAlert,
  Flame,
  Cpu,
  Terminal,
  Network,
  Eye,
  BookOpen,
  Feather,
  Wind,
  Activity,
  Mic,
  Users,
  Clock,
  Link,
  Crown
} from "lucide-react";

export const SkillsPage: React.FC = () => {
  const { unlockSkill } = useGame();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [activeBranch, setActiveBranch] = useState<string>("ALL");
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadSkills = async () => {
    try {
      setIsLoading(true);
      const res = await api.getSkills();
      if (res.success && res.skills) {
        setSkills(res.skills);
        if (!selectedSkill && res.skills.length > 0) {
          setSelectedSkill(res.skills[0]);
        }
      }
    } catch (err) {
      console.error("Failed to load skills", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const getSkillIcon = (iconName: string) => {
    switch (iconName) {
      case "ShieldAlert": return ShieldAlert;
      case "Zap": return Zap;
      case "Flame": return Flame;
      case "Cpu": return Cpu;
      case "Terminal": return Terminal;
      case "Network": return Network;
      case "Eye": return Eye;
      case "BookOpen": return BookOpen;
      case "Feather": return Feather;
      case "Wind": return Wind;
      case "Activity": return Activity;
      case "Mic": return Mic;
      case "Users": return Users;
      case "Clock": return Clock;
      case "Link": return Link;
      case "Crown": return Crown;
      default: return Sparkles;
    }
  };

  const branches = ["ALL", "COMBAT", "INTELLECT", "WISDOM", "AGILITY", "CHARISMA", "DISCIPLINE"];

  const filteredSkills = skills.filter((s) => {
    if (activeBranch !== "ALL" && s.branch !== activeBranch) return false;
    return true;
  });

  const handleUnlock = async (skill: Skill) => {
    const res = await unlockSkill(skill.id);
    if (res.success) {
      await loadSkills();
      setSelectedSkill((prev) => (prev ? { ...prev, isUnlocked: true, canUnlock: false } : null));
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <Layers className="w-6 h-6 text-cyan-600" />
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Skill Nexus
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Master specialized abilities across physical, intellectual, and psychological disciplines.
        </p>
      </div>

      {/* Branch Tabs */}
      <div className="flex flex-wrap gap-2">
        {branches.map((b) => (
          <button
            key={b}
            onClick={() => setActiveBranch(b)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              activeBranch === b
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {b}
          </button>
        ))}
      </div>

      {/* Main Grid: Left Node Matrix, Right Selected Skill Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Skill Nodes */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredSkills.map((skill) => {
              const Icon = getSkillIcon(skill.icon);
              const isSelected = selectedSkill?.id === skill.id;

              return (
                <div
                  key={skill.id}
                  onClick={() => setSelectedSkill(skill)}
                  className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                    isSelected
                      ? "border-cyan-500 bg-cyan-50/40 shadow-md"
                      : skill.isUnlocked
                      ? "border-emerald-300 bg-emerald-50/20"
                      : skill.canUnlock
                      ? "border-amber-300 bg-amber-50/20 hover:border-amber-400"
                      : "border-slate-200 bg-slate-50/50 opacity-60 hover:opacity-90"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`p-2 rounded-xl flex items-center justify-center ${
                        skill.isUnlocked
                          ? "bg-emerald-500 text-white"
                          : skill.canUnlock
                          ? "bg-amber-500 text-white animate-pulse"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
                      Tier {skill.tier}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-cyan-700 font-bold block">
                      {skill.branch}
                    </span>
                    <h4 className="font-display font-bold text-sm text-slate-900 mt-0.5">
                      {skill.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {skill.description}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono">
                    {skill.isUnlocked ? (
                      <span className="text-emerald-600 font-bold flex items-center space-x-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>MASTERED</span>
                      </span>
                    ) : skill.canUnlock ? (
                      <span className="text-amber-600 font-bold flex items-center space-x-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>AVAILABLE</span>
                      </span>
                    ) : (
                      <span className="text-slate-400 flex items-center space-x-1">
                        <Lock className="w-3.5 h-3.5" />
                        <span>LOCKED</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Skill Detail Panel */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-24 space-y-6">
          {selectedSkill ? (
            <>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-600 bg-cyan-50 px-2.5 py-1 rounded font-bold">
                  {selectedSkill.branch} NEXUS
                </span>
                <h3 className="font-display font-black text-2xl text-slate-900 mt-2">
                  {selectedSkill.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {selectedSkill.description}
                </p>
              </div>

              {/* Requirements checklist */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase block mb-1">
                  Mastery Prerequisites
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Level {selectedSkill.requiredLevel}:</span>
                  <span
                    className={`font-mono font-bold ${
                      selectedSkill.meetsLevel ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {selectedSkill.meetsLevel ? "✓ Satisfied" : `✗ Required`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">
                    {selectedSkill.requiredAttr} {selectedSkill.requiredAttrVal}:
                  </span>
                  <span
                    className={`font-mono font-bold ${
                      selectedSkill.meetsAttr ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {selectedSkill.meetsAttr
                      ? `✓ (${selectedSkill.currentAttrVal})`
                      : `✗ (Have: ${selectedSkill.currentAttrVal})`}
                  </span>
                </div>
              </div>

              {/* Passive Stat Bonuses */}
              <div>
                <span className="text-xs font-bold text-slate-700 font-display uppercase tracking-wider block mb-2">
                  Permanent Passive Boosts
                </span>
                <div className="space-y-1.5">
                  {Object.entries(selectedSkill.statBonusParsed || {}).map(([attr, val]) => (
                    <div
                      key={attr}
                      className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-cyan-50/60 border border-cyan-100 font-mono"
                    >
                      <span className="capitalize font-bold text-slate-700">{attr}</span>
                      <span className="text-cyan-700 font-extrabold">+{String(val)} Permanent</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              {selectedSkill.isUnlocked ? (
                <div className="w-full py-3 rounded-xl bg-emerald-50 text-emerald-700 font-display font-bold text-xs text-center border border-emerald-200">
                  ✓ Node Mastered and Active
                </div>
              ) : selectedSkill.canUnlock ? (
                <button
                  onClick={() => handleUnlock(selectedSkill)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-display font-bold text-sm shadow-md shadow-cyan-600/25 hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>MASTER NODE</span>
                </button>
              ) : (
                <div className="w-full py-3 rounded-xl bg-slate-100 text-slate-400 font-display font-bold text-xs text-center border border-slate-200">
                  Prerequisites Locked
                </div>
              )}
            </>
          ) : (
            <p className="text-slate-400 text-xs text-center py-8">Select a skill node to inspect.</p>
          )}
        </div>
      </div>
    </div>
  );
};
