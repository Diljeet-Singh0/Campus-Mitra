import React from 'react';
import { NavLink } from 'react-router-dom';
import type { UserRole } from '../../types';
import { Home, Bot, CalendarCheck, Sparkles, ShieldAlert, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

interface MobileNavProps {
  role: UserRole;
}

export const MobileNav: React.FC<MobileNavProps> = ({ role }) => {
  const items = {
    student: [
      { to: '/student', label: 'Home', icon: Home },
      { to: '/student/mannmitra', label: 'MannMitra', icon: Bot },
      { to: '/student/checkin', label: 'Check-in', icon: CalendarCheck },
      { to: '/student/wellness', label: 'Wellness', icon: Sparkles }
    ],
    counselor: [
      { to: '/counselor', label: 'Overview', icon: Home },
      { to: '/counselor/cases', label: 'Priority', icon: ShieldAlert },
      { to: '/counselor/analytics', label: 'Analytics', icon: BarChart3 }
    ],
    admin: [
      { to: '/admin', label: 'Overview', icon: Home },
      { to: '/admin/analytics', label: 'Trends', icon: BarChart3 },
      { to: '/admin/forecast', label: 'Forecast', icon: Sparkles }
    ]
  };

  const navItems = items[role] || items.student;

  return (
    <motion.nav
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden glass-panel border-t border-slate-200 dark:border-slate-800 px-3 py-2 flex items-center justify-around shadow-2xl"
    >
      {navItems.map(item => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === `/${role}`}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all ${
                isActive
                  ? 'text-emerald-800 dark:text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`
            }
          >
            <Icon className="w-4 h-4" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </motion.nav>
  );
};
