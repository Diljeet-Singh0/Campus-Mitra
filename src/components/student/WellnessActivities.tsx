import React, { useState, useEffect } from 'react';
import { Wind, Timer, Compass, Play, Pause, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const WellnessActivities: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'breathing' | 'focus' | 'grounding'>('breathing');

  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [breathSeconds, setBreathSeconds] = useState(4);
  const [isBreathRunning, setIsBreathRunning] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isBreathRunning) {
      interval = setInterval(() => {
        setBreathSeconds(prev => {
          if (prev > 1) return prev - 1;
          if (breathPhase === 'Inhale') {
            setBreathPhase('Hold');
            return 4;
          } else if (breathPhase === 'Hold') {
            setBreathPhase('Exhale');
            return 4;
          } else {
            setBreathPhase('Inhale');
            return 4;
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreathRunning, breathPhase]);

  const [focusSeconds, setFocusSeconds] = useState(300);
  const [isFocusRunning, setIsFocusRunning] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isFocusRunning && focusSeconds > 0) {
      interval = setInterval(() => {
        setFocusSeconds(s => s - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isFocusRunning, focusSeconds]);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const tabs: { id: 'breathing' | 'focus' | 'grounding'; label: string; icon: any }[] = [
    { id: 'breathing', label: '2-Min Breathing Circle', icon: Wind },
    { id: 'focus', label: '5-Min Focus Reset', icon: Timer },
    { id: 'grounding', label: '5-4-3-2-1 Grounding', icon: Compass }
  ];

  return (
    <div className="space-y-6">
      {/* Sliding Active Pill Container */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-fit mx-auto shadow-sm relative">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative z-10 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-colors ${
                isActive ? 'text-white' : 'text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 shadow-md shadow-emerald-600/30 z-[-1]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'breathing' && (
          <motion.div
            key="tab-breathing"
            initial={{ opacity: 0, y: 15, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.96 }}
            transition={{ duration: 0.3 }}
            className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 max-w-xl mx-auto text-center shadow-xl"
          >
            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Box Breathing Exercise</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Slow down your nervous system with rhythmic breathing.
              </p>
            </div>

            <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
              <div
                className={`absolute inset-0 rounded-full border-4 transition-all duration-1000 ${
                  breathPhase === 'Inhale'
                    ? 'scale-110 border-emerald-500 bg-emerald-500/10 shadow-xl shadow-emerald-500/20'
                    : breathPhase === 'Hold'
                    ? 'scale-100 border-amber-500 bg-amber-500/10'
                    : 'scale-90 border-teal-500 bg-teal-500/10'
                }`}
              />
              <div className="relative z-10 text-center space-y-1">
                <span className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">
                  {breathPhase}
                </span>
                <span className="text-3xl font-black text-emerald-700 dark:text-emerald-400 block font-mono">
                  {breathSeconds} s
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsBreathRunning(!isBreathRunning)}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all shimmer-btn"
              >
                {isBreathRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isBreathRunning ? 'Pause Session' : 'Start Breathing'}</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsBreathRunning(false);
                  setBreathPhase('Inhale');
                  setBreathSeconds(4);
                }}
                className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-all shadow-xs"
              >
                <RotateCcw className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {activeTab === 'focus' && (
          <motion.div
            key="tab-focus"
            initial={{ opacity: 0, y: 15, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.96 }}
            transition={{ duration: 0.3 }}
            className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 max-w-xl mx-auto text-center shadow-xl"
          >
            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">5-Minute Study Reset Timer</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Step away from screens, close your eyes, and clear your mind before your next study sprint.
              </p>
            </div>

            <div className="w-48 h-48 rounded-full border-4 border-teal-500/40 bg-teal-500/10 mx-auto flex items-center justify-center shadow-inner">
              <span className="text-4xl font-black text-teal-700 dark:text-teal-400 font-mono tracking-tight">
                {formatTime(focusSeconds)}
              </span>
            </div>

            <div className="flex items-center justify-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFocusRunning(!isFocusRunning)}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-teal-600/30 transition-all shimmer-btn"
              >
                {isFocusRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isFocusRunning ? 'Pause Timer' : 'Start Focus Reset'}</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsFocusRunning(false);
                  setFocusSeconds(300);
                }}
                className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-slate-800 transition-all shadow-xs"
              >
                <RotateCcw className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {activeTab === 'grounding' && (
          <motion.div
            key="tab-grounding"
            initial={{ opacity: 0, y: 15, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.96 }}
            transition={{ duration: 0.3 }}
            className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 max-w-xl mx-auto shadow-xl"
          >
            <div className="text-center space-y-1">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">5-4-3-2-1 Sensory Grounding</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Re-anchor your awareness in the present moment through your senses.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                <span className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-black flex items-center justify-center shrink-0">
                  5
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">Acknowledge <strong className="text-emerald-700 dark:text-emerald-400">5 things</strong> you can see around you.</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                <span className="w-7 h-7 rounded-xl bg-teal-500/20 text-teal-800 dark:text-teal-300 font-black flex items-center justify-center shrink-0">
                  4
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">Acknowledge <strong className="text-teal-700 dark:text-teal-400">4 things</strong> you can physically feel.</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                <span className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 font-black flex items-center justify-center shrink-0">
                  3
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">Acknowledge <strong className="text-cyan-700 dark:text-cyan-400">3 things</strong> you hear.</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                <span className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-800 dark:text-amber-300 font-black flex items-center justify-center shrink-0">
                  2
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">Acknowledge <strong className="text-amber-700 dark:text-amber-400">2 things</strong> you can smell.</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                <span className="w-7 h-7 rounded-xl bg-rose-500/20 text-rose-800 dark:text-rose-300 font-black flex items-center justify-center shrink-0">
                  1
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">Acknowledge <strong className="text-rose-700 dark:text-rose-400">1 thing</strong> you can taste or one positive thought.</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
