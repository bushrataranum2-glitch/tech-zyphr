import React from "react";
import { useGame } from "../context/GameContext";
import { HeroAvatar } from "../components/character/HeroAvatar";
import { AttributeBar } from "../components/common/AttributeBar";
import { RarityBadge } from "../components/common/RarityBadge";
import { Shield, Sparkles, Trophy, Award, CheckCircle2, Lock } from "lucide-react";

export const CharacterPage: React.FC = () => {
  const { character } = useGame();

  if (!character) return null;

  const equipmentSlots = [
    { key: "WEAPON", label: "Weapon", icon: "⚔️" },
    { key: "ARMOR", label: "Armor", icon: "🛡️" },
    { key: "HELMET", label: "Helmet", icon: "🪖" },
    { key: "GLOVES", label: "Gloves", icon: "🧤" },
    { key: "BOOTS", label: "Boots", icon: "👢" },
    { key: "AURA", label: "Aura", icon: "✨" },
    { key: "FRAME", label: "Frame", icon: "🖼️" },
    { key: "ACCESSORY", label: "Accessory", icon: "💍" }
  ];

  const getEquippedInSlot = (slotKey: string) => {
    return character.equippedGear?.find((g) => g.slot.toUpperCase() === slotKey.toUpperCase())?.item;
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <Shield className="w-6 h-6 text-cyan-600" />
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Hero Dossier
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Identity, neurological attributes, equipped cybernetic gear, and evolution timeline.
        </p>
      </div>

      {/* Main Character Sheet Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Anime Hero Visual & Bio */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-slate-950 text-white p-6 rounded-3xl border border-slate-800 shadow-2xl flex flex-col items-center text-center">
          <HeroAvatar
            gender={character.heroGender}
            heroClass={character.heroClass}
            level={character.level}
            evolutionStage={character.evolutionStage}
            size="xl"
            className="mb-4"
          />

          <h2 className="font-display font-black text-2xl text-white tracking-tight">{character.name}</h2>
          <p className="text-cyan-400 text-xs font-mono font-bold mt-0.5">{character.heroClass} • {character.evolutionStage}</p>
          <p className="text-slate-400 text-xs mt-2 italic max-w-xs">"{character.title}"</p>

          <div className="w-full grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-slate-800 text-center">
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono block">STREAK</span>
              <span className="font-display font-bold text-base text-orange-400">
                🔥 {character.streak?.currentStreak || 0}d
              </span>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono block">GOLD</span>
              <span className="font-display font-bold text-base text-amber-400">
                🪙 {character.gold}
              </span>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono block">CRYSTALS</span>
              <span className="font-display font-bold text-base text-cyan-400">
                💎 {character.crystals}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Attribute Details & Breakdown */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-slate-900 text-lg">Attribute Matrix</h3>
              <span className="text-xs text-slate-400 font-mono">Total = Base + Equipment</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

          {/* Equipped Gear Slots Grid */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-slate-900 text-lg">Equipped Gear</h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {equipmentSlots.map((slot) => {
                const item = getEquippedInSlot(slot.key);
                return (
                  <div
                    key={slot.key}
                    className={`p-3.5 rounded-2xl border flex flex-col justify-between transition-all ${
                      item
                        ? "bg-slate-50 border-cyan-300 shadow-sm"
                        : "bg-slate-50/40 border-dashed border-slate-200 text-slate-400"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg">{slot.icon}</span>
                      {item ? (
                        <RarityBadge rarity={item.rarity} />
                      ) : (
                        <span className="text-[9px] font-mono uppercase text-slate-400">Empty</span>
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block">{slot.label}</span>
                      <h4 className="text-xs font-bold text-slate-800 truncate">
                        {item ? item.name : "None Equipped"}
                      </h4>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Evolution Timeline */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <h3 className="font-display font-bold text-slate-900 text-lg">Character Evolution Path</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Your real-world accomplishments advance you through distinct mythic tiers.
          </p>
        </div>

        <div className="relative">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {character.evolutionTimeline?.map((tier) => (
              <div
                key={tier.stage}
                className={`p-4 rounded-2xl border transition-all text-center flex flex-col justify-between ${
                  tier.isUnlocked
                    ? "bg-gradient-to-b from-cyan-50 to-white border-cyan-300 shadow-sm"
                    : "bg-slate-50/50 border-slate-200 opacity-50"
                }`}
              >
                <div>
                  <div className="flex justify-center mb-2">
                    {tier.isUnlocked ? (
                      <div className="w-8 h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center shadow-md shadow-cyan-600/20">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 font-bold block">
                    Lv. {tier.minLevel}
                  </span>
                  <h4 className="font-display font-extrabold text-sm text-slate-900 mt-1">
                    {tier.stage}
                  </h4>
                </div>
                <p className="text-[10px] text-slate-500 font-mono mt-2">{tier.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
