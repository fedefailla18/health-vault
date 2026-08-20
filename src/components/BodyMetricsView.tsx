import React, { useMemo } from 'react';
import { 
  Scale, 
  Plus, 
  Calendar, 
  TrendingDown, 
  TrendingUp, 
  Activity, 
  Heart 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { BodyMetric, UserProfile } from '../types';

interface BodyMetricsViewProps {
  bodyMetrics: BodyMetric[];
  userProfile?: UserProfile;
  onAddMetric: () => void;
}

export const BodyMetricsView: React.FC<BodyMetricsViewProps> = ({
  bodyMetrics,
  userProfile,
  onAddMetric,
}) => {
  const sortedMetrics = useMemo(() => {
    return [...bodyMetrics].sort((a, b) => a.date.localeCompare(b.date));
  }, [bodyMetrics]);

  const latestMetric = bodyMetrics[0] || { weight_kg: userProfile?.weight_kg || 77.5, date: 'N/A' };
  const firstMetric = sortedMetrics[0] || latestMetric;
  const weightDiff = (latestMetric.weight_kg - firstMetric.weight_kg).toFixed(1);

  const heightM = (userProfile?.height_cm || 174) / 100;
  const bmi = (latestMetric.weight_kg / (heightM * heightM)).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Scale size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Body Composition & Weight Trajectory</h2>
            <p className="text-xs text-slate-400">Longitudinal weight logs, body fat %, muscle mass, and metabolic metrics.</p>
          </div>
        </div>

        <button
          onClick={onAddMetric}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus size={15} />
          <span>Log Body Metric</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Latest Weight */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Current Weight</span>
            <Scale size={16} className="text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{latestMetric.weight_kg}</span>
            <span className="text-xs text-slate-400">kg</span>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <Calendar size={12} className="text-slate-400" />
            <span>Latest: {latestMetric.date}</span>
          </div>
        </div>

        {/* Calculated BMI */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Body Mass Index (BMI)</span>
            <Activity size={16} className="text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-cyan-400">{bmi}</span>
            <span className="text-xs text-slate-400">kg/m²</span>
          </div>
          <div className="text-[11px] text-slate-500">
            <span>Normal Range (18.5 - 24.9)</span>
          </div>
        </div>

        {/* Total Delta */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Net Trajectory</span>
            {Number(weightDiff) <= 0 ? (
              <TrendingDown size={16} className="text-emerald-400" />
            ) : (
              <TrendingUp size={16} className="text-amber-400" />
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">
              {Number(weightDiff) > 0 ? `+${weightDiff}` : weightDiff}
            </span>
            <span className="text-xs text-slate-400">kg from start</span>
          </div>
          <div className="text-[11px] text-slate-500">
            <span>Since {firstMetric.date}</span>
          </div>
        </div>

        {/* Body Fat / Muscle */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Body Composition</span>
            <Heart size={16} className="text-rose-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">
              {latestMetric.body_fat_pct ? `${latestMetric.body_fat_pct}%` : '—'}
            </span>
            <span className="text-xs text-slate-400">body fat</span>
          </div>
          <div className="text-[11px] text-slate-500">
            <span>Muscle: {latestMetric.muscle_mass_kg ? `${latestMetric.muscle_mass_kg} kg` : 'Untracked'}</span>
          </div>
        </div>
      </div>

      {/* Longitudinal Weight Chart */}
      <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <TrendingUp size={16} className="text-emerald-400" />
            <span>Longitudinal Weight Trajectory (kg)</span>
          </div>
          <span className="text-[11px] text-slate-500">{sortedMetrics.length} recorded checkpoints</span>
        </div>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sortedMetrics} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} tickLine={false} />
              <YAxis 
                stroke="#64748b" 
                tick={{ fontSize: 11 }} 
                tickLine={false} 
                domain={['auto', 'auto']}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  borderColor: '#334155', 
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#fff' 
                }}
                formatter={(val: any) => [`${val} kg`, 'Weight']}
              />
              <Area 
                type="monotone" 
                dataKey="weight_kg" 
                stroke="#10b981" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#weightGrad)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Full Metrics Table */}
      <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5">Weight (kg)</th>
                <th className="px-5 py-3.5">Body Fat (%)</th>
                <th className="px-5 py-3.5">Muscle Mass (kg)</th>
                <th className="px-5 py-3.5">Visceral Fat</th>
                <th className="px-5 py-3.5">BMR (kcal)</th>
                <th className="px-5 py-3.5">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {bodyMetrics.map((metric, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-4 font-mono text-slate-400 flex items-center gap-1.5">
                    <Calendar size={13} className="text-slate-500" />
                    {metric.date}
                  </td>
                  <td className="px-5 py-4 font-bold text-white">
                    {metric.weight_kg} <span className="text-slate-500 font-normal">kg</span>
                  </td>
                  <td className="px-5 py-4 text-slate-300">
                    {metric.body_fat_pct ? `${metric.body_fat_pct}%` : '—'}
                  </td>
                  <td className="px-5 py-4 text-slate-300">
                    {metric.muscle_mass_kg ? `${metric.muscle_mass_kg} kg` : '—'}
                  </td>
                  <td className="px-5 py-4 text-slate-300">
                    {metric.visceral_fat || '—'}
                  </td>
                  <td className="px-5 py-4 text-slate-300">
                    {metric.bmr ? `${metric.bmr} kcal` : '—'}
                  </td>
                  <td className="px-5 py-4 text-slate-400 max-w-xs truncate">
                    {metric.notes || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
