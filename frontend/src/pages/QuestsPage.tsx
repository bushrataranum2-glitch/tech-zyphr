import React, { useState } from "react";
import { useGame } from "../context/GameContext";
import { QuestCard } from "../components/quests/QuestCard";
import { QuestModal } from "../components/quests/QuestModal";
import { EmptyState } from "../components/common/EmptyState";
import { Quest, QuestCategory, QuestType } from "../types";
import { Swords, Plus, Filter, Search } from "lucide-react";

export const QuestsPage: React.FC = () => {
  const { quests } = useGame();
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "COMPLETED">("ACTIVE");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);

  const filteredQuests = quests.filter((q) => {
    if (statusFilter === "ACTIVE" && q.isCompleted) return false;
    if (statusFilter === "COMPLETED" && !q.isCompleted) return false;
    if (selectedType !== "ALL" && q.type !== selectedType) return false;
    if (selectedCategory !== "ALL" && q.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const match = q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    q.description?.toLowerCase().includes(searchQuery.toLowerCase());
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Swords className="w-6 h-6 text-cyan-600" />
            <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Mission Registry
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Accept and conquer real-world objectives to evolve your RPG character.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingQuest(null);
            setIsModalOpen(true);
          }}
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-display font-bold text-xs sm:text-sm shadow-md flex items-center space-x-2 self-start sm:self-auto hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 text-cyan-400" />
          <span>New Quest</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        {/* Search & Status */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search objectives by title or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-cyan-500 text-xs sm:text-sm"
            />
          </div>

          <div className="flex rounded-xl bg-slate-100 p-1 self-start sm:self-auto">
            {(["ACTIVE", "COMPLETED", "ALL"] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-display transition-all ${
                  statusFilter === st
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Type and Category Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-mono text-slate-400 flex items-center space-x-1 mr-1">
            <Filter className="w-3 h-3" />
            <span>Type:</span>
          </span>
          {["ALL", "DAILY", "MAIN", "SIDE", "EPIC"].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all ${
                selectedType === t
                  ? "bg-cyan-600 text-white font-bold"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {t}
            </button>
          ))}

          <div className="w-px h-4 bg-slate-200 mx-1 hidden sm:block" />

          <span className="text-xs font-mono text-slate-400 flex items-center space-x-1 mr-1 hidden sm:flex">
            <span>Category:</span>
          </span>
          {["ALL", "CODING", "STUDY", "FITNESS", "CAREER", "DISCIPLINE"].map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all ${
                selectedCategory === c
                  ? "bg-indigo-600 text-white font-bold"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Quest Grid */}
      {filteredQuests.length === 0 ? (
        <EmptyState
          icon={Swords}
          title="Your Quest Board is Empty"
          description="No missions match your current filter criteria. Forge a new quest to begin earning XP and gold."
          actionText="Create New Quest"
          onAction={() => {
            setEditingQuest(null);
            setIsModalOpen(true);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredQuests.map((q) => (
            <QuestCard
              key={q.id}
              quest={q}
              onEdit={(quest) => {
                setEditingQuest(quest);
                setIsModalOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <QuestModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingQuest(null);
        }}
        editQuest={editingQuest}
      />
    </div>
  );
};
