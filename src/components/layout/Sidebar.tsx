import React from 'react';
import { NavLink } from 'react-router-dom';
import type { UserRole } from '../../types';
import {
  Home,
  Bot,
  CalendarCheck,
  HeartHandshake,
  TrendingUp,
  ShieldAlert,
  Clock,
  BarChart3,
  Sparkles,
  PieChart,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
  role: UserRole;
  className?: string;
}

interface NavItem {
  to: string;
  label: string;
  icon: any;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ role, className = '' }) => {
  const links: Record<UserRole, NavItem[]> = {
    student: [
      { to: '/student', label: 'Home', icon: Home },
      { to: '/student/mannmitra', label: 'Talk to MannMitra', icon: Bot, badge: 'AI' },
      { to: '/student/checkin', label: 'Daily Check-in', icon: CalendarCheck },
      { to: '/student/wellness', label: 'Wellness Zone', icon: Sparkles },
      { to: '/student/trends', label: 'My Trends', icon: TrendingUp },
      { to: '/student/support', label: 'Support Services', icon: HeartHandshake }
    ],
    counselor: [
      { to: '/counselor', label: 'Command Overview', icon: Home },
      { to: '/counselor/cases', label: 'Priority Cases', icon: ShieldAlert },
      { to: '/counselor/interventions', label: 'Interventions', icon: HeartHandshake },
      { to: '/counselor/followups', label: 'Follow-ups Due', icon: Clock },
      { to: '/counselor/analytics', label: 'Campus Analytics', icon: BarChart3 }
    ],
    admin: [
      { to: '/admin', label: 'Campus Overview', icon: Home },
      { to: '/admin/analytics', label: 'Department Trends', icon: PieChart },
      { to: '/admin/forecast', label: 'Stress Forecasting', icon: TrendingUp }
    ]
  };

  const navItems = links[role] || links.student;

  return (
    <motion.aside
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
      className={`w-64 glass-panel rounded-3xl border border-slate-200 dark:border-slate-800/80 p-4 flex flex-col justify-between shrink-0 hidden md:flex h-full select-none ${className}`}
    >
      <div className="space-y-6">
        <div className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/60 flex items-center justify-between shadow-xs">
          <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            {role === 'student' ? 'MANN MITRA PORTAL' : `CAMPUS PULSE (${role.toUpperCase()})`}
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        </div>

        <nav className="space-y-1.5">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === `/${role}`}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all relative overflow-hidden ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/25 border border-emerald-500/40'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-emerald-50/60 dark:hover:bg-slate-800/50'
                  }`
                }
              >
                <div className="flex items-center gap-2.5 z-10">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/40 z-10">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-3.5 rounded-2xl bg-emerald-50/40 dark:bg-slate-900/80 border border-emerald-100 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-400 space-y-1">
        <p className="font-bold text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Non-Diagnostic Standard
        </p>
        <p className="text-[10px] leading-tight text-slate-600 dark:text-slate-400">
          Complies with DPDP Act & Ethical AI Guidelines.
        </p>
      </div>
    </motion.aside>
  );
};
