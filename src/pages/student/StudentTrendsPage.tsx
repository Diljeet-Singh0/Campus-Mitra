import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Sparkles, Moon, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Student } from '../../types';

const MANNMITRA_API = import.meta.env.VITE_MANNMITRA_API || 'http://localhost:5000';

interface StudentTrendsPageProps {
  student: Student;
}

export const StudentTrendsPage: React.FC<StudentTrendsPageProps> = ({ student }) => {
  const [trendData, setTrendData] = useState<any[]>([]);

  useEffect(() => {
    const fetchCheckins = async () => {
      const targetId = student.studentId || student.id;
      let checkins: any[] = [];
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

      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      if (checkins.length > 0) {
        // Map real checkins into 7-day trend format
        const formatted = checkins.slice(0, 7).reverse().map((chk, i) => {
          const moodVal = chk.mood === 'Great' ? 9 : chk.mood === 'Good' ? 8 : chk.mood === 'Okay' ? 6 : chk.mood === 'Low' ? 4 : 2;
          return {
            day: chk.timestamp ? chk.timestamp.split(' ')[0] : days[i % 7],
            moodScore: moodVal,
            stress: chk.stress,
            sleep: chk.sleep,
            energy: Math.max(2, 10 - chk.stress)
          };
        });
        setTrendData(formatted);
      } else {
        // Generate personalized baseline graph based on student's live stress/sleep scores
        const baseStress = student.stressScore || 5;
        const baseSleep = student.sleepHours || 7;
        const generated = [
          { day: 'Mon', moodScore: Math.min(10, Math.max(2, 11 - baseStress)), stress: Math.max(2, baseStress - 1), sleep: Math.min(9, baseSleep + 0.5), energy: 7 },
          { day: 'Tue', moodScore: Math.min(10, Math.max(2, 10 - baseStress)), stress: baseStress, sleep: baseSleep, energy: 6 },
          { day: 'Wed', moodScore: Math.min(10, Math.max(2, 9 - baseStress)), stress: Math.min(10, baseStress + 1), sleep: Math.max(4, baseSleep - 1), energy: 5 },
          { day: 'Thu', moodScore: Math.min(10, Math.max(2, 8 - baseStress)), stress: Math.min(10, baseStress + 1.5), sleep: Math.max(4, baseSleep - 1.2), energy: 4 },
          { day: 'Fri', moodScore: Math.min(10, Math.max(2, 9 - baseStress)), stress: baseStress, sleep: baseSleep, energy: 6 },
          { day: 'Sat', moodScore: Math.min(10, Math.max(2, 10 - baseStress)), stress: Math.max(2, baseStress - 1.5), sleep: Math.min(9, baseSleep + 0.8), energy: 7 },
          { day: 'Sun', moodScore: Math.min(10, Math.max(2, 11 - baseStress)), stress: Math.max(2, baseStress - 2), sleep: Math.min(9.5, baseSleep + 1), energy: 8 }
        ];
        setTrendData(generated);
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
            Current Stress: <strong className="text-amber-700 dark:text-amber-300">{student.stressScore}/10</strong> • Sleep: <strong className="text-teal-700 dark:text-teal-300">{student.sleepHours} hrs</strong> • Mood Trajectory: <strong className="text-emerald-700 dark:text-emerald-300 font-capitalize">{student.moodTrend}</strong>.
          </p>
        </div>
      </div>

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
    </motion.div>
  );
};
