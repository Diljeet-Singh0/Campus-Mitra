import React from 'react';
import { WellnessActivities } from '../../components/student/WellnessActivities';
import { Sparkles } from 'lucide-react';

export const WellnessZonePage: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Wellness Zone Micro-Apps
        </div>
        <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">Pause, Reset & Regain Focus</h2>
        <p className="text-xs text-slate-400">
          Guided activities to relieve stress and re-center your energy during intense study sessions.
        </p>
      </div>

      <WellnessActivities />
    </div>
  );
};
