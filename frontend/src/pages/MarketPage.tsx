import React, { useState, useEffect } from "react";
import { Item, ItemCategory } from "../types";
import { api } from "../services/api";
import { useGame } from "../context/GameContext";
import { RarityBadge } from "../components/common/RarityBadge";
import {
  ShoppingBag,
  Sword,
  Shield,
  Glasses,
  Hand,
  Footprints,
  Sparkle,
  Square,
  Image as ImageIcon,
  Coffee,
  Check,
  Zap,
  Coins
} from "lucide-react";

export const MarketPage: React.FC = () => {
  const { character, purchaseItem, equipItem } = useGame();
  const [items, setItems] = useState<Item[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [isLoading, setIsLoading] = useState(true);

  const loadItems = async () => {
    try {
      setIsLoading(true);
      const res = await api.getShopItems(activeCategory === "ALL" ? undefined : activeCategory);
      if (res.success && res.items) {
        setItems(res.items);
      }
    } catch (err) {
      console.error("Failed to load shop items", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, [activeCategory]);

  const categories = [
    { id: "ALL", label: "All Gear", icon: ShoppingBag },
    { id: "WEAPON", label: "Weapons", icon: Sword },
    { id: "ARMOR", label: "Armor", icon: Shield },
    { id: "HELMET", label: "Helmets", icon: Glasses },
    { id: "AURA", label: "Auras", icon: Sparkle },
    { id: "FRAME", label: "Frames", icon: Square },
    { id: "BACKGROUND", label: "Scenes", icon: ImageIcon },
    { id: "CONSUMABLE", label: "Consumables", icon: Coffee }
  ];

  const handleBuy = async (item: Item) => {
    const res = await purchaseItem(item.id);
    if (res.success) {
      await loadItems();
    }
  };

  const handleEquip = async (item: Item) => {
    const res = await equipItem(item.id);
    if (res.success) {
      await loadItems();
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-6 h-6 text-amber-500" />
            <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
              QuestMe Market
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Exchange your quest bounty for cybernetic weapons, defensive armor, and rare cosmetics.
          </p>
        </div>

        {/* Player Currency Pill */}
        {character && (
          <div className="flex items-center space-x-3 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm self-start sm:self-auto">
            <div className="flex items-center space-x-1 text-sm font-bold text-amber-700">
              <span>🪙</span>
              <span>{character.gold.toLocaleString()} Gold</span>
            </div>
            <div className="w-px h-4 bg-slate-200" />
            <div className="flex items-center space-x-1 text-sm font-bold text-cyan-700">
              <span>💎</span>
              <span>{character.crystals.toLocaleString()} Crystals</span>
            </div>
          </div>
        )}
      </div>

      {/* Categories Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                isActive
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={`bg-white rounded-2xl p-4 border transition-all flex flex-col justify-between ${
              item.isEquipped
                ? "border-cyan-400 bg-cyan-50/20 shadow-md ring-1 ring-cyan-400"
                : "border-slate-200 hover:border-slate-300 shadow-sm"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <RarityBadge rarity={item.rarity} />
                <span className="text-[10px] font-mono text-slate-400 uppercase">{item.category}</span>
              </div>

              <h3 className="font-display font-bold text-base text-slate-900 leading-snug">{item.name}</h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{item.description}</p>

              {/* Stat Bonuses */}
              {item.statBonusParsed && Object.keys(item.statBonusParsed).length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {Object.entries(item.statBonusParsed).map(([attr, bonus]) => (
                    <span
                      key={attr}
                      className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 uppercase"
                    >
                      +{String(bonus)} {attr}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Price and Action Footer */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="font-mono font-extrabold text-sm">
                {item.currency === "GOLD" ? (
                  <span className="text-amber-700 flex items-center space-x-1">
                    <span>🪙</span>
                    <span>{item.price} Gold</span>
                  </span>
                ) : (
                  <span className="text-cyan-700 flex items-center space-x-1">
                    <span>💎</span>
                    <span>{item.price} Crystals</span>
                  </span>
                )}
              </div>

              {item.isOwned ? (
                item.isEquippable ? (
                  <button
                    onClick={() => handleEquip(item)}
                    className={`px-3 py-1.5 rounded-xl font-display font-bold text-xs transition-all flex items-center space-x-1 ${
                      item.isEquipped
                        ? "bg-cyan-600 text-white shadow-sm"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    {item.isEquipped ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Equipped</span>
                      </>
                    ) : (
                      <span>Equip</span>
                    )}
                  </button>
                ) : (
                  <span className="text-xs font-mono text-emerald-600 font-bold">
                    Owned (x{item.quantity})
                  </span>
                )
              ) : (
                <button
                  onClick={() => handleBuy(item)}
                  className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-display font-bold text-xs shadow hover:scale-105 active:scale-95 transition-all"
                >
                  Acquire
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
