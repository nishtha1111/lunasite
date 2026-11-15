// Portions of this file were generated with SI assistance (see SI_USE.md)
/**
 * LunaSite Footer Component.
 */

import React from 'react';
import { ShieldAlert, Database, Cpu, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-lunar-800 bg-lunar-950 py-6 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Left: Credits & Sources */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-slate-300 font-semibold">
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <span>NASA Planetary Data System & NAIF SPICE Ephemeris</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Topographic horizon modeling from Lunar Reconnaissance Orbiter (LRO) LOLA polar data products via NASA PDS Geosciences Node. Celestial ephemerides calculated via NAIF SPICE DE440s kernels in the MOON_ME frame.
          </p>
        </div>

        {/* Right: Disclaimer & AI Disclosure */}
        <div className="space-y-1 md:text-right shrink-0">
          <div className="flex items-center md:justify-end gap-3 font-mono text-[11px]">
            <a 
              href="https://github.com/nishtha1111/lunasite" 
              target="_blank" 
              rel="noreferrer" 
              className="text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
            >
              <span>GitHub Repo</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-lunar-700">•</span>
            <a
              href="https://github.com/nishtha1111/lunasite/blob/main/SI_USE.md"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400/90 hover:text-emerald-300 flex items-center gap-1 transition-colors"
            >
              <Cpu className="w-3 h-3" />
              <span>Built with SI assistance (see SI_USE.md)</span>
            </a>
          </div>
          <p className="text-[10px] text-slate-400 flex items-center md:justify-end gap-1">
            <ShieldAlert className="w-3 h-3 text-amber-500 shrink-0" />
            <span>Approximate / For mission planning exploration only; not flight-certified. No endorsement implied.</span>
          </p>
        </div>

      </div>
    </footer>
  );
};
