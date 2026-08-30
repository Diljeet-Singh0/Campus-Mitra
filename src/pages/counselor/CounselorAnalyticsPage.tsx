import React, { useEffect } from 'react';
import type { DepartmentMetric } from '../../types';
import { DepartmentHeatmap } from '../../components/admin/DepartmentHeatmap';
import { ForecastChart } from '../../components/admin/ForecastChart';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

interface CounselorAnalyticsPageProps {
  departmentMetrics: DepartmentMetric[];
}

export const CounselorAnalyticsPage: React.FC<CounselorAnalyticsPageProps> = ({ departmentMetrics }) => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/counselor/analytics') {
      const timer = setTimeout(() => {
        const el = document.getElementById('counselor-trends-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Institutional Analytics Hub</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Aggregated wellbeing trends, department heatmaps, and stress forecasting</p>
        </div>
      </div>

      <div id="counselor-trends-section" className="space-y-8 scroll-mt-20">
        <DepartmentHeatmap metrics={departmentMetrics} />
        <ForecastChart />
      </div>
    </motion.div>
  );
};
