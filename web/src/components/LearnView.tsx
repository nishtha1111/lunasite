/**
 * Portions of this file were generated with AI assistance.
 * LunaSite Interactive Educational Guide & Technical Glossary.
 * Step-by-step walkthrough of lunar south polar lighting, comms, and terrain dynamics.
 */

import React, { useState } from 'react';
import { 
  BookOpen, 
  ChevronRight, 
  ChevronLeft, 
  Sun, 
  Radio, 
  Mountain, 
  RotateCw, 
  ShieldCheck, 
  Lightbulb
} from 'lucide-react';

interface GlossaryTerm {
  term: string;
  definition: string;
  category: 'astronomy' | 'telecom' | 'terrain';
}

const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: 'Azimuth',
    category: 'astronomy',
    definition: 'The horizontal compass bearing measured in degrees clockwise from local Lunar North (0° = North, 90° = East, 180° = South, 270° = West).'
  },
  {
    term: 'Elevation',
    category: 'astronomy',
    definition: 'The vertical angular distance of a celestial body above (+) or below (-) the local observer horizon. At the south pole, the Sun rarely exceeds 2° to 7°.'
  },
  {
    term: 'Direct-with-Earth (DWE)',
    category: 'telecom',
    definition: 'Direct line-of-sight radio communication from lunar surface antennas to NASA Deep Space Network (DSN) tracking stations on Earth without an orbital relay satellite.'
  },
  {
    term: 'Lunar Libration',
    category: 'astronomy',
    definition: 'The apparent periodic wobble of the Moon caused by its elliptical orbit (eccentricity 0.0549) and axial tilt. From the lunar poles, this causes the Earth to oscillate in an apparent 27.3-day loop.'
  },
  {
    term: 'Lunar Terminator',
    category: 'astronomy',
    definition: 'The moving boundary line between lunar day and night. At the south pole, rather than being a smooth line, topography fractures the terminator into high illuminated peaks and deep shadowed valleys.'
  },
  {
    term: 'Permanently Shadowed Region (PSR)',
    category: 'terrain',
    definition: 'Deep impact crater interiors and scarps that have not received sunlight for billions of years, remaining below 40 Kelvin (-233°C) and harboring accessible deposits of volatile water ice.'
  },
  {
    term: 'LOLA (Lunar Orbiter Laser Altimeter)',
    category: 'terrain',
    definition: 'Laser ranging payload aboard NASA Lunar Reconnaissance Orbiter (LRO) providing global digital elevation models (DEM) used by LunaSite for horizon ray-marching.'
  },
  {
    term: 'Topocentric Frame',
    category: 'astronomy',
    definition: 'A local coordinate frame centered directly at the surface landing site, measuring azimuth, elevation, and terrain masking from the viewpoint of the lunar lander.'
  }
];

interface WalkthroughStep {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  content: string;
  bulletPoints: string[];
  takeaway: string;
}

const WALKTHROUGH_STEPS: WalkthroughStep[] = [
  {
    title: '1. Why the Lunar South Pole?',
    subtitle: 'Artemis Exploration & Cryogenic Volatiles',
    icon: <Mountain className="w-5 h-5 text-amber-400" />,
    content:
      'Unlike the Apollo equatorial landing zones, the lunar south pole offers direct access to the Moon’s most vital resource: water ice trapped inside ancient, permanently shadowed crater basins. NASA’s Artemis campaign has designated candidate landing regions clustered within 6 degrees of the south pole to scout these deposits for life support and rocket propellant.',
    bulletPoints: [
      'Permanently Shadowed Regions (PSRs) maintain extreme cryogenic temperatures (< 40 Kelvin).',
      'Water ice deposits represent irreplaceable reservoirs for In-Situ Resource Utilization (ISRU).',
      'High crater rims provide prolonged periods of solar illumination dubbed "peaks of eternal light".'
    ],
    takeaway: 'Landing on high rims adjacent to deep cold traps gives missions both solar power and access to volatiles.'
  },
  {
    title: '2. The Grazing Sun Dilemma',
    subtitle: 'Why Flat Horizons Are Scientifically Invalid',
    icon: <Sun className="w-5 h-5 text-amber-400" />,
    content:
      'Because the Moon’s rotational axis is tilted only 1.54° relative to the ecliptic plane, the Sun never rises high into the polar sky. Over a 29.5-day synodic month, the Sun skims horizontally around the entire 360° horizon, typically staying between -2° and +6° in elevation.',
    bulletPoints: [
      'In equatorial regions, the Sun arcs straight overhead to +90° elevation.',
      'At the south pole, the maximum theoretical flat-horizon Sun elevation is bounded by (90 - |lat|) + 1.54°.',
      'A flat-horizon model fails completely because even a 200-meter hill miles away blocks the Sun entirely.'
    ],
    takeaway: 'Mission planners must use high-resolution topographic terrain models to predict true solar availability.'
  },
  {
    title: '3. Long Shadows & Knife-Edge Topography',
    subtitle: 'LOLA Digital Elevation Model Ray-Marching',
    icon: <Mountain className="w-5 h-5 text-cyan-400" />,
    content:
      'LunaSite precomputes true 360° terrain horizons by line-of-sight ray-marching through NASA’s Lunar Orbiter Laser Altimeter (LOLA) DEM out to 120 km radius, accounting for lunar spherical curvature (R = 1737.4 km).',
    bulletPoints: [
      'High crater rims (e.g., Shackleton, Malapert) act as giant natural shields that cast shadows over dozens of kilometers.',
      'Terrain masking cuts the nominal 50% flat-horizon illumination down to 33%–42% at surface level.',
      'Extended solar disc modeling (0.53° angular diameter) captures partial grazing sunlight as the Sun clears ridge crests.'
    ],
    takeaway: 'LOLA ray-marching accurately identifies solar windows and eliminates unexpected freezing darkness.'
  },
  {
    title: '4. The 27.3-Day Earth Libration Cycle',
    subtitle: 'Direct-with-Earth (DWE) Comm Windows',
    icon: <Radio className="w-5 h-5 text-cyan-400" />,
    content:
      'Because the Moon is tidally locked with orbital eccentricity and inclination, Earth undergoes an apparent orbital wobble (optical libration) in the polar sky over a 27.32-day sidereal cycle. Sites near the lunar limb experience predictable alternating ~14-day comm visibility and ~14-day outages.',
    bulletPoints: [
      'Direct-with-Earth (DWE) eliminates the need for expensive orbital relay satellites.',
      'When Earth dips below the local terrain horizon, high-bandwidth data downlink is cut off.',
      'Elevated sites like Nobile Rim 1 overlook downward-sloping terrain, unlocking up to 97% continuous DWE comms!'
    ],
    takeaway: 'Earth comm cycles are independent of solar cycles; planning requires finding the overlap between both.'
  },
  {
    title: '5. Mast Height Leverage',
    subtitle: '2.0 m Surface Lander vs 10.0 m Deployable Mast',
    icon: <RotateCw className="w-5 h-5 text-emerald-400" />,
    content:
      'At polar grazing angles, raising solar arrays from the lander deck (2m) to a deployable vertical mast (10m) drops the angular elevation of the local terrain horizon by 0.5° to 1.5° across multiple azimuths.',
    bulletPoints: [
      'At Peak Near Shackleton, a 10m mast lowers the mean horizon from +1.14° to +0.27°.',
      'Mast elevation can reduce maximum continuous freezing darkness by hundreds of hours.',
      'Deployable mast structures are a high-return architectural design choice for Artemis HLS landers.'
    ],
    takeaway: 'Vertical clearance provides disproportionate power benefits when the Sun is grazing the horizon.'
  },
  {
    title: '6. Explainable Mission Viability Scoring',
    subtitle: 'Balancing Power, Thermal Margins, and Telecom',
    icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
    content:
      'LunaSite evaluates landing sites using an explainable, open-formula Mission Viability Score (0 to 100) combining total sunlit fraction, darkness duration penalties, Earth DWE availability, and outage penalties.',
    bulletPoints: [
      'Rover missions prioritize continuous sunlight and short dark intervals to preserve battery heating.',
      'Crewed stays prioritize reliable DWE comm links and thermal margins during EVA activities.',
      'The Best-Window Finder scans multi-year datasets to pinpoint optimal 7-day or 14-day landing opportunities.'
    ],
    takeaway: 'Different mission architectures require tailored operational trade-offs—LunaSite makes them transparent.'
  }
];

export const LearnView: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [selectedGlossaryTerm, setSelectedGlossaryTerm] = useState<string | null>(null);

  const step = WALKTHROUGH_STEPS[activeStepIndex];

  const filteredGlossary = GLOSSARY_TERMS.filter((t) => {
    if (!searchFilter) return true;
    const q = searchFilter.toLowerCase();
    return t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* 1. Walkthrough Step Carousel */}
      <div className="bg-lunar-900/60 border border-lunar-800 rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Step Indicator Top Bar */}
        <div className="bg-lunar-950 border-b border-lunar-800/80 px-4 py-3 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {WALKTHROUGH_STEPS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStepIndex(idx)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 shrink-0 ${
                  idx === activeStepIndex
                    ? 'bg-amber-500 text-lunar-950 font-bold shadow-sm'
                    : 'bg-lunar-900/80 text-slate-400 hover:text-slate-200 border border-lunar-800'
                }`}
              >
                <span>Step {idx + 1}</span>
              </button>
            ))}
          </div>

          <div className="text-xs font-mono text-slate-500 shrink-0">
            {activeStepIndex + 1} of {WALKTHROUGH_STEPS.length}
          </div>
        </div>

        {/* Step Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 font-mono">
              {step.icon}
              <span>{step.subtitle}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
              {step.title}
            </h2>
          </div>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
            {step.content}
          </p>

          {/* Key Bullet Points */}
          <div className="bg-lunar-950/70 border border-lunar-800 rounded-xl p-4 sm:p-5 space-y-2.5">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              Key Scientific Observations:
            </h4>
            <ul className="space-y-2">
              {step.bulletPoints.map((pt, i) => (
                <li key={i} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0"></span>
                  <span className="leading-relaxed">{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Takeaway Callout */}
          <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-4 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-slate-200">
              <span className="font-bold text-emerald-400">Mission Planning Takeaway: </span>
              {step.takeaway}
            </div>
          </div>

          {/* Prev / Next Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-lunar-800/80">
            <button
              onClick={() => setActiveStepIndex(Math.max(0, activeStepIndex - 1))}
              disabled={activeStepIndex === 0}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeStepIndex === 0
                  ? 'opacity-40 cursor-not-allowed bg-lunar-950 text-slate-600'
                  : 'bg-lunar-800 text-slate-200 hover:bg-lunar-750'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Step</span>
            </button>

            <button
              onClick={() => setActiveStepIndex(Math.min(WALKTHROUGH_STEPS.length - 1, activeStepIndex + 1))}
              disabled={activeStepIndex === WALKTHROUGH_STEPS.length - 1}
              className={`px-5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeStepIndex === WALKTHROUGH_STEPS.length - 1
                  ? 'opacity-40 cursor-not-allowed bg-lunar-950 text-slate-600'
                  : 'bg-amber-500 text-lunar-950 font-bold hover:bg-amber-400 shadow-md shadow-amber-500/20'
              }`}
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* 2. Interactive Technical Glossary */}
      <div className="bg-lunar-900/60 border border-lunar-800 rounded-2xl p-6 sm:p-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-lunar-800/80 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Lunar South Pole Technical Glossary</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Definitions of astrodynamics, telecommunications, and topographic terms used in LunaSite.
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Filter terms (e.g. DWE, LOLA)..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-lunar-950 border border-lunar-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Glossary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGlossary.map((g) => {
            const isSelected = selectedGlossaryTerm === g.term;
            return (
              <div
                key={g.term}
                onClick={() => setSelectedGlossaryTerm(isSelected ? null : g.term)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-lunar-950 border-cyan-500/60 shadow-sm shadow-cyan-500/10'
                    : 'bg-lunar-950/40 border-lunar-800/80 hover:border-lunar-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-bold text-sm text-slate-100">{g.term}</span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase ${
                      g.category === 'astronomy'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : g.category === 'telecom'
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}
                  >
                    {g.category}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {g.definition}
                </p>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
