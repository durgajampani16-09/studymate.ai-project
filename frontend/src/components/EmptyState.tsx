import React from 'react';
import { LucideIcon, ArrowRight } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  colorScheme?: 'lavender' | 'blue' | 'pink' | 'mint';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
  colorScheme = 'lavender',
}) => {
  const colorMap = {
    lavender: 'bg-pastel-lavender/60 text-indigo-700',
    blue: 'bg-pastel-blue text-sky-700',
    pink: 'bg-pastel-pink text-rose-700',
    mint: 'bg-pastel-mint text-emerald-700',
  };

  return (
    <div className="bg-white/80 border border-dashed border-pastel-border rounded-3xl p-8 sm:p-12 text-center max-w-lg mx-auto shadow-sm">
      <div
        className={`w-16 h-16 rounded-3xl ${colorMap[colorScheme]} mx-auto flex items-center justify-center mb-4 shadow-sm`}
      >
        <Icon size={28} />
      </div>
      <h3 className="font-bold text-lg text-pastel-dark mb-2">{title}</h3>
      <p className="text-sm text-pastel-muted mb-6 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-pastel-dark text-white text-sm font-semibold hover:bg-slate-800 transition-all shadow-sm group"
        >
          <span>{actionText}</span>
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </button>
      )}
    </div>
  );
};
