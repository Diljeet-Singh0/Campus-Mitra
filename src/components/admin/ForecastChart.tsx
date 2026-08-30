import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Info } from 'lucide-react';
import { motion } from 'framer-motion';

export const ForecastChart: React.FC = () => {
  const data = [
    { week: 'Wk 1', historicalDemand: 42, projectedDemand: 42, confidenceHigh: 45, confidenceLow: 39 },
    { week: 'Wk 2', historicalDemand: 45, projectedDemand: 45, confidenceHigh: 48, confidenceLow: 42 },
    { week: 'Wk 3', historicalDemand: 48, projectedDemand: 48, confidenceHigh: 52, confidenceLow: 44 },
    { week: 'Wk 4', historicalDemand: 54, projectedDemand: 54, confidenceHigh: 58, confidenceLow: 50 },
    { week: 'Wk 5 (Midterms)', historicalDemand: null, projectedDemand: 68, confidenceHigh: 76, confidenceLow: 60 },
    { week: 'Wk 6', historicalDemand: null, projectedDemand: 62, confidenceHigh: 70, confidenceLow: 54 },
    { week: 'Wk 7', historicalDemand: null, projectedDemand: 49, confidenceHigh: 55, confidenceLow: 43 },
    { week: 'Wk 8', historicalDemand: null, projectedDemand: 44, confidenceHigh: 50, confidenceLow: 38 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            Wellbeing Outlook & Stress Forecasting
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-800 dark:text-teal-300 font-mono font-bold">
              Predictive Outlook
            </span>
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Projected support demand over upcoming academic milestones & exam periods</p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-400 font-mono font-bold">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" /> Historical
          <span className="w-2.5 h-2.5 rounded-full bg-teal-400 inline-block ml-2" /> Projected
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="historicalColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="projectedColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="week" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[20, 90]} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#f8fafc' }}
              itemStyle={{ color: '#f8fafc' }}
            />
            <Area type="monotone" dataKey="historicalDemand" name="Historical Demand" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#historicalColor)" />
            <Area type="monotone" dataKey="projectedDemand" name="Projected Demand" stroke="#2dd4bf" strokeWidth={3} strokeDasharray="4 4" fillOpacity={1} fill="url(#projectedColor)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="p-3.5 rounded-2xl bg-teal-50/50 dark:bg-slate-900/50 border border-teal-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5 font-medium">
        <Info className="w-4 h-4 text-teal-700 dark:text-teal-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="font-bold text-slate-900 dark:text-slate-200">Ethos Principle:</strong> Forecasting models estimate resource demands (counselor staffing, wellness workshop schedules) ahead of exam weeks. Forecast estimates are projected trends, never absolute predictions.
        </p>
      </div>
    </motion.div>
  );
};
