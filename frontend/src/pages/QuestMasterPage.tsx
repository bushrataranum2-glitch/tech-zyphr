import React, { useState, useEffect, useRef } from "react";
import { api } from "../services/api";
import { AIRecommendation } from "../types";
import { Bot, Send, Sparkles, Zap, Shield, Brain, Swords, MessageSquare } from "lucide-react";

export const QuestMasterPage: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null);
  const [insights, setInsights] = useState<any>(null);
  const [isAccepting, setIsAccepting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    "What should I focus on today?",
    "How can I defeat the active boss?",
    "How can I accelerate Intelligence & Coding?",
    "Which skill should I unlock next?",
    "How does the non-linear XP curve work?"
  ];

  useEffect(() => {
    // Load chat history, daily recommendation, and insights
    Promise.all([
      api.getChatHistory().catch(() => null),
      api.getDailyRecommendation().catch(() => null),
      api.getInsights().catch(() => null)
    ]).then(([chatRes, recRes, insRes]) => {
      if (chatRes?.success && chatRes.history && chatRes.history.length > 0) {
        setMessages(chatRes.history);
      } else {
        setMessages([
          {
            role: "ASSISTANT",
            content:
              "Greetings, Hunter. I am the Quest Master, your neural advisor in Neo-Alexandria. Ask me for tactical guidance, boss weakness exploits, attribute training, or daily focus priorities."
          }
        ]);
      }

      if (recRes?.success && recRes.recommendation) {
        setRecommendation(recRes.recommendation);
      }

      if (insRes?.success && insRes.insights) {
        setInsights(insRes.insights);
      }
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    const userMsg = { role: "USER", content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsLoading(true);

    try {
      const res = await api.chatWithMentor(text.trim());
      if (res.success && res.reply) {
        setMessages((prev) => [...prev, { role: "ASSISTANT", content: res.reply }]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ASSISTANT",
          content: "⚠️ The neural link experienced brief latency. Your character telemetry is safe. Please re-engage."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptRecommendation = async () => {
    if (!recommendation) return;
    setIsAccepting(true);
    try {
      const res = await api.acceptRecommendation(recommendation.id);
      if (res.success) {
        setRecommendation(null);
        alert(`Accepted quest "${res.quest.title}"! Added to your quest board.`);
      }
    } catch (err) {
      console.warn("Failed to accept rec", err);
    } finally {
      setIsAccepting(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <Bot className="w-6 h-6 text-cyan-600" />
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Quest Master Neural Conduit
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Cyberpunk-fantasy AI mentor tuned to your exact character progression and habits.
        </p>
      </div>

      {/* Top Cards: Insight & Daily Recommendation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Progress Insights Card */}
        {insights && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded font-bold">
                  PROGRESS TELEMETRY
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">
                  Weakest: <span className="text-rose-600">{insights.weakestAttribute}</span>
                </span>
              </div>
              <h3 className="font-display font-black text-lg text-slate-900">Neural Insights</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{insights.message}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Session XP Harvested:</span>
              <span className="font-bold text-cyan-700">+{insights.totalXpEarned} XP</span>
            </div>
          </div>
        )}

        {/* Daily Recommendation Card */}
        {recommendation ? (
          <div className="bg-gradient-to-br from-cyan-50 to-white p-6 rounded-3xl border border-cyan-300 shadow-sm space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-700 bg-cyan-100 px-2.5 py-0.5 rounded font-bold">
                  RECOMMENDED MISSION
                </span>
                <span className="text-xs font-mono font-bold text-amber-600">
                  +{recommendation.xpReward} XP • +{recommendation.goldReward} 🪙
                </span>
              </div>
              <h3 className="font-display font-black text-lg text-slate-900">{recommendation.title}</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{recommendation.reason}</p>
            </div>

            <button
              onClick={handleAcceptRecommendation}
              disabled={isAccepting}
              className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-display font-bold text-xs shadow-md shadow-cyan-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isAccepting ? "Accepting..." : "Accept to Quest Board"}</span>
            </button>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-center text-center p-8">
            <p className="text-xs text-slate-400 font-mono">
              Daily recommendation accepted or calibrated for today.
            </p>
          </div>
        )}
      </div>

      {/* Main Interactive Chat Interface */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[520px]">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-100 flex items-center space-x-3 bg-slate-50/60">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-slate-900 text-sm">Quest Master Conduit</h3>
            <span className="text-[10px] font-mono text-emerald-600 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
              <span>LATTICE ONLINE • REAL-TIME MENTORING</span>
            </span>
          </div>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/30">
          {messages.map((m, idx) => {
            const isAssistant = m.role === "ASSISTANT";
            return (
              <div
                key={idx}
                className={`flex items-start space-x-3 ${isAssistant ? "justify-start" : "justify-end"}`}
              >
                {isAssistant && (
                  <div className="w-8 h-8 rounded-xl bg-slate-900 text-cyan-400 flex items-center justify-center flex-shrink-0 text-xs shadow-sm mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-xl p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    isAssistant
                      ? "bg-white border border-slate-200/80 text-slate-800 shadow-sm"
                      : "bg-slate-900 text-white font-medium"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            );
          })}
          {isLoading && (
            <div className="flex items-center space-x-2 text-xs text-slate-400 italic">
              <Bot className="w-4 h-4 animate-bounce text-cyan-500" />
              <span>Quest Master is calculating tactical advice...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Prompts */}
        <div className="p-2.5 bg-white border-t border-slate-100 flex items-center space-x-2 overflow-x-auto">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold flex-shrink-0 pl-1">
            Tactical Prompts:
          </span>
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-[11px] font-mono bg-slate-100 hover:bg-cyan-50 hover:text-cyan-700 text-slate-600 px-3 py-1 rounded-full whitespace-nowrap border border-slate-200 transition-colors flex-shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Message Input Box */}
        <div className="p-4 bg-white border-t border-slate-100 flex items-center space-x-3">
          <input
            type="text"
            placeholder="Ask Quest Master about attributes, raid bosses, skills, or daily goals..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-500 text-sm font-medium"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !input.trim()}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-display font-bold text-xs shadow hover:scale-105 active:scale-95 transition-all flex items-center space-x-1.5 disabled:opacity-50 disabled:pointer-events-none"
          >
            <span>Transmit</span>
            <Send className="w-3.5 h-3.5 text-cyan-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
