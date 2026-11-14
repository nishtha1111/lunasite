/**
 * Portions of this file were generated with AI assistance.
 * LunaSite Header Component.
 */

import React from 'react';
import { ActiveView, MissionPreset } from '../types';
import { MISSION_PRESETS } from '../metrics/engine';
import { 
  BarChart3, 
  Compass, 
  GraduationCap, 
  Share2, 
  Download, 
  Moon, 
  Sun, 
  Radio
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
    <header className="border-b border-lunar-800 bg-lunar-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand & Neutral Mission Pill */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 via-cyan-500/20 to-lunar-800 border border-lunar-700 flex items-center justify-center">
              <Moon className="w-4 h-4 text-slate-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-100 via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  LunaSite
                </span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-lunar-800 border border-lunar-700 text-slate-300 font-semibold tracking-wider">
                  Lunar South Pole Mission Planner
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* View Tabs */}
        <nav className="flex items-center gap-1 bg-lunar-950/70 p-1 rounded-lg border border-lunar-800">
          <button
            onClick={() => onViewChange('compare')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeView === 'compare'
                ? 'bg-lunar-800 text-slate-100 shadow-sm border border-lunar-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-lunar-850'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
            <span>Compare Sites</span>
          </button>
          <button
            onClick={() => onViewChange('horizon')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeView === 'horizon'
                ? 'bg-lunar-800 text-slate-100 shadow-sm border border-lunar-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-lunar-850'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>Horizon 360°</span>
          </button>
          <button
            onClick={() => onViewChange('learn')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeView === 'learn'
                ? 'bg-lunar-800 text-slate-100 shadow-sm border border-lunar-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-lunar-850'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
            <span>Learn</span>
          </button>
        </nav>

        {/* Presets & Actions */}
        <div className="flex items-center gap-2">
          {/* Preset Selector */}
          <div className="hidden sm:flex items-center gap-1.5 bg-lunar-950 border border-lunar-800 px-2 py-1 rounded-md text-xs">
            <span className="text-slate-500 font-mono text-[11px]">Preset:</span>
            <select
              value={preset}
              onChange={(e) => onPresetChange(e.target.value as MissionPreset)}
              className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer"
            >
              {(Object.keys(MISSION_PRESETS) as MissionPreset[]).map((key) => (
                <option key={key} value={key} className="bg-lunar-900 text-slate-200">
                  {MISSION_PRESETS[key].label}
                </option>
              ))}
            </select>
          </div>

          {/* Share Button */}
          <button
            onClick={onShare}
            title="Copy shareable mission link"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium bg-lunar-850 hover:bg-lunar-800 border border-lunar-700/60 text-slate-300 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{shareCopied ? 'Link Copied!' : 'Share'}</span>
          </button>

          {/* Export CSV Button */}
          <button
            onClick={onExportCsv}
            title="Download CSV metrics table"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium bg-lunar-850 hover:bg-lunar-800 border border-lunar-700/60 text-slate-300 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Export CSV</span>
          </button>

          {/* Legend indicators */}
          <div className="hidden lg:flex items-center gap-3 ml-2 pl-3 border-l border-lunar-800 text-[11px] font-mono">
            <span className="flex items-center gap-1 text-amber-400">
              <Sun className="w-3 h-3" /> Sun
            </span>
            <span className="flex items-center gap-1 text-cyan-400">
              <Radio className="w-3 h-3" /> Earth (DWE)
            </span>
          </div>

        </div>

      </div>
    </header>
  );
};
