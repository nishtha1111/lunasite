/**
 * Portions of this file were generated with AI assistance.
 * Type definitions for LunaSite lunar south pole mission planning.
 */

export interface SiteMetadata {
  id: string;
  name: string;
  region: string;
  lat_deg: number;
  lon_deg: number;
  elev_m: number;
  status: 'verified' | 'approximate';
  description: string;
  start_utc: string;
  end_utc: string;
  step_seconds: number;
  num_steps: number;
  bytes_per_step: number;
  format: string;
  binary_file: string;
  horizon_profile_default: number[];
  horizon_profile_mast?: number[];
  max_flat_sun_elevation_bound: number;
  actual_max_sun_elevation: number;
  baseline_flat_stats: {
    sunlit_fraction_pct: number;
    earth_visible_pct: number;
    power_comm_overlap_pct: number;
  };
  ai_use: string;
}

export interface SiteManifestEntry {
  id: string;
  name: string;
  region: string;
  lat_deg: number;
  lon_deg: number;
  elev_m: number;
  status: 'verified' | 'approximate';
  dataFile: string;
  metaFile: string;
}

export interface Manifest {
  source: string;
  disclaimer: string;
  ephemeris_engine: string;
  start_utc: string;
  end_utc: string;
  step_seconds: number;
  num_steps: number;
  sites: SiteManifestEntry[];
  ai_use: string;
}

export interface EphemerisStep {
  epochIndex: number;
  timestampMs: number;
  sunAzimuthDeg: number;
  sunElevationDeg: number;
  earthAzimuthDeg: number;
  earthElevationDeg: number;
  sunVisible: boolean;
  sunFraction: number; // 0.0 to 1.0 (disc model)
  earthVisible: boolean;
  overlap: boolean;
}

export interface SiteMetrics {
  siteId: string;
  siteName: string;
  sunlitFractionPct: number;
  longestDarknessHours: number;
  darkPeriodsOver48h: number;
  longestSunlightHours: number;
  earthVisiblePct: number;
  longestCommOutageHours: number;
  commWindowsCount: number;
  overlapPct: number;
  missionViabilityScore: number;
  scoreBreakdown: {
    sunlitComponent: number;
    darknessPenalty: number;
    dweComponent: number;
    outagePenalty: number;
  };
}

export interface ViabilityWeights {
  sunlit: number;       // w1 (weight on solar power availability)
  minDarkness: number;  // w2 (weight on minimizing continuous freezing dark)
  dwe: number;          // w3 (weight on direct-with-Earth comm window)
  minOutage: number;    // w4 (weight on minimizing communication loss duration)
}

export type MissionPreset = 'rover' | 'lander' | 'crewed' | 'education';

export interface DateRange {
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
}

export type ActiveView = 'compare' | 'horizon' | 'learn';

export type ObserverHeight = '2m' | '10m';

export interface BestWindow {
  rank: number;
  startIndex: number;
  endIndex: number;
  startDate: string;
  endDate: string;
  score: number;
  sunlitFractionPct: number;
  longestDarknessHours: number;
  earthVisiblePct: number;
  longestCommOutageHours: number;
  overlapPct: number;
  summaryReason: string;
}

