import React, { useState } from 'react';
import type { DepartmentMetric } from '../../types';
import { Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface DepartmentHeatmapProps {
  metrics: DepartmentMetric[];
}

export const DepartmentHeatmap: React.FC<DepartmentHeatmapProps> = ({ metrics }) => {
  const [hoveredDept, setHoveredDept] = useState<DepartmentMetric | null>(null);

  const getHeatmapColor = (urgentCount: number, studentCount: number) => {
    const ratio = urgentCount / studentCount;
    if (ratio > 0.06) return 'border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20';
    if (ratio > 0.04) return 'border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20';
    return 'border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            Campus Department Wellbeing Heatmap
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-800 dark:text-teal-300 font-mono font-extrabold">
              Aggregated & Anonymized
            </span>
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Departmental wellbeing distribution for proactive institutional allocation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map(m => {
          const cardColor = getHeatmapColor(m.urgentCount, m.studentCount);
          return (
            <motion.div
              key={m.department}
              whileHover={{ y: -3 }}
              onMouseEnter={() => setHoveredDept(m)}
              onMouseLeave={() => setHoveredDept(null)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-4 shadow-sm ${cardColor}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100">{m.department}</h4>
                  <span className="text-[11px] text-slate-600 dark:text-slate-400 font-mono font-bold">{m.studentCount} Students</span>
                </div>
                <div className="p-2 rounded-xl bg-white/80 dark:bg-slate-900/60 text-teal-700 dark:text-teal-400 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <Building2 className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-extrabold">
                  <span className="text-emerald-800 dark:text-emerald-400">Stable: {m.stableCount}</span>
                  <span className="text-amber-800 dark:text-amber-400">Mod: {m.moderateCount}</span>
                  <span className="text-rose-800 dark:text-rose-400">Priority: {m.urgentCount}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-900 overflow-hidden flex">
                  <div style={{ width: `${(m.stableCount / m.studentCount) * 100}%` }} className="bg-emerald-500 h-full" />
                  <div style={{ width: `${(m.moderateCount / m.studentCount) * 100}%` }} className="bg-amber-500 h-full" />
                  <div style={{ width: `${(m.urgentCount / m.studentCount) * 100}%` }} className="bg-rose-500 h-full" />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-300/40 dark:border-slate-800/40 font-medium">
                <span>Avg Stress: <strong className="text-slate-900 dark:text-slate-200 font-bold">{m.averageStress}/10</strong></span>
                <span className={`font-mono font-bold ${m.attendanceTrend < 0 ? 'text-rose-700 dark:text-rose-400' : 'text-emerald-700 dark:text-emerald-400'}`}>
                  Att: {m.attendanceTrend > 0 ? `+${m.attendanceTrend}%` : `${m.attendanceTrend}%`}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {hoveredDept && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 rounded-2xl bg-white/95 dark:bg-slate-900/90 border border-teal-500/30 shadow-md text-xs space-y-1"
        >
          <p className="font-extrabold text-teal-800 dark:text-teal-300">Detailed Department Aggregate: {hoveredDept.department}</p>
          <p className="text-slate-700 dark:text-slate-400 font-medium">
            Stable Rate: {((hoveredDept.stableCount / hoveredDept.studentCount) * 100).toFixed(1)}% | Priority Review Rate: {((hoveredDept.urgentCount / hoveredDept.studentCount) * 100).toFixed(1)}%
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};
