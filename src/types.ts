export interface UserProfile {
  name: string;
  age: number;
  height_cm: number;
  weight_kg: number;
  profession: string;
}

export interface BodyMetric {
  date: string;
  weight_kg: number;
  body_fat_pct?: number;
  muscle_mass_kg?: number;
  visceral_fat?: number;
  bmr?: number;
  notes?: string;
}

export type InjurySeverity = 'mild' | 'moderate' | 'high' | 'severe';
export type InjuryStatus = 'active' | 'monitoring' | 'recovering' | 'active_history' | 'healed';

export interface Injury {
  date: string;
  body_region: string;
  severity: InjurySeverity;
  status: InjuryStatus;
  description: string;
  source?: string;
}

export interface LabResult {
  date: string;
  test_name: string;
  result: number | string;
  unit: string;
  reference_range?: string;
  comments?: string;
}

export interface Medication {
  date_start: string;
  date_end?: string;
  drug: string;
  dose?: string;
  reason?: string;
  notes?: string;
}

export interface StrengthLift {
  date: string;
  exercise: string;
  weight: number;
  reps: number;
  sets?: number;
  rpe?: number;
  notes?: string;
}

export interface TrainingSession {
  date: string;
  activity: string;
  type: string;
  duration_min: number;
  intensity: 'Low' | 'Medium' | 'High' | string;
  rpe?: number;
  notes?: string;
}

export interface StudyRecord {
  category: 'MRI' | 'Bloodwork' | 'Reports' | string;
  fileName: string;
  sizeBytes: number;
  modifiedAt: string;
}

export interface HealthVaultState {
  userProfile?: UserProfile;
  bodyMetrics: BodyMetric[];
  injuries: Injury[];
  labs: LabResult[];
  medications: Medication[];
  strengthLogs: StrengthLift[];
  trainingLogs: TrainingSession[];
  studies: StudyRecord[];
  loading: boolean;
  error?: string | null;
}
