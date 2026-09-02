import React, { useEffect, useState } from 'react';
import type { Student } from '../../types';
import { MetricCard } from '../../components/common/MetricCard';
import { SafetyDisclaimer } from '../../components/common/SafetyDisclaimer';
import { Sparkles, CalendarCheck, HeartHandshake, TrendingUp, Moon, Activity, ArrowRight, PhoneCall } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

const MANNMITRA_API = import.meta.env.VITE_MANNMITRA_API || 'http://localhost:5000';

interface StudentHomeProps {
  student: Student;
}

export const StudentHome: React.FC<StudentHomeProps> = ({ student }) => {
  const navigate = useNavigate();
  const [hasLoggedData, setHasLoggedData] = useState<boolean | null>(null);

  useEffect(() => {
    const checkCheckinHistory = async () => {
      const targetId = student.studentId || student.id;
      let count = 0;

      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase
            .from('checkins')
            .select('id')
            .or(`student_id.eq.${targetId},student_name.ilike.%${student.name}%`);
          if (!error && data && data.length > 0) {
            count = data.length;
          }
        } catch (e) {
          console.warn('Supabase checkin count check error:', e);
        }
      }

      if (count === 0) {
        try {
          const res = await fetch(`${MANNMITRA_API}/api/checkins/${encodeURIComponent(targetId)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.checkins && data.checkins.length > 0) {
              count = data.checkins.length;
            }
          }
        } catch (err) {
          console.warn('Backend checkin count check error:', err);
        }
      }

      setHasLoggedData(count > 0);
    };

    checkCheckinHistory();
  }, [student]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-8"
    >
      <div className="glass-panel p-6 lg:p-8 rounded-3xl border border-emerald-500/20 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-bold">
              Mann Mitra Student Portal
            </span>
            <span className="text-xs text-slate-600 dark:text-slate-400 font-mono font-bold">{student.department} • {student.year}</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Good evening, {student.name.split(' ')[0]} 👋
          </h2>
          <p className="text-xs lg:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            How are you feeling today? Take a moment for yourself to log your check-in or talk with MannMitra.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto z-10">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate('/student/checkin')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold shadow-lg shadow-emerald-600/30 transition-all shimmer-btn"
            >
              <CalendarCheck className="w-4 h-4" /> Daily Check-in
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate('/student/mannmitra')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-slate-800 text-emerald-800 dark:text-emerald-300 border border-emerald-500/40 text-xs font-extrabold transition-all shadow-sm shimmer-btn"
            >
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" /> Talk to MannMitra
            </motion.button>
          </div>

          {/* Smiling Cartoon Avatar Mascot on the right side of the hero banner */}
          <div className="hidden xl:flex items-center gap-3 shrink-0">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-2"
            >
              {/* Cartoon Speech Bubble */}
              <div className="glass-panel px-3 py-1.5 rounded-2xl border border-emerald-500/40 bg-white/95 dark:bg-slate-900/95 shadow-lg text-[11px] font-bold text-slate-900 dark:text-slate-100 max-w-[140px] leading-tight animate-float">
                "Hi {student.name.split(' ')[0]}! 😊 I'm here!"
              </div>

              {/* Cartoon Mascot Character Graphic */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="relative w-20 h-20 flex items-center justify-center cursor-pointer group"
                onClick={() => navigate('/student/mannmitra')}
                title="Click to talk to MannMitra Avatar"
              >
                {/* Outer Glow Aura */}
                <div className="absolute inset-0 rounded-full bg-emerald-400/25 blur-lg group-hover:scale-125 transition-transform" />

                <svg className="w-16 h-16 drop-shadow-xl z-10" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="heroBody" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#34d399" />
                      <stop offset="1" stopColor="#0d9488" />
                    </linearGradient>
                    <linearGradient id="heroHead" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#a7f3d0" />
                      <stop offset="1" stopColor="#059669" />
                    </linearGradient>
                  </defs>

                  <circle cx="100" cy="22" r="8" fill="#f59e0b" />
                  <path d="M100 30 V 45" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />

                  <rect x="38" y="42" width="124" height="100" rx="46" fill="url(#heroHead)" stroke="#047857" strokeWidth="3" />
                  <rect x="48" y="52" width="104" height="80" rx="36" fill="#064e3b" opacity="0.9" />

                  {/* Smiling Eyes */}
                  <path d="M68 86 Q78 74 88 86" stroke="#6ee7b7" strokeWidth="4.5" strokeLinecap="round" fill="none" />
                  <path d="M112 86 Q122 74 132 86" stroke="#6ee7b7" strokeWidth="4.5" strokeLinecap="round" fill="none" />

                  {/* Blush Cheeks */}
                  <circle cx="64" cy="98" r="8" fill="#f43f5e" opacity="0.4" />
                  <circle cx="136" cy="98" r="8" fill="#f43f5e" opacity="0.4" />

                  {/* Big Smile */}
                  <path d="M82 98 Q100 116 118 98" stroke="#34d399" strokeWidth="4.5" strokeLinecap="round" fill="none" />

                  <path d="M60 142 C60 142, 100 135, 140 142 C150 170, 130 190, 100 190 C70 190, 50 170, 60 142 Z" fill="url(#heroBody)" stroke="#047857" strokeWidth="3" />
                  <ellipse cx="160" cy="148" rx="12" ry="8" fill="#34d399" stroke="#047857" strokeWidth="2.5" />
                  <ellipse cx="40" cy="148" rx="12" ry="8" fill="#34d399" stroke="#047857" strokeWidth="2.5" />
                </svg>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      <SafetyDisclaimer role="student" />

      {/* Display real check-in metrics or clear 'Not logged yet' indicator for new accounts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Mood Trajectory"
          value={
            hasLoggedData
              ? student.moodTrend ? student.moodTrend.charAt(0).toUpperCase() + student.moodTrend.slice(1) : "Stable"
              : "No Logs Yet"
          }
          subtitle={hasLoggedData ? "7-day check-in habit" : "Log check-in to track"}
          icon={Activity}
          iconColor="text-emerald-700 dark:text-emerald-400"
        />
        <MetricCard
          title="Stress Level"
          value={
            hasLoggedData
              ? `${student.stressScore} / 10`
              : "-- / 10"
          }
          subtitle={hasLoggedData ? "Vs last week" : "Not logged yet"}
          icon={TrendingUp}
          iconColor={hasLoggedData && student.stressScore && student.stressScore >= 7 ? "text-rose-700 dark:text-rose-400" : "text-amber-700 dark:text-amber-400"}
        />
        <MetricCard
          title="Avg Nightly Sleep"
          value={
            hasLoggedData
              ? `${student.sleepHours} Hours`
              : "-- Hours"
          }
          subtitle={hasLoggedData ? "Target: 7.5 hrs" : "Not logged yet"}
          icon={Moon}
          iconColor={hasLoggedData && student.sleepHours && student.sleepHours < 6 ? "text-rose-700 dark:text-rose-400" : "text-teal-700 dark:text-teal-400"}
        />
        <MetricCard
          title="Academic Drive"
          value={
            hasLoggedData
              ? student.academicEngagement ? student.academicEngagement.charAt(0).toUpperCase() + student.academicEngagement.slice(1) : "Normal"
              : "Pending Data"
          }
          subtitle={hasLoggedData ? `Attendance ${student.attendanceRate}%` : "Complete daily check-in"}
          icon={HeartHandshake}
          iconColor="text-amber-700 dark:text-amber-400"
        />
      </div>

      <div className="glass-panel p-6 lg:p-8 rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-slate-900 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 shadow-sm">
            <Sparkles className="w-7 h-7 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">Talk to MannMitra AI Companion</h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
              "Sometimes putting things into words helps." Speak freely in a private, supportive space.
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate('/student/mannmitra')}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold shadow-lg shadow-emerald-600/30 transition-all shrink-0 shimmer-btn"
        >
          Start Conversation <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-md">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            Recommended Wellbeing Action
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-mono font-bold">
              Wellness Zone
            </span>
          </h3>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2">
            <p className="text-xs font-extrabold text-slate-900 dark:text-slate-100">2-Minute Box Breathing Reset</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              We noticed slightly elevated stress ratings in your recent check-in. Try a quick guided breathing circle to restore focus.
            </p>
            <button
              onClick={() => navigate('/student/wellness')}
              className="mt-2 text-xs font-extrabold text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 flex items-center gap-1"
            >
              Open Wellness Zone <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-md">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            24/7 Campus Counseling & Peer Support
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-800 dark:text-teal-300 font-mono font-bold">
              Always Available
            </span>
          </h3>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-extrabold">
              <PhoneCall className="w-4 h-4" /> 1-on-1 Confidential Sessions
            </div>
            <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              Schedule confidential 1-on-1 counseling sessions with university counselors or join trained peer wellbeing circles anytime.
            </p>
            <button
              onClick={() => navigate('/student/support')}
              className="text-xs font-extrabold text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 flex items-center gap-1 pt-1"
            >
              Explore Campus Support Services <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
