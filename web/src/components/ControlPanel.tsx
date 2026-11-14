/**
 * Portions of this file were generated with AI assistance.
 * LunaSite Control Panel Component (Left sidebar).
 */

import React, { useState } from 'react';
import { SiteManifestEntry, DateRange, ViabilityWeights, MissionPreset, ObserverHeight } from '../types';
import { MISSION_PRESETS } from '../metrics/engine';
import { 
  Calendar, 
  Sliders, 
  HelpCircle, 
  Layers, 
  Check, 
  Info,
  Sparkles,
  Maximize2
} from 'lucide-react';

interface ControlPanelProps {
  availableSites: SiteManifestEntry[];
  selectedSiteIds: string[];
  onToggleSite: (siteId: string) => void;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  weights: ViabilityWeights;
  onWeightsChange: (weights: ViabilityWeights) => void;
  activePreset: MissionPreset;
  onPresetChange?: (preset: MissionPreset) => void;
  observerHeight: ObserverHeight;
  onObserverHeightChange: (h: ObserverHeight) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  availableSites,
  selectedSiteIds,
  onToggleSite,
  dateRange,
  onDateRangeChange,
  weights,
  onWeightsChange,
  activePreset,
  observerHeight,
  onObserverHeightChange
}) => {
  const [showFormulaModal, setShowFormulaModal] = useState(false);
  const [isWeightsExpanded, setIsWeightsExpanded] = useState(false);

  // Quick Date Presets (Revision 7 required presets)
  const applyPresetDates = (type: 'next30' | '2027' | 'full') => {
    if (type === 'next30') {
      onDateRangeChange({
        startDate: '2026-11-14',
        endDate: '2026-12-14'
      });
    } else if (type === '2027') {
      onDateRangeChange({
        startDate: '2027-01-01',
        endDate: '2027-12-31'
      });
    } else if (type === 'full') {
      onDateRangeChange({
        startDate: '2026-01-01',
        endDate: '2030-12-31'
      });
    }
  };

  return (
    <aside className="w-full lg:w-80 shrink-0 bg-lunar-900/60 border-r border-lunar-800 p-4 space-y-6 overflow-y-auto">
      
      {/* 1. Candidate Sites Picker */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            Candidate Sites ({selectedSiteIds.length}/4)
          </label>
          <span className="text-[11px] font-mono text-slate-500">Pick 2-4</span>
        </div>

        <div className="space-y-2">
          {availableSites.map((site) => {
            const isSelected = selectedSiteIds.includes(site.id);
            return (
              <button
                key={site.id}
                onClick={() => onToggleSite(site.id)}
                className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all relative ${
                  isSelected
                    ? 'bg-lunar-800/90 border-amber-500/50 text-slate-100 shadow-sm shadow-amber-500/10'
                    : 'bg-lunar-950/40 border-lunar-800/70 text-slate-400 hover:text-slate-200 hover:border-lunar-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">{site.name}</span>
                  <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                    isSelected ? 'bg-amber-500 border-amber-400 text-lunar-950' : 'border-lunar-700'
                  }`}>
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-1 font-mono text-[10px] text-slate-400">
                  <span>{Math.abs(site.lat_deg).toFixed(2)}°S, {site.lon_deg >= 0 ? `${site.lon_deg.toFixed(2)}°E` : `${Math.abs(site.lon_deg).toFixed(2)}°W`}</span>
                  <span className="text-lunar-600">•</span>
                  <span className="text-slate-400">+{site.elev_m}m</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. Date Range Picker & Quick Presets */}
      <section className="space-y-3 pt-4 border-t border-lunar-800/70">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            Evaluation Range
          </label>
        </div>

        {/* Quick presets buttons */}
        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={() => applyPresetDates('next30')}
            className={`px-2 py-1.5 rounded text-[11px] font-medium border text-center transition-all ${
              dateRange.startDate === '2026-11-14' && dateRange.endDate === '2026-12-14'
                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-semibold'
                : 'bg-lunar-950/60 border-lunar-800 text-slate-400 hover:text-slate-200 hover:bg-lunar-850'
            }`}
          >
            Next 30 Days
          </button>
          <button
            onClick={() => applyPresetDates('2027')}
            className={`px-2 py-1.5 rounded text-[11px] font-medium border text-center transition-all ${
              dateRange.startDate === '2027-01-01' && dateRange.endDate === '2027-12-31'
                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-semibold'
                : 'bg-lunar-950/60 border-lunar-800 text-slate-400 hover:text-slate-200 hover:bg-lunar-850'
            }`}
          >
            Year 2027
          </button>
          <button
            onClick={() => applyPresetDates('full')}
            className={`px-2 py-1.5 rounded text-[11px] font-medium border text-center transition-all ${
              dateRange.startDate === '2026-01-01' && dateRange.endDate === '2030-12-31'
                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-semibold'
                : 'bg-lunar-950/60 border-lunar-800 text-slate-400 hover:text-slate-200 hover:bg-lunar-850'
            }`}
          >
            2026–2030
          </button>
        </div>

        {/* Custom Start & End */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <label className="text-[10px] font-mono text-slate-500 block mb-1">START DATE</label>
            <input
              type="date"
              min="2026-01-01"
              max="2030-12-31"
              value={dateRange.startDate}
              onChange={(e) => onDateRangeChange({ ...dateRange, startDate: e.target.value })}
              className="w-full bg-lunar-950 border border-lunar-800 rounded px-2.5 py-1.5 text-slate-200 font-mono text-xs focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] font-mono text-slate-500 block mb-1">END DATE</label>
            <input
              type="date"
              min="2026-01-01"
              max="2030-12-31"
              value={dateRange.endDate}
              onChange={(e) => onDateRangeChange({ ...dateRange, endDate: e.target.value })}
              className="w-full bg-lunar-950 border border-lunar-800 rounded px-2.5 py-1.5 text-slate-200 font-mono text-xs focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* 3. Mast Height / Array Elevation */}
      <section className="space-y-3 pt-4 border-t border-lunar-800/70">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
            Array Height / Mast
          </label>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => onObserverHeightChange('2m')}
            className={`px-2 py-1.5 rounded text-[11px] font-medium border text-center transition-all ${
              observerHeight === '2m'
                ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-semibold'
                : 'bg-lunar-950/60 border-lunar-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            2.0m (Lander)
          </button>
          <button
            onClick={() => onObserverHeightChange('10m')}
            className={`px-2 py-1.5 rounded text-[11px] font-medium border text-center transition-all ${
              observerHeight === '10m'
                ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-semibold'
                : 'bg-lunar-950/60 border-lunar-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            10.0m (Mast)
          </button>
        </div>
        <p className="text-[10px] text-slate-400 leading-normal">
          Deployable 10m array lowers the horizon by ~0.5°–1.0°, overcoming local rim masking.
        </p>
      </section>

      {/* 4. Viability Score Weights & Explainability */}
      <section className="space-y-3 pt-4 border-t border-lunar-800/70">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            Viability Weights
          </label>
          <button
            onClick={() => setShowFormulaModal(true)}
            className="text-[11px] font-mono text-slate-400 hover:text-slate-200 flex items-center gap-1"
            title="Inspect explainable score formula"
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Formula</span>
          </button>
        </div>

        <p className="text-[11px] text-slate-400">
          Preset: <strong className="text-slate-200">{MISSION_PRESETS[activePreset].label}</strong>
        </p>

        <button
          onClick={() => setIsWeightsExpanded(!isWeightsExpanded)}
          className="w-full py-1.5 px-2.5 bg-lunar-950/70 hover:bg-lunar-850 border border-lunar-800 rounded text-xs text-slate-300 flex items-center justify-between transition-colors"
        >
          <span>{isWeightsExpanded ? 'Hide Weight Sliders' : 'Customize Sliders'}</span>
          <span className="font-mono text-[10px] text-slate-500">
            {weights.sunlit}/{weights.minDarkness}/{weights.dwe}/{weights.minOutage}
          </span>
        </button>

        {isWeightsExpanded && (
          <div className="space-y-3 pt-2 text-xs bg-lunar-950/50 p-2.5 rounded-lg border border-lunar-800/80">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-amber-400 font-medium">Solar Power (w1)</span>
                <span className="font-mono text-slate-300">{weights.sunlit}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weights.sunlit}
                onChange={(e) => onWeightsChange({ ...weights, sunlit: Number(e.target.value) })}
                className="w-full accent-amber-500 bg-lunar-800 h-1.5 rounded-lg"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-amber-300 font-medium">Min Darkness (w2)</span>
                <span className="font-mono text-slate-300">{weights.minDarkness}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weights.minDarkness}
                onChange={(e) => onWeightsChange({ ...weights, minDarkness: Number(e.target.value) })}
                className="w-full accent-amber-300 bg-lunar-800 h-1.5 rounded-lg"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-cyan-400 font-medium">DWE Comms (w3)</span>
                <span className="font-mono text-slate-300">{weights.dwe}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weights.dwe}
                onChange={(e) => onWeightsChange({ ...weights, dwe: Number(e.target.value) })}
                className="w-full accent-cyan-500 bg-lunar-800 h-1.5 rounded-lg"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-cyan-300 font-medium">Min Outage (w4)</span>
                <span className="font-mono text-slate-300">{weights.minOutage}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weights.minOutage}
                onChange={(e) => onWeightsChange({ ...weights, minOutage: Number(e.target.value) })}
                className="w-full accent-cyan-300 bg-lunar-800 h-1.5 rounded-lg"
              />
            </div>
          </div>
        )}
      </section>

      {/* Formula & Explainability Modal */}
      {showFormulaModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-lunar-900 border border-lunar-700 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-lunar-800 pb-3">
              <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Explainable Mission Viability Score
              </h3>
              <button
                onClick={() => setShowFormulaModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm font-mono"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                LunaSite calculates a completely transparent, non-black-box score (0 to 100) combining four operational constraints:
              </p>
              <div className="bg-lunar-950 p-3 rounded-lg border border-lunar-800 font-mono text-[11px] text-emerald-300 overflow-x-auto">
                Score = (w1·S_sun + w2·S_dark + w3·S_dwe + w4·S_outage) / (w1 + w2 + w3 + w4)
              </div>
              <ul className="space-y-2 list-disc list-inside text-slate-300">
                <li><strong className="text-amber-400">S_sun:</strong> Sunlit fraction percentage (0–100%).</li>
                <li><strong className="text-amber-300">S_dark:</strong> 100 · exp(-D_dark / 72 h), penalizing long freeze periods (0h dark = 100, 72h dark = 36.8).</li>
                <li><strong className="text-cyan-400">S_dwe:</strong> Direct-with-Earth comm window percentage (0–100%).</li>
                <li><strong className="text-cyan-300">S_outage:</strong> 100 · exp(-O_comm / 168 h), penalizing comm blackouts beyond a 7-day battery threshold.</li>
              </ul>
              <div className="bg-lunar-800/40 border border-lunar-700/50 p-2.5 rounded text-[11px] flex items-start gap-2 text-slate-400">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  Adjusting weights dynamically recomputes the entire score and updates ranking across all candidate sites in real time.
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowFormulaModal(false)}
                className="px-4 py-1.5 bg-lunar-800 hover:bg-lunar-700 border border-lunar-600 rounded text-xs font-medium text-slate-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </aside>
  );
};
