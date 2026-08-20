import React, { useState, useMemo } from 'react';
import { 
  FlaskConical, 
  Plus, 
  Filter, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  TrendingUp 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { LabResult } from '../types';

interface BiomarkersViewProps {
  labs: LabResult[];
  onAddLab: () => void;
}

export const BiomarkersView: React.FC<BiomarkersViewProps> = ({ labs, onAddLab }) => {
  const [selectedTest, setSelectedTest] = useState<string>('ALL');

  const uniqueTests = useMemo(() => {
    return Array.from(new Set(labs.map(l => l.test_name))).sort();
  }, [labs]);

  const filteredLabs = useMemo(() => {
    if (selectedTest === 'ALL') return labs;
    return labs.filter(l => l.test_name === selectedTest);
  }, [labs, selectedTest]);

  // Chart data for selected test
  const chartData = useMemo(() => {
    const numericLabs = (selectedTest === 'ALL' ? labs : filteredLabs)
      .filter(l => typeof l.result === 'number' || !isNaN(Number(l.result)))
      .map(l => ({
        date: l.date,
        test_name: l.test_name,
        result: Number(l.result),
        unit: l.unit,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return numericLabs;
  }, [labs, filteredLabs, selectedTest]);

  return (
    <div className="space-y-6">
      {/* Header & Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
            <FlaskConical size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Biomarkers & Laboratory Results</h2>
            <p className="text-xs text-slate-400">Track longitudinal blood chemistry, hormones, and micronutrients.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Test Filter */}
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <Filter size={14} className="text-slate-400" />
            <select
              value={selectedTest}
              onChange={e => setSelectedTest(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-xs text-white cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">All Biomarkers</option>
              {uniqueTests.map(test => (
                <option key={test} value={test} className="bg-slate-900">{test}</option>
              ))}
            </select>
          </div>

          <button
            onClick={onAddLab}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus size={15} />
            <span>Add Lab Test</span>
          </button>
        </div>
      </div>

      {/* Chart Section (if test is selected or numeric data available) */}
      {chartData.length > 0 && (
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <TrendingUp size={16} className="text-indigo-400" />
              <span>Biomarker Trend Curve {selectedTest !== 'ALL' ? `(${selectedTest})` : ''}</span>
            </div>
            <span className="text-[11px] text-slate-500">Longitudinal Values</span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis 
                  dataKey="date" 
                  stroke="#64748b" 
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#64748b" 
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderColor: '#334155', 
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff' 
                  }}
                  formatter={(val: any, _name: any, item: any) => [
                    `${val} ${item.payload.unit}`,
                    item.payload.test_name
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="result" 
                  stroke="#818cf8" 
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#6366f1', stroke: '#0f172a', strokeWidth: 2 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Table Section */}
      <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5">Test Name</th>
                <th className="px-5 py-3.5">Result</th>
                <th className="px-5 py-3.5">Reference Range</th>
                <th className="px-5 py-3.5">Status & Comments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredLabs.map((lab, idx) => {
                const isDeficient = String(lab.comments || '').toLowerCase().includes('deficiency');
                return (
                  <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-4 font-mono text-slate-400 flex items-center gap-1.5">
                      <Calendar size={13} className="text-slate-500" />
                      {lab.date}
                    </td>
                    <td className="px-5 py-4 font-medium text-white">{lab.test_name}</td>
                    <td className="px-5 py-4 font-semibold text-white">
                      {lab.result} <span className="text-slate-400 font-normal">{lab.unit}</span>
                    </td>
                    <td className="px-5 py-4 text-slate-400">{lab.reference_range || '—'}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 ${
                          isDeficient 
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {isDeficient ? <AlertCircle size={11} /> : <CheckCircle2 size={11} />}
                          {isDeficient ? 'Deficient' : 'Optimal/Normal'}
                        </span>
                        {lab.comments && <span className="text-slate-400 text-[11px] truncate max-w-xs">{lab.comments}</span>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
