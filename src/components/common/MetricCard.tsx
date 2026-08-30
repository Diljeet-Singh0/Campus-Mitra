import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { TiltCard } from './TiltCard';
import { AnimatedCounter } from './AnimatedCounter';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  iconColor?: string;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  change,
  changeLabel,
  icon: Icon,
  iconColor = 'text-emerald-700 dark:text-emerald-400',
  className = ''
}) => {
  return (
    <TiltCard
      tiltAmount={6}
      className={`glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-md hover:shadow-xl transition-all ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">{title}</p>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            <AnimatedCounter value={value} />
          </h3>
        </div>
        <div className={`p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 ${iconColor} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(subtitle || change !== undefined) && (
        <div className="mt-4 flex items-center gap-2 text-xs">
          {change !== undefined && (
            <span
              className={`inline-flex items-center gap-0.5 font-bold px-2 py-0.5 rounded-md ${
                change > 0
                  ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300'
                  : change < 0
                  ? 'bg-rose-500/15 text-rose-800 dark:text-rose-300'
                  : 'bg-slate-500/15 text-slate-700 dark:text-slate-300'
              }`}
            >
              {change > 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : change < 0 ? (
                <TrendingDown className="w-3 h-3" />
              ) : (
                <Minus className="w-3 h-3" />
              )}
              {change > 0 ? `+${change}%` : `${change}%`}
            </span>
          )}
          <span className="text-slate-600 dark:text-slate-400 font-medium">{changeLabel || subtitle}</span>
        </div>
      )}
    </TiltCard>
  );
};
