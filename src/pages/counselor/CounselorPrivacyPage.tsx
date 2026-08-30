import React from 'react';
import { SafetyDisclaimer } from '../../components/common/SafetyDisclaimer';
import { ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export const CounselorPrivacyPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Counselor Audit & Governance</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Institutional audit logging and privacy enforcement compliance</p>
        </div>
      </div>

      <SafetyDisclaimer role="counselor" />

      <div className="glass-panel rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Recent Counselor Access Audit Log
        </h3>

        <div className="space-y-2 text-xs font-mono font-bold">
          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between text-slate-800 dark:text-slate-300 shadow-xs">
            <span>[2026-08-28 00:15] Dr. Sharma reviewed case profile: CS2023-042 (Aarohi Verma)</span>
            <span className="text-emerald-700 dark:text-emerald-400">Authorized</span>
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between text-slate-800 dark:text-slate-300 shadow-xs">
            <span>[2026-08-27 14:30] Context request dispatched to Prof. Ramesh Verma (CS301)</span>
            <span className="text-emerald-700 dark:text-emerald-400">Authorized</span>
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between text-slate-800 dark:text-slate-300 shadow-xs">
            <span>[2026-08-26 11:20] Recorded intervention for student ME2024-118</span>
            <span className="text-emerald-700 dark:text-emerald-400">Authorized</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
