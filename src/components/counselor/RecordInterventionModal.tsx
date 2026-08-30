import React, { useState } from 'react';
import type { Student, InterventionRecord } from '../../types';
import { X, HeartHandshake, Calendar, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface RecordInterventionModalProps {
  student: Student;
  onClose: () => void;
  onSubmitIntervention: (intervention: Omit<InterventionRecord, 'id'>) => void;
}

export const RecordInterventionModal: React.FC<RecordInterventionModalProps> = ({
  student,
  onClose,
  onSubmitIntervention
}) => {
  const [type, setType] = useState<InterventionRecord['type']>('counseling');
  const [notes, setNotes] = useState('Conducted 1-on-1 counseling session. Discussed academic workload management and sleep routine reset.');
  const [followUpDate, setFollowUpDate] = useState(
    new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split('T')[0]
  );
  const [outcome, setOutcome] = useState<InterventionRecord['outcome']>('improving');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitIntervention({
      studentId: student.id,
      type,
      date: new Date().toISOString().split('T')[0],
      notes,
      followUpDate,
      outcome,
      scheduledBy: 'Dr. Ananya Sharma'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="glass-panel p-6 lg:p-8 rounded-3xl max-w-xl w-full border border-emerald-500/30 text-left space-y-6 shadow-2xl relative"
      >
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 rounded-xl border border-emerald-500/30">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">Record Counselor Intervention</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Log support action & schedule follow-up for {student.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-900 dark:hover:text-white p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1">Intervention Type</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as any)}
                className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:border-emerald-500/60"
              >
                <option value="counseling">1-on-1 Counseling Session</option>
                <option value="academic_support">Academic Peer Tutoring</option>
                <option value="faculty_conversation">Faculty Alignment Talk</option>
                <option value="referral">Specialist Referral</option>
                <option value="follow_up">Progress Check-in</option>
                <option value="other">Other Support Plan</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1">Assessed Outcome</label>
              <select
                value={outcome}
                onChange={e => setOutcome(e.target.value as any)}
                className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:border-emerald-500/60"
              >
                <option value="improving">Improving (Priority Reduced)</option>
                <option value="stable">Stable / Monitoring</option>
                <option value="needs_followup">Needs Active Follow-up</option>
                <option value="referred">Referred to Specialist</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1">Counselor Action Notes</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 font-medium focus:outline-none focus:border-emerald-500/60"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Schedule Follow-up Assessment Date
            </label>
            <input
              type="date"
              value={followUpDate}
              onChange={e => setFollowUpDate(e.target.value)}
              className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:border-emerald-500/60"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold shadow-lg shadow-emerald-600/30 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" /> Save Intervention & Update Case
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
