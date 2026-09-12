import React from "react";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction
}) => {
  return (
    <div className="text-center py-12 px-4 rounded-2xl bg-white/50 border border-dashed border-slate-300 max-w-lg mx-auto">
      <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 shadow-inner">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="font-display font-bold text-slate-800 text-lg mb-1">{title}</h3>
      <p className="text-slate-500 text-xs sm:text-sm max-w-sm mx-auto mb-5 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs sm:text-sm font-display font-bold shadow-md shadow-cyan-600/20 hover:scale-105 active:scale-95 transition-all"
        >
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
};
