import React from 'react';
import type { UserRole, UserProfile } from '../../types';
import { Sparkles, Shield, GraduationCap, Building2, Lock, Sun, Moon, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  currentUser: UserProfile | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  theme,
  onToggleTheme,
  currentUser,
  onLogout
}) => {
  const portalMeta = {
    student: { label: 'Mann Mitra Student Portal', icon: GraduationCap, badge: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300' },
    counselor: { label: 'Campus Pulse Counselor Center', icon: Shield, badge: 'bg-teal-500/10 border-teal-500/30 text-teal-800 dark:text-teal-300' },
    admin: { label: 'Campus Pulse Admin Overview', icon: Building2, badge: 'bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-300' }
  };

  const currentMeta = portalMeta[currentRole] || portalMeta.student;
  const RoleIcon = currentMeta.icon;

  const displayName = currentUser?.name || (currentRole === 'student' ? 'Aarohi Verma' : currentRole === 'counselor' ? 'Dr. Ananya Sharma' : 'Dean Mehta');
  const displayTitle = currentUser?.title || (currentRole === 'student' ? 'Student Portal' : currentRole === 'counselor' ? 'Counselor Center' : 'Campus Admin');
  const avatarUrl = currentUser?.avatar;

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200 dark:border-slate-800/80 px-4 lg:px-8 py-3 transition-colors duration-300"
    >
      <div className="flex items-center justify-between gap-4 w-full">
        {/* Brand & Active Portal Badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-amber-500 p-0.5 shadow-lg shadow-emerald-500/20 shrink-0 flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 dark:bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-500 dark:text-emerald-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                {currentRole === 'student' ? 'Mann Mitra' : 'Campus Pulse'}
              </h1>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border flex items-center gap-1.5 ${currentMeta.badge}`}>
                <RoleIcon className="w-3.5 h-3.5" />
                <span>{currentRole === 'student' ? 'Student Portal' : currentRole === 'counselor' ? 'Counselor Center' : 'Campus Admin'}</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1">
              <Lock className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" /> Privacy-First Wellbeing Platform
            </p>
          </div>
        </div>

        {/* User Actions & Theme Toggle */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onToggleTheme}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm ${
              theme === 'dark'
                ? 'bg-slate-900/80 border-slate-800 text-amber-300 hover:bg-slate-800'
                : 'bg-emerald-50 border-emerald-300 text-emerald-900 hover:bg-emerald-100'
            }`}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme Mode"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-emerald-700" />
                <span className="hidden sm:inline">Dark</span>
              </>
            )}
          </motion.button>

          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{displayName}</p>
            <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold tracking-wider truncate max-w-[160px]">{displayTitle}</p>
          </div>

          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-9 h-9 rounded-full object-cover border border-emerald-500/40 shadow-inner shrink-0"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-emerald-600/10 border border-emerald-500/40 flex items-center justify-center text-xs font-extrabold text-emerald-700 dark:text-emerald-300 shadow-inner shrink-0">
              {displayName.charAt(0)}
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onLogout}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900/80 hover:bg-rose-500/20 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-300 dark:border-slate-800 transition-all"
            title="Sign Out of Campus Portal"
          >
            <LogOut className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};
