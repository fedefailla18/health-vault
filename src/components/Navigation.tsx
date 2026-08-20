import React from 'react';
import { 
  LayoutDashboard, 
  FlaskConical, 
  HeartPulse, 
  Dumbbell, 
  Scale, 
  Pill, 
  FolderOpen,
  LucideIcon
} from 'lucide-react';

export type TabType = 
  | 'overview' 
  | 'biomarkers' 
  | 'injuries' 
  | 'training' 
  | 'metrics' 
  | 'medications' 
  | 'studies';

interface TabItem {
  id: TabType;
  label: string;
  icon: LucideIcon;
  count?: number;
  alert?: boolean;
}

interface NavigationProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  counts: {
    injuries: number;
    labs: number;
    medications: number;
    studies: number;
  };
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onChangeTab,
  counts
}) => {
  const tabs: TabItem[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'biomarkers', label: 'Biomarkers & Labs', icon: FlaskConical, count: counts.labs },
    { id: 'injuries', label: 'Injuries & Recovery', icon: HeartPulse, count: counts.injuries, alert: counts.injuries > 0 },
    { id: 'training', label: 'Training & Strength', icon: Dumbbell },
    { id: 'metrics', label: 'Body Metrics', icon: Scale },
    { id: 'medications', label: 'Medications', icon: Pill, count: counts.medications },
    { id: 'studies', label: 'Studies & Docs', icon: FolderOpen, count: counts.studies },
  ];

  return (
    <div className="border-b border-slate-800 bg-slate-900/40 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-emerald-400' : 'text-slate-400'} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                  isActive 
                    ? 'bg-emerald-500/20 text-emerald-300' 
                    : tab.alert 
                      ? 'bg-amber-500/20 text-amber-300' 
                      : 'bg-slate-800 text-slate-400'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

