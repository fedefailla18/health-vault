import React from 'react';
import { 
  Dumbbell, 
  Plus, 
  TrendingUp, 
  Trophy 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { StrengthLift, TrainingSession } from '../types';

interface TrainingViewProps {
  strengthLogs: StrengthLift[];
  trainingLogs: TrainingSession[];
  onAddLift: () => void;
  onAddSession: () => void;
}

export const TrainingView: React.FC<TrainingViewProps> = ({
  strengthLogs,
  trainingLogs,
  onAddLift,
  onAddSession
}) => {
  // Compute chart data for strength PRs (weight & 1RM)
  const strengthChartData = strengthLogs.map(l => {
    const est1RM = Math.round(l.weight * (1 + (l.reps || 1) / 30));
    return {
      exercise: l.exercise,
      weight: l.weight,
      reps: l.reps,
      est1RM: est1RM,
      date: l.date
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Dumbbell size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Training Regimen & Strength Progression</h2>
            <p className="text-xs text-slate-400">Weekly athletic cadence, compound lift progression, and estimated 1RMs.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onAddSession}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Plus size={15} />
            <span>Log Session</span>
          </button>
          <button
            onClick={onAddLift}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus size={15} />
            <span>Log Strength Lift</span>
          </button>
        </div>
      </div>

      {/* Routine Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {trainingLogs.map((session, idx) => (
          <div key={idx} className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">{session.activity}</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {session.type}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-slate-200">{session.duration_min}</span>
              <span className="text-xs text-slate-400">mins / session</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span>Intensity: <strong className="text-slate-300">{session.intensity}</strong></span>
              <span>{session.notes}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Strength Chart & PR Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strength Lift Bar Chart */}
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <TrendingUp size={16} className="text-emerald-400" />
              <span>Lift Weight vs. Estimated 1RM (kg)</span>
            </div>
            <span className="text-[11px] text-slate-500">Epley Formula</span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={strengthChartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="exercise" stroke="#64748b" tick={{ fontSize: 11 }} tickLine={false} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderColor: '#334155', 
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff' 
                  }}
                />
                <Bar dataKey="weight" name="Working Weight (kg)" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="est1RM" name="Estimated 1RM (kg)" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Strength Logs Table */}
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <Trophy size={16} className="text-amber-400" />
            <span>Strength Log History</span>
          </div>

          <div className="divide-y divide-slate-800/60">
            {strengthLogs.map((lift, i) => {
              const est1RM = Math.round(lift.weight * (1 + lift.reps / 30));
              return (
                <div key={i} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-white block">{lift.exercise}</span>
                    <span className="text-[11px] text-slate-500">{lift.date} • {lift.notes || 'Working set'}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-emerald-400">
                      {lift.weight} kg × {lift.reps} reps
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Est. 1RM: <strong className="text-slate-200">{est1RM} kg</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
