import React, { useState } from 'react';
import { Lock, Download } from 'lucide-react';
import { motion } from 'framer-motion';

export const StudentPrivacyPage: React.FC = () => {
  const [consentMood, setConsentMood] = useState(true);
  const [consentAttendance, setConsentAttendance] = useState(true);
  const [consentFacultyObservation, setConsentFacultyObservation] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Privacy & Data Governance Center</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Complete control over what wellbeing data is collected and shared</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold shadow-md shadow-emerald-600/30 transition-all"
        >
          <Download className="w-4 h-4" /> Download My Data Archive
        </motion.button>
      </div>

      <div className="glass-panel rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-6 shadow-2xl">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Active Consent & Sharing Controls
        </h3>

        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 shadow-xs">
            <div className="space-y-1">
              <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100">Daily Mood & Stress Check-ins</h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                Purpose: Personal wellbeing tracking & longitudinal signal analysis for assigned counselor.
              </p>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono font-bold">Status: Encrypted & Active</span>
            </div>
            <input
              type="checkbox"
              checked={consentMood}
              onChange={e => setConsentMood(e.target.checked)}
              className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
            />
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 shadow-xs">
            <div className="space-y-1">
              <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100">Attendance & Academic Disengagement Signals</h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                Purpose: Detect uncharacteristic attendance drops to offer early academic support.
              </p>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono font-bold">Status: Encrypted & Active</span>
            </div>
            <input
              type="checkbox"
              checked={consentAttendance}
              onChange={e => setConsentAttendance(e.target.checked)}
              className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
            />
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 shadow-xs">
            <div className="space-y-1">
              <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100">Faculty Classroom Observation Input</h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                Purpose: Allows counselor to request non-clinical classroom context from your course mentors.
              </p>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono font-bold">Status: Encrypted & Active</span>
            </div>
            <input
              type="checkbox"
              checked={consentFacultyObservation}
              onChange={e => setConsentFacultyObservation(e.target.checked)}
              className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
