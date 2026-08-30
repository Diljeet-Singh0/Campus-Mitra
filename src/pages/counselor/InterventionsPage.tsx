import React from 'react';
import type { InterventionRecord } from '../../types';
import { HeartHandshake } from 'lucide-react';
import { motion } from 'framer-motion';

interface InterventionsPageProps {
  interventions: Record<string, InterventionRecord[]>;
}

export const InterventionsPage: React.FC<InterventionsPageProps> = ({ interventions }) => {
  const allInterventions = Object.values(interventions).flat();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Interventions Care Log</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Longitudinal record of human counselor care plans and academic support actions</p>
        </div>
      </div>

      <div className="glass-panel rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
        {allInterventions.map((int, idx) => (
          <motion.div
            key={int.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wide flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                {int.type.replace('_', ' ')}
              </span>
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-extrabold uppercase">Outcome: {int.outcome}</span>
            </div>
            <p className="text-slate-800 dark:text-slate-300 leading-relaxed font-serif">"{int.notes}"</p>
            <div className="flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800/60 pt-2 font-medium">
              <span>Recorded by: {int.scheduledBy} ({int.date})</span>
              <span className="font-bold">Next Assessment: {int.followUpDate}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
