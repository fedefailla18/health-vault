import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Navigation, TabType } from './components/Navigation';
import { DashboardOverview } from './components/DashboardOverview';
import { BiomarkersView } from './components/BiomarkersView';
import { InjuriesView } from './components/InjuriesView';
import { TrainingView } from './components/TrainingView';
import { BodyMetricsView } from './components/BodyMetricsView';
import { MedicationsView } from './components/MedicationsView';
import { StudiesView } from './components/StudiesView';
import { Modal } from './components/Modal';
import { fetchHealthVaultData, saveCsvData } from './services/api';
import { 
  BodyMetric, 
  HealthVaultState, 
  Injury, 
  InjuryStatus, 
  LabResult, 
  Medication, 
  StrengthLift, 
  TrainingSession 
} from './types';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

type LogModalType = 'none' | 'quick' | 'metric' | 'lab' | 'injury' | 'lift' | 'session' | 'medication';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [state, setState] = useState<HealthVaultState>({
    bodyMetrics: [],
    injuries: [],
    labs: [],
    medications: [],
    strengthLogs: [],
    trainingLogs: [],
    studies: [],
    loading: true,
    error: null,
  });

  const [activeModal, setActiveModal] = useState<LogModalType>('none');
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const data = await fetchHealthVaultData();
      setState({
        ...data,
        loading: false,
        error: null,
      });
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err.message || 'Failed to load HealthVault data',
      }));
      showToast(err.message || 'Failed to load data', 'error');
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Injury Status Change
  const handleUpdateInjuryStatus = async (index: number, newStatus: InjuryStatus) => {
    const updatedInjuries = [...state.injuries];
    updatedInjuries[index] = {
      ...updatedInjuries[index],
      status: newStatus,
    };

    setState(prev => ({ ...prev, injuries: updatedInjuries }));

    try {
      await saveCsvData('injuries.csv', updatedInjuries, [
        'date',
        'body_region',
        'severity',
        'status',
        'description',
        'source',
      ]);
      showToast('Injury status updated and saved to injuries.csv');
    } catch (err: any) {
      showToast(`Failed to update injury status: ${err.message}`, 'error');
    }
  };

  // Form Submission Handlers
  const handleSaveMetric = async (metric: BodyMetric) => {
    const updated = [metric, ...state.bodyMetrics].sort((a, b) => b.date.localeCompare(a.date));
    setState(prev => ({ ...prev, bodyMetrics: updated }));
    try {
      await saveCsvData('body_metrics.csv', updated, [
        'date',
        'weight_kg',
        'body_fat_pct',
        'muscle_mass_kg',
        'visceral_fat',
        'bmr',
        'notes',
      ]);
      showToast('Body metric successfully recorded');
      setActiveModal('none');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleSaveLab = async (lab: LabResult) => {
    const updated = [lab, ...state.labs].sort((a, b) => b.date.localeCompare(a.date));
    setState(prev => ({ ...prev, labs: updated }));
    try {
      await saveCsvData('labs.csv', updated, [
        'date',
        'test_name',
        'result',
        'unit',
        'reference_range',
        'comments',
      ]);
      showToast('Lab result successfully recorded');
      setActiveModal('none');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleSaveInjury = async (injury: Injury) => {
    const updated = [injury, ...state.injuries].sort((a, b) => b.date.localeCompare(a.date));
    setState(prev => ({ ...prev, injuries: updated }));
    try {
      await saveCsvData('injuries.csv', updated, [
        'date',
        'body_region',
        'severity',
        'status',
        'description',
        'source',
      ]);
      showToast('Injury report saved');
      setActiveModal('none');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleSaveLift = async (lift: StrengthLift) => {
    const updated = [lift, ...state.strengthLogs].sort((a, b) => b.date.localeCompare(a.date));
    setState(prev => ({ ...prev, strengthLogs: updated }));
    try {
      await saveCsvData('strength_log.csv', updated, [
        'date',
        'exercise',
        'weight',
        'reps',
        'sets',
        'rpe',
        'notes',
      ]);
      showToast('Strength lift logged');
      setActiveModal('none');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleSaveSession = async (session: TrainingSession) => {
    const updated = [session, ...state.trainingLogs].sort((a, b) => b.date.localeCompare(a.date));
    setState(prev => ({ ...prev, trainingLogs: updated }));
    try {
      await saveCsvData('training_log.csv', updated, [
        'date',
        'activity',
        'type',
        'duration_min',
        'intensity',
        'rpe',
        'notes',
      ]);
      showToast('Training session logged');
      setActiveModal('none');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleSaveMedication = async (med: Medication) => {
    const updated = [med, ...state.medications].sort((a, b) => b.date_start.localeCompare(a.date_start));
    setState(prev => ({ ...prev, medications: updated }));
    try {
      await saveCsvData('medications.csv', updated, [
        'date_start',
        'date_end',
        'drug',
        'dose',
        'reason',
        'notes',
      ]);
      showToast('Medication recorded');
      setActiveModal('none');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-medium border animate-fadeIn ${
          toastMessage.type === 'success'
            ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-300'
            : 'bg-rose-950/90 border-rose-500/30 text-rose-300'
        }`}>
          {toastMessage.type === 'success' ? (
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle size={16} className="text-rose-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Header */}
      <Header
        userProfile={state.userProfile}
        loading={state.loading}
        onRefresh={loadData}
        onOpenQuickLog={() => setActiveModal('quick')}
      />

      {/* Navigation Tab Bar */}
      <Navigation
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        counts={{
          injuries: state.injuries.filter(i => i.status === 'active' || i.status === 'monitoring').length,
          labs: state.labs.length,
          medications: state.medications.filter(m => !m.date_end).length,
          studies: state.studies.length,
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8">
        {state.loading && state.bodyMetrics.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="animate-spin text-emerald-400" size={32} />
            <p className="text-xs">Reading HealthVault CSV datasets...</p>
          </div>
        ) : state.error && state.bodyMetrics.length === 0 ? (
          <div className="p-8 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center space-y-3">
            <AlertCircle className="mx-auto text-rose-400" size={36} />
            <h3 className="text-sm font-semibold text-rose-300">Failed to load health records</h3>
            <p className="text-xs text-rose-200/80">{state.error}</p>
            <button
              onClick={loadData}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <DashboardOverview
                userProfile={state.userProfile}
                bodyMetrics={state.bodyMetrics}
                injuries={state.injuries}
                labs={state.labs}
                strengthLogs={state.strengthLogs}
                trainingLogs={state.trainingLogs}
                medications={state.medications}
                onNavigate={setActiveTab}
                onOpenLog={(type) => {
                  if (type === 'weight') setActiveModal('metric');
                  else if (type === 'lab') setActiveModal('lab');
                  else if (type === 'injury') setActiveModal('injury');
                  else if (type === 'lift') setActiveModal('lift');
                }}
              />
            )}

            {activeTab === 'biomarkers' && (
              <BiomarkersView
                labs={state.labs}
                onAddLab={() => setActiveModal('lab')}
              />
            )}

            {activeTab === 'injuries' && (
              <InjuriesView
                injuries={state.injuries}
                onAddInjury={() => setActiveModal('injury')}
                onUpdateStatus={handleUpdateInjuryStatus}
              />
            )}

            {activeTab === 'training' && (
              <TrainingView
                strengthLogs={state.strengthLogs}
                trainingLogs={state.trainingLogs}
                onAddLift={() => setActiveModal('lift')}
                onAddSession={() => setActiveModal('session')}
              />
            )}

            {activeTab === 'metrics' && (
              <BodyMetricsView
                bodyMetrics={state.bodyMetrics}
                userProfile={state.userProfile}
                onAddMetric={() => setActiveModal('metric')}
              />
            )}

            {activeTab === 'medications' && (
              <MedicationsView
                medications={state.medications}
                onAddMedication={() => setActiveModal('medication')}
              />
            )}

            {activeTab === 'studies' && (
              <StudiesView
                studies={state.studies}
              />
            )}
          </>
        )}
      </main>

      {/* Quick Action Selector Modal */}
      <Modal
        isOpen={activeModal === 'quick'}
        onClose={() => setActiveModal('none')}
        title="Select Data to Log"
      >
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setActiveModal('metric')}
            className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/40 text-left transition-all group"
          >
            <h4 className="text-xs font-bold text-white group-hover:text-emerald-400">Body Metric / Weight</h4>
            <p className="text-[11px] text-slate-400 mt-1">Log body weight, fat %, muscle mass.</p>
          </button>

          <button
            onClick={() => setActiveModal('lab')}
            className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/40 text-left transition-all group"
          >
            <h4 className="text-xs font-bold text-white group-hover:text-indigo-400">Lab Result / Biomarker</h4>
            <p className="text-[11px] text-slate-400 mt-1">Record blood chemistry, hormones, vitamins.</p>
          </button>

          <button
            onClick={() => setActiveModal('injury')}
            className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-rose-500/50 hover:bg-slate-800/40 text-left transition-all group"
          >
            <h4 className="text-xs font-bold text-white group-hover:text-rose-400">Injury & Pain Report</h4>
            <p className="text-[11px] text-slate-400 mt-1">Log musculoskeletal discomfort or updates.</p>
          </button>

          <button
            onClick={() => setActiveModal('lift')}
            className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/40 text-left transition-all group"
          >
            <h4 className="text-xs font-bold text-white group-hover:text-cyan-400">Strength Lift Record</h4>
            <p className="text-[11px] text-slate-400 mt-1">Log compound lifts, reps, and RPE.</p>
          </button>

          <button
            onClick={() => setActiveModal('session')}
            className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/40 text-left transition-all group"
          >
            <h4 className="text-xs font-bold text-white group-hover:text-emerald-400">Training Session</h4>
            <p className="text-[11px] text-slate-400 mt-1">Gym, soccer, padel, walking cadence.</p>
          </button>

          <button
            onClick={() => setActiveModal('medication')}
            className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-violet-500/50 hover:bg-slate-800/40 text-left transition-all group"
          >
            <h4 className="text-xs font-bold text-white group-hover:text-violet-400">Medication / Supplement</h4>
            <p className="text-[11px] text-slate-400 mt-1">Prescriptions and vitamin dosage.</p>
          </button>
        </div>
      </Modal>

      {/* Form Modal: Body Metric */}
      <Modal
        isOpen={activeModal === 'metric'}
        onClose={() => setActiveModal('none')}
        title="Log Body Metric"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            handleSaveMetric({
              date: String(fd.get('date')),
              weight_kg: Number(fd.get('weight_kg')),
              body_fat_pct: fd.get('body_fat_pct') ? Number(fd.get('body_fat_pct')) : undefined,
              muscle_mass_kg: fd.get('muscle_mass_kg') ? Number(fd.get('muscle_mass_kg')) : undefined,
              visceral_fat: fd.get('visceral_fat') ? Number(fd.get('visceral_fat')) : undefined,
              bmr: fd.get('bmr') ? Number(fd.get('bmr')) : undefined,
              notes: String(fd.get('notes') || ''),
            });
          }}
          className="space-y-4 text-xs"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Date</label>
              <input name="date" type="date" defaultValue={todayStr} required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Weight (kg) *</label>
              <input name="weight_kg" type="number" step="0.1" required placeholder="e.g. 77.5" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Body Fat (%)</label>
              <input name="body_fat_pct" type="number" step="0.1" placeholder="e.g. 18.2" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Muscle Mass (kg)</label>
              <input name="muscle_mass_kg" type="number" step="0.1" placeholder="e.g. 35.4" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500" />
            </div>
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Notes</label>
            <input name="notes" type="text" placeholder="Fasting morning weigh-in, etc." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500" />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={() => setActiveModal('none')} className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold">Save to CSV</button>
          </div>
        </form>
      </Modal>

      {/* Form Modal: Lab Result */}
      <Modal
        isOpen={activeModal === 'lab'}
        onClose={() => setActiveModal('none')}
        title="Add Lab Result"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const rawRes = String(fd.get('result'));
            handleSaveLab({
              date: String(fd.get('date')),
              test_name: String(fd.get('test_name')),
              result: isNaN(Number(rawRes)) ? rawRes : Number(rawRes),
              unit: String(fd.get('unit')),
              reference_range: String(fd.get('reference_range') || ''),
              comments: String(fd.get('comments') || ''),
            });
          }}
          className="space-y-4 text-xs"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Date</label>
              <input name="date" type="date" defaultValue={todayStr} required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Biomarker / Test Name *</label>
              <input name="test_name" type="text" required placeholder="e.g. Vitamin D, Ferritin" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Result Value *</label>
              <input name="result" type="text" required placeholder="e.g. 12 or 5.4" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Unit *</label>
              <input name="unit" type="text" required placeholder="e.g. ng/ml, mg/dl, %" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500" />
            </div>
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Reference Range</label>
            <input name="reference_range" type="text" placeholder="e.g. 30-100 or < 5.7" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Clinical Interpretation / Notes</label>
            <input name="comments" type="text" placeholder="e.g. Normal, Deficiency detected" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500" />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={() => setActiveModal('none')} className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold">Save to CSV</button>
          </div>
        </form>
      </Modal>

      {/* Form Modal: Injury */}
      <Modal
        isOpen={activeModal === 'injury'}
        onClose={() => setActiveModal('none')}
        title="Report / Update Injury"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            handleSaveInjury({
              date: String(fd.get('date')),
              body_region: String(fd.get('body_region')),
              severity: fd.get('severity') as any,
              status: fd.get('status') as any,
              description: String(fd.get('description')),
              source: String(fd.get('source') || 'User report'),
            });
          }}
          className="space-y-4 text-xs"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Date</label>
              <input name="date" type="date" defaultValue={todayStr} required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500" />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Body Region *</label>
              <input name="body_region" type="text" required placeholder="e.g. rectus_femoris, right_shoulder" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Severity</label>
              <select name="severity" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500">
                <option value="mild">Mild</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
                <option value="severe">Severe</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Status</label>
              <select name="status" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500">
                <option value="active">Active</option>
                <option value="monitoring">Monitoring</option>
                <option value="recovering">Recovering</option>
                <option value="active_history">Active History</option>
                <option value="healed">Healed</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Diagnosis & Description *</label>
            <textarea name="description" required rows={3} placeholder="Mechanism of injury, pain scale, medical imaging details..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500" />
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Source / Verification</label>
            <input name="source" type="text" placeholder="e.g. MRI 2026, Doctor visit, User report" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500" />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={() => setActiveModal('none')} className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold">Save to CSV</button>
          </div>
        </form>
      </Modal>

      {/* Form Modal: Strength Lift */}
      <Modal
        isOpen={activeModal === 'lift'}
        onClose={() => setActiveModal('none')}
        title="Log Strength Lift"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            handleSaveLift({
              date: String(fd.get('date')),
              exercise: String(fd.get('exercise')),
              weight: Number(fd.get('weight')),
              reps: Number(fd.get('reps')),
              sets: fd.get('sets') ? Number(fd.get('sets')) : 1,
              rpe: fd.get('rpe') ? Number(fd.get('rpe')) : undefined,
              notes: String(fd.get('notes') || ''),
            });
          }}
          className="space-y-4 text-xs"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Date</label>
              <input name="date" type="date" defaultValue={todayStr} required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Exercise *</label>
              <input name="exercise" type="text" required placeholder="e.g. Squat, Incline Press" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Weight (kg) *</label>
              <input name="weight" type="number" step="0.5" required placeholder="90" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Reps *</label>
              <input name="reps" type="number" required placeholder="4" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Sets</label>
              <input name="sets" type="number" defaultValue="1" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500" />
            </div>
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Notes</label>
            <input name="notes" type="text" placeholder="Felt strong, clean depth, RPE 8.5" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500" />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={() => setActiveModal('none')} className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold">Save to CSV</button>
          </div>
        </form>
      </Modal>

      {/* Form Modal: Training Session */}
      <Modal
        isOpen={activeModal === 'session'}
        onClose={() => setActiveModal('none')}
        title="Log Training Session"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            handleSaveSession({
              date: String(fd.get('date')),
              activity: String(fd.get('activity')),
              type: String(fd.get('type')),
              duration_min: Number(fd.get('duration_min')),
              intensity: String(fd.get('intensity')),
              notes: String(fd.get('notes') || ''),
            });
          }}
          className="space-y-4 text-xs"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Date</label>
              <input name="date" type="date" defaultValue={todayStr} required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Activity *</label>
              <input name="activity" type="text" required placeholder="e.g. Gym, Soccer, Padel, Walking" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Type</label>
              <select name="type" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500">
                <option value="Strength">Strength</option>
                <option value="Cardio">Cardio</option>
                <option value="Mobility">Mobility</option>
                <option value="Sport">Sport</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Duration (mins) *</label>
              <input name="duration_min" type="number" required placeholder="60" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Intensity</label>
              <select name="intensity" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Notes</label>
            <input name="notes" type="text" placeholder="Good pacing, no flare-ups" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500" />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={() => setActiveModal('none')} className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold">Save to CSV</button>
          </div>
        </form>
      </Modal>

      {/* Form Modal: Medication */}
      <Modal
        isOpen={activeModal === 'medication'}
        onClose={() => setActiveModal('none')}
        title="Add Medication / Supplement"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            handleSaveMedication({
              date_start: String(fd.get('date_start')),
              date_end: String(fd.get('date_end') || ''),
              drug: String(fd.get('drug')),
              dose: String(fd.get('dose') || ''),
              reason: String(fd.get('reason') || ''),
              notes: String(fd.get('notes') || ''),
            });
          }}
          className="space-y-4 text-xs"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Date Start *</label>
              <input name="date_start" type="date" defaultValue={todayStr} required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-violet-500" />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Date End (leave empty if active)</label>
              <input name="date_end" type="date" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-violet-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Substance / Drug *</label>
              <input name="drug" type="text" required placeholder="e.g. Vitamin D3, Sertraline" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-violet-500" />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Dose & Frequency</label>
              <input name="dose" type="text" placeholder="e.g. 5000 IU daily, 50mg" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-violet-500" />
            </div>
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Indication / Reason</label>
            <input name="reason" type="text" placeholder="e.g. Vitamin deficiency correction, mood support" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-violet-500" />
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Notes</label>
            <input name="notes" type="text" placeholder="e.g. Take with high-fat breakfast" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-violet-500" />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={() => setActiveModal('none')} className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold">Save to CSV</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
