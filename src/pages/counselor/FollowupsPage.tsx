import React from 'react';
import type { Student } from '../../types';
import { TrendingDown, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface FollowupsPageProps {
  students: Student[];
}

export const FollowupsPage: React.FC<FollowupsPageProps> = () => {
  const navigate = useNavigate();

  const followUpItems = [
    {
      id: 'fol-1',
      studentId: 'std-1',
      studentName: 'Aarohi Verma',
      department: 'CSE',
      previousScore: 8.4,
      currentScore: 6.1,
      lastIntervention: '1-on-1 Academic & Wellbeing Counseling',
      dueDate: '2026-08-29',
      status: 'due_today'
    },
    {
      id: 'fol-2',
      studentId: 'std-2',
      studentName: 'Rohan Mehta',
      department: 'Mechanical',
      previousScore: 7.2,
      currentScore: 4.8,
      lastIntervention: 'Academic Peer Tutoring & Exam Reset',
      dueDate: '2026-09-02',
      status: 'scheduled'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Active Follow-ups Due</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Track longitudinal priority score changes after recorded interventions</p>
        </div>
      </div>

      <div className="space-y-4">
        {followUpItems.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.1 }}
            className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">{item.studentName}</h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-mono font-bold">
                  {item.department}
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">Last Action: {item.lastIntervention}</p>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-center">
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Previous</span>
                <span className="text-sm font-mono font-extrabold text-rose-700 dark:text-rose-400">{item.previousScore.toFixed(1)}</span>
              </div>

              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <TrendingDown className="w-4 h-4 animate-bounce" />
                <ArrowRight className="w-4 h-4" />
              </div>

              <div className="text-center">
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Current</span>
                <span className="text-sm font-mono font-extrabold text-emerald-700 dark:text-emerald-400">{item.currentScore.toFixed(1)}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right text-xs font-mono text-slate-600 dark:text-slate-400 font-bold">
                <span>Due: {item.dueDate}</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate(`/counselor/cases/${item.studentId}`)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-md shadow-emerald-600/30 transition-all"
              >
                Review Profile
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
