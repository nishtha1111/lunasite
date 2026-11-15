# LunaSite Data Sources, Software Credits & Production Bundle Report

### 1. Primary Datasets & Ephemeris Kernels
- **NASA LRO LOLA Topography**: `LDEM_75S_240M.IMG` (Lunar Orbiter Laser Altimeter 240 m/pixel south polar gridded DEM, polar stereographic projection, 75°S–90°S).
  - *Source*: NASA Planetary Data System (PDS) Geosciences Node / Washington University in St. Louis.
  - *URL*: `https://pds-geosciences.wustl.edu/lro/lro-l-lola-3-rdr-v1/lrolol_1xxx/data/lola_gdr/polar/img/`
  - *License*: NASA Open Data Policy (US Government Public Domain).
- **NASA NAIF SPICE Planetary Ephemeris**: `de440s.bsp` (JPL planetary and lunar ephemeris DE440 short, span 1900–2050).
  - *Source*: NASA Navigation and Ancillary Information Facility (NAIF) / Jet Propulsion Laboratory.
  - *URL*: `https://naif.jpl.nasa.gov/pub/naif/generic_kernels/spk/planets/de440s.bsp`
  - *License*: NASA Open Data Policy (Public Domain).
- **NASA NAIF SPICE Lunar Frame & PCK Kernels**:
  - `moon_080317.tf`: High-precision lunar topocentric reference frame kernel (`https://naif.jpl.nasa.gov/pub/naif/generic_kernels/fk/satellites/moon_080317.tf`).
  - `moon_pa_de421_1900-2050.bpc`: High-accuracy lunar orientation binary PCK in Principal Axes frame (`https://naif.jpl.nasa.gov/pub/naif/generic_kernels/pck/moon_pa_de421_1900-2050.bpc`).
  - `naif0012.tls` & `pck00010.tpc`: Leapseconds kernel and physical constants kernel.
  - *License*: Public Domain.
- **Artemis III Candidate Landing Regions**:
  - *Source*: NASA Press Release 22-088 (August 19, 2022).
  - *URL*: `https://www.nasa.gov/news-release/nasa-identifies-candidate-regions-for-landing-next-americans-on-moon/`
  - *Cartographic Atlas*: LPI/USRA Lunar South Pole Atlas (`https://www.lpi.usra.edu/lunar/lunar-south-pole-atlas/`).

### 2. Software Libraries & Licenses
- **Frontend Web Application**:
  - `React` (v18.3.1, MIT License, https://react.dev/)
  - `React DOM` (v18.3.1, MIT License, https://react.dev/)
  - `Vite` (v5.4.10, MIT License, https://vite.dev/)
  - `TypeScript` (v5.6.3, Apache 2.0 License, https://www.typescriptlang.org/)
  - `Tailwind CSS` (v3.4.14, MIT License, https://tailwindcss.com/)
  - `Lucide React` (v1.16.0, ISC License, https://lucide.dev/)
  - `Vitest` (v2.1.4, MIT License, https://vitest.dev/)
  - `clsx` (v2.1.1, MIT) & `tailwind-merge` (v2.5.4, MIT)
- **Offline Ephemeris & Ray-Marching Pipeline**:
  - `Python` (v3.12, PSF License)
  - `SpiceyPy` (v6.0.0, MIT License, https://github.com/AndrewAnnex/SpiceyPy)
  - `NumPy` (v2.1.3, BSD 3-Clause, https://numpy.org/)
  - `SciPy` (v1.14.1, BSD 3-Clause, https://scipy.org/)
  - `Astropy` (v6.1.6, BSD 3-Clause, https://www.astropy.org/)

### 3. Production Bundle & Performance Report
- **Total Static Data Size**: **4.07 MB** across all 6 candidate landing sites for 5 full years (87,648 epochs at 30-minute intervals).
- **Gzipped JavaScript**: **72.04 kB** (`web/dist/assets/index-LnYlJn1z.js`, 246.32 kB raw).
- **Gzipped Stylesheet**: **5.29 kB** (`web/dist/assets/index-Bdouaf7Y.css`, 27.07 kB raw).
- **Initial Page Weight**: **< 100 kB** gzipped code before lazy-loading per-site binary chunks (684 kB per site).
- **Automated Unit Tests**: **10 passed / 0 failed** (Vitest test runner).
- **Lighthouse Performance Audit**: Performance: 98/100, Accessibility: 100/100, Best Practices: 100/100, SEO: 100/100.
