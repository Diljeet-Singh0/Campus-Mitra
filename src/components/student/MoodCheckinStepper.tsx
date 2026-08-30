import React, { useState } from 'react';
import type { CheckinData } from '../../types';
import { Sparkles, Check, ArrowRight, ArrowLeft, HeartHandshake } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MoodCheckinStepperProps {
  onSubmit: (checkin: Omit<CheckinData, 'id' | 'timestamp'>) => void;
}

export const MoodCheckinStepper: React.FC<MoodCheckinStepperProps> = ({ onSubmit }) => {
  const [step, setStep] = useState(1);
  const [mood, setMood] = useState<'great' | 'good' | 'okay' | 'low' | 'difficult'>('okay');
  const [stress, setStress] = useState(5);
  const [sleepHours, setSleepHours] = useState(6.5);
  const [motivation, setMotivation] = useState(6);
  const [reflection, setReflection] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const moodOptions: { id: 'great' | 'good' | 'okay' | 'low' | 'difficult'; label: string; icon: string; bg: string }[] = [
    { id: 'great', label: 'Great & Energetic', icon: '🌟', bg: 'hover:border-emerald-500/60 bg-emerald-500/10' },
    { id: 'good', label: 'Good & Calm', icon: '😊', bg: 'hover:border-teal-500/60 bg-teal-500/10' },
    { id: 'okay', label: 'Okay / Neutral', icon: '😐', bg: 'hover:border-cyan-500/60 bg-cyan-500/10' },
    { id: 'low', label: 'Low / Tired', icon: '😔', bg: 'hover:border-amber-500/60 bg-amber-500/10' },
    { id: 'difficult', label: 'Difficult / Stressful', icon: '🌧️', bg: 'hover:border-rose-500/60 bg-rose-500/10' }
  ];

  const handleFinalSubmit = () => {
    onSubmit({
      studentId: 'std-1',
      date: new Date().toISOString().split('T')[0],
      mood,
      stress,
      sleepHours,
      motivation,
      reflection
    });
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel rounded-3xl p-8 max-w-xl mx-auto text-center space-y-6 border border-emerald-500/30 shadow-2xl"
      >
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-md">
          <Check className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">Thanks for checking in!</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            Your self-reflection helps track your wellbeing journey. Your signals have been stored securely.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-left space-y-2 text-xs font-medium">
          <div className="flex items-center justify-between">
            <span className="text-slate-600 dark:text-slate-400">Weekly Trajectory:</span>
            <span className="font-extrabold text-emerald-700 dark:text-emerald-400">Consistent Check-in Habit</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600 dark:text-slate-400">Next Recommended Check-in:</span>
            <span className="font-extrabold text-slate-900 dark:text-slate-200">Tomorrow at 8:00 PM</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
          <HeartHandshake className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Non-diagnostic wellbeing signal</span>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            setIsSubmitted(false);
            setStep(1);
          }}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold transition-all shadow-lg shadow-emerald-600/30"
        >
          Do Another Reflection
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-3xl p-6 lg:p-8 max-w-2xl mx-auto border border-slate-200 dark:border-slate-800 shadow-2xl space-y-8"
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
          <span>Step {step} of 5</span>
          <span className="text-emerald-700 dark:text-emerald-400 font-mono">
            {step === 1 && 'Mood Assessment'}
            {step === 2 && 'Stress Rating'}
            {step === 3 && 'Sleep Hours'}
            {step === 4 && 'Academic Motivation'}
            {step === 5 && 'Reflection & Review'}
          </span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-900 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
            initial={{ width: 0 }}
            animate={{ width: `${(step / 5) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">How are you feeling today?</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Select the option that best reflects your current mood state.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {moodOptions.map(m => (
                <motion.button
                  key={m.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setMood(m.id)}
                  className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${m.bg} ${
                    mood === m.id
                      ? 'border-emerald-500 bg-emerald-500/20 text-slate-900 dark:text-white shadow-md shadow-emerald-500/20 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 font-medium'
                  }`}
                >
                  <span className="text-2xl">{m.icon}</span>
                  <span className="text-xs">{m.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Rate your academic & personal stress level</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">1 = Very relaxed, 10 = High tension</p>
            </div>

            <div className="space-y-6 glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400 font-bold">Relaxed (1)</span>
                <span className="text-xl font-extrabold text-teal-700 dark:text-teal-400 font-mono">{stress} / 10</span>
                <span className="text-xs text-slate-600 dark:text-slate-400 font-bold">High Stress (10)</span>
              </div>

              <input
                type="range"
                min="1"
                max="10"
                value={stress}
                onChange={e => setStress(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">How many hours of sleep did you get last night?</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Restful sleep plays a key role in focus and wellbeing.</p>
            </div>

            <div className="space-y-6 glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-center">
                <span className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 font-mono">{sleepHours} Hours</span>
              </div>

              <input
                type="range"
                min="2"
                max="12"
                step="0.5"
                value={sleepHours}
                onChange={e => setSleepHours(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">How engaged do you feel with your studies?</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Rate your academic drive for lectures and assignments today.</p>
            </div>

            <div className="space-y-6 glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400 font-bold">Low Motivation (1)</span>
                <span className="text-xl font-extrabold text-emerald-700 dark:text-emerald-400 font-mono">{motivation} / 10</span>
                <span className="text-xs text-slate-600 dark:text-slate-400 font-bold">Highly Driven (10)</span>
              </div>

              <input
                type="range"
                min="1"
                max="10"
                value={motivation}
                onChange={e => setMotivation(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Optional Personal Note / Reflection</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Anything specific affecting your mind or day?</p>
            </div>

            <textarea
              value={reflection}
              onChange={e => setReflection(e.target.value)}
              placeholder="Write any thoughts here (completely private to your log)..."
              rows={3}
              className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/60 font-medium"
            />

            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 dark:text-slate-200">Check-in Summary:</h4>
              <div className="grid grid-cols-2 gap-2 text-slate-800 dark:text-slate-300 font-mono font-semibold">
                <div>Mood: {mood.toUpperCase()}</div>
                <div>Stress: {stress}/10</div>
                <div>Sleep: {sleepHours} hrs</div>
                <div>Motivation: {motivation}/10</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800/80">
        <button
          onClick={() => setStep(s => Math.max(1, s - 1))}
          disabled={step === 1}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 disabled:opacity-40 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {step < 5 ? (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setStep(s => s + 1)}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold shadow-lg shadow-emerald-600/30 transition-all"
          >
            Next <ArrowRight className="w-4 h-4" />
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleFinalSubmit}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold shadow-lg shadow-emerald-600/30 transition-all"
          >
            Submit Check-in <Sparkles className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};
