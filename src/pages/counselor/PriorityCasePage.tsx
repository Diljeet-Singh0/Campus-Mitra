import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Student, TimelineEvent, FeatureContribution, FacultyObservation } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { FeatureContributionChart } from '../../components/counselor/FeatureContributionChart';
import { Timeline } from '../../components/common/Timeline';
import { ArrowLeft, HeartHandshake, GraduationCap, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';

interface PriorityCasePageProps {
  students: Student[];
  timelineEvents: Record<string, TimelineEvent[]>;
  featureContributions: Record<string, FeatureContribution[]>;
  facultyObservations: FacultyObservation[];
  onRecordIntervention: (studentId: string) => void;
}

export const PriorityCasePage: React.FC<PriorityCasePageProps> = ({
  students,
  timelineEvents,
  featureContributions,
  facultyObservations,
  onRecordIntervention
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const student = students.find(s => s.id === (id || 'std-1')) || students[0];
  const events = timelineEvents[student.id] || [];
  const contributions = featureContributions[student.id] || [
    { factor: 'Attendance Variance', percentage: 40, description: 'Decline in CS301 lab attendance', impact: 'high' },
    { factor: 'Mood Signal Change', percentage: 35, description: 'Low sentiment check-ins over 14 days', impact: 'high' },
    { factor: 'Sleep Deficit', percentage: 25, description: 'Average sleep dropped below 5 hours', impact: 'medium' }
  ];

  const studentObservations = facultyObservations.filter(o => o.studentId === student.id);

  const signalHistoryData = [
    { week: 'Wk 1', attendance: 90, moodScore: 7, sleepHours: 7.0, priorityScore: 2.8 },
    { week: 'Wk 2', attendance: 88, moodScore: 6, sleepHours: 6.5, priorityScore: 3.5 },
    { week: 'Wk 3', attendance: 78, moodScore: 4, sleepHours: 5.0, priorityScore: 6.2 },
    { week: 'Wk 4', attendance: 71, moodScore: 3, sleepHours: 4.5, priorityScore: student.priorityScore }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-8"
    >
      {/* Back Button & Case Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/counselor/cases')}
            className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-300 transition-all shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </motion.button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{student.name}</h2>
              <StatusBadge level={student.priorityLevel} score={student.priorityScore} />
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              {student.department} • {student.year} • ID: <span className="font-mono font-bold text-slate-800 dark:text-slate-300">{student.studentId}</span>
            </p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onRecordIntervention(student.id)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold shadow-lg shadow-emerald-600/30 transition-all"
          >
            <HeartHandshake className="w-4 h-4" /> Record Intervention
          </motion.button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-6">
          <FeatureContributionChart contributions={contributions} />

          {studentObservations.length > 0 && (
            <div className="glass-panel p-5 rounded-3xl border border-amber-500/30 space-y-3">
              <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-amber-700 dark:text-amber-400" /> Submitted Faculty Classroom Context
              </h4>
              {studentObservations.map(obs => (
                <div key={obs.id} className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1 shadow-xs">
                  <div className="flex justify-between font-extrabold text-amber-800 dark:text-amber-300">
                    <span>{obs.facultyName} ({obs.course})</span>
                    <span className="text-[10px] opacity-80 font-mono">{obs.submittedAt}</span>
                  </div>
                  <p className="text-slate-800 dark:text-slate-300 text-[11px] leading-relaxed font-serif">"{obs.contextualNotes}"</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-700 dark:text-teal-400" /> Longitudinal Signals Variance (4 Weeks)
            </h3>
            <span className="text-xs text-slate-600 dark:text-slate-400 font-mono font-bold">Consent Data</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={signalHistoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                <XAxis dataKey="week" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#f8fafc' }} />
                <Line type="monotone" dataKey="priorityScore" name="Priority Score" stroke="#f43f5e" strokeWidth={3} dot={{ r: 5 }} />
                <Line type="monotone" dataKey="attendance" name="Attendance %" stroke="#0d9488" strokeWidth={2} />
                <Line type="monotone" dataKey="moodScore" name="Mood Score" stroke="#10b981" strokeWidth={2} strokeDasharray="3 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 lg:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">Student Care & Signal Timeline</h3>
          <span className="text-xs text-slate-600 dark:text-slate-400 font-mono font-bold">{events.length} Logged Events</span>
        </div>

        <Timeline events={events} />
      </div>
    </motion.div>
  );
};
