import React, { useEffect } from 'react';
import type { Student } from '../../types';
import { PriorityQueueTable } from '../../components/counselor/PriorityQueueTable';
import { MetricCard } from '../../components/common/MetricCard';
import { SafetyDisclaimer } from '../../components/common/SafetyDisclaimer';
import { ShieldAlert, Users, Clock, TrendingUp } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

interface CounselorDashboardProps {
  students: Student[];
  onRecordIntervention: (studentId: string) => void;
}

export const CounselorDashboard: React.FC<CounselorDashboardProps> = ({
  students,
  onRecordIntervention
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const urgentCount = students.filter(s => s.priorityLevel === 'urgent').length;
  const moderateCount = students.filter(s => s.priorityLevel === 'moderate').length;

  useEffect(() => {
    const timer = setTimeout(() => {
      const mainEl = document.getElementById('main-scroll-container');
      if (location.pathname === '/counselor/cases') {
        const el = document.getElementById('priority-cases-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else if (location.pathname === '/counselor') {
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Good morning, Dr. Sharma 👋
          </h2>
          <p className="text-xs lg:text-sm text-slate-600 dark:text-slate-400 font-medium">
            CampusPulse Institutional Signal Command Center • {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>

      <SafetyDisclaimer role="counselor" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Students Monitored"
          value="420"
          subtitle="All departments active"
          icon={Users}
          iconColor="text-teal-700 dark:text-teal-400"
        />
        <MetricCard
          title="Moderate Support"
          value={moderateCount.toString()}
          change={+4}
          changeLabel="Vs last week"
          icon={TrendingUp}
          iconColor="text-amber-700 dark:text-amber-400"
        />
        <MetricCard
          title="Priority Review"
          value={urgentCount.toString()}
          subtitle="Human review queued"
          icon={ShieldAlert}
          iconColor="text-rose-700 dark:text-rose-400"
        />
        <MetricCard
          title="Follow-ups Due"
          value="3"
          subtitle="Active care plans"
          icon={Clock}
          iconColor="text-emerald-700 dark:text-emerald-400"
        />
      </div>

      <PriorityQueueTable
        students={students}
        onSelectStudent={id => navigate(`/counselor/cases/${id}`)}
        onRecordIntervention={onRecordIntervention}
      />
    </motion.div>
  );
};
