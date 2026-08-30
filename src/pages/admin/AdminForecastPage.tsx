import React from 'react';
import { ForecastChart } from '../../components/admin/ForecastChart';
import { motion } from 'framer-motion';

export const AdminForecastPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Institutional Stress Forecasting</h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Predictive demand modeling to align campus counseling resources before exam periods</p>
      </div>

      <ForecastChart />
    </motion.div>
  );
};
