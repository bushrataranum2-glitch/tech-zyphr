import React from "react";
import { HeroGender, HeroClass } from "../../types";
import { Shield, Cpu, BookOpen, Flame, Compass, Palette } from "lucide-react";

interface HeroAvatarProps {
  gender: HeroGender;
  heroClass: HeroClass;
  level: number;
  evolutionStage: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const HeroAvatar: React.FC<HeroAvatarProps> = ({
  gender,
  heroClass,
  level,
  evolutionStage,
  size = "md",
  className = ""
}) => {
  const isMale = gender === "MALE";

  const getClassTheme = () => {
    switch (heroClass) {
      case "TECHMANCER":
        return {
          color: "from-cyan-500 to-blue-600",
          accentHex: "#06B6D4",
          icon: Cpu,
          tag: "DIGITAL ARCHITECT"
        };
      case "WARRIOR":
        return {
          color: "from-amber-500 to-red-600",
          accentHex: "#F59E0B",
          icon: Flame,
          tag: "VANGUARD TITAN"
        };
      case "SAGE":
        return {
          color: "from-violet-500 to-indigo-600",
          accentHex: "#8B5CF6",
          icon: BookOpen,
          tag: "SCHOLAR OF RUNES"
        };
      case "RANGER":
        return {
          color: "from-emerald-500 to-teal-600",
          accentHex: "#10B981",
          icon: Compass,
          tag: "KINETIC STRIKER"
        };
      case "MAGE":
        return {
          color: "from-purple-500 to-pink-600",
          accentHex: "#EC4899",
          icon: Shield,
          tag: "ASTRAL WEAVER"
        };
      case "CREATOR":
        return {
          color: "from-pink-500 to-rose-600",
          accentHex: "#F43F5E",
          icon: Palette,
          tag: "INNOVATION ARTISAN"
        };
      default:
        return {
          color: "from-cyan-500 to-indigo-600",
          accentHex: "#06B6D4",
          icon: Cpu,
          tag: "OPERATIVE"
        };
    }
  };

  const theme = getClassTheme();
  const ClassIcon = theme.icon;

  const sizeClasses = {
    sm: "w-20 h-28",
    md: "w-44 h-60",
    lg: "w-64 h-84",
    xl: "w-80 h-96"
  };

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* Outer Card Frame with Cinematic Dark Cyberpunk Anime Protagonist */}
      <div
        className={`relative ${sizeClasses[size]} rounded-2xl overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-2 border-slate-700/80 shadow-2xl flex flex-col items-center justify-between p-3 group`}
        style={{
          boxShadow: `0 10px 30px -5px ${theme.accentHex}33`
        }}
      >
        {/* Animated Cybernetic Grid Background */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Ambient Aura Gradient Glow */}
        <div
          className="absolute -top-12 inset-x-0 h-40 rounded-full blur-2xl opacity-40 pointer-events-none"
          style={{ background: theme.accentHex }}
        />

        {/* Top Header Tag: Class & Stage */}
        <div className="relative z-10 w-full flex items-center justify-between text-[10px] font-mono tracking-wider">
          <span className="bg-slate-800/90 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30 flex items-center space-x-1">
            <ClassIcon className="w-2.5 h-2.5" />
            <span>{heroClass}</span>
          </span>
          <span className="text-amber-400 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/40">
            Lv.{level}
          </span>
        </div>

        {/* Cinematic Character Graphic Illustration */}
        <div className="relative z-10 flex-1 flex items-center justify-center my-1 w-full">
          <svg
            viewBox="0 0 200 240"
            className="w-full h-full max-h-[190px] drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Energy Aura Ring behind character */}
            <circle
              cx="100"
              cy="100"
              r="65"
              stroke={theme.accentHex}
              strokeWidth="1.5"
              strokeDasharray="6 4"
              className="animate-spin-slow opacity-60"
            />
            <circle cx="100" cy="100" r="75" stroke="#FFFFFF" strokeWidth="0.5" strokeOpacity="0.3" />

            {/* Glowing Rune Sigils */}
            <polygon
              points="100,28 108,44 92,44"
              fill={theme.accentHex}
              className="opacity-70 animate-pulse"
            />

            {/* Cybernetic Cape / High Collar */}
            <path
              d="M 60 110 L 40 220 L 75 210 L 100 130 L 125 210 L 160 220 L 140 110 Z"
              fill="#0b0f19"
              stroke="#1e293b"
              strokeWidth="1.5"
            />

            {/* Tactical Armor Body Chassis */}
            <path
              d="M 68 115 L 85 185 L 115 185 L 132 115 L 120 95 L 80 95 Z"
              fill="#1e293b"
              stroke={theme.accentHex}
              strokeWidth="1.5"
            />

            {/* Glowing Core Armor Reactor */}
            <polygon
              points="100,120 108,135 100,150 92,135"
              fill={theme.accentHex}
              className="filter drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] animate-pulse"
            />
            <line x1="85" y1="135" x2="115" y2="135" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.7" />

            {/* Shoulders & Pauldrons */}
            <path
              d="M 50 100 L 75 92 L 78 120 L 52 115 Z"
              fill="#0f172a"
              stroke="#38bdf8"
              strokeWidth="1"
            />
            <path
              d="M 150 100 L 125 92 L 122 120 L 148 115 Z"
              fill="#0f172a"
              stroke="#38bdf8"
              strokeWidth="1"
            />

            {/* Neck & Jawline (Sharp Anime Aesthetics) */}
            <polygon points="90,85 110,85 105,102 95,102" fill="#d1d5db" />
            <polygon
              points={isMale ? "78,65 122,65 115,92 100,105 85,92" : "80,68 120,68 114,90 100,102 86,90"}
              fill="#f1f5f9"
            />

            {/* Anime Hair Silhouette */}
            {isMale ? (
              // Spiky mature cyberpunk hair
              <path
                d="M 72 65 L 62 48 L 78 45 L 75 30 L 95 38 L 105 24 L 118 36 L 132 30 L 128 48 L 142 55 L 130 68 L 122 62 L 100 68 L 78 62 Z"
                fill="#090d16"
                stroke={theme.accentHex}
                strokeWidth="1"
              />
            ) : (
              // Sleek winged futuristic bangs & side locks
              <path
                d="M 70 70 L 60 52 L 75 42 L 88 28 L 102 24 L 115 28 L 128 42 L 142 52 L 132 70 L 138 120 L 128 110 L 124 64 L 100 68 L 76 64 L 72 110 L 62 120 Z"
                fill="#090d16"
                stroke={theme.accentHex}
                strokeWidth="1"
              />
            )}

            {/* Cyber Visor / Glowing Eyes */}
            <rect
              x="86"
              y="74"
              width="28"
              height="5"
              rx="2.5"
              fill={theme.accentHex}
              className="drop-shadow-[0_0_6px_rgba(6,182,212,0.9)]"
            />

            {/* Cybernetic Headpiece Antenna / Rune Earpiece */}
            <circle cx="74" cy="74" r="3" fill="#38bdf8" />
            <line x1="74" y1="74" x2="66" y2="60" stroke="#38bdf8" strokeWidth="1.5" />
            <circle cx="126" cy="74" r="3" fill="#38bdf8" />
            <line x1="126" y1="74" x2="134" y2="60" stroke="#38bdf8" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Bottom Silhouette Stage Tag */}
        <div className="relative z-10 w-full text-center">
          <div className="text-[11px] font-display font-extrabold text-white tracking-widest uppercase">
            {evolutionStage}
          </div>
          <div className="text-[9px] font-mono text-slate-400 -mt-0.5">
            {isMale ? "Cyber Operative" : "Cyber Vanguard"}
          </div>
        </div>
      </div>
    </div>
  );
};
