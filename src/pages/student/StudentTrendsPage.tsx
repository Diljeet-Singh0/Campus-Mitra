import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Sparkles, Moon, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Student } from '../../types';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

const MANNMITRA_API = import.meta.env.VITE_MANNMITRA_API || 'http://localhost:5000';

interface StudentTrendsPageProps {
  student: Student;
}

export const StudentTrendsPage: React.FC<StudentTrendsPageProps> = ({ student }) => {
  const [trendData, setTrendData] = useState<any[]>([]);
  const [hasRealData, setHasRealData] = useState(false);

  useEffect(() => {
    const fetchCheckins = async () => {
      const targetId = student.studentId || student.id;
      let checkins: any[] = [];

      // Try fetching checkins from Supabase directly first
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase
            .from('checkins')
            .select('*')
            .or(`student_id.eq.${targetId},student_name.ilike.%${student.name}%`)
            .order('created_at', { ascending: false })
            .limit(14);

          if (!error && data && data.length > 0) {
            checkins = data;
          }
        } catch (e) {
          console.warn('Supabase checkins fetch notice:', e);
        }
      }

      if (checkins.length === 0) {
        try {
          const res = await fetch(`${MANNMITRA_API}/api/checkins/${encodeURIComponent(targetId)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.checkins && data.checkins.length > 0) {
              checkins = data.checkins;
            }
          }
        } catch (err) {
          console.warn('Could not fetch student checkins for trends:', err);
        }
      }

      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      if (checkins.length > 0) {
        setHasRealData(true);
        // Map real checkins into 7-day trend format
        const formatted = checkins.slice(0, 7).reverse().map((chk, i) => {
          const moodVal = chk.mood === 'Great' || chk.mood === 'great' ? 9 : chk.mood === 'Good' || chk.mood === 'good' ? 8 : chk.mood === 'Okay' || chk.mood === 'okay' ? 6 : chk.mood === 'Low' || chk.mood === 'low' ? 4 : 2;
          return {
            day: chk.created_at ? new Date(chk.created_at).toLocaleDateString([], { weekday: 'short' }) : (chk.timestamp ? chk.timestamp.split(' ')[0] : days[i % 7]),
            moodScore: moodVal,
            stress: Number(chk.stress),
            sleep: Number(chk.sleep),
            energy: Math.max(2, 10 - Number(chk.stress))
          };
        });
        setTrendData(formatted);
      } else {
        setHasRealData(false);
        setTrendData([]);
      }
    };

    fetchCheckins();
  }, [student]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const el = document.getElementById('student-trends-cards');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {student.name}'s Wellbeing Trends
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            Personalized longitudinal view of self-reported mood, stress, and sleep signals ({student.department})
          </p>
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-extrabold">
          7-Day Personal Analysis
        </span>
      </div>

      <div className="glass-panel p-5 rounded-2xl border border-teal-500/30 flex items-start gap-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 dark:from-slate-900 dark:to-teal-950/40 shadow-md">
        <div className="p-2 rounded-xl bg-teal-500/20 text-teal-800 dark:text-teal-400 shrink-0 mt-0.5 shadow-xs">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <div className="space-y-1 text-xs text-slate-800 dark:text-slate-200">
          <h4 className="font-extrabold text-slate-900 dark:text-slate-100">Live Personal Insights</h4>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            {hasRealData ? (
              <>
                Current Stress: <strong className="text-amber-700 dark:text-amber-300">{student.stressScore}/10</strong> • Sleep: <strong className="text-teal-700 dark:text-teal-300">{student.sleepHours} hrs</strong> • Mood Trajectory: <strong className="text-emerald-700 dark:text-emerald-300 font-capitalize">{student.moodTrend}</strong>.
              </>
            ) : (
              <>
                No check-ins logged for this account yet. Complete your first daily check-in to generate personal wellbeing trends!
              </>
            )}
          </p>
        </div>
      </div>

      {!hasRealData ? (
        <div className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-xl my-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-2xl">
            📊
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">No Check-in Data Recorded Yet</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              Log your daily check-in to start building your personal mood trajectory, stress score history, and sleep performance curves.
            </p>
          </div>
          <button
            onClick={() => window.location.assign('/student/checkin')}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold shadow-lg shadow-emerald-600/30 transition-all inline-flex items-center gap-2"
          >
            Submit First Daily Check-in
          </button>
        </div>
      ) : (
        <div id="student-trends-cards" className="grid grid-cols-1 lg:grid-cols-2 gap-6 scroll-mt-20">
          <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-700 dark:text-teal-400" /> Mood & Energy Score (1-10)
              </h3>
              <span className="text-xs text-slate-600 dark:text-slate-400 font-mono font-bold">Past 7 Days</span>
            </div>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} domain={[1, 10]} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#f8fafc' }} />
                  <Line type="monotone" dataKey="moodScore" name="Mood" stroke="#0d9488" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="energy" name="Energy" stroke="#10b981" strokeWidth={2} strokeDasharray="3 3" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Moon className="w-4 h-4 text-emerald-700 dark:text-emerald-400" /> Stress Rating vs Sleep Hours
              </h3>
              <span className="text-xs text-slate-600 dark:text-slate-400 font-mono font-bold">Past 7 Days</span>
            </div>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} domain={[2, 10]} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#f8fafc' }} />
                  <Line type="monotone" dataKey="stress" name="Stress (1-10)" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="sleep" name="Sleep (Hours)" stroke="#2dd4bf" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
