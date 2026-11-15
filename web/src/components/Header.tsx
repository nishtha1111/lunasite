// Portions of this file were generated with SI assistance (see SI_USE.md)
/**
 * Portions of this file were generated with AI assistance.
 * LunaSite Clean, Modern Header Component.
 */

import React from 'react';
import { ActiveView, MissionPreset } from '../types';
import { MISSION_PRESETS } from '../metrics/engine';
import { 
  BarChart3, 
  Compass, 
  GraduationCap, 
  Share2, 
  Download
} from 'lucide-react';

interface HeaderProps {
  activeView: ActiveView;
  onViewChange: (view: ActiveView) => void;
  preset: MissionPreset;
  onPresetChange: (preset: MissionPreset) => void;
  onShare: () => void;
  onExportCsv: () => void;
  shareCopied: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onViewChange,
  preset,
  onPresetChange,
  onShare,
  onExportCsv,
  shareCopied
}) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        
        {/* Sleek Aerospace Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onViewChange('compare')}>
            {/* Custom Modern Lunar Logo Mark */}
            <div className="relative w-7 h-7 flex items-center justify-center">
              <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none">
                <circle cx="16" cy="16" r="14" stroke="#334155" strokeWidth="1.5" />
                <path
                  d="M16 2 A 14 14 0 0 1 16 30 A 10 10 0 0 0 16 2 Z"
                  fill="#f1f5f9"
                />
                <circle cx="21" cy="11" r="2.5" fill="#f59e0b" />
                <circle cx="9" cy="21" r="1.5" fill="#06b6d4" />
              </svg>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-extrabold text-base tracking-tight text-white">
                LunaSite
              </span>
              <span className="hidden sm:inline-block text-[11px] text-slate-400 font-medium">
                Lunar South Pole Planner
              </span>
            </div>
          </div>
        </div>

        {/* View Segmented Tabs */}
        <nav className="flex items-center bg-slate-900/90 p-1 rounded-lg border border-slate-800 shadow-inner">
          <button
            onClick={() => onViewChange('compare')}
            className={`flex items-center gap-1.5 px-3 py-1.2 rounded-md text-xs font-medium transition-all ${
              activeView === 'compare'
                ? 'bg-slate-800 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
            <span>Compare</span>
          </button>
          <button
            onClick={() => onViewChange('horizon')}
            className={`flex items-center gap-1.5 px-3 py-1.2 rounded-md text-xs font-medium transition-all ${
              activeView === 'horizon'
                ? 'bg-slate-800 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>Horizon 360°</span>
          </button>
          <button
            onClick={() => onViewChange('learn')}
            className={`flex items-center gap-1.5 px-3 py-1.2 rounded-md text-xs font-medium transition-all ${
              activeView === 'learn'
                ? 'bg-slate-800 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
            <span>Learn</span>
          </button>
        </nav>

        {/* Presets & Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Preset Selector */}
          <div className="hidden md:flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-md text-xs">
            <span className="text-slate-500 font-mono text-[10px] uppercase tracking-wider">Profile:</span>
            <select
              value={preset}
              onChange={(e) => onPresetChange(e.target.value as MissionPreset)}
              className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer text-xs"
            >
              {(Object.keys(MISSION_PRESETS) as MissionPreset[]).map((key) => (
                <option key={key} value={key} className="bg-slate-900 text-slate-200">
                  {MISSION_PRESETS[key].label}
                </option>
              ))}
            </select>
          </div>

          {/* Share Button */}
          <button
            onClick={onShare}
            title="Copy shareable mission link"
            className="flex items-center gap-1.5 px-2.5 py-1.2 rounded-md text-xs font-medium bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{shareCopied ? 'Copied!' : 'Share'}</span>
          </button>

          {/* Export CSV Button */}
          <button
            onClick={onExportCsv}
            title="Download CSV metrics"
            className="flex items-center gap-1.5 px-2.5 py-1.2 rounded-md text-xs font-medium bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CSV</span>
          </button>
        </div>

      </div>
    </header>
  );
};
