import React from "react";
import { ItemRarity } from "../../types";

interface RarityBadgeProps {
  rarity: ItemRarity;
  className?: string;
}

export const RarityBadge: React.FC<RarityBadgeProps> = ({ rarity, className = "" }) => {
  const getStyle = () => {
    switch (rarity) {
      case "COMMON":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "UNCOMMON":
        return "bg-emerald-50 text-emerald-700 border-emerald-300";
      case "RARE":
        return "bg-cyan-50 text-cyan-700 border-cyan-300";
      case "EPIC":
        return "bg-purple-50 text-purple-700 border-purple-300 shadow-sm shadow-purple-500/20";
      case "LEGENDARY":
        return "bg-amber-50 text-amber-700 border-amber-300 shadow-sm shadow-amber-500/30 font-bold";
      case "MYTHIC":
        return "bg-gradient-to-r from-rose-500 to-pink-600 text-white border-transparent shadow-md shadow-rose-500/40 font-extrabold animate-pulse";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase border ${getStyle()} ${className}`}
    >
      {rarity}
    </span>
  );
};
