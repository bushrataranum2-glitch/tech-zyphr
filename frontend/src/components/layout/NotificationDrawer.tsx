import React from "react";
import { useGame } from "../../context/GameContext";
import { api } from "../../services/api";
import { X, CheckCheck, Bell, Sparkles, Trophy, Zap, ShieldAlert } from "lucide-react";

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, unreadCount, refreshGameData } = useGame();

  if (!isOpen) return null;

  const handleMarkAllRead = async () => {
    await api.markNotificationRead("all");
    await refreshGameData();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "LEVEL_UP":
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      case "ACHIEVEMENT":
        return <Trophy className="w-4 h-4 text-violet-500" />;
      case "BOSS":
        return <ShieldAlert className="w-4 h-4 text-rose-500" />;
      default:
        return <Zap className="w-4 h-4 text-cyan-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/30 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-slate-700" />
            <h3 className="font-display font-bold text-slate-800 text-lg">Transmission Log</h3>
            {unreadCount > 0 && (
              <span className="bg-rose-100 text-rose-700 text-xs px-2 py-0.5 rounded-full font-bold">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-cyan-600 hover:text-cyan-800 font-semibold flex items-center space-x-1"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {notifications.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <Bell className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="font-medium text-sm">No new transmissions.</p>
              <p className="text-xs">Your quest actions will log here.</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  n.isRead
                    ? "bg-slate-50/60 border-slate-100 text-slate-600"
                    : "bg-cyan-50/40 border-cyan-200 text-slate-900 shadow-sm"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-white shadow-sm border border-slate-100 flex-shrink-0">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold leading-tight">{n.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                    <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
