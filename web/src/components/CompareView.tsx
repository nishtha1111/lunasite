/**
 * Portions of this file were generated with AI assistance.
 * LunaSite Compare View Component (Stacked Timelines & Sortable Summary Table).
 */

import React, { useState } from 'react';
import { LoadedSiteData } from '../data/loader';
import { SiteMetrics, DateRange, ObserverHeight } from '../types';
import { TimelineRibbon } from './TimelineRibbon';
import { 
  Trophy, 
  ArrowUpDown, 
  Sun, 
  Radio, 
  Zap, 
  Clock, 
  AlertTriangle,
  Camera
} from 'lucide-react';

interface CompareViewProps {
  sitesData: LoadedSiteData[];
  metricsList: SiteMetrics[];
  dateRange: DateRange;
  startIndex: number;
  endIndex: number;
  observerHeight?: ObserverHeight;
}

type SortField = keyof SiteMetrics;

export const CompareView: React.FC<CompareViewProps> = ({
  sitesData,
  metricsList,
  dateRange,
  startIndex,
  endIndex,
  observerHeight = '2m'
}) => {
  const [hoverFraction, setHoverFraction] = useState<number | null>(null);
  const [sortField, setSortField] = useState<SortField>('missionViabilityScore');
  const [sortAsc, setSortAsc] = useState(false);
  const [isExportingPng, setIsExportingPng] = useState(false);

  // Identify best site
  const sortedMetrics = [...metricsList].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    // For darkness and outage hours, lower is usually better, but sorting respects column intent
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortAsc ? aVal - bVal : bVal - aVal;
    }
    return 0;
  });

  const bestSite = [...metricsList].sort((a, b) => b.missionViabilityScore - a.missionViabilityScore)[0];

  // Compute cursor data point
  let cursorTimeStr = '';
  let cursorSiteReadouts: Record<string, { sEl: number; sAz: number; eEl: number; eAz: number; sVis: boolean; eVis: boolean }> = {};

  if (hoverFraction !== null && sitesData.length > 0) {
    const primary = sitesData[0];
    const span = endIndex - startIndex;
    const curIdx = Math.min(primary.numSteps - 1, Math.max(0, Math.floor(startIndex + hoverFraction * span)));
    const curMs = primary.startMs + curIdx * primary.stepMs;
    cursorTimeStr = new Date(curMs).toISOString().replace('T', ' ').substring(0, 16) + ' UTC';

    sitesData.forEach((sd) => {
      const idx = Math.min(sd.numSteps - 1, Math.max(0, Math.floor(startIndex + hoverFraction * span)));
      const sEl = sd.sunElevations[idx];
      const sAz = sd.sunAzimuths[idx];
      const eEl = sd.earthElevations[idx];
      const eAz = sd.earthAzimuths[idx];

      const horizon = observerHeight === '10m'
        ? (sd.meta.horizon_profile_mast || sd.meta.horizon_profile_default || [])
        : (sd.meta.horizon_profile_default || []);

      const sBin = Math.floor(sAz) % 360;
      const eBin = Math.floor(eAz) % 360;
      const sH = horizon[sBin >= 0 ? sBin : 0] ?? 0.0;
      const eH = horizon[eBin >= 0 ? eBin : 0] ?? 0.0;

      cursorSiteReadouts[sd.meta.id] = {
        sEl,
        sAz,
        eEl,
        eAz,
        sVis: (sEl + 0.265) > sH,
        eVis: (eEl + 0.95) > eH
      };
    });
  }

  // PNG Export Handler
  const handleExportPng = () => {
    setIsExportingPng(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 750;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Dark background
      ctx.fillStyle = '#0a0d14';
      ctx.fillRect(0, 0, 1200, 750);

      // Header branding
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 24px system-ui, sans-serif';
      ctx.fillText('LunaSite - Lunar South Pole Candidate Site Comparison', 40, 50);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px system-ui, sans-serif';
      ctx.fillText(`Evaluation Period: ${dateRange.startDate} to ${dateRange.endDate} | Observer: ${observerHeight} Mast`, 40, 80);

      // Draw scoreboard table
      let y = 130;
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(40, y, 1120, 40);

      ctx.fillStyle = '#f1f5f9';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('CANDIDATE SITE', 60, y + 25);
      ctx.fillText('COORDINATES', 280, y + 25);
      ctx.fillText('VIABILITY SCORE', 480, y + 25);
      ctx.fillText('SUNLIT (%)', 660, y + 25);
      ctx.fillText('MAX DARK (H)', 780, y + 25);
      ctx.fillText('EARTH DWE (%)', 920, y + 25);
      ctx.fillText('OVERLAP (%)', 1040, y + 25);

      y += 45;
      metricsList.forEach((m, idx) => {
        const site = sitesData.find(s => s.meta.id === m.siteId);
        ctx.fillStyle = idx % 2 === 0 ? '#111827' : '#0f172a';
        ctx.fillRect(40, y, 1120, 48);

        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 14px system-ui, sans-serif';
        ctx.fillText(m.siteName, 60, y + 30);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px monospace';
        const coords = site ? `${Math.abs(site.meta.lat_deg).toFixed(1)}°S, ${site.meta.lon_deg.toFixed(1)}°E` : '';
        ctx.fillText(coords, 280, y + 30);

        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 16px monospace';
        ctx.fillText(`${m.missionViabilityScore}/100`, 480, y + 30);

        ctx.fillStyle = '#f59e0b';
        ctx.font = '13px monospace';
        ctx.fillText(`${m.sunlitFractionPct}%`, 660, y + 30);

        ctx.fillStyle = '#94a3b8';
        ctx.fillText(`${m.longestDarknessHours}h`, 780, y + 30);

        ctx.fillStyle = '#06b6d4';
        ctx.fillText(`${m.earthVisiblePct}%`, 920, y + 30);

        ctx.fillStyle = '#34d399';
        ctx.fillText(`${m.overlapPct}%`, 1040, y + 30);

        y += 54;
      });

      // Best site highlight box
      if (bestSite) {
        y += 20;
        ctx.fillStyle = '#064e3b';
        ctx.fillRect(40, y, 1120, 80);
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(40, y, 1120, 80);

        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 15px system-ui, sans-serif';
        ctx.fillText(`RECOMMENDED LANDING SITE: ${bestSite.siteName} (Score: ${bestSite.missionViabilityScore}/100)`, 60, y + 32);

        ctx.fillStyle = '#e2e8f0';
        ctx.font = '13px system-ui, sans-serif';
        ctx.fillText(`Provides ${bestSite.sunlitFractionPct}% solar illumination, ${bestSite.earthVisiblePct}% direct-with-Earth comms, and max dark interval of ${bestSite.longestDarknessHours}h.`, 60, y + 58);
      }

      // Disclaimer footer
      ctx.fillStyle = '#64748b';
      ctx.font = '11px system-ui, sans-serif';
      ctx.fillText('Generated by LunaSite | NASA Space Apps Challenge 2026 | Topography: LOLA LDEM_75S_240M | Ephemeris: NAIF SPICE DE440s', 40, 720);

      // Download
      const link = document.createElement('a');
      link.download = `lunasite_comparison_${dateRange.startDate}_${dateRange.endDate}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } finally {
      setIsExportingPng(false);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header Overview & Cursor Readout */}
      <div className="bg-lunar-900/60 border border-lunar-800 rounded-xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-lunar-800/80 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <span>Site Illumination & Comm Window Timelines</span>
              <span className="text-[11px] font-mono font-normal text-slate-400 bg-lunar-950 px-2 py-0.5 rounded border border-lunar-800">
                {dateRange.startDate} to {dateRange.endDate}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Top bar: <span className="text-amber-400 font-medium">Solar Power</span> • Bottom bar: <span className="text-cyan-400 font-medium">Direct-to-Earth Comm</span>. Hover to inspect topocentric coordinates.
            </p>
          </div>

          {/* Actions: Hover Cursor Pill & PNG Export */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-lunar-950 border border-lunar-700/80 px-3 py-1.5 rounded-lg text-xs font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-300">
                {cursorTimeStr || 'Hover over timelines to inspect'}
              </span>
            </div>

            <button
              onClick={handleExportPng}
              disabled={isExportingPng}
              title="Download PNG snapshot of comparison chart & scoreboard"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-lunar-850 hover:bg-lunar-800 border border-lunar-700 text-slate-200 transition-colors shadow-sm"
            >
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span>Export PNG</span>
            </button>
          </div>
        </div>

        {/* Stacked Timelines */}
        <div className="space-y-4 pt-4">
          {sitesData.map((sd) => {
            const cur = cursorSiteReadouts[sd.meta.id];
            const isBest = bestSite && bestSite.siteId === sd.meta.id;
            const horizon = observerHeight === '10m'
              ? (sd.meta.horizon_profile_mast || sd.meta.horizon_profile_default || [])
              : (sd.meta.horizon_profile_default || []);

            return (
              <div key={sd.meta.id} className="space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-200">{sd.meta.name}</span>
                    <span className="font-mono text-[10px] text-slate-400">
                      ({Math.abs(sd.meta.lat_deg).toFixed(2)}°S, {sd.meta.lon_deg >= 0 ? `${sd.meta.lon_deg.toFixed(2)}°E` : `${Math.abs(sd.meta.lon_deg).toFixed(2)}°W`})
                    </span>
                    {isBest && (
                      <span className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-[10px] font-semibold px-2 py-0.2 rounded flex items-center gap-1">
                        <Trophy className="w-3 h-3" /> Highest Viability
                      </span>
                    )}
                  </div>

                  {/* Real-time cursor coordinates for this site */}
                  {cur && (
                    <div className="flex items-center gap-3 font-mono text-[11px] text-slate-300">
                      <span className={cur.sVis ? 'text-amber-400' : 'text-slate-500'}>
                        Sun: {cur.sEl.toFixed(1)}° el ({cur.sVis ? 'Light' : 'Shadow'})
                      </span>
                      <span className={cur.eVis ? 'text-cyan-400' : 'text-slate-500'}>
                        Earth: {cur.eEl.toFixed(1)}° el ({cur.eVis ? 'Comm OK' : 'No Comm'})
                      </span>
                    </div>
                  )}
                </div>

                <TimelineRibbon
                  siteData={sd}
                  startIndex={startIndex}
                  endIndex={endIndex}
                  hoverFraction={hoverFraction}
                  onHoverFractionChange={setHoverFraction}
                  horizonProfile={horizon}
                />
              </div>
            );
          })}
        </div>

      </div>

      {/* 2. Plain-English "Why This Site Ranks #1" Insight Card */}
      {bestSite && (
        <div className="bg-gradient-to-r from-emerald-950/40 via-lunar-900 to-lunar-900 border border-emerald-500/30 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Trophy className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-sm text-slate-100">
                Recommended Landing Zone: <span className="text-emerald-400">{bestSite.siteName}</span>
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              Under current mission weights, <strong>{bestSite.siteName}</strong> achieves the top Mission Viability Score of <strong className="text-emerald-400 font-mono">{bestSite.missionViabilityScore}/100</strong>. It maintains <strong>{bestSite.sunlitFractionPct}% solar illumination</strong> with a maximum continuous darkness of <strong>{bestSite.longestDarknessHours} hours</strong>, and provides <strong>{bestSite.earthVisiblePct}% Direct-with-Earth comm coverage</strong>.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-3 bg-lunar-950 border border-lunar-800 p-3 rounded-lg font-mono">
            <div className="text-right">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">Viability Score</div>
              <div className="text-2xl font-bold text-emerald-400">{bestSite.missionViabilityScore}</div>
            </div>
            <div className="text-right pl-3 border-l border-lunar-800">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">Overlap</div>
              <div className="text-lg font-bold text-slate-200">{bestSite.overlapPct}%</div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Comprehensive Sortable Metrics Table */}
      <div className="bg-lunar-900/60 border border-lunar-800 rounded-xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <span>Mission Constraints & Viability Scoreboard</span>
          </h3>
          <span className="text-xs text-slate-400">Click column header to sort</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-lunar-800 font-mono text-[11px] text-slate-400">
                <th className="py-2.5 px-3 font-semibold cursor-pointer hover:text-slate-200" onClick={() => handleSort('siteName')}>
                  <div className="flex items-center gap-1">Site Name <ArrowUpDown className="w-3 h-3 text-slate-500" /></div>
                </th>
                <th className="py-2.5 px-3 font-semibold cursor-pointer hover:text-slate-200 text-emerald-400" onClick={() => handleSort('missionViabilityScore')}>
                  <div className="flex items-center gap-1">Viability Score <ArrowUpDown className="w-3 h-3 text-slate-500" /></div>
                </th>
                <th className="py-2.5 px-3 font-semibold cursor-pointer hover:text-slate-200 text-amber-400" onClick={() => handleSort('sunlitFractionPct')}>
                  <div className="flex items-center gap-1"><Sun className="w-3 h-3" /> Sunlit % <ArrowUpDown className="w-3 h-3 text-slate-500" /></div>
                </th>
                <th className="py-2.5 px-3 font-semibold cursor-pointer hover:text-slate-200" onClick={() => handleSort('longestDarknessHours')}>
                  <div className="flex items-center gap-1">Max Dark (h) <ArrowUpDown className="w-3 h-3 text-slate-500" /></div>
                </th>
                <th className="py-2.5 px-3 font-semibold cursor-pointer hover:text-slate-200" onClick={() => handleSort('darkPeriodsOver48h')}>
                  <div className="flex items-center gap-1">Dark &gt; 48h <ArrowUpDown className="w-3 h-3 text-slate-500" /></div>
                </th>
                <th className="py-2.5 px-3 font-semibold cursor-pointer hover:text-slate-200 text-cyan-400" onClick={() => handleSort('earthVisiblePct')}>
                  <div className="flex items-center gap-1"><Radio className="w-3 h-3" /> Earth (DWE) % <ArrowUpDown className="w-3 h-3 text-slate-500" /></div>
                </th>
                <th className="py-2.5 px-3 font-semibold cursor-pointer hover:text-slate-200" onClick={() => handleSort('longestCommOutageHours')}>
                  <div className="flex items-center gap-1">Max Outage (h) <ArrowUpDown className="w-3 h-3 text-slate-500" /></div>
                </th>
                <th className="py-2.5 px-3 font-semibold cursor-pointer hover:text-slate-200" onClick={() => handleSort('commWindowsCount')}>
                  <div className="flex items-center gap-1">Comm Windows <ArrowUpDown className="w-3 h-3 text-slate-500" /></div>
                </th>
                <th className="py-2.5 px-3 font-semibold cursor-pointer hover:text-slate-200 text-slate-300" onClick={() => handleSort('overlapPct')}>
                  <div className="flex items-center gap-1"><Zap className="w-3 h-3 text-emerald-400" /> Overlap % <ArrowUpDown className="w-3 h-3 text-slate-500" /></div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-lunar-800/60">
              {sortedMetrics.map((m) => {
                const isBest = bestSite && bestSite.siteId === m.siteId;
                return (
                  <tr
                    key={m.siteId}
                    className={`font-mono transition-colors ${
                      isBest ? 'bg-emerald-950/20 font-medium' : 'hover:bg-lunar-850/40'
                    }`}
                  >
                    <td className="py-3 px-3 font-sans font-semibold text-slate-200 flex items-center gap-2">
                      {isBest && <Trophy className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                      <span>{m.siteName}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded font-bold ${
                        isBest ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-lunar-950 text-slate-200'
                      }`}>
                        {m.missionViabilityScore.toFixed(1)}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-amber-400 font-semibold">{m.sunlitFractionPct.toFixed(1)}%</td>
                    <td className="py-3 px-3 text-slate-300">{m.longestDarknessHours.toFixed(1)} h</td>
                    <td className="py-3 px-3">
                      {m.darkPeriodsOver48h > 0 ? (
                        <span className="text-amber-400 font-semibold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> {m.darkPeriodsOver48h}
                        </span>
                      ) : (
                        <span className="text-slate-500">0</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-cyan-400 font-semibold">{m.earthVisiblePct.toFixed(1)}%</td>
                    <td className="py-3 px-3 text-slate-300">{m.longestCommOutageHours.toFixed(1)} h</td>
                    <td className="py-3 px-3 text-slate-400">{m.commWindowsCount}</td>
                    <td className="py-3 px-3 text-emerald-400 font-semibold">{m.overlapPct.toFixed(1)}%</td>
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
