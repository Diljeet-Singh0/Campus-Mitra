import React from 'react';
import { Info, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

interface SafetyDisclaimerProps {
  role?: string;
  className?: string;
}

export const SafetyDisclaimer: React.FC<SafetyDisclaimerProps> = ({ role = 'counselor', className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`p-4 rounded-2xl bg-teal-500/10 dark:bg-emerald-950/40 border border-teal-500/25 dark:border-emerald-500/20 text-slate-800 dark:text-slate-300 text-xs flex items-start gap-3 backdrop-blur-md shadow-xs ${className}`}
    >
      <div className="p-2 bg-teal-500/20 text-teal-800 dark:text-teal-300 rounded-xl shrink-0 mt-0.5">
        <Info className="w-4 h-4" />
      </div>
      <div className="flex-1 space-y-1 leading-relaxed">
        <div className="flex items-center gap-2 font-extrabold text-slate-900 dark:text-slate-100">
          <span>{role === 'student' ? 'Mann Mitra Signal Intelligence' : 'Campus Pulse Signal Intelligence'}</span>
          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 bg-teal-500/20 text-teal-900 dark:text-teal-300 rounded-full border border-teal-500/30 font-bold">
            <Lock className="w-2.5 h-2.5" /> Privacy Protected
          </span>
        </div>
        <p className="text-slate-600 dark:text-slate-400 font-medium">
          {role === 'student' &&
            'MannMitra is a supportive companion and check-in tool. It does not provide medical diagnoses. Your data is encrypted and confidential.'}
          {role === 'counselor' &&
            'AI-generated support signals highlight longitudinal pattern changes. Final intervention decisions always belong to authorized human counselors.'}
          {role === 'faculty' &&
            'Faculty input provides observable classroom context only. Faculty do not diagnose or view private counseling notes.'}
          {role === 'admin' &&
            'Admin analytics show anonymized, aggregated campus trends without exposing individual student records.'}
        </p>
      </div>
    </motion.div>
  );
};
