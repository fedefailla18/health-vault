import React from 'react';
import { 
  AlertTriangle, 
  HeartPulse, 
  CheckCircle2, 
  ChevronRight, 
  Dumbbell, 
  FlaskConical, 
  Scale, 
  TrendingUp 
} from 'lucide-react';
import { 
  BodyMetric, 
  Injury, 
  LabResult, 
  Medication, 
  StrengthLift, 
  TrainingSession, 
  UserProfile 
} from '../types';
import { TabType } from './Navigation';

interface DashboardOverviewProps {
  userProfile?: UserProfile;
  bodyMetrics: BodyMetric[];
  injuries: Injury[];
  labs: LabResult[];
  strengthLogs: StrengthLift[];
  trainingLogs?: TrainingSession[];
  medications?: Medication[];
  onNavigate: (tab: TabType) => void;
  onOpenLog: (type: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  userProfile,
  bodyMetrics,
  injuries,
  labs,
  strengthLogs,
  onNavigate,
  onOpenLog,
}) => {
  const latestWeight = bodyMetrics[0]?.weight_kg || userProfile?.weight_kg || 0;
  const activeInjuries = injuries.filter(i => i.status === 'active' || i.status === 'monitoring');
  const criticalLabs = labs.filter(l => String(l.comments || '').toLowerCase().includes('deficiency') || String(l.comments || '').toLowerCase().includes('elevated'));

  return (
    <div className="space-y-6">
      {/* Active Injury Banner if present */}
      {activeInjuries.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3.5 shadow-lg shadow-amber-950/20 animate-fadeIn">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
            <AlertTriangle size={20} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-sm font-semibold text-amber-300">
                Active Injury Monitoring: {activeInjuries.map(i => i.body_region.replace('_', ' ')).join(', ')}
              </h4>
              <button 
                onClick={() => onNavigate('injuries')}
                className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 hover:underline"
              >
                View Injury Protocol <ChevronRight size={14} />
              </button>
            </div>
            <p className="text-xs text-amber-200/80 mt-1">
              {activeInjuries[0].description} ({activeInjuries[0].date})
            </p>
          </div>
        </div>
      )}

      {/* Top Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Weight Card */}
        <div 
          onClick={() => onNavigate('metrics')}
          className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Current Weight</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
              <Scale size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white tracking-tight">{latestWeight}</span>
            <span className="text-sm font-medium text-slate-400">kg</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
            <CheckCircle2 size={12} className="text-emerald-400" />
            Height: {userProfile?.height_cm || 174} cm • BMI: {(latestWeight / Math.pow((userProfile?.height_cm || 174)/100, 2)).toFixed(1)}
          </p>
        </div>

        {/* Injuries Card */}
        <div 
          onClick={() => onNavigate('injuries')}
          className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Physical Health</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center group-hover:bg-rose-500/20 transition-colors">
              <HeartPulse size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white tracking-tight">{injuries.length}</span>
            <span className="text-xs text-slate-400">total records</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            {activeInjuries.length > 0 ? (
              <span className="text-amber-400 font-medium">{activeInjuries.length} active/monitoring</span>
            ) : (
              <span className="text-emerald-400 font-medium">All cleared & healed</span>
            )}
          </p>
        </div>

        {/* Labs Card */}
        <div 
          onClick={() => onNavigate('biomarkers')}
          className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Biomarkers Tested</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
              <FlaskConical size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white tracking-tight">{labs.length}</span>
            <span className="text-xs text-slate-400">biomarker entries</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            {criticalLabs.length > 0 ? (
              <span className="text-amber-400 font-medium">{criticalLabs.length} attention required</span>
            ) : (
              <span className="text-emerald-400 font-medium">Within normal ranges</span>
            )}
          </p>
        </div>

        {/* Training Frequency Card */}
        <div 
          onClick={() => onNavigate('training')}
          className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Weekly Regimen</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
              <Dumbbell size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white tracking-tight">4-5</span>
            <span className="text-xs text-slate-400">sessions/week</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Gym (3-4x) • Soccer (1x) • Padel • Walking
          </p>
        </div>
      </div>

      {/* Main Grid: Biomarker Highlights & Strength Baselines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Biomarkers Table */}
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FlaskConical className="text-indigo-400" size={18} />
              <h3 className="text-sm font-semibold text-white">Biomarkers & Lab Status</h3>
            </div>
            <button
              onClick={() => onNavigate('biomarkers')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 hover:underline"
            >
              All Biomarkers <ChevronRight size={14} />
            </button>
          </div>

          <div className="divide-y divide-slate-800/60">
            {labs.slice(0, 5).map((lab, i) => {
              const isDeficient = String(lab.comments || '').toLowerCase().includes('deficiency');
              return (
                <div key={i} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-medium text-slate-200">{lab.test_name}</span>
                    <span className="block text-[11px] text-slate-500">{lab.date} {lab.reference_range ? `• Ref: ${lab.reference_range}` : ''}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-white">{lab.result} {lab.unit}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isDeficient 
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {isDeficient ? 'Deficiency' : 'Normal'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Strength PRs & Baselines */}
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Dumbbell className="text-emerald-400" size={18} />
              <h3 className="text-sm font-semibold text-white">Current Strength Baselines</h3>
            </div>
            <button
              onClick={() => onNavigate('training')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 hover:underline"
            >
              Training Log <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {strengthLogs.map((lift, idx) => {
              // Epley formula 1RM = Weight * (1 + Reps / 30)
              const est1RM = Math.round(lift.weight * (1 + lift.reps / 30));
              return (
                <div key={idx} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/60 space-y-2">
                  <span className="text-xs font-medium text-slate-400 block">{lift.exercise}</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-bold text-white">{lift.weight}</span>
                    <span className="text-xs text-slate-400">kg × {lift.reps}</span>
                  </div>
                  <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                    <TrendingUp size={10} />
                    Est. 1RM: {est1RM} kg
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/40 flex items-center justify-between text-xs text-slate-400">
            <span>Primary Focus: Hypertrophy & Injury Prevention</span>
            <span className="text-emerald-400 font-semibold">3-4x / week</span>
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-slate-900/40 to-slate-900/40 border border-emerald-500/20 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-semibold text-white">Record Today's Health & Training</h4>
          <p className="text-xs text-slate-400 mt-0.5">Keep your longitudinal timeline up to date with new data.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenLog('weight')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
          >
            + Weight
          </button>
          <button
            onClick={() => onOpenLog('lab')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
          >
            + Lab Test
          </button>
          <button
            onClick={() => onOpenLog('injury')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
          >
            + Injury Update
          </button>
          <button
            onClick={() => onOpenLog('lift')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
          >
            + Strength Lift
          </button>
        </div>
      </div>
    </div>
  );
};
