import React from 'react';
import { Phone, Calendar, Users, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const StudentSupportPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-8"
    >
      <div className="space-y-1">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Campus Support & Counseling</h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Human support services available to every student on campus</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ y: -4 }}
          className="glass-panel p-6 rounded-3xl border border-rose-500/30 space-y-4 shadow-xl"
        >
          <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-700 dark:text-rose-400 w-fit">
            <Phone className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">24/7 Crisis & Support Helpline</h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">Toll-free emergency helpline managed by university counseling staff.</p>
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 font-mono text-sm font-extrabold text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-slate-800 text-center shadow-xs">
            1800-CAMPUS-HELP (1800-226-787)
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="glass-panel p-6 rounded-3xl border border-teal-500/30 space-y-4 shadow-xl"
        >
          <div className="p-3 rounded-2xl bg-teal-500/20 text-teal-800 dark:text-teal-400 w-fit">
            <Calendar className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">Book 1-on-1 Counselor</h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">Confidential sessions with Dr. Ananya Sharma or Dr. Rajesh Gupta.</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-extrabold text-xs shadow-lg shadow-teal-600/30 transition-all flex items-center justify-center gap-2"
          >
            Schedule Appointment <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-4 shadow-xl"
        >
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 w-fit">
            <Users className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">Peer Wellbeing Circle</h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">Connect with trained senior student mentors in small peer groups.</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
          >
            Join Student Circle <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};
