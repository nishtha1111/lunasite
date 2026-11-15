// Portions of this file were generated with SI assistance (see SI_USE.md)
/**
 * Portions of this file were generated with AI assistance.
 * LunaSite Best Mission Window Finder.
 * Scans candidate landing dates for optimal duration (7, 14, 30 days) based on solar & comm viability.
 */

import React, { useState, useMemo } from 'react';
import { LoadedSiteData } from '../data/loader';
import { DateRange, ViabilityWeights, ObserverHeight, BestWindow } from '../types';
import { computeSiteMetrics } from '../metrics/engine';
import { 
  Sparkles, 
  Calendar, 
  ArrowRight, 
  Trophy, 
  Sun, 
  Radio 
} from 'lucide-react';

interface BestWindowFinderProps {
  sitesData: LoadedSiteData[];
  selectedSiteId: string;
  onSelectSiteId: (siteId: string) => void;
  weights: ViabilityWeights;
  observerHeight: ObserverHeight;
  onApplyWindow: (range: DateRange) => void;
}

export const BestWindowFinder: React.FC<BestWindowFinderProps> = ({
  sitesData,
  selectedSiteId,
  onSelectSiteId,
  weights,
  observerHeight,
  onApplyWindow
}) => {
  const [durationDays, setDurationDays] = useState<number>(7);

  const currentSite = useMemo(() => {
    return sitesData.find((s) => s.meta.id === selectedSiteId) || sitesData[0] || null;
  }, [sitesData, selectedSiteId]);

  // Compute top 5 best windows for the current site across the entire loaded dataset
  const topWindows = useMemo<BestWindow[]>(() => {
    if (!currentSite) return [];

    const stepsPerDay = 48; // 30-min steps
    const windowSteps = durationDays * stepsPerDay;
    const totalSteps = currentSite.numSteps;

    if (totalSteps <= windowSteps) return [];

    const horizon = observerHeight === '10m'
      ? (currentSite.meta.horizon_profile_mast || currentSite.meta.horizon_profile_default || null)
      : (currentSite.meta.horizon_profile_default || null);

    // Stride to make the scan instantaneous: check every 12 hours (24 steps)
    const scanStride = 24;
    const candidates: { startIndex: number; score: number }[] = [];

    for (let start = 0; start <= totalSteps - windowSteps; start += scanStride) {
      const end = start + windowSteps - 1;
      const sElSlice = currentSite.sunElevations.subarray(start, end + 1);
      const sAzSlice = currentSite.sunAzimuths.subarray(start, end + 1);
      const eElSlice = currentSite.earthElevations.subarray(start, end + 1);
      const eAzSlice = currentSite.earthAzimuths.subarray(start, end + 1);

      const m = computeSiteMetrics(
        currentSite.meta.id,
        currentSite.meta.name,
        sElSlice,
        sAzSlice,
        eElSlice,
        eAzSlice,
        horizon,
        weights,
        0.5
      );

      candidates.push({ startIndex: start, score: m.missionViabilityScore });
    }

    // Sort candidates descending by score
    candidates.sort((a, b) => b.score - a.score);

    // Pick top non-overlapping or separated windows (separated by at least 14 days)
    const picked: { startIndex: number; score: number }[] = [];
    const minDistanceSteps = 14 * stepsPerDay;

    for (const cand of candidates) {
      const tooClose = picked.some((p) => Math.abs(p.startIndex - cand.startIndex) < minDistanceSteps);
      if (!tooClose) {
        picked.push(cand);
        if (picked.length >= 5) break;
      }
    }

    // Convert picked candidates into full BestWindow records
    return picked.map((p, idx) => {
      const start = p.startIndex;
      const end = start + windowSteps - 1;
      const sElSlice = currentSite.sunElevations.subarray(start, end + 1);
      const sAzSlice = currentSite.sunAzimuths.subarray(start, end + 1);
      const eElSlice = currentSite.earthElevations.subarray(start, end + 1);
      const eAzSlice = currentSite.earthAzimuths.subarray(start, end + 1);

      const m = computeSiteMetrics(
        currentSite.meta.id,
        currentSite.meta.name,
        sElSlice,
        sAzSlice,
        eElSlice,
        eAzSlice,
        horizon,
        weights,
        0.5
      );

      const startMs = currentSite.startMs + start * currentSite.stepMs;
      const endMs = currentSite.startMs + end * currentSite.stepMs;
      const startDate = new Date(startMs).toISOString().substring(0, 10);
      const endDate = new Date(endMs).toISOString().substring(0, 10);

      // Generate explainable reason
      let reason = '';
      if (m.sunlitFractionPct > 80 && m.earthVisiblePct > 80) {
        reason = 'High solar illumination (>80%) synchronized with continuous Direct-with-Earth line-of-sight.';
      } else if (m.longestDarknessHours < 12) {
        reason = `Minimal freezing darkness (longest dark period only ${m.longestDarknessHours}h) protecting lander battery reserves.`;
      } else if (m.earthVisiblePct > 90) {
        reason = `Near-continuous DWE telemetry (${m.earthVisiblePct}%) with strong direct-to-Earth link margin.`;
      } else {
        reason = `Optimal balanced trade-off between solar power (${m.sunlitFractionPct}%) and comm window availability.`;
      }

      return {
        rank: idx + 1,
        startIndex: start,
        endIndex: end,
        startDate,
        endDate,
        score: m.missionViabilityScore,
        sunlitFractionPct: m.sunlitFractionPct,
        longestDarknessHours: m.longestDarknessHours,
        earthVisiblePct: m.earthVisiblePct,
        longestCommOutageHours: m.longestCommOutageHours,
        overlapPct: m.overlapPct,
        summaryReason: reason
      };
    });
  }, [currentSite, durationDays, observerHeight, weights]);

  return (
    <div className="bg-lunar-900/60 border border-lunar-800 rounded-xl p-4 sm:p-5 space-y-5">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-lunar-800/80 pb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Optimal Mission Window Finder</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Rank highest-viability launch and landing intervals for candidate durations across 2026–2030.
          </p>
        </div>

        {/* Site & Duration Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Site Selector */}
          <select
            value={selectedSiteId}
            onChange={(e) => onSelectSiteId(e.target.value)}
            className="bg-lunar-950 border border-lunar-750 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 font-medium focus:border-amber-500 focus:outline-none"
          >
            {sitesData.map((s) => (
              <option key={s.meta.id} value={s.meta.id}>
                {s.meta.name}
              </option>
            ))}
          </select>

          {/* Mission Duration Pills */}
          <div className="flex items-center bg-lunar-950 border border-lunar-800 rounded-lg p-0.5 text-xs font-mono">
            {[
              { days: 7, label: '7 Days (Crewed)' },
              { days: 14, label: '14 Days (Lander)' },
              { days: 30, label: '30 Days (Rover)' }
            ].map((d) => (
              <button
                key={d.days}
                onClick={() => setDurationDays(d.days)}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  durationDays === d.days
                    ? 'bg-amber-500 text-lunar-950 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top 5 Ranked Cards */}
      <div className="space-y-3">
        {topWindows.map((w) => (
          <div
            key={w.rank}
            className={`p-3.5 rounded-lg border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              w.rank === 1
                ? 'bg-gradient-to-r from-amber-500/10 via-lunar-950/80 to-lunar-950 border-amber-500/40 shadow-sm shadow-amber-500/10'
                : 'bg-lunar-950/50 border-lunar-800 hover:border-lunar-700'
            }`}
          >
            {/* Rank badge & Dates */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                    w.rank === 1
                      ? 'bg-amber-500 text-lunar-950'
                      : 'bg-lunar-800 text-slate-300'
                  }`}
                >
                  #{w.rank}
                </span>
                <span className="font-mono text-xs font-semibold text-slate-100 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  {w.startDate} → {w.endDate}
                  <span className="text-slate-500 font-sans font-normal">({durationDays} days)</span>
                </span>
                {w.rank === 1 && (
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Trophy className="w-3 h-3" /> Recommended
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                {w.summaryReason}
              </p>
            </div>

            {/* Metrics Chips & Apply Button */}
            <div className="flex items-center gap-4 shrink-0">
              
              {/* Score pill */}
              <div className="text-right">
                <div className="text-[10px] font-mono text-slate-500 uppercase">Viability</div>
                <div className="text-base font-black font-mono text-amber-400">
                  {w.score}<span className="text-xs text-slate-500">/100</span>
                </div>
              </div>

              {/* Stat breakdown */}
              <div className="hidden sm:grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] font-mono text-slate-300 border-l border-lunar-800 pl-3">
                <span className="flex items-center gap-1">
                  <Sun className="w-3 h-3 text-amber-400" />
                  {w.sunlitFractionPct}% sun
                </span>
                <span className="flex items-center gap-1">
                  <Radio className="w-3 h-3 text-cyan-400" />
                  {w.earthVisiblePct}% DWE
                </span>
                <span className="text-slate-400 text-[10px]">
                  Dark: {w.longestDarknessHours}h max
                </span>
                <span className="text-slate-400 text-[10px]">
                  Outage: {w.longestCommOutageHours}h max
                </span>
              </div>

              {/* Apply Button */}
              <button
                onClick={() => onApplyWindow({ startDate: w.startDate, endDate: w.endDate })}
                className="bg-amber-500 hover:bg-amber-400 text-lunar-950 font-semibold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-sm shadow-amber-500/20"
              >
                <span>Apply</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
