import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { computeSiteMetrics, MISSION_PRESETS } from '../metrics/engine';

const GIT_COMMIT = 'ad71914902d186c3d11bcebc03ecbb5c0f6f8907';
const DATA_BUILD_DATE = '2026-11-14';
const COORDINATE_SOURCE_URL = 'https://www.nasa.gov/news-release/nasa-identifies-candidate-regions-for-landing-next-americans-on-moon/';

const DATA_DIR = path.resolve(__dirname, '../../public/data');
const OUT_DIR = path.resolve(__dirname, '../../../submission/deck_assets');

const SITES = [
  { id: 'shackleton_peak', name: 'Peak Near Shackleton', lat: -88.81, lon: 124.68 },
  { id: 'connecting_ridge', name: 'Connecting Ridge', lat: -89.45, lon: -136.00 },
  { id: 'malapert_massif', name: 'Malapert Massif', lat: -86.00, lon: 2.70 },
  { id: 'faustini_rim_a', name: 'Faustini Rim A', lat: -87.89, lon: 90.00 },
  { id: 'de_gerlache_rim_1', name: 'de Gerlache Rim 1', lat: -88.50, lon: -68.00 },
  { id: 'nobile_rim_1', name: 'Nobile Rim 1', lat: -85.30, lon: 31.50 }
];

const CONFIGS = [
  { key: '2m', label: '2 m (Lander Deck)', horizonProp: 'horizon_profile_default' },
  { key: '10m', label: '10 m (Deployable Mast)', horizonProp: 'horizon_profile_mast' },
  { key: 'flat', label: 'Flat Horizon (0° Baseline)', horizonProp: null }
];

describe('Generate Deck Assets Final Metrics', () => {
  it('generates final_metrics.json and final_metrics.csv for all 6 MVP sites across 2026-2030', () => {
    fs.mkdirSync(OUT_DIR, { recursive: true });
    const allRecords: any[] = [];

    for (const site of SITES) {
      const metaPath = path.join(DATA_DIR, `${site.id}.json`);
      const binPath = path.join(DATA_DIR, `${site.id}.bin`);

      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
      const buf = fs.readFileSync(binPath);
      const numSteps = meta.num_steps || 87648;

      const sunAz = new Float32Array(numSteps);
      const sunEl = new Float32Array(numSteps);
      const earthAz = new Float32Array(numSteps);
      const earthEl = new Float32Array(numSteps);

      for (let i = 0; i < numSteps; i++) {
        const offset = i * 8;
        sunAz[i] = buf.readUInt16LE(offset) / 100.0;
        sunEl[i] = buf.readInt16LE(offset + 2) / 100.0;
        earthAz[i] = buf.readUInt16LE(offset + 4) / 100.0;
        earthEl[i] = buf.readInt16LE(offset + 6) / 100.0;
      }

      for (const cfg of CONFIGS) {
        let horizon: number[] | null = null;
        if (cfg.horizonProp) {
          horizon = meta[cfg.horizonProp] || null;
        }

        // Base metrics
        const baseMetrics = computeSiteMetrics(
          site.id,
          site.name,
          sunEl,
          sunAz,
          earthEl,
          earthAz,
          horizon,
          MISSION_PRESETS.lander.weights,
          0.5
        );

        // Preset scores
        const scoreRover = computeSiteMetrics(
          site.id,
          site.name,
          sunEl,
          sunAz,
          earthEl,
          earthAz,
          horizon,
          MISSION_PRESETS.rover.weights,
          0.5
        ).missionViabilityScore;

        const scoreLander = baseMetrics.missionViabilityScore;

        const scoreCrewed = computeSiteMetrics(
          site.id,
          site.name,
          sunEl,
          sunAz,
          earthEl,
          earthAz,
          horizon,
          MISSION_PRESETS.crewed.weights,
          0.5
        ).missionViabilityScore;

        const scoreEducation = computeSiteMetrics(
          site.id,
          site.name,
          sunEl,
          sunAz,
          earthEl,
          earthAz,
          horizon,
          MISSION_PRESETS.education.weights,
          0.5
        ).missionViabilityScore;

        allRecords.push({
          site_id: site.id,
          site_name: site.name,
          latitude_deg: site.lat,
          longitude_deg: site.lon,
          coordinate_source_url: COORDINATE_SOURCE_URL,
          observer_height: cfg.label,
          sunlit_fraction_pct: baseMetrics.sunlitFractionPct,
          longest_darkness_hours: baseMetrics.longestDarknessHours,
          dark_periods_over_48h: baseMetrics.darkPeriodsOver48h,
          earth_visible_dwe_pct: baseMetrics.earthVisiblePct,
          longest_comm_outage_hours: baseMetrics.longestCommOutageHours,
          power_comms_overlap_pct: baseMetrics.overlapPct,
          viability_score_rover: scoreRover,
          viability_score_lander: scoreLander,
          viability_score_crewed: scoreCrewed,
          viability_score_education: scoreEducation
        });
      }
    }

    expect(allRecords.length).toBe(18); // 6 sites * 3 configs

    // Construct JSON output
    const jsonOutput = {
      metadata: {
        project: 'LunaSite',
        challenge: 'NASA Space Apps Challenge 2026',
        git_commit_hash: GIT_COMMIT,
        data_build_date: DATA_BUILD_DATE,
        ephemeris_range_utc: {
          start: '2026-01-01T00:00:00Z',
          end: '2030-12-31T23:30:00Z',
          total_epochs: 87648,
          time_step_minutes: 30
        },
        sources: {
          ephemeris: 'NASA NAIF SPICE (de440s, moon_080317.tf, moon_pa_de421_1900-2050.bpc)',
          dem: 'NASA LRO LOLA LDEM_75S_240M via PDS Geosciences Node',
          coordinates: COORDINATE_SOURCE_URL
        }
      },
      results: allRecords
    };

    const jsonFilePath = path.join(OUT_DIR, 'final_metrics.json');
    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonOutput, null, 2), 'utf8');

    // Construct CSV output
    const csvHeaders = [
      'site_id',
      'site_name',
      'latitude_deg',
      'longitude_deg',
      'observer_height',
      'sunlit_fraction_pct',
      'longest_darkness_hours',
      'dark_periods_over_48h',
      'earth_visible_dwe_pct',
      'longest_comm_outage_hours',
      'power_comms_overlap_pct',
      'viability_score_rover',
      'viability_score_lander',
      'viability_score_crewed',
      'viability_score_education',
      'coordinate_source_url'
    ];

    const csvRows = [
      csvHeaders.join(','),
      ...allRecords.map(r => [
        r.site_id,
        `"${r.site_name}"`,
        r.latitude_deg,
        r.longitude_deg,
        `"${r.observer_height}"`,
        r.sunlit_fraction_pct,
        r.longest_darkness_hours,
        r.dark_periods_over_48h,
        r.earth_visible_dwe_pct,
        r.longest_comm_outage_hours,
        r.power_comms_overlap_pct,
        r.viability_score_rover,
        r.viability_score_lander,
        r.viability_score_crewed,
        r.viability_score_education,
        `"${r.coordinate_source_url}"`
      ].join(','))
    ];

    const csvFilePath = path.join(OUT_DIR, 'final_metrics.csv');
    fs.writeFileSync(csvFilePath, csvRows.join('\n'), 'utf8');

    expect(fs.existsSync(jsonFilePath)).toBe(true);
    expect(fs.existsSync(csvFilePath)).toBe(true);
  });
});
