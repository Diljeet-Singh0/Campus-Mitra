import React from 'react';
import type { SupportPriorityLevel } from '../../types';
import { ShieldCheck, AlertTriangle, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
  level: SupportPriorityLevel;
  score?: number;
  showIcon?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ level, score, showIcon = true, className = '' }) => {
  const config = {
    stable: {
      label: 'Stable Signal',
      bg: 'bg-emerald-500/15 border-emerald-500/35 text-emerald-900 dark:text-emerald-300',
      icon: ShieldCheck,
      dot: 'bg-emerald-500'
    },
    moderate: {
      label: 'Moderate Support Need',
      bg: 'bg-amber-500/15 border-amber-500/35 text-amber-900 dark:text-amber-300',
      icon: AlertTriangle,
      dot: 'bg-amber-500'
    },
    urgent: {
      label: 'Priority Counselor Review',
      bg: 'bg-rose-500/15 border-rose-500/35 text-rose-900 dark:text-rose-300',
      icon: AlertCircle,
      dot: 'bg-rose-500'
    }
  };

  const current = config[level] || config.stable;
  const IconComponent = current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold tracking-wide shadow-xs ${current.bg} ${className}`}
      aria-label={`${current.label}${score !== undefined ? `, score ${score} out of 10` : ''}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot} animate-pulse`} />
      {showIcon && <IconComponent className="w-3.5 h-3.5 shrink-0" />}
      <span>{current.label}</span>
      {score !== undefined && (
        <span className="ml-1 opacity-90 font-mono text-[11px]">({score.toFixed(1)}/10)</span>
      )}
    </span>
  );
};
