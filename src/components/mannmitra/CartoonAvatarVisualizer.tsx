import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, MessageSquare, Volume2, ShieldCheck } from 'lucide-react';

interface CartoonAvatarVisualizerProps {
  isSpeaking?: boolean;
}

export const CartoonAvatarVisualizer: React.FC<CartoonAvatarVisualizerProps> = ({ isSpeaking = false }) => {
  const [welcomeMessage, setWelcomeMessage] = useState<string>(
    "Hi there! 👋 I'm MannMitra, your friendly companion. I'm always here to listen with a warm smile!"
  );
  const [isWinking, setIsWinking] = useState(false);

  // Periodic friendly wink & wave animation
  useEffect(() => {
    const winkInterval = setInterval(() => {
      setIsWinking(true);
      setTimeout(() => setIsWinking(false), 450);
    }, 4000);

    return () => clearInterval(winkInterval);
  }, []);

  useEffect(() => {
    if (isSpeaking) {
      setWelcomeMessage("I'm listening to you carefully... Take all the time you need! ✨");
    } else {
      setWelcomeMessage("Hi there! 👋 I'm MannMitra, your friendly companion. I'm always here to listen with a warm smile!");
    }
  }, [isSpeaking]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full h-full min-h-[500px] glass-panel rounded-3xl p-6 flex flex-col items-center justify-between relative overflow-hidden border border-emerald-500/30 shadow-2xl bg-gradient-to-b from-emerald-50/40 via-teal-50/20 to-slate-50 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-slate-900/90"
    >
      {/* Background Soft Glow Orbs */}
      <div className="absolute top-10 left-10 w-48 h-48 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-teal-400/20 blur-3xl pointer-events-none animate-pulse" />

      {/* Header Badge */}
      <div className="w-full flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-black text-slate-900 dark:text-slate-100 tracking-wider uppercase">
            MannMitra Friendly Companion
          </span>
        </div>
        <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-extrabold flex items-center gap-1 shadow-xs">
          <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Always Smiling
        </span>
      </div>

      {/* Speech Bubble */}
      <motion.div
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-sm my-2 z-10 relative"
      >
        <div className="glass-panel p-4 rounded-2xl border border-emerald-500/40 bg-white/95 dark:bg-slate-900/95 shadow-xl text-center space-y-1 relative">
          <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-relaxed">
            {welcomeMessage}
          </p>
          {/* Speech Bubble Tail */}
          <div className="w-4 h-4 bg-white dark:bg-slate-900 border-r border-b border-emerald-500/40 transform rotate-45 mx-auto -bottom-2 relative z-0" />
        </div>
      </motion.div>

      {/* Cartoon Avatar Character (Interactive Smiling Mascot) */}
      <div className="relative w-64 h-64 flex items-center justify-center my-2 z-10 cursor-pointer group">
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 1.5, -1.5, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative flex flex-col items-center justify-center"
        >
          {/* Soft Outer Aura */}
          <div className="absolute w-56 h-56 rounded-full bg-gradient-to-r from-emerald-400/30 to-teal-400/30 blur-2xl animate-orb-glow pointer-events-none" />

          {/* Cartoon Avatar SVG Graphic */}
          <svg className="w-52 h-52 drop-shadow-2xl z-10" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bodyGrad" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
                <stop stopColor="#34d399" />
                <stop offset="0.5" stopColor="#10b981" />
                <stop offset="1" stopColor="#0d9488" />
              </linearGradient>
              <linearGradient id="headGrad" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
                <stop stopColor="#a7f3d0" />
                <stop offset="0.6" stopColor="#34d399" />
                <stop offset="1" stopColor="#059669" />
              </linearGradient>
              <filter id="glowEffect">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Floating Antenna / Star Halo */}
            <circle cx="100" cy="22" r="8" fill="#f59e0b" filter="url(#glowEffect)" />
            <path d="M100 30 V 45" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />

            {/* Ears / Side Pods */}
            <rect x="26" y="70" width="16" height="30" rx="8" fill="#059669" />
            <rect x="158" y="70" width="16" height="30" rx="8" fill="#059669" />

            {/* Cute Round Head */}
            <rect x="38" y="42" width="124" height="100" rx="46" fill="url(#headGrad)" stroke="#047857" strokeWidth="3" />

            {/* Shiny Glass Face Display Panel */}
            <rect x="48" y="52" width="104" height="80" rx="36" fill="#064e3b" opacity="0.92" />

            {/* Smiling Eyes */}
            {isWinking ? (
              <>
                {/* Left Eye Open */}
                <circle cx="78" cy="85" r="9" fill="#6ee7b7" />
                <circle cx="80" cy="83" r="3" fill="#ffffff" />
                {/* Right Eye Winking */}
                <path d="M112 85 Q122 76 132 85" stroke="#6ee7b7" strokeWidth="4" strokeLinecap="round" fill="none" />
              </>
            ) : (
              <>
                {/* Both Eyes Smiling Big */}
                <path d="M68 86 Q78 74 88 86" stroke="#6ee7b7" strokeWidth="4.5" strokeLinecap="round" fill="none" filter="url(#glowEffect)" />
                <path d="M112 86 Q122 74 132 86" stroke="#6ee7b7" strokeWidth="4.5" strokeLinecap="round" fill="none" filter="url(#glowEffect)" />
              </>
            )}

            {/* Rosy Blush Cheeks */}
            <circle cx="64" cy="98" r="8" fill="#f43f5e" opacity="0.45" />
            <circle cx="136" cy="98" r="8" fill="#f43f5e" opacity="0.45" />

            {/* Warm Friendly Big Smile */}
            <path d="M82 98 Q100 116 118 98" stroke="#34d399" strokeWidth="4.5" strokeLinecap="round" fill="none" filter="url(#glowEffect)" />
            {/* Tongue Detail */}
            <path d="M92 104 Q100 112 108 104" fill="#f43f5e" opacity="0.8" />

            {/* Cute Floating Body */}
            <path d="M60 142 C60 142, 100 135, 140 142 C150 170, 130 190, 100 190 C70 190, 50 170, 60 142 Z" fill="url(#bodyGrad)" stroke="#047857" strokeWidth="3" />

            {/* Heart Emblem on Chest */}
            <path d="M100 166 C100 166, 92 156, 86 160 C80 164, 84 172, 100 180 C116 172, 120 164, 114 160 C108 156, 100 166, 100 166 Z" fill="#f43f5e" filter="url(#glowEffect)" />

            {/* Hands */}
            <ellipse cx="160" cy="148" rx="12" ry="8" fill="#34d399" stroke="#047857" strokeWidth="2.5" />
            <ellipse cx="40" cy="148" rx="12" ry="8" fill="#34d399" stroke="#047857" strokeWidth="2.5" />
          </svg>
        </motion.div>

        {/* Floating Heart & Sparkle Particles */}
        <motion.div
          animate={{ y: [-5, -25, -5], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute -top-2 right-8 text-rose-500 pointer-events-none"
        >
          <Heart className="w-5 h-5 fill-rose-500" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -20, 0], opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
          className="absolute top-4 left-8 text-amber-400 pointer-events-none"
        >
          <Sparkles className="w-4 h-4 fill-amber-400" />
        </motion.div>
      </div>

      {/* Audio Equalizer */}
      <div className="w-full flex flex-col items-center gap-2 z-10">
        <div className="flex items-center justify-center gap-1.5 h-6">
          {[35, 70, 45, 90, 60, 80, 50, 75, 40].map((h, i) => (
            <div
              key={i}
              style={{ height: `${isSpeaking ? (h * (0.8 + Math.random() * 0.4)) / 3 : 8}px` }}
              className="w-1.5 rounded-full bg-gradient-to-t from-emerald-600 to-teal-400 dark:from-emerald-400 dark:to-teal-300 transition-all duration-200"
            />
          ))}
        </div>
        <span className="text-[10px] font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-widest flex items-center gap-1">
          <Volume2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400 animate-pulse" />
          {isSpeaking ? 'MannMitra Speaking...' : 'Smiling & Ready To Talk'}
        </span>
      </div>

      {/* Footer Info */}
      <div className="w-full z-10 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-medium">
        <span className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-extrabold">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> 100% Confidential
        </span>
        <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-bold">
          <MessageSquare className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> Speak Freely
        </span>
      </div>
    </motion.div>
  );
};
