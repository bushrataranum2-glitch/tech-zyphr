import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Swords, ArrowRight, KeyRound, Mail, Sparkles } from "lucide-react";

interface AuthLoginPageProps {
  onSuccess: () => void;
  onSwitchToRegister: () => void;
  onBackToLanding: () => void;
}

export const AuthLoginPage: React.FC<AuthLoginPageProps> = ({
  onSuccess,
  onSwitchToRegister,
  onBackToLanding
}) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await login({ email, password });
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please verify your email and password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-rpg-bg flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border border-slate-200 animate-in fade-in">
        {/* Brand */}
        <div className="text-center mb-8">
          <div
            onClick={onBackToLanding}
            className="inline-flex items-center space-x-2 cursor-pointer group mb-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Swords className="w-5 h-5" />
            </div>
            <span className="font-display font-black text-2xl text-slate-900 tracking-tight">
              QUEST<span className="text-cyan-600">ME</span>
            </span>
          </div>
          <h2 className="font-display font-black text-2xl text-slate-900">Sign In to Your Hero</h2>
          <p className="text-xs text-slate-500 mt-1">Reconnect your character neural link</p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 font-display uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                placeholder="hero@questme.app"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-500 text-sm font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 font-display uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-500 text-sm font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-display font-bold text-sm shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 mt-2"
          >
            <span>{isLoading ? "AUTHENTICATING..." : "SIGN IN"}</span>
            <ArrowRight className="w-4 h-4 text-cyan-400" />
          </button>
        </form>

        {/* Switch to Register */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            Don't have a character yet?{" "}
            <button
              onClick={onSwitchToRegister}
              className="text-cyan-600 hover:text-cyan-800 font-bold hover:underline"
            >
              Forge a New Hero
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
