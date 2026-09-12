import React from "react";
import { Zap, Swords, Shield, Sparkles, Bot } from "lucide-react";

interface MobileNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentTab, setCurrentTab }) => {
  const tabs = [
    { id: "dashboard", label: "Command", icon: Zap },
    { id: "quests", label: "Quests", icon: Swords },
    { id: "character", label: "Hero", icon: Shield },
    { id: "bosses", label: "Raids", icon: Sparkles },
    { id: "quest-master", label: "Master", icon: Bot }
  ];

  return (
    <div className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 py-1.5 flex items-center justify-around">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              isActive ? "text-cyan-600 font-bold" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <div className={`p-1 rounded-full ${isActive ? "bg-cyan-50" : ""}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
