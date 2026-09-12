import React from "react";
import { HeroAvatar } from "../components/character/HeroAvatar";
import {
  Zap,
  Swords,
  Shield,
  Layers,
  Sparkles,
  Bot,
  Compass,
  ArrowRight,
  Award,
  CheckCircle2
} from "lucide-react";

interface LandingPageProps {
  onStart: () => void;
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onLogin }) => {
  return (
    <div className="min-h-screen bg-rpg-bg text-slate-900 selection:bg-cyan-500 selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
              <span className="font-display font-extrabold text-xl">Q</span>
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <span className="font-display font-black text-xl text-slate-900">QUEST</span>
                <span className="font-display font-black text-xl text-cyan-600">ME</span>
              </div>
              <p className="text-[9px] text-slate-400 font-mono tracking-widest uppercase -mt-1">LIFE RPG</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onLogin}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={onStart}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-display font-bold text-sm shadow-md shadow-cyan-500/25 hover:scale-105 active:scale-95 transition-all"
            >
              Start Your Journey
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-cyan-200/40 via-violet-200/30 to-pink-200/30 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Headline */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-50 border border-cyan-200/80 text-cyan-700 text-xs font-mono font-bold tracking-wider uppercase">
                <Zap className="w-3.5 h-3.5 text-cyan-600" />
                <span>REAL-LIFE PROGRESSION RPG</span>
              </div>

              <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-slate-950 leading-[1.05]">
                YOUR LIFE. <br />
                YOUR QUESTS. <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 via-indigo-600 to-violet-600">
                  YOUR EVOLUTION.
                </span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Turn everyday actions into quests, build your character, defeat your obstacles, and become the hero of your own story.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={onStart}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 hover:bg-slate-800 text-white font-display font-bold text-base shadow-xl shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-2.5"
                >
                  <span>START YOUR JOURNEY</span>
                  <ArrowRight className="w-5 h-5 text-cyan-400" />
                </button>
                <a
                  href="#how-it-works"
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl border border-slate-300 hover:border-slate-400 bg-white/80 hover:bg-white text-slate-700 font-display font-bold text-base transition-all text-center"
                >
                  EXPLORE QUESTME
                </a>
              </div>

              {/* Trust/Feature Pills */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-500 font-medium">
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600" />
                  <span>Non-linear XP Curves</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600" />
                  <span>Obstacle Boss Raids</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600" />
                  <span>AI Quest Master Mentor</span>
                </span>
              </div>
            </div>

            {/* Right Character Card Showcase */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative">
                {/* Floating XP Card */}
                <div className="absolute -top-6 -left-6 z-20 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 shadow-xl animate-float">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 font-display">+150 XP • +40 Gold</div>
                      <div className="text-[10px] text-slate-400 font-mono">Study Java for 90m</div>
                    </div>
                  </div>
                </div>

                {/* Hero Avatar Component */}
                <HeroAvatar
                  gender="MALE"
                  heroClass="TECHMANCER"
                  level={14}
                  evolutionStage="Specialist"
                  size="xl"
                />

                {/* Floating Boss Damage Card */}
                <div className="absolute -bottom-6 -right-6 z-20 bg-slate-900 text-white p-3.5 rounded-2xl border border-slate-700 shadow-xl">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-xl bg-rose-950 text-rose-400">
                      <Swords className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold font-display text-rose-300">-225 Boss Damage</div>
                      <div className="text-[10px] text-slate-400 font-mono">Procrastination Weakened</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold text-cyan-600 uppercase tracking-widest bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200">
              GAMEPLAY LOOP
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 tracking-tight mt-3">
              Real-Life Action → Character Evolution
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              Every productive action directly drives character attributes, skill points, and story unlocks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { step: "01", title: "Action", desc: "Workout, coding session, reading, or deep focus.", icon: Zap },
              { step: "02", title: "Quest Log", desc: "Record missions with server-verified XP rewards.", icon: Swords },
              { step: "03", title: "Attributes", desc: "Boost Strength, Intelligence, Discipline, and more.", icon: Shield },
              { step: "04", title: "Skill Tree", desc: "Unlock active perks across 6 progression branches.", icon: Layers },
              { step: "05", title: "Boss Raids", desc: "Slay Procrastination, Distraction, and Self-Doubt.", icon: Sparkles },
              { step: "06", title: "World Unlock", desc: "Travel to Neo-Alexandria, Sky Citadel, and beyond.", icon: Compass }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-cyan-400 hover:bg-white hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-cyan-600">{item.step}</span>
                    <Icon className="w-5 h-5 text-slate-600" />
                  </div>
                  <h3 className="font-display font-bold text-base text-slate-800 mb-1">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Hero Classes Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              CHOOSE YOUR PATH
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 tracking-tight mt-3">
              Six Specialized RPG Classes
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              Your class determines your starting attributes, but your habits forge your destiny.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                class: "WARRIOR",
                emoji: "⚔️",
                primary: "Strength",
                sec: "Discipline",
                desc: "Focused on heavy workouts, physical endurance, and morning consistency."
              },
              {
                class: "SAGE",
                emoji: "🧠",
                primary: "Intelligence",
                sec: "Wisdom",
                desc: "Dedicated to academic study, non-fiction reading, and strategic contemplation."
              },
              {
                class: "TECHMANCER",
                emoji: "💻",
                primary: "Intelligence",
                sec: "Creativity",
                desc: "Forged in code, algorithmic challenges, distributed architectures, and technical launches."
              },
              {
                class: "RANGER",
                emoji: "🏹",
                primary: "Dexterity",
                sec: "Endurance",
                desc: "Agile outdoor activity, high daily step goals, running, and athletic movement."
              },
              {
                class: "MAGE",
                emoji: "🔮",
                primary: "Wisdom",
                sec: "Creativity",
                desc: "Deep reflection, philosophical insight, writing, and mindful habit building."
              },
              {
                class: "CREATOR",
                emoji: "🎨",
                primary: "Creativity",
                sec: "Charisma",
                desc: "Design systems, content publishing, public speaking, and community leadership."
              }
            ].map((cls, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-xl transition-all"
              >
                <div className="text-3xl mb-3">{cls.emoji}</div>
                <h3 className="font-display font-extrabold text-xl text-slate-900">{cls.class}</h3>
                <div className="flex items-center space-x-2 text-xs font-mono text-indigo-600 mt-1 mb-3">
                  <span>Primary: {cls.primary}</span>
                  <span>•</span>
                  <span>Sec: {cls.sec}</span>
                </div>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{cls.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Quest Master & Bosses Showcase */}
      <section className="py-20 bg-slate-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 text-xs font-mono font-bold">
                <Bot className="w-3.5 h-3.5" />
                <span>NEURAL ADVISOR SYSTEM</span>
              </div>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight mt-4 mb-4">
                Guided by the AI Quest Master
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Not a generic chat bot. The Quest Master analyzes your completed quests, lagging attributes, streak consistency, and current raid boss to provide actionable advice and adaptive daily quests.
              </p>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 flex-shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-cyan-300 font-display">Adaptive Daily Quests</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Identifies when your Discipline or Strength slows down and generates targeted challenges.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-indigo-950 text-indigo-400 flex-shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-indigo-300 font-display">Authoritative Security</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      The AI cannot modify stats or currencies directly. All rewards remain 100% server-validated.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Boss Raid Preview Box */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold text-rose-400">ACTIVE RAID</span>
                <span className="text-xs font-mono text-slate-400">Lv.3 Obstacle</span>
              </div>
              <h3 className="font-display font-black text-2xl text-white">Chronos the Devourer</h3>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                The time-eating shadow of Procrastination that whispers 'there is always tomorrow'.
              </p>

              <div className="space-y-1.5 mb-6">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">BOSS HEALTH</span>
                  <span className="text-rose-400 font-bold">2,450 / 3,000 HP</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-orange-500 to-rose-600 w-4/5" />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 flex items-center justify-between">
                <span>Vulnerable to: DISCIPLINE</span>
                <span className="font-bold text-amber-400">+800 XP Loot</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 text-center relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="font-display font-black text-4xl sm:text-5xl text-slate-950 tracking-tight">
            READY TO BEGIN YOUR QUEST?
          </h2>
          <p className="text-slate-600 text-base max-w-xl mx-auto leading-relaxed">
            Your character is waiting in the First Citadel. Take your first real-life action and watch your attributes rise.
          </p>
          <div className="pt-2">
            <button
              onClick={onStart}
              className="px-10 py-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-display font-bold text-lg shadow-xl shadow-cyan-600/30 hover:scale-105 active:scale-95 transition-all"
            >
              CREATE YOUR HERO NOW
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 text-center text-xs text-slate-400 font-mono">
        <p>QUESTME © 2026 — Your Life. Your Quests. Your Evolution. Full-Stack Life RPG.</p>
      </footer>
    </div>
  );
};
