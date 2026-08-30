import React, { useState } from 'react';
import type { Student, SupportPriorityLevel } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Eye, HeartHandshake, Search, ArrowUpRight, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PriorityQueueTableProps {
  students: Student[];
  onSelectStudent: (id: string) => void;
  onRecordIntervention: (studentId: string) => void;
}

export const PriorityQueueTable: React.FC<PriorityQueueTableProps> = ({
  students,
  onSelectStudent,
  onRecordIntervention
}) => {
  const [filterLevel, setFilterLevel] = useState<'all' | SupportPriorityLevel>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = students.filter(s => {
    const matchesLevel = filterLevel === 'all' || s.priorityLevel === filterLevel;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  return (
    <motion.div
      id="priority-cases-section"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            Student Priority Queue
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-mono font-extrabold">
              {filteredStudents.length} Students
            </span>
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Longitudinal consent signals prioritizing human counselor review</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search student or ID..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500/60 font-medium"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            {(['all', 'urgent', 'moderate', 'stable'] as const).map(lvl => (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                  filterLevel === lvl
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                    : 'text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800/80 text-[11px] font-extrabold text-slate-700 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4">Student Info</th>
              <th className="py-3 px-4">Support Priority</th>
              <th className="py-3 px-4">Trend</th>
              <th className="py-3 px-4 hidden md:table-cell">Primary Signals</th>
              <th className="py-3 px-4 hidden lg:table-cell">Last Activity</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-xs">
            <AnimatePresence>
              {filteredStudents.map(std => (
                <motion.tr
                  key={std.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="group hover:bg-emerald-50/50 dark:hover:bg-slate-900/60 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={std.avatar}
                        alt={std.name}
                        className="w-10 h-10 rounded-full object-cover border border-emerald-500/40 shrink-0 shadow-xs"
                      />
                      <div>
                        <button
                          onClick={() => onSelectStudent(std.id)}
                          className="font-extrabold text-slate-900 dark:text-slate-100 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-xs flex items-center gap-1"
                        >
                          {std.name}
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium truncate max-w-[180px]">{std.department}</p>
                        <span className="text-[10px] text-slate-500 font-mono font-bold">{std.studentId} • {std.year}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <StatusBadge level={std.priorityLevel} score={std.priorityScore} />
                  </td>

                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-1 font-bold text-[11px] capitalize ${
                        std.moodTrend === 'improving'
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : std.moodTrend === 'declining'
                          ? 'text-rose-700 dark:text-rose-400'
                          : 'text-slate-700 dark:text-slate-400'
                      }`}
                    >
                      {std.moodTrend === 'improving' && <TrendingUp className="w-3.5 h-3.5" />}
                      {std.moodTrend === 'declining' && <TrendingDown className="w-3.5 h-3.5" />}
                      {std.moodTrend === 'stable' && <Minus className="w-3.5 h-3.5" />}
                      {std.moodTrend}
                    </span>
                  </td>

                  <td className="py-4 px-4 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {std.primarySignals.slice(0, 2).map((sig, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 font-mono font-bold"
                        >
                          {sig}
                        </span>
                      ))}
                      {std.primarySignals.length > 2 && (
                        <span className="text-[10px] text-slate-500 font-mono font-bold">+{std.primarySignals.length - 2} more</span>
                      )}
                    </div>
                  </td>

                  <td className="py-4 px-4 hidden lg:table-cell text-slate-600 dark:text-slate-400 font-mono text-[11px] font-medium">
                    {std.lastActivity}
                  </td>

                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onSelectStudent(std.id)}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-emerald-500/20 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 border border-slate-300 dark:border-slate-800 transition-all shadow-xs"
                        title="Open Case Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onRecordIntervention(std.id)}
                        className="p-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-800 dark:text-emerald-300 border border-emerald-500/35 transition-all shadow-xs"
                        title="Record Intervention"
                      >
                        <HeartHandshake className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
