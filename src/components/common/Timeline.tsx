import React from 'react';
import type { TimelineEvent, EventType } from '../../types';
import { Activity, MessageSquare, Eye, UserCheck, Stethoscope, Clock, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
}

const EVENT_CONFIG: Record<EventType, { icon: any; bg: string; border: string; text: string }> = {
  system_detection: {
    icon: ShieldAlert,
    bg: 'bg-rose-500/15',
    border: 'border-rose-500/40',
    text: 'text-rose-900 dark:text-rose-300'
  },
  check_in: {
    icon: Activity,
    bg: 'bg-emerald-500/15',
    border: 'border-emerald-500/40',
    text: 'text-emerald-900 dark:text-emerald-300'
  },
  faculty_request: {
    icon: Eye,
    bg: 'bg-amber-500/15',
    border: 'border-amber-500/40',
    text: 'text-amber-900 dark:text-amber-300'
  },
  faculty_observation: {
    icon: MessageSquare,
    bg: 'bg-teal-500/15',
    border: 'border-teal-500/40',
    text: 'text-teal-900 dark:text-teal-300'
  },
  counselor_action: {
    icon: UserCheck,
    bg: 'bg-cyan-500/15',
    border: 'border-cyan-500/40',
    text: 'text-cyan-900 dark:text-cyan-300'
  },
  intervention: {
    icon: Stethoscope,
    bg: 'bg-purple-500/15',
    border: 'border-purple-500/40',
    text: 'text-purple-900 dark:text-purple-300'
  },
  follow_up: {
    icon: Clock,
    bg: 'bg-emerald-500/15',
    border: 'border-emerald-500/40',
    text: 'text-emerald-900 dark:text-emerald-300'
  }
};

export const Timeline: React.FC<TimelineProps> = ({ events, className = '' }) => {
  if (!events || events.length === 0) {
    return (
      <div className="p-6 text-center text-slate-600 dark:text-slate-400 text-sm glass-card rounded-2xl">
        No signal events recorded yet for this student timeline.
      </div>
    );
  }

  return (
    <div className={`space-y-6 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-slate-300 dark:before:bg-slate-800 ${className}`}>
      {events.map((evt, idx) => {
        const conf = EVENT_CONFIG[evt.type] || EVENT_CONFIG.check_in;
        const IconComponent = conf.icon;

        return (
          <motion.div
            key={evt.id || idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className="relative flex items-start gap-4 pl-10 group"
          >
            <div
              className={`absolute left-0 top-1 w-8 h-8 rounded-full border flex items-center justify-center transition-transform group-hover:scale-110 shadow-xs ${conf.bg} ${conf.border} ${conf.text}`}
            >
              <IconComponent className="w-4 h-4" />
            </div>

            <div className="flex-1 glass-card p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 transition-all space-y-1.5 shadow-sm">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  {evt.title}
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${conf.bg} ${conf.border} ${conf.text}`}>
                    {evt.type.replace('_', ' ')}
                  </span>
                </h4>
                <span className="text-xs text-slate-600 dark:text-slate-400 font-mono font-medium">{evt.timestamp}</span>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{evt.description}</p>

              <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 border-t border-slate-200 dark:border-slate-800/60">
                <span className="font-bold text-slate-800 dark:text-slate-300">Author / Source:</span>
                <span>{evt.author}</span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
