import React from 'react';
import { Activity, Plus, RefreshCw, User } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  userProfile?: UserProfile;
  onRefresh: () => void;
  onOpenQuickLog: () => void;
  loading: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  userProfile,
  onRefresh,
  onOpenQuickLog,
  loading
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm shadow-emerald-500/10">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">HealthVault</h1>
              <span className="text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Local First
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Longitudinal Health Intelligence & Performance</p>
          </div>
        </div>

        {/* User Profile Info & Actions */}
        <div className="flex items-center gap-3">
          {userProfile && (
            <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 font-medium text-white">
                <User size={14} className="text-emerald-400" />
                {userProfile.name}
              </div>
              <span className="text-slate-600">|</span>
              <span>{userProfile.age} yrs</span>
              <span className="text-slate-600">|</span>
              <span>{userProfile.height_cm} cm</span>
              <span className="text-slate-600">|</span>
              <span className="font-semibold text-emerald-400">{userProfile.weight_kg} kg</span>
            </div>
          )}

          <button
            onClick={onRefresh}
            disabled={loading}
            title="Refresh Data from CSV files"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin text-emerald-400' : ''} />
          </button>

          <button
            onClick={onOpenQuickLog}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus size={16} />
            <span>Log Entry</span>
          </button>
        </div>
      </div>
    </header>
  );
};
