import React, { useState, useEffect } from "react";
import { useGame } from "../context/GameContext";
import { HeroAvatar } from "../components/character/HeroAvatar";
import { AttributeBar } from "../components/common/AttributeBar";
import { QuestCard } from "../components/quests/QuestCard";
import { QuestModal } from "../components/quests/QuestModal";
import { BossBattleCard } from "../components/bosses/BossBattleCard";
import { Quest, AIRecommendation } from "../types";
import { api } from "../services/api";
import {
  Sparkles,
  Plus,
  ArrowRight,
  Bot,
  Zap,
  Swords,
  Trophy,
  Flame,
  Award,
  Layers,
  ShoppingBag,
  Compass
} from "lucide-react";

interface DashboardPageProps {
  onNavigate: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { character, quests, activeBoss, completeQuest } = useGame();
  const [isQuestModalOpen, setIsQuestModalOpen] = useState(false);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [aiRec, setAiRec] = useState<AIRecommendation | null>(null);
  const [isAcceptingRec, setIsAcceptingRec] = useState(false);

  useEffect(() => {
    api.getDailyRecommendation()
      .then((res) => {
        if (res.success && res.recommendation) {
          setAiRec(res.recommendation);
        }
      })
      .catch((err) => console.warn("AI Rec load error", err));
  }, []);

  const handleAcceptRec = async () => {
    if (!aiRec) return;
    setIsAcceptingRec(true);
    try {
      const res = await api.acceptRecommendation(aiRec.id);
      if (res.success) {
        setAiRec(null);
        window.location.reload(); // Refresh to populate quest
      }
    } catch (e) {
      console.warn("Failed to accept AI rec", e);
    } finally {
      setIsAcceptingRec(false);
    }
  };

  if (!character) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-600" />
      </div>
    );
  }

  const activeQuests = quests.filter((q) => !q.isCompleted);
  const completedToday = quests.filter((q) => q.isCompleted);

  return (
    <div className="space-y-8 pb-16">
      {/* 1. HERO COMMAND BANNER */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white p-6 sm:p-8 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Glow ambient background rings */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Hero Silhouette / Avatar */}
          <div className="lg:col-span-4 flex justify-center lg:justify-start">
            <HeroAvatar
              gender={character.heroGender}
              heroClass={character.heroClass}
              level={character.level}
              evolutionStage={character.evolutionStage}
              size="lg"
            />
          </div>

          {/* Hero Stats & Progress */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold tracking-wider uppercase text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-md border border-cyan-500/30">
                    {character.heroClass}
                  </span>
                  <span className="text-xs font-mono text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-md border border-amber-500/30 font-bold">
                    {character.evolutionStage} Stage
                  </span>
                </div>
                <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight mt-1.5">
                  {character.name}
                </h1>
                <p className="text-slate-400 text-xs font-mono mt-0.5">"{character.title}"</p>
              </div>

              {/* Quick Level Pill */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-3 text-right">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">CURRENT LEVEL</span>
                <span className="font-display font-black text-3xl text-cyan-400">Lv.{character.level}</span>
              </div>
            </div>

            {/* Non-Linear XP Progress Bar */}
            <div className="space-y-1.5 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>EXPERIENCE PROGRESSION</span>
                </span>
                <span className="text-cyan-300 font-bold">
                  {character.currentXp.toLocaleString()} / {character.requiredXp.toLocaleString()} XP ({character.progressPercent}%)
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden relative shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-violet-500 rounded-full transition-all duration-500 shadow-glow"
                  style={{ width: `${character.progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-mono pt-0.5">
                <span>Non-linear curve: floor(100 × level^1.5)</span>
                <span>{character.requiredXp - character.currentXp} XP to Level {character.level + 1}</span>
              </div>
            </div>

            {/* Quick Navigation Action Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={() => onNavigate("skills")}
                className="px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-xs font-bold font-display text-white border border-slate-700 flex items-center space-x-1.5 transition-all"
              >
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Skill Tree</span>
              </button>
              <button
                onClick={() => onNavigate("market")}
                className="px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-xs font-bold font-display text-white border border-slate-700 flex items-center space-x-1.5 transition-all"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                <span>Market</span>
              </button>
              <button
                onClick={() => onNavigate("world")}
                className="px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-xs font-bold font-display text-white border border-slate-700 flex items-center space-x-1.5 transition-all"
              >
                <Compass className="w-3.5 h-3.5 text-indigo-400" />
                <span>World Map</span>
              </button>
              <button
                onClick={() => onNavigate("character")}
                className="px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-xs font-bold font-display text-white border border-slate-700 flex items-center space-x-1.5 transition-all ml-auto"
              >
                <span>Full Character Sheet</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ATTRIBUTES GRID */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-cyan-600" />
            <h2 className="font-display font-extrabold text-lg text-slate-900 uppercase tracking-tight">
              Character Attributes
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Dynamically raised by completed quests</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <AttributeBar
            name="Strength"
            value={character.baseAttributes.strength}
            gearBonus={character.gearBonuses.strength}
          />
          <AttributeBar
            name="Intelligence"
            value={character.baseAttributes.intelligence}
            gearBonus={character.gearBonuses.intelligence}
          />
          <AttributeBar
            name="Dexterity"
            value={character.baseAttributes.dexterity}
            gearBonus={character.gearBonuses.dexterity}
          />
          <AttributeBar
            name="Wisdom"
            value={character.baseAttributes.wisdom}
            gearBonus={character.gearBonuses.wisdom}
          />
          <AttributeBar
            name="Charisma"
            value={character.baseAttributes.charisma}
            gearBonus={character.gearBonuses.charisma}
          />
          <AttributeBar
            name="Discipline"
            value={character.baseAttributes.discipline}
            gearBonus={character.gearBonuses.discipline}
          />
        </div>
      </div>

      {/* 3. AI QUEST MASTER INSIGHT & RECOMMENDATION */}
      {aiRec && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-50/70 via-indigo-50/50 to-purple-50/70 border border-cyan-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="p-2.5 rounded-xl bg-white shadow-sm border border-cyan-200 text-cyan-600 flex-shrink-0">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-700 bg-cyan-100/70 px-2 py-0.5 rounded">
                  AI QUEST MASTER ADVICE
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">
                  Target: {aiRec.attribute}
                </span>
              </div>
              <h3 className="font-display font-bold text-slate-900 text-sm mt-1">{aiRec.title}</h3>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed max-w-2xl">{aiRec.reason}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            <button
              onClick={handleAcceptRec}
              disabled={isAcceptingRec}
              className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-display font-bold shadow-md shadow-cyan-600/20 hover:scale-105 active:scale-95 transition-all flex items-center space-x-1.5 flex-shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAcceptingRec ? "Accepting..." : "Accept Recommended Quest"}</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. ACTIVE BOSS RAID */}
      {activeBoss && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Flame className="w-4 h-4 text-rose-500" />
              <h2 className="font-display font-extrabold text-lg text-slate-900 uppercase tracking-tight">
                Active Obstacle Raid
              </h2>
            </div>
            <button
              onClick={() => onNavigate("bosses")}
              className="text-xs text-cyan-600 hover:text-cyan-800 font-semibold flex items-center space-x-1"
            >
              <span>View All Raids</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <BossBattleCard boss={activeBoss} />
        </div>
      )}

      {/* 5. TODAY'S QUEST BOARD */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <Swords className="w-4 h-4 text-cyan-600" />
              <h2 className="font-display font-extrabold text-lg text-slate-900 uppercase tracking-tight">
                Today's Quests ({activeQuests.length} pending)
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Completed quests award XP, Gold, and damage the active obstacle boss.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setEditingQuest(null);
                setIsQuestModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-display font-bold text-xs shadow-md flex items-center space-x-1.5 hover:scale-105 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>New Quest</span>
            </button>
          </div>
        </div>

        {activeQuests.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white border border-dashed border-slate-300 text-center space-y-3">
            <Trophy className="w-8 h-8 text-amber-500 mx-auto" />
            <h4 className="font-display font-bold text-slate-800">All Quests Conquered!</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              You have resolved all pending quests. Create another mission or consult the Quest Master.
            </p>
            <button
              onClick={() => setIsQuestModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-cyan-600 text-white font-display font-bold text-xs shadow"
            >
              Create New Quest
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeQuests.map((q) => (
              <QuestCard
                key={q.id}
                quest={q}
                onEdit={(quest) => {
                  setEditingQuest(quest);
                  setIsQuestModalOpen(true);
                }}
              />
            ))}
          </div>
        )}

        {/* Recently Completed Quests accordion */}
        {completedToday.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-200">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
              Conquered Missions Today ({completedToday.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 opacity-75">
              {completedToday.slice(0, 4).map((q) => (
                <QuestCard key={q.id} quest={q} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quest Modal */}
      <QuestModal
        isOpen={isQuestModalOpen}
        onClose={() => {
          setIsQuestModalOpen(false);
          setEditingQuest(null);
        }}
        editQuest={editingQuest}
      />
    </div>
  );
};
