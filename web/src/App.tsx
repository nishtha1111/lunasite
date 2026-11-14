/**
 * Portions of this file were generated with AI assistance.
 * LunaSite Main Application Component.
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Manifest, 
  DateRange, 
  ActiveView, 
  MissionPreset, 
  ViabilityWeights, 
  SiteMetrics,
  ObserverHeight 
} from './types';
import { 
  fetchManifest, 
  loadSiteData, 
  getDateRangeIndices, 
  LoadedSiteData 
} from './data/loader';
import { 
  computeSiteMetrics, 
  MISSION_PRESETS 
} from './metrics/engine';
import { Header } from './components/Header';
import { ControlPanel } from './components/ControlPanel';
import { CompareView } from './components/CompareView';
import { HorizonView } from './components/HorizonView';
import { BestWindowFinder } from './components/BestWindowFinder';
import { LearnView } from './components/LearnView';
import { InsightCard } from './components/InsightCard';
import { Footer } from './components/Footer';
import { Loader2, AlertCircle } from 'lucide-react';

export const App: React.FC = () => {
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [selectedSiteIds, setSelectedSiteIds] = useState<string[]>([
    'shackleton_peak',
    'connecting_ridge',
    'malapert_massif'
  ]);
  const [focusedSiteId, setFocusedSiteId] = useState<string>('shackleton_peak');
  const [observerHeight, setObserverHeight] = useState<ObserverHeight>('2m');
  
  // Date range defaults to "Next 30 days" starting today (2026-11-14 to 2026-12-14)
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: '2026-11-14',
    endDate: '2026-12-14'
  });

  const [activeView, setActiveView] = useState<ActiveView>('compare');
  const [activePreset, setActivePreset] = useState<MissionPreset>('crewed');
  const [weights, setWeights] = useState<ViabilityWeights>(MISSION_PRESETS.crewed.weights);

  const [loadedSites, setLoadedSites] = useState<LoadedSiteData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [shareCopied, setShareCopied] = useState<boolean>(false);

  // Sync preset change with weights
  const handlePresetChange = (preset: MissionPreset) => {
    setActivePreset(preset);
    setWeights(MISSION_PRESETS[preset].weights);
  };

  // Toggle site selection (2 to 4 sites)
  const handleToggleSite = (siteId: string) => {
    if (selectedSiteIds.includes(siteId)) {
      if (selectedSiteIds.length <= 2) {
        alert('Please keep at least 2 sites selected for comparison.');
        return;
      }
      setSelectedSiteIds(selectedSiteIds.filter((id) => id !== siteId));
      if (focusedSiteId === siteId) {
        const remaining = selectedSiteIds.filter((id) => id !== siteId);
        setFocusedSiteId(remaining[0] || '');
      }
    } else {
      if (selectedSiteIds.length >= 4) {
        alert('You can compare up to 4 candidate sites at once.');
        return;
      }
      setSelectedSiteIds([...selectedSiteIds, siteId]);
      setFocusedSiteId(siteId);
    }
  };

  // Parse URL hash on mount
  useEffect(() => {
    try {
      const hash = window.location.hash.substring(1);
      if (hash) {
        const params = new URLSearchParams(hash);
        const sitesParam = params.get('sites');
        const startParam = params.get('start');
        const endParam = params.get('end');
        const presetParam = params.get('preset') as MissionPreset | null;
        const viewParam = params.get('view') as ActiveView | null;

        if (sitesParam) {
          const list = sitesParam.split(',').filter(Boolean);
          if (list.length >= 2) setSelectedSiteIds(list);
        }
        if (startParam && endParam) {
          setDateRange({ startDate: startParam, endDate: endParam });
        }
        if (presetParam && MISSION_PRESETS[presetParam]) {
          setActivePreset(presetParam);
          setWeights(MISSION_PRESETS[presetParam].weights);
        }
        if (viewParam && ['compare', 'horizon', 'learn'].includes(viewParam)) {
          setActiveView(viewParam);
        }
      }
    } catch (e) {
      console.warn('Could not parse URL hash state:', e);
    }
  }, []);

  // Update URL hash on state change
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('sites', selectedSiteIds.join(','));
    params.set('start', dateRange.startDate);
    params.set('end', dateRange.endDate);
    params.set('preset', activePreset);
    params.set('view', activeView);
    window.history.replaceState(null, '', `#${params.toString()}`);
  }, [selectedSiteIds, dateRange, activePreset, activeView]);

  // Load manifest & site data
  useEffect(() => {
    let isCancelled = false;

    async function init() {
      try {
        setIsLoading(true);
        setError(null);
        const mf = await fetchManifest();
        if (isCancelled) return;
        setManifest(mf);

        // Fetch selected site binary buffers
        const dataPromises = selectedSiteIds.map((id) => loadSiteData(id));
        const sites = await Promise.all(dataPromises);
        if (isCancelled) return;
        setLoadedSites(sites);
      } catch (err: any) {
        if (!isCancelled) {
          console.error('Failed to load data:', err);
          setError(err.message || 'Error loading mission ephemeris data.');
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    init();
    return () => {
      isCancelled = true;
    };
  }, [selectedSiteIds]);

  // Compute slice indices for the selected date range
  const { startIndex, endIndex } = useMemo(() => {
    if (loadedSites.length === 0) return { startIndex: 0, endIndex: 0 };
    return getDateRangeIndices(loadedSites[0], dateRange.startDate, dateRange.endDate);
  }, [loadedSites, dateRange]);

  // Compute live browser metrics for all selected sites
  const metricsList: SiteMetrics[] = useMemo(() => {
    return loadedSites.map((sd) => {
      const sElSlice = sd.sunElevations.subarray(startIndex, endIndex + 1);
      const sAzSlice = sd.sunAzimuths.subarray(startIndex, endIndex + 1);
      const eElSlice = sd.earthElevations.subarray(startIndex, endIndex + 1);
      const eAzSlice = sd.earthAzimuths.subarray(startIndex, endIndex + 1);

      const horizon = observerHeight === '10m'
        ? (sd.meta.horizon_profile_mast || sd.meta.horizon_profile_default || null)
        : (sd.meta.horizon_profile_default || null);

      return computeSiteMetrics(
        sd.meta.id,
        sd.meta.name,
        sElSlice,
        sAzSlice,
        eElSlice,
        eAzSlice,
        horizon,
        weights,
        0.5
      );
    });
  }, [loadedSites, startIndex, endIndex, weights, observerHeight]);

  // Focused site data for the insight card
  const focusedSiteData = useMemo(() => {
    return loadedSites.find((s) => s.meta.id === focusedSiteId) || loadedSites[0] || null;
  }, [loadedSites, focusedSiteId]);

  const focusedMetrics = useMemo(() => {
    return metricsList.find((m) => m.siteId === (focusedSiteData?.meta.id || '')) || metricsList[0] || null;
  }, [metricsList, focusedSiteData]);

  // Share handler
  const handleShare = useCallback(() => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  }, []);

  // CSV Export handler
  const handleExportCsv = useCallback(() => {
    if (metricsList.length === 0) return;

    const headers = [
      'Site ID',
      'Site Name',
      'Evaluation Start',
      'Evaluation End',
      'Mission Viability Score (0-100)',
      'Sunlit Fraction (%)',
      'Max Continuous Darkness (h)',
      'Dark Periods > 48h',
      'Max Continuous Sunlight (h)',
      'Earth Visible DWE (%)',
      'Max Comm Outage (h)',
      'Comm Windows Count',
      'Power + Comm Overlap (%)'
    ];

    const rows = metricsList.map((m) => [
      `"${m.siteId}"`,
      `"${m.siteName}"`,
      `"${dateRange.startDate}"`,
      `"${dateRange.endDate}"`,
      m.missionViabilityScore,
      m.sunlitFractionPct,
      m.longestDarknessHours,
      m.darkPeriodsOver48h,
      m.longestSunlightHours,
      m.earthVisiblePct,
      m.longestCommOutageHours,
      m.commWindowsCount,
      m.overlapPct
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `lunasite_metrics_${dateRange.startDate}_${dateRange.endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [metricsList, dateRange]);

  return (
    <div className="min-h-screen flex flex-col bg-lunar-950 text-slate-100">
      
      {/* App Header */}
      <Header
        activeView={activeView}
        onViewChange={setActiveView}
        preset={activePreset}
        onPresetChange={handlePresetChange}
        onShare={handleShare}
        onExportCsv={handleExportCsv}
        shareCopied={shareCopied}
      />

      {/* Main 3-Column Layout */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto">
        
        {/* Left Control Panel */}
        <ControlPanel
          availableSites={manifest?.sites || []}
          selectedSiteIds={selectedSiteIds}
          onToggleSite={handleToggleSite}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          weights={weights}
          onWeightsChange={setWeights}
          activePreset={activePreset}
          onPresetChange={handlePresetChange}
          observerHeight={observerHeight}
          onObserverHeightChange={setObserverHeight}
        />

        {/* Center Main Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {isLoading ? (
            <div className="h-96 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
              <p className="font-mono text-xs">Streaming compact lunar ephemeris binary buffers...</p>
            </div>
          ) : error ? (
            <div className="bg-red-950/40 border border-red-800 rounded-xl p-6 text-red-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm">Failed to Load Ephemeris Data</h4>
                <p className="text-xs text-red-300 mt-1">{error}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {activeView === 'compare' && (
                <>
                  <CompareView
                    sitesData={loadedSites}
                    metricsList={metricsList}
                    dateRange={dateRange}
                    startIndex={startIndex}
                    endIndex={endIndex}
                    observerHeight={observerHeight}
                  />

                  <BestWindowFinder
                    sitesData={loadedSites}
                    selectedSiteId={focusedSiteId}
                    onSelectSiteId={setFocusedSiteId}
                    weights={weights}
                    observerHeight={observerHeight}
                    onApplyWindow={(newRange) => setDateRange(newRange)}
                  />
                </>
              )}

              {activeView === 'horizon' && (
                <HorizonView
                  sitesData={loadedSites}
                  selectedSiteId={focusedSiteId}
                  onSelectSiteId={setFocusedSiteId}
                  startIndex={startIndex}
                  endIndex={endIndex}
                  observerHeight={observerHeight}
                  onObserverHeightChange={setObserverHeight}
                />
              )}

              {activeView === 'learn' && (
                <LearnView />
              )}
            </div>
          )}
        </main>

        {/* Right Insight Panel */}
        <InsightCard
          activeSiteMeta={focusedSiteData?.meta || null}
          activeMetrics={focusedMetrics}
        />

      </div>

      {/* App Footer */}
      <Footer />

    </div>
  );
};
