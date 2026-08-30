import React from 'react';
import type { FeatureContribution } from '../../types';
import { Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface FeatureContributionChartProps {
  contributions: FeatureContribution[];
}

export const FeatureContributionChart: React.FC<FeatureContributionChartProps> = ({ contributions }) => {
  const COLORS = ['#f43f5e', '#f59e0b', '#0d9488', '#10b981'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            Why was this student flagged?
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-800 dark:text-rose-300 font-mono font-bold">
              Signal Attribution
            </span>
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Relative contribution of longitudinal signals to support priority elevation</p>
        </div>
      </div>

      <div className="space-y-4">
        {contributions.map((feat, idx) => (
          <div key={idx} className="space-y-1.5 glass-card p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-900 dark:text-slate-200">{feat.factor}</span>
              <span className="text-teal-700 dark:text-teal-400 font-mono">{feat.percentage}% Contribution</span>
            </div>

            <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-900 rounded-full overflow-hidden flex">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${feat.percentage}%` }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                className="h-full rounded-full"
              />
            </div>

            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{feat.description}</p>
          </div>
        ))}
      </div>

      <div className="p-3 rounded-xl bg-teal-50/50 dark:bg-slate-900/60 border border-teal-200 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-400 flex items-start gap-2 font-medium">
        <Info className="w-4 h-4 text-teal-700 dark:text-teal-400 shrink-0 mt-0.5" />
        <span>
          Attribution algorithms analyze multi-week variances in attendance, check-ins, and LMS activity without drawing clinical conclusions.
        </span>
      </div>
    </motion.div>
  );
};
