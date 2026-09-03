import React from 'react';
import { 
  HeartPulse, 
  Plus, 
  Calendar, 
  FileText, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle, 
  Clock 
} from 'lucide-react';
import { Injury, InjurySeverity, InjuryStatus } from '../types';

interface InjuriesViewProps {
  injuries: Injury[];
  onAddInjury: () => void;
  onUpdateStatus: (index: number, newStatus: InjuryStatus) => void;
}

export const InjuriesView: React.FC<InjuriesViewProps> = ({
  injuries,
  onAddInjury,
  onUpdateStatus
}) => {
  const getSeverityBadge = (severity: InjurySeverity) => {
    switch (severity) {
      case 'high':
      case 'severe':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'moderate':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'mild':
      default:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    }
  };

  const getStatusBadge = (status: InjuryStatus) => {
    switch (status) {
      case 'active':
        return { label: 'Active', bg: 'bg-rose-500/20 text-rose-300 border-rose-500/30', icon: AlertTriangle };
      case 'monitoring':
        return { label: 'Monitoring', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/30', icon: Clock };
      case 'recovering':
        return { label: 'Recovering', bg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30', icon: Clock };
      case 'active_history':
        return { label: 'Active History', bg: 'bg-blue-500/20 text-blue-300 border-blue-500/30', icon: ShieldAlert };
      case 'healed':
      default:
        return { label: 'Healed', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', icon: CheckCircle };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400">
            <HeartPulse size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Injuries & Physical Recovery</h2>
            <p className="text-xs text-slate-400">Longitudinal musculoskeletal history, MRI findings, and active recovery protocols.</p>
          </div>
        </div>

        <button
          onClick={onAddInjury}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus size={15} />
          <span>Report Injury</span>
        </button>
      </div>

      {/* Injury Cards Timeline */}
      <div className="space-y-4">
        {injuries.map((injury, idx) => {
          const statusInfo = getStatusBadge(injury.status);
          const StatusIcon = statusInfo.icon;
          return (
            <div 
              key={idx}
              className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700/80 transition-all space-y-4 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white capitalize">
                      {injury.body_region.replace(/_/g, ' ')}
                    </h3>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${getSeverityBadge(injury.severity)}`}>
                      {injury.severity} severity
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar size={13} className="text-slate-500" />
                      {injury.date}
                    </span>
                    {injury.source && (
                      <>
                        <span className="text-slate-600">•</span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <FileText size={13} className="text-slate-500" />
                          {injury.source}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Status selector badge */}
                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border ${statusInfo.bg}`}>
                    <StatusIcon size={14} />
                    <span>{statusInfo.label}</span>
                  </div>
                  <select
                    value={injury.status}
                    onChange={e => onUpdateStatus(idx, e.target.value as InjuryStatus)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1 text-xs text-slate-300 focus:outline-none cursor-pointer"
                  >
                    <option value="active">Active</option>
                    <option value="monitoring">Monitoring</option>
                    <option value="recovering">Recovering</option>
                    <option value="active_history">Active History</option>
                    <option value="healed">Healed</option>
                  </select>
                </div>
              </div>

              {/* Description Body */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/40 text-xs text-slate-300 leading-relaxed">
                {injury.description}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
