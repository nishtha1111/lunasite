/**
 * Portions of this file were generated with AI assistance.
 * LunaSite Right Insight Panel Component.
 */

import React from 'react';
import { SiteMetrics, SiteMetadata } from '../types';
import { 
  Info, 
  ShieldCheck, 
  HelpCircle 
} from 'lucide-react';

interface InsightCardProps {
  activeSiteMeta: SiteMetadata | null;
  activeMetrics: SiteMetrics | null;
}

export const InsightCard: React.FC<InsightCardProps> = ({
  activeSiteMeta,
  activeMetrics
}) => {
  if (!activeSiteMeta || !activeMetrics) {
    return (
      <aside className="w-full lg:w-80 shrink-0 bg-lunar-900/40 border-l border-lunar-800 p-4 text-xs text-slate-500">
        Select a site to view mission constraints and telemetry breakdown.
      </aside>
    );
  }

  const { scoreBreakdown } = activeMetrics;

  return (
    <aside className="w-full lg:w-80 shrink-0 bg-lunar-900/60 border-l border-lunar-800 p-4 space-y-6 overflow-y-auto">
      
      {/* 1. Selected Site Identification */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Focused Target Site</span>
          <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-1.5 py-0.5 rounded">
            Artemis III Candidate
          </span>
        </div>
        <h3 className="font-bold text-base text-slate-100">{activeSiteMeta.name}</h3>
        <p className="text-xs text-slate-400 leading-relaxed">{activeSiteMeta.description}</p>
        
        {/* Coordinates grid */}
        <div className="grid grid-cols-2 gap-2 bg-lunar-950 p-2.5 rounded-lg border border-lunar-800 font-mono text-[11px]">
          <div>
            <span className="text-slate-500 block text-[9px]">LATITUDE</span>
            <span className="text-slate-200">{Math.abs(activeSiteMeta.lat_deg).toFixed(2)}° S</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[9px]">LONGITUDE</span>
            <span className="text-slate-200">{activeSiteMeta.lon_deg >= 0 ? `${activeSiteMeta.lon_deg.toFixed(2)}° E` : `${Math.abs(activeSiteMeta.lon_deg).toFixed(2)}° W`}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[9px]">ELEVATION</span>
            <span className="text-slate-200">{activeSiteMeta.elev_m} m</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[9px]">MAX SUN EL BOUND</span>
            <span className="text-amber-400">{activeSiteMeta.max_flat_sun_elevation_bound}°</span>
          </div>
        </div>
      </div>

      {/* 2. Plain-English Executive Summary */}
      <div className="space-y-3 pt-4 border-t border-lunar-800/70">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          Executive Mission Brief
        </h4>

        <div className="space-y-2 text-xs text-slate-300 bg-lunar-950/60 p-3 rounded-lg border border-lunar-800 leading-relaxed">
          <p>
            ☀️ <strong>Solar Availability:</strong> Sunlit for <strong className="text-amber-400">{activeMetrics.sunlitFractionPct}%</strong> of evaluated duration. Longest continuous darkness is <strong className="text-slate-100">{activeMetrics.longestDarknessHours} hours</strong> ({activeMetrics.darkPeriodsOver48h} periods exceeding 48h).
          </p>
          <p>
            📡 <strong>Earth Comms (DWE):</strong> Earth line-of-sight active <strong className="text-cyan-400">{activeMetrics.earthVisiblePct}%</strong> of the time, split across <strong>{activeMetrics.commWindowsCount} distinct windows</strong>. Longest blackout is <strong className="text-slate-100">{activeMetrics.longestCommOutageHours} hours</strong>.
          </p>
          <p>
            ⚡ <strong>Power + Comms Overlap:</strong> Simultaneous solar illumination and direct Earth line-of-sight occurs for <strong className="text-emerald-400">{activeMetrics.overlapPct}%</strong> of the mission window.
          </p>
        </div>
      </div>

      {/* 3. Viability Score Breakdown Bars */}
      <div className="space-y-3 pt-4 border-t border-lunar-800/70">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Score Contribution Breakdown
          </h4>
          <span className="font-mono text-emerald-400 font-bold text-xs">
            {activeMetrics.missionViabilityScore}/100
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-400">Solar Power Component</span>
              <span className="font-mono text-amber-400">{scoreBreakdown.sunlitComponent}</span>
            </div>
            <div className="w-full bg-lunar-950 rounded-full h-1.5 border border-lunar-800 overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${scoreBreakdown.sunlitComponent}%` }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-400">Darkness Penalty Score</span>
              <span className="font-mono text-amber-300">{scoreBreakdown.darknessPenalty}</span>
            </div>
            <div className="w-full bg-lunar-950 rounded-full h-1.5 border border-lunar-800 overflow-hidden">
              <div className="bg-amber-300 h-full rounded-full" style={{ width: `${scoreBreakdown.darknessPenalty}%` }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-400">DWE Link Margin Score</span>
              <span className="font-mono text-cyan-400">{scoreBreakdown.dweComponent}</span>
            </div>
            <div className="w-full bg-lunar-950 rounded-full h-1.5 border border-lunar-800 overflow-hidden">
              <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${scoreBreakdown.dweComponent}%` }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-400">Comm Outage Retention Score</span>
              <span className="font-mono text-cyan-300">{scoreBreakdown.outagePenalty}</span>
            </div>
            <div className="w-full bg-lunar-950 rounded-full h-1.5 border border-lunar-800 overflow-hidden">
              <div className="bg-cyan-300 h-full rounded-full" style={{ width: `${scoreBreakdown.outagePenalty}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Domain Glossary Tooltips */}
      <div className="space-y-2 pt-4 border-t border-lunar-800/70">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
          Technical Glossary
        </h4>
        <div className="space-y-1.5 text-[11px] text-slate-400">
          <details className="bg-lunar-950/60 p-2 rounded border border-lunar-800/70 cursor-pointer">
            <summary className="font-medium text-slate-300 hover:text-amber-400">Topocentric Azimuth & Elevation</summary>
            <p className="mt-1 text-slate-400 leading-relaxed">
              Coordinates measured from the observer's local surface tangent plane. Azimuth is compass bearing (0° North, 90° East). Elevation is angle above local horizontal.
            </p>
          </details>
          <details className="bg-lunar-950/60 p-2 rounded border border-lunar-800/70 cursor-pointer">
            <summary className="font-medium text-slate-300 hover:text-cyan-400">Direct-With-Earth (DWE)</summary>
            <p className="mt-1 text-slate-400 leading-relaxed">
              Direct line-of-sight communication between a lunar surface antenna and Earth ground stations (DSN/NEN) without requiring an orbiting lunar relay satellite.
            </p>
          </details>
          <details className="bg-lunar-950/60 p-2 rounded border border-lunar-800/70 cursor-pointer">
            <summary className="font-medium text-slate-300 hover:text-emerald-400">Libration Cycle</summary>
            <p className="mt-1 text-slate-400 leading-relaxed">
              Apparent wobble of the Moon relative to Earth, causing Earth to oscillate vertically in the polar sky over a ~27.3-day period with ~14-day visibility cycles.
            </p>
          </details>
        </div>
      </div>

    </aside>
  );
};
