import React, { useState, useEffect } from "react";
import { WorldRegion } from "../types";
import { api } from "../services/api";
import { Compass, Lock, CheckCircle2, MapPin, Sparkles } from "lucide-react";

export const WorldPage: React.FC = () => {
  const [regions, setRegions] = useState<WorldRegion[]>([]);
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getWorldRegions()
      .then((res) => {
        if (res.success && res.regions) {
          setRegions(res.regions);
          setCurrentLevel(res.currentLevel);
        }
      })
      .catch((err) => console.error("Failed to load regions", err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <Compass className="w-6 h-6 text-indigo-600" />
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Aetherial World Map
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Explore fantasy-cyberpunk biomes unlocked as your character level ascends.
        </p>
      </div>

      {/* World Map Regions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {regions.map((region) => (
          <div
            key={region.id}
            className={`rounded-3xl border-2 transition-all p-6 flex flex-col justify-between overflow-hidden relative ${
              region.isUnlocked
                ? "bg-white border-slate-200 hover:border-indigo-400 hover:shadow-xl shadow-sm"
                : "bg-slate-50/60 border-slate-200/80 opacity-60"
            }`}
          >
            {/* Header / Theme */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded font-bold uppercase">
                  {region.theme.replace("_", " ")}
                </span>
                {region.isUnlocked ? (
                  <span className="text-[10px] font-mono text-emerald-600 font-bold flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>UNLOCKED</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-slate-400 font-bold flex items-center space-x-1">
                    <Lock className="w-3.5 h-3.5" />
                    <span>REQ LV.{region.unlockLevel}</span>
                  </span>
                )}
              </div>

              <h3 className="font-display font-black text-xl text-slate-900 tracking-tight mb-1">
                {region.name}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                {region.description}
              </p>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 italic leading-relaxed">
                "{region.lore}"
              </div>
            </div>

            {/* Bottom Status */}
            <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Unlock Level: {region.unlockLevel}</span>
              {region.isUnlocked ? (
                <span className="text-indigo-600 font-bold flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Accessible</span>
                </span>
              ) : (
                <span className="text-slate-400">
                  {region.unlockLevel - currentLevel} levels remaining
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
