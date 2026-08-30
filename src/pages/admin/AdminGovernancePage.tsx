import React from 'react';
import { SafetyDisclaimer } from '../../components/common/SafetyDisclaimer';
import { Lock, CheckCircle2, Server } from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminGovernancePage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">System Governance & Ethical AI Status</h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Institutional compliance enforcement, DPDP Act adherence, and system health</p>
      </div>

      <SafetyDisclaimer role="admin" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Ethical Guardrail Enforcements
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-800 dark:text-slate-300 font-medium">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              Strict non-diagnostic microcopy filter active
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              Faculty observation scope restricted to observable behaviors
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              Student consent revocation available at any time
            </li>
          </ul>
        </div>

        <div className="glass-panel rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Server className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Platform System Status
          </h3>
          <div className="space-y-2 text-xs font-mono font-bold">
            <div className="flex justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-slate-800 dark:text-slate-200">MannMitra AI Engine</span>
              <span className="text-emerald-700 dark:text-emerald-400">Operational</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-slate-800 dark:text-slate-200">CampusPulse Signal Analytics</span>
              <span className="text-emerald-700 dark:text-emerald-400">Operational</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-slate-800 dark:text-slate-200">Encrypted Storage Engine</span>
              <span className="text-emerald-700 dark:text-emerald-400">Operational</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
