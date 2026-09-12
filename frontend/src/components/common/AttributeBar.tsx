import React from "react";
import { Dumbbell, Brain, Wind, BookOpen, MessageSquare, ShieldCheck } from "lucide-react";

interface AttributeBarProps {
  name: string;
  value: number;
  gearBonus?: number;
  maxValue?: number;
  recentDelta?: number;
}

export const AttributeBar: React.FC<AttributeBarProps> = ({
  name,
  value,
  gearBonus = 0,
  maxValue = 100,
  recentDelta
}) => {
  const getAttrConfig = (attrName: string) => {
    switch (attrName.toUpperCase()) {
      case "STRENGTH":
        return { icon: Dumbbell, color: "from-amber-500 to-red-500", text: "text-amber-600", bg: "bg-amber-50" };
      case "INTELLIGENCE":
        return { icon: Brain, color: "from-cyan-500 to-blue-600", text: "text-cyan-600", bg: "bg-cyan-50" };
      case "DEXTERITY":
        return { icon: Wind, color: "from-emerald-500 to-teal-500", text: "text-emerald-600", bg: "bg-emerald-50" };
      case "WISDOM":
        return { icon: BookOpen, color: "from-violet-500 to-indigo-600", text: "text-violet-600", bg: "bg-violet-50" };
      case "CHARISMA":
        return { icon: MessageSquare, color: "from-pink-500 to-rose-500", text: "text-pink-600", bg: "bg-pink-50" };
      case "DISCIPLINE":
      default:
        return { icon: ShieldCheck, color: "from-blue-600 to-indigo-700", text: "text-blue-600", bg: "bg-blue-50" };
    }
  };

  const config = getAttrConfig(name);
  const Icon = config.icon;
  const total = value + gearBonus;
  const percentage = Math.min(100, Math.round((total / maxValue) * 100));

  return (
    <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 shadow-sm hover:shadow transition-shadow">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center space-x-2">
          <div className={`p-1.5 rounded-lg ${config.bg} ${config.text}`}>
            <Icon className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 font-display">
            {name}
          </span>
          {recentDelta && recentDelta > 0 && (
            <span className="text-[10px] font-bold text-emerald-600 animate-bounce">
              +{recentDelta}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="text-sm font-extrabold font-display text-slate-900">{total}</span>
          {gearBonus > 0 && (
            <span className="text-[10px] font-mono font-semibold text-cyan-600 bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-200">
              +{gearBonus} gear
            </span>
          )}
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden relative">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${config.color} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
