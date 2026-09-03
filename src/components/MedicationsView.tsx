import React from 'react';
import { 
  Pill, 
  Plus, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';
import { Medication } from '../types';

interface MedicationsViewProps {
  medications: Medication[];
  onAddMedication: () => void;
}

export const MedicationsView: React.FC<MedicationsViewProps> = ({
  medications,
  onAddMedication,
}) => {
  const activeMeds = medications.filter(m => !m.date_end || m.date_end.trim() === '');
  const historicMeds = medications.filter(m => m.date_end && m.date_end.trim() !== '');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400">
            <Pill size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Medications & Supplement Regimen</h2>
            <p className="text-xs text-slate-400">Longitudinal prescription history, active supplements, dosage, and indications.</p>
          </div>
        </div>

        <button
          onClick={onAddMedication}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md shadow-violet-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus size={15} />
          <span>Add Medication</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Active Regimen</span>
            <ShieldCheck size={16} className="text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{activeMeds.length}</span>
            <span className="text-xs text-slate-400">active entries</span>
          </div>
          <p className="text-[11px] text-slate-500">Currently taking</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Historical / Completed</span>
            <Clock size={16} className="text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-300">{historicMeds.length}</span>
            <span className="text-xs text-slate-400">past records</span>
          </div>
          <p className="text-[11px] text-slate-500">Discontinued courses</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Recorded</span>
            <Pill size={16} className="text-violet-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-violet-400">{medications.length}</span>
            <span className="text-xs text-slate-400">lifetime</span>
          </div>
          <p className="text-[11px] text-slate-500">All documented substances</p>
        </div>
      </div>

      {/* Active Medications List */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>Active Medications & Daily Regimen</span>
        </h3>

        {activeMeds.length === 0 ? (
          <div className="p-6 rounded-2xl bg-slate-900/20 border border-slate-800/60 text-center text-xs text-slate-500">
            No active medications recorded.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeMeds.map((med, idx) => (
              <div 
                key={idx} 
                className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700/80 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-base font-bold text-white capitalize">{med.drug}</h4>
                    <p className="text-xs text-violet-300 font-medium">{med.dose || 'Dose unrecorded'}</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Active
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/40 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Indication / Reason:</span>
                    <span className="text-slate-200 font-medium">{med.reason || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Started:</span>
                    <span className="text-slate-200 font-mono flex items-center gap-1">
                      <Calendar size={12} className="text-slate-500" />
                      {med.date_start}
                    </span>
                  </div>
                  {med.notes && (
                    <div className="pt-1 text-[11px] text-slate-400 border-t border-slate-800/60">
                      {med.notes}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Historical Medications Table */}
      {historicMeds.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-400 flex items-center gap-2">
            <Clock size={16} className="text-slate-400" />
            <span>Discontinued / Historical Treatments</span>
          </h3>

          <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-5 py-3.5">Substance / Drug</th>
                    <th className="px-5 py-3.5">Dose</th>
                    <th className="px-5 py-3.5">Duration</th>
                    <th className="px-5 py-3.5">Indication</th>
                    <th className="px-5 py-3.5">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {historicMeds.map((med, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-4 font-bold text-white capitalize">{med.drug}</td>
                      <td className="px-5 py-4 text-violet-300 font-medium">{med.dose || '—'}</td>
                      <td className="px-5 py-4 font-mono text-slate-400">
                        {med.date_start} → {med.date_end}
                      </td>
                      <td className="px-5 py-4 text-slate-300">{med.reason || '—'}</td>
                      <td className="px-5 py-4 text-slate-400 max-w-xs truncate">{med.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
