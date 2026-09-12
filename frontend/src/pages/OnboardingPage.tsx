import React, { useState } from "react";
import { HeroGender, HeroClass, QuestDifficulty } from "../types";
import { HeroAvatar } from "../components/character/HeroAvatar";
import { useAuth } from "../context/AuthContext";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  Swords,
  Shield,
  Zap,
  Target,
  Flame,
  BookOpen,
  Cpu,
  Compass,
  Palette
} from "lucide-react";

interface OnboardingPageProps {
  onComplete: () => void;
  onCancel: () => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ onComplete, onCancel }) => {
  const { register } = useAuth();

  const [step, setStep] = useState(1);
  const [heroGender, setHeroGender] = useState<HeroGender>("MALE");
  const [heroClass, setHeroClass] = useState<HeroClass>("TECHMANCER");
  const [selectedGoals, setSelectedGoals] = useState<string[]>(["CODING", "STUDY", "DISCIPLINE"]);
  const [initialDifficulty, setInitialDifficulty] = useState<QuestDifficulty>("NORMAL");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const goalOptions = [
    { id: "CAREER", label: "Career Acceleration", icon: Target },
    { id: "CODING", label: "Software Engineering & DSA", icon: Cpu },
    { id: "STUDY", label: "Knowledge & Non-Fiction Reading", icon: BookOpen },
    { id: "FITNESS", label: "Athletic Fitness & Vitality", icon: Flame },
    { id: "CREATIVITY", label: "Design & Content Creation", icon: Palette },
    { id: "DISCIPLINE", label: "Habit Stacking & Consistency", icon: Shield }
  ];

  const classOptions = [
    { id: "WARRIOR", name: "Warrior", primary: "Strength", sec: "Discipline", icon: Flame, desc: "Endurance, workouts, physical grit." },
    { id: "SAGE", name: "Sage", primary: "Intelligence", sec: "Wisdom", icon: BookOpen, desc: "Deep study, philosophical insight, research." },
    { id: "TECHMANCER", name: "Techmancer", primary: "Intelligence", sec: "Creativity", icon: Cpu, desc: "Coding, architecture, software shipping." },
    { id: "RANGER", name: "Ranger", primary: "Dexterity", sec: "Endurance", icon: Compass, desc: "Fitness, daily steps, outdoor movement." },
    { id: "MAGE", name: "Mage", primary: "Wisdom", sec: "Creativity", icon: Sparkles, desc: "Reflective thinking, meditation, innovation." },
    { id: "CREATOR", name: "Creator", primary: "Creativity", sec: "Charisma", icon: Palette, desc: "Art, design, writing, community leadership." }
  ];

  const toggleGoal = (id: string) => {
    if (selectedGoals.includes(id)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== id));
    } else {
      setSelectedGoals([...selectedGoals, id]);
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setErrorMsg("Please enter your name, email, and password");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      await register({
        name,
        email,
        password,
        heroGender,
        heroClass,
        selectedGoals,
        initialDifficulty
      });
      onComplete();
    } catch (err: any) {
      setErrorMsg(err.message || "Registration failed. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-rpg-bg flex flex-col justify-center items-center p-4">
      {/* Container */}
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative">
        {/* Progress Bar */}
        <div className="h-2 bg-slate-100 w-full">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-indigo-600 transition-all duration-300"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>

        {/* Content Wrapper */}
        <div className="p-6 sm:p-10">
          {errorMsg && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* STEP 1: WELCOME */}
          {step === 1 && (
            <div className="text-center space-y-6 animate-in fade-in">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-cyan-500/30">
                <Swords className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-cyan-600 uppercase tracking-widest bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200">
                  SYSTEM INITIALIZATION
                </span>
                <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 tracking-tight mt-3">
                  Welcome to QuestMe
                </h2>
                <p className="text-slate-500 text-sm max-w-md mx-auto mt-2 leading-relaxed">
                  "Your life is the game. Every day holds quests, attributes to strengthen, and inner demons to conquer."
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setStep(2)}
                  className="px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-display font-bold text-sm shadow-lg shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all inline-flex items-center space-x-2"
                >
                  <span>COMMENCE AWAKENING</span>
                  <ArrowRight className="w-4 h-4 text-cyan-400" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: CHOOSE HERO */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="text-center">
                <span className="text-xs font-mono font-bold text-cyan-600 uppercase">STAGE 01</span>
                <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 mt-1">
                  Choose Your Hero
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Select your cyberpunk anime protagonist persona.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
                <div
                  onClick={() => setHeroGender("MALE")}
                  className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col items-center text-center ${
                    heroGender === "MALE"
                      ? "border-cyan-500 bg-cyan-50/50 shadow-lg shadow-cyan-500/20"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <HeroAvatar gender="MALE" heroClass={heroClass} level={1} evolutionStage="Novice" size="sm" />
                  <span className="font-display font-bold text-slate-900 text-sm mt-3">Male Hero</span>
                  <span className="text-[10px] text-slate-500 font-mono">Cyber Operative</span>
                </div>

                <div
                  onClick={() => setHeroGender("FEMALE")}
                  className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col items-center text-center ${
                    heroGender === "FEMALE"
                      ? "border-cyan-500 bg-cyan-50/50 shadow-lg shadow-cyan-500/20"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <HeroAvatar gender="FEMALE" heroClass={heroClass} level={1} evolutionStage="Novice" size="sm" />
                  <span className="font-display font-bold text-slate-900 text-sm mt-3">Female Hero</span>
                  <span className="text-[10px] text-slate-500 font-mono">Cyber Vanguard</span>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-display font-bold text-sm shadow-md shadow-cyan-600/20 flex items-center space-x-2"
                >
                  <span>Next: Choose Class</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: CHOOSE CLASS */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="text-center">
                <span className="text-xs font-mono font-bold text-indigo-600 uppercase">STAGE 02</span>
                <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 mt-1">
                  Choose Initial Class
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Classes shape your baseline attributes. Habit actions develop all traits dynamically.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto p-1">
                {classOptions.map((c) => {
                  const Icon = c.icon;
                  const isSelected = heroClass === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => setHeroClass(c.id as HeroClass)}
                      className={`cursor-pointer p-3.5 rounded-2xl border-2 transition-all flex items-start space-x-3 ${
                        isSelected
                          ? "border-indigo-500 bg-indigo-50/50 shadow-sm"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-xl flex-shrink-0 ${
                          isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-display font-bold text-sm text-slate-900">{c.name}</h4>
                          {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                        </div>
                        <p className="text-[10px] font-mono text-indigo-600 mt-0.5">
                          {c.primary} + {c.sec}
                        </p>
                        <p className="text-xs text-slate-500 mt-1 leading-snug">{c.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-display font-bold text-sm shadow-md shadow-indigo-600/20 flex items-center space-x-2"
                >
                  <span>Next: Life Goals</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: CHOOSE GOALS */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="text-center">
                <span className="text-xs font-mono font-bold text-emerald-600 uppercase">STAGE 03</span>
                <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 mt-1">
                  Select Focus Spheres
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Which areas of your real life do you wish to gamify? (Select multiple)
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {goalOptions.map((g) => {
                  const Icon = g.icon;
                  const isSelected = selectedGoals.includes(g.id);
                  return (
                    <div
                      key={g.id}
                      onClick={() => toggleGoal(g.id)}
                      className={`cursor-pointer p-3.5 rounded-xl border-2 transition-all flex items-center space-x-3 ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-50/50 text-slate-900 font-bold"
                          : "border-slate-200 hover:border-slate-300 text-slate-600"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg ${
                          isSelected ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs flex-1">{g.label}</span>
                      {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep(3)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(5)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-display font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center space-x-2"
                >
                  <span>Next: Difficulty</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: DIFFICULTY */}
          {step === 5 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="text-center">
                <span className="text-xs font-mono font-bold text-amber-600 uppercase">STAGE 04</span>
                <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 mt-1">
                  Choose Challenge Pace
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Sets initial quest recommendations. You can adjust this anytime.
                </p>
              </div>

              <div className="space-y-3 max-w-md mx-auto">
                {[
                  { id: "EASY", title: "Apprentice", desc: "Gentle daily habits with micro-commitments.", bonus: "+40 XP Base" },
                  { id: "NORMAL", title: "Adventurer (Recommended)", desc: "Balanced cadence for working professionals & students.", bonus: "+80 XP Base" },
                  { id: "HARD", title: "Iron Vanguard", desc: "Rigorous daily consistency, high boss damage multipliers.", bonus: "+150 XP Base" }
                ].map((d) => {
                  const isSelected = initialDifficulty === d.id;
                  return (
                    <div
                      key={d.id}
                      onClick={() => setInitialDifficulty(d.id as QuestDifficulty)}
                      className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${
                        isSelected
                          ? "border-amber-500 bg-amber-50/40 shadow-sm"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div>
                        <h4 className="font-display font-bold text-sm text-slate-900">{d.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{d.desc}</p>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-amber-600 bg-amber-100/70 px-2 py-1 rounded">
                        {d.bonus}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep(4)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(6)}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-display font-bold text-sm shadow-md shadow-amber-500/20 flex items-center space-x-2"
                >
                  <span>Reveal Character</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: CHARACTER REVEAL & SIGNUP */}
          {step === 6 && (
            <form onSubmit={handleFinalSubmit} className="space-y-6 animate-in fade-in">
              <div className="text-center">
                <span className="text-xs font-mono font-bold text-cyan-600 uppercase">FINAL CALIBRATION</span>
                <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 mt-1">
                  Your Hero is Ready
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Register your credentials to persist your character on the secure database.
                </p>
              </div>

              {/* Character Presentation Card */}
              <div className="flex justify-center my-4">
                <HeroAvatar
                  gender={heroGender}
                  heroClass={heroClass}
                  level={1}
                  evolutionStage="Novice"
                  size="md"
                />
              </div>

              {/* Credential Inputs */}
              <div className="space-y-3 max-w-md mx-auto">
                <div>
                  <label className="block text-xs font-bold text-slate-700 font-display uppercase mb-1">
                    Hero Name / Handle *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NeoSovereign, Ren, Nitish"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-500 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 font-display uppercase mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="hero@questme.app"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-500 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 font-display uppercase mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-500 text-sm font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-display font-bold text-sm shadow-lg shadow-cyan-600/30 hover:scale-105 active:scale-95 transition-all flex items-center space-x-2"
                >
                  <Zap className="w-4 h-4 text-cyan-300" />
                  <span>{isSubmitting ? "FORGING HERO..." : "AWAKEN CHARACTER"}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
