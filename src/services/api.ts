import { 
  BodyMetric, 
  HealthVaultState, 
  Injury, 
  LabResult, 
  Medication, 
  StrengthLift, 
  StudyRecord, 
  TrainingSession, 
  UserProfile 
} from '../types';
import { parseCsv, serializeCsv } from '../utils/csvParser';

export async function fetchHealthVaultData(): Promise<Omit<HealthVaultState, 'loading' | 'error'>> {
  const res = await fetch('/api/data');
  if (!res.ok) {
    throw new Error(`Failed to load health vault data: ${res.statusText}`);
  }

  const json = await res.json();
  const raw = json.data || {};

  const userProfileRows = parseCsv<UserProfile>(raw['user_profile'] || '');
  const bodyMetrics = parseCsv<BodyMetric>(raw['body_metrics'] || '');
  const injuries = parseCsv<Injury>(raw['injuries'] || '');
  const labs = parseCsv<LabResult>(raw['labs'] || '');
  const medications = parseCsv<Medication>(raw['medications'] || '');
  const strengthLogs = parseCsv<StrengthLift>(raw['strength_log'] || '');
  const trainingLogs = parseCsv<TrainingSession>(raw['training_log'] || '');

  // Fetch studies
  let studies: StudyRecord[] = [];
  try {
    const studiesRes = await fetch('/api/studies');
    if (studiesRes.ok) {
      const studiesJson = await studiesRes.json();
      studies = studiesJson.studies || [];
    }
  } catch (e) {
    console.warn('Could not load studies list:', e);
  }

  return {
    userProfile: userProfileRows[0] || undefined,
    bodyMetrics: bodyMetrics.sort((a, b) => b.date.localeCompare(a.date)),
    injuries: injuries.sort((a, b) => b.date.localeCompare(a.date)),
    labs: labs.sort((a, b) => b.date.localeCompare(a.date)),
    medications: medications.sort((a, b) => b.date_start.localeCompare(a.date_start)),
    strengthLogs: strengthLogs.sort((a, b) => b.date.localeCompare(a.date)),
    trainingLogs: trainingLogs.sort((a, b) => b.date.localeCompare(a.date)),
    studies,
  };
}

export async function saveCsvData<T extends Record<string, any>>(
  fileName: string,
  data: T[],
  headers: (keyof T)[]
): Promise<void> {
  const csvContent = serializeCsv(data, headers);
  const res = await fetch('/api/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileName, content: csvContent }),
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.error || `Failed to save ${fileName}`);
  }
}
