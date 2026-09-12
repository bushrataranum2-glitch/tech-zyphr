import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useGame } from "../../context/GameContext";
import {
  Shield,
  Zap,
  Award,
  Compass,
  ShoppingBag,
  BarChart2,
  Bot,
  Volume2,
  VolumeX,
  Bell,
  LogOut,
  Menu,
  X,
  Swords,
  Layers,
  Sparkles
} from "lucide-react";

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, onOpenNotifications }) => {
  const { user, logout } = useAuth();
  const { character, unreadCount, isMuted, toggleMute } = useGame();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Command", icon: Zap },
    { id: "quests", label: "Quests", icon: Swords },
    { id: "character", label: "Hero", icon: Shield },
    { id: "skills", label: "Skills", icon: Layers },
    { id: "bosses", label: "Raids", icon: Sparkles },
    { id: "world", label: "World", icon: Compass },
    { id: "market", label: "Market", icon: ShoppingBag },
    { id: "achievements", label: "Legends", icon: Award },
    { id: "analytics", label: "Growth", icon: BarChart2 },
    { id: "quest-master", label: "Quest Master", icon: Bot }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            onClick={() => setCurrentTab("dashboard")}
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <span className="font-display font-bold text-xl tracking-wider">Q</span>
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <span className="font-display font-extrabold text-xl tracking-tight text-slate-900">QUEST</span>
                <span className="font-display font-extrabold text-xl tracking-tight text-cyan-600">ME</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase -mt-1">LIFE RPG</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-cyan-50 text-cyan-700 font-semibold border border-cyan-200 shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-cyan-600" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Header Controls: Currencies, Audio, Notifications, Profile */}
          <div className="flex items-center space-x-3">
            {/* Currencies Pill */}
            {character && (
              <div className="hidden sm:flex items-center space-x-2 bg-slate-50 border border-slate-200/80 rounded-full px-3 py-1.5 shadow-inner">
                {/* Gold */}
                <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-700">
                  <span className="text-sm">🪙</span>
                  <span>{character.gold.toLocaleString()}</span>
                </div>
                <div className="w-px h-3.5 bg-slate-200" />
                {/* Crystals */}
                <div className="flex items-center space-x-1.5 text-xs font-bold text-cyan-700">
                  <span className="text-sm">💎</span>
                  <span>{character.crystals.toLocaleString()}</span>
                </div>
                <div className="w-px h-3.5 bg-slate-200" />
                {/* Streak */}
                <div className="flex items-center space-x-1 text-xs font-bold text-orange-600">
                  <span>🔥</span>
                  <span>{character.streak?.currentStreak || 0}d</span>
                </div>
              </div>
            )}

            {/* Audio Toggle */}
            <button
              onClick={toggleMute}
              title={isMuted ? "Unmute Sound" : "Mute Sound"}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-rose-500" /> : <Volume2 className="w-5 h-5 text-cyan-600" />}
            </button>

            {/* Notifications Button */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
              )}
            </button>

            {/* Hero Pill / Profile */}
            {character && (
              <div
                onClick={() => setCurrentTab("character")}
                className="cursor-pointer flex items-center space-x-2 pl-2 pr-3 py-1 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-sm"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center text-[10px] font-bold text-slate-950">
                  {character.level}
                </div>
                <div className="text-left hidden md:block">
                  <div className="text-xs font-semibold leading-none">{character.name}</div>
                  <div className="text-[10px] text-cyan-300 font-mono leading-tight">{character.heroClass}</div>
                </div>
              </div>
            )}

            {/* Logout button */}
            <button
              onClick={logout}
              className="hidden md:flex p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>

            {/* Mobile menu toggle button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {/* Mobile Currencies */}
          {character && (
            <div className="flex items-center justify-around bg-slate-50 p-2.5 rounded-lg mb-3 border border-slate-200">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-700">
                <span>🪙</span>
                <span>{character.gold} Gold</span>
              </div>
              <div className="flex items-center space-x-1.5 text-xs font-bold text-cyan-700">
                <span>💎</span>
                <span>{character.crystals} Crystals</span>
              </div>
              <div className="flex items-center space-x-1.5 text-xs font-bold text-orange-600">
                <span>🔥</span>
                <span>{character.streak?.currentStreak || 0} Day Streak</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-2 px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive ? "bg-cyan-50 text-cyan-700 font-bold border border-cyan-200" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-cyan-600" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 mt-2 flex justify-between items-center px-2">
            <span className="text-xs text-slate-400">Signed in as {user?.email}</span>
            <button
              onClick={logout}
              className="text-xs text-rose-600 font-semibold flex items-center space-x-1 hover:underline"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
