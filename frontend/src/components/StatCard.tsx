import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'lavender' | 'blue' | 'pink' | 'mint' | 'cream';
  trend?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'lavender',
  trend,
}) => {
  const styles = {
    lavender: {
      bg: 'bg-[#F2EDFE]',
      iconBg: 'bg-[#E8DFFF]',
      textColor: 'text-indigo-900',
      badgeColor: 'bg-indigo-100 text-indigo-800',
    },
    blue: {
      bg: 'bg-[#EBF3FC]',
      iconBg: 'bg-[#DCEBFA]',
      textColor: 'text-sky-900',
      badgeColor: 'bg-sky-100 text-sky-800',
    },
    pink: {
      bg: 'bg-[#FCEDF3]',
      iconBg: 'bg-[#F9DDE8]',
      textColor: 'text-rose-900',
      badgeColor: 'bg-rose-100 text-rose-800',
    },
    mint: {
      bg: 'bg-[#EDF9F1]',
      iconBg: 'bg-[#DDF3E4]',
      textColor: 'text-emerald-900',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    cream: {
      bg: 'bg-[#FFFDF9]',
      iconBg: 'bg-[#FFF9F0]',
      textColor: 'text-amber-900',
      badgeColor: 'bg-amber-100 text-amber-800',
    },
  };

  const currentStyle = styles[variant];

  return (
    <div
      className={`${currentStyle.bg} rounded-3xl p-5 border border-white/60 shadow-pastel transition-all duration-300 hover:shadow-pastel-hover hover:-translate-y-0.5 flex flex-col justify-between`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-pastel-muted uppercase tracking-wider">
          {title}
        </span>
        <div className={`w-10 h-10 rounded-2xl ${currentStyle.iconBg} flex items-center justify-center text-pastel-dark shadow-sm`}>
          <Icon size={20} className={currentStyle.textColor} />
        </div>
      </div>
      <div>
        <div className="flex items-baseline gap-2">
          <span className={`text-2xl sm:text-3xl font-extrabold ${currentStyle.textColor}`}>
            {value}
          </span>
          {trend && (
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${currentStyle.badgeColor}`}>
              {trend}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-pastel-muted mt-1 font-medium">{subtitle}</p>
        )}
      </div>
    </div>
  );
};
