import React, { useEffect } from 'react';
import type { ToastMessage } from '../../store/useDemoStore';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
    info: <Info className="w-5 h-5 text-teal-600 dark:text-teal-400" />
  };

  const borders = {
    success: 'border-emerald-500/40 bg-white/95 dark:bg-emerald-950/90 text-slate-900 dark:text-white',
    warning: 'border-amber-500/40 bg-white/95 dark:bg-amber-950/90 text-slate-900 dark:text-white',
    info: 'border-teal-500/40 bg-white/95 dark:bg-teal-950/90 text-slate-900 dark:text-white'
  };

  const type = toast.type || 'success';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.25 }}
        className="fixed bottom-6 right-6 z-50 max-w-sm"
      >
        <div className={`flex items-start gap-3 p-4 rounded-2xl border ${borders[type]} shadow-2xl backdrop-blur-xl`}>
          <div className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900/60 shrink-0">{icons[type]}</div>
          <div className="flex-1 min-w-0 pr-2">
            <h5 className="text-xs font-extrabold text-slate-900 dark:text-slate-100">{toast.title}</h5>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-snug font-medium">{toast.message}</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900 dark:hover:text-white p-1 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
