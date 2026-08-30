import React, { useEffect } from 'react';
import type { DepartmentMetric } from '../../types';
import { DepartmentHeatmap } from '../../components/admin/DepartmentHeatmap';
import { MetricCard } from '../../components/common/MetricCard';
import { SafetyDisclaimer } from '../../components/common/SafetyDisclaimer';
import { Users, ShieldCheck, PieChart, TrendingUp } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

interface AdminDashboardProps {
  departmentMetrics: DepartmentMetric[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ departmentMetrics }) => {
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      const mainEl = document.getElementById('main-scroll-container');
      if (location.pathname === '/admin/analytics') {
        const el = document.getElementById('department-trends-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else if (location.pathname === '/admin') {
        if (mainEl) {
          mainEl.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    }, 100);
    return () => clearTimeout(timer);
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
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Institutional Administration Overview
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Anonymized, aggregated campus wellbeing intelligence for Dean & Executive Leadership</p>
        </div>
      </div>

      <SafetyDisclaimer role="admin" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Population"
          value="1,770"
          subtitle="6 Active Departments"
          icon={Users}
          iconColor="text-teal-700 dark:text-teal-400"
        />
        <MetricCard
          title="Stable Signal Rate"
          value="77.4%"
          change={+1.8}
          changeLabel="Vs last month"
          icon={ShieldCheck}
          iconColor="text-emerald-700 dark:text-emerald-400"
        />
        <MetricCard
          title="Moderate Support"
          value="16.6%"
          subtitle="Wellness Zone active"
          icon={PieChart}
          iconColor="text-amber-700 dark:text-amber-400"
        />
        <MetricCard
          title="Priority Review Rate"
          value="5.2%"
          subtitle="Human care queue"
          icon={TrendingUp}
          iconColor="text-rose-700 dark:text-rose-400"
        />
      </div>

      <div id="department-trends-section" className="scroll-mt-20">
        <DepartmentHeatmap metrics={departmentMetrics} />
      </div>
    </motion.div>
  );
};
