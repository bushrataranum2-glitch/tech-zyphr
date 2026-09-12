import React, { useState, useEffect } from "react";
import { Quest, QuestCategory, QuestDifficulty, QuestType } from "../../types";
import { useGame } from "../../context/GameContext";
import { X, Sparkles, Swords } from "lucide-react";

interface QuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  editQuest?: Quest | null;
}

export const QuestModal: React.FC<QuestModalProps> = ({ isOpen, onClose, editQuest }) => {
  const { createQuest, updateQuest } = useGame();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<QuestCategory>("CODING");
  const [difficulty, setDifficulty] = useState<QuestDifficulty>("NORMAL");
  const [type, setType] = useState<QuestType>("DAILY");
  const [recurrence, setRecurrence] = useState("NONE");
  const [estimatedMinutes, setEstimatedMinutes] = useState(30);
  const [attributeAffected, setAttributeAffected] = useState("INTELLIGENCE");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editQuest) {
      setTitle(editQuest.title);
      setDescription(editQuest.description || "");
      setCategory(editQuest.category);
      setDifficulty(editQuest.difficulty);
      setType(editQuest.type);
      setRecurrence(editQuest.recurrence || "NONE");
      setEstimatedMinutes(editQuest.estimatedMinutes || 30);
      setAttributeAffected(editQuest.attributeAffected || "INTELLIGENCE");
    } else {
      setTitle("");
      setDescription("");
      setCategory("CODING");
      setDifficulty("NORMAL");
      setType("DAILY");
      setRecurrence("NONE");
      setEstimatedMinutes(30);
      setAttributeAffected("INTELLIGENCE");
    }
  }, [editQuest, isOpen]);

  if (!isOpen) return null;

  const getRewardPreview = () => {
    switch (difficulty) {
      case "EASY":
        return { xp: 40, gold: 10, primaryAttr: 2, disc: 1 };
      case "HARD":
        return { xp: 150, gold: 40, primaryAttr: 10, disc: 5 };
      case "EPIC":
        return { xp: 400, gold: 100, primaryAttr: 25, disc: 15 };
      case "NORMAL":
      default:
        return { xp: 80, gold: 20, primaryAttr: 5, disc: 2 };
    }
  };

  const preview = getRewardPreview();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    const payload = {
      title: title.trim(),
      description: description.trim(),
      category,
      difficulty,
      type,
      recurrence,
      estimatedMinutes: Number(estimatedMinutes),
      attributeAffected
    };

    let success = false;
    if (editQuest) {
      success = await updateQuest(editQuest.id, payload);
    } else {
      success = await createQuest(payload);
    }

    setIsSubmitting(false);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-200">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-slate-900 text-lg">
                {editQuest ? "Edit Quest Parameters" : "Draft New Quest"}
              </h3>
              <p className="text-xs text-slate-500 font-medium">Turn real-world intent into character power</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 font-display uppercase tracking-wider mb-1">
              Quest Objective *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Study Java 90 minutes, Run 5km, Ship PR"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-sm font-medium"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 font-display uppercase tracking-wider mb-1">
              Mission Context / Notes
            </label>
            <textarea
              rows={2}
              placeholder="Provide tactical context, links, or specific acceptance criteria..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-sm"
            />
          </div>

          {/* Category & Attribute */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 font-display uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => {
                  const cat = e.target.value as QuestCategory;
                  setCategory(cat);
                  // Auto-suggest primary attribute
                  if (cat === "CODING") setAttributeAffected("INTELLIGENCE");
                  else if (cat === "FITNESS") setAttributeAffected("STRENGTH");
                  else if (cat === "STUDY") setAttributeAffected("WISDOM");
                  else if (cat === "GROWTH") setAttributeAffected("CHARISMA");
                  else if (cat === "DISCIPLINE") setAttributeAffected("DISCIPLINE");
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-500 text-sm font-medium bg-white"
              >
                <option value="CODING">Coding</option>
                <option value="STUDY">Study & Reading</option>
                <option value="FITNESS">Fitness & Health</option>
                <option value="CAREER">Career & Launch</option>
                <option value="GROWTH">Personal Growth</option>
                <option value="CREATIVITY">Creativity & Design</option>
                <option value="DISCIPLINE">Discipline & Habit</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 font-display uppercase tracking-wider mb-1">
                Primary Attribute
              </label>
              <select
                value={attributeAffected}
                onChange={(e) => setAttributeAffected(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-500 text-sm font-medium bg-white"
              >
                <option value="INTELLIGENCE">Intelligence</option>
                <option value="STRENGTH">Strength</option>
                <option value="DEXTERITY">Dexterity</option>
                <option value="WISDOM">Wisdom</option>
                <option value="CHARISMA">Charisma</option>
                <option value="DISCIPLINE">Discipline</option>
              </select>
            </div>
          </div>

          {/* Difficulty & Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 font-display uppercase tracking-wider mb-1">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as QuestDifficulty)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-500 text-sm font-medium bg-white"
              >
                <option value="EASY">Easy</option>
                <option value="NORMAL">Normal</option>
                <option value="HARD">Hard</option>
                <option value="EPIC">Epic</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 font-display uppercase tracking-wider mb-1">
                Quest Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as QuestType)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-500 text-sm font-medium bg-white"
              >
                <option value="DAILY">Daily Quest</option>
                <option value="MAIN">Main Quest</option>
                <option value="SIDE">Side Quest</option>
                <option value="EPIC">Epic Quest</option>
              </select>
            </div>
          </div>

          {/* Recurrence & Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 font-display uppercase tracking-wider mb-1">
                Recurrence
              </label>
              <select
                value={recurrence}
                onChange={(e) => setRecurrence(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-500 text-sm font-medium bg-white"
              >
                <option value="NONE">One-Time</option>
                <option value="DAILY">Repeats Daily</option>
                <option value="WEEKLY">Repeats Weekly</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 font-display uppercase tracking-wider mb-1">
                Est. Duration (min)
              </label>
              <input
                type="number"
                min="5"
                max="480"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-500 text-sm font-medium bg-white"
              />
            </div>
          </div>

          {/* Server-Authoritative Reward Calculation Preview Card */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-slate-500 font-bold uppercase">Estimated Yield</span>
              <span className="text-cyan-600 font-bold">Server Verified</span>
            </div>
            <div className="flex items-center space-x-3 text-xs font-bold">
              <span className="text-cyan-600 bg-cyan-50 px-2 py-1 rounded border border-cyan-200">
                +{preview.xp} XP
              </span>
              <span className="text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-200">
                🪙 +{preview.gold} Gold
              </span>
              <span className="text-slate-600 bg-white px-2 py-1 rounded border border-slate-200">
                +{preview.primaryAttr} {attributeAffected}
              </span>
              <span className="text-slate-600 bg-white px-2 py-1 rounded border border-slate-200">
                +{preview.disc} DISC
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 font-medium text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-display font-bold text-sm shadow-md shadow-cyan-600/20 hover:scale-105 active:scale-95 transition-all flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{editQuest ? "Save Changes" : "Accept Quest"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
