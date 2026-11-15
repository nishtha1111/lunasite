# NASA Space Apps Challenge 2026: Project Data & Tool Inventory

**Project**: LunaSite  
**Challenge**: Visualizing Sun & Earth Positions at Lunar South Pole  
**File**: `submission/data_links.md`  

---

## A) NASA DATA / RESOURCES

*Copy-paste ready for the NASA Space Apps form field: **"NASA Data"***

| Link Text | Link URL |
| :--- | :--- |
| NASA PDS Geosciences Node: LOLA South Polar Digital Elevation Model (LDEM_75S_240M.IMG, 240 m/px) | https://pds-geosciences.wustl.edu/lro/lro-l-lola-3-rdr-v1/lrolol_1xxx/data/lola_gdr/polar/img/ldem_75s_240m.img |
| NASA PDS Geosciences Node: LOLA Polar DEM PDS3 Product Label (LDEM_75S_240M.LBL) | https://pds-geosciences.wustl.edu/lro/lro-l-lola-3-rdr-v1/lrolol_1xxx/data/lola_gdr/polar/img/ldem_75s_240m.lbl |
| NASA PDS Geosciences Node: LRO LOLA Gridded Data Records Directory | https://pds-geosciences.wustl.edu/lro/lro-l-lola-3-rdr-v1/lrolol_1xxx/data/lola_gdr/polar/img/ |
| NASA NAIF SPICE Planetary Ephemeris Kernel (de440s.bsp) | https://naif.jpl.nasa.gov/pub/naif/generic_kernels/spk/planets/de440s.bsp |
| NASA NAIF SPICE Lunar Reference Frame Kernel (moon_080317.tf) | https://naif.jpl.nasa.gov/pub/naif/generic_kernels/fk/satellites/moon_080317.tf |
| NASA NAIF SPICE Lunar High-Precision Binary Orientation PCK (moon_pa_de421_1900-2050.bpc) | https://naif.jpl.nasa.gov/pub/naif/generic_kernels/pck/moon_pa_de421_1900-2050.bpc |
| NASA NAIF SPICE Leapseconds Kernel (naif0012.tls) | https://naif.jpl.nasa.gov/pub/naif/generic_kernels/lsk/naif0012.tls |
| NASA NAIF SPICE Planetary Physical Constants Kernel (pck00010.tpc) | https://naif.jpl.nasa.gov/pub/naif/generic_kernels/pck/pck00010.tpc |
| NASA NAIF SPICE Generic Planetary Kernels Directory | https://naif.jpl.nasa.gov/pub/naif/generic_kernels/spk/planets/ |
| NASA Press Release 22-088: Artemis III Candidate Landing Regions Announcement | https://www.nasa.gov/news-release/nasa-identifies-candidate-regions-for-landing-next-americans-on-moon/ |
| NASA Space Apps Challenge 2026: Visualizing Sun and Earth Positions Challenge Briefing | https://www.spaceappschallenge.org/ |
| Lunar and Planetary Institute (LPI/USRA): Lunar South Pole Atlas | https://www.lpi.usra.edu/lunar/lunar-south-pole-atlas/ |
| NASA ADS: Mazarico et al. (2011) Illumination of Lunar Polar Regions Using LOLA Topography | https://doi.org/10.1016/j.icarus.2010.10.030 |
| NASA ADS: Gläser et al. (2014) Illumination Conditions at the Lunar Poles | https://doi.org/10.1016/j.icarus.2014.08.013 |

---

## B) SPACE AGENCY PARTNER & OTHER DATA / TOOLS

*Copy-paste ready for the NASA Space Apps form field: **"Space Agency Partner & Other Data"***

| Link Text | Link URL |
| :--- | :--- |
| React (MIT) | https://react.dev/ |
| React DOM (MIT) | https://react.dev/ |
| Vite (MIT) | https://vite.dev/ |
| TypeScript (Apache-2.0) | https://www.typescriptlang.org/ |
| Tailwind CSS (MIT) | https://tailwindcss.com/ |
| Lucide React (ISC) | https://lucide.dev/ |
| Vitest (MIT) | https://vitest.dev/ |
| SpiceyPy (MIT) | https://spiceypy.readthedocs.io/ |
| NumPy (BSD-3-Clause) | https://numpy.org/ |
| SciPy (BSD-3-Clause) | https://scipy.org/ |
| Astropy (BSD-3-Clause) | https://www.astropy.org/ |
| jplephem (MIT) | https://github.com/brandon-rhodes/python-jplephem |
| clsx (MIT) | https://github.com/lukeed/clsx |
| tailwind-merge (MIT) | https://github.com/dcastil/tailwind-merge |
| PostCSS (MIT) | https://postcss.org/ |
| Autoprefixer (MIT) | https://github.com/postcss/autoprefixer |
| Google Fonts: Inter (OFL-1.1) | https://fonts.google.com/specimen/Inter |
| Google Fonts: JetBrains Mono (OFL-1.1) | https://fonts.google.com/specimen/JetBrains+Mono |
| Python (PSF-2.0) | https://www.python.org/ |
| uv (MIT / Apache-2.0) | https://docs.astral.sh/uv/ |
| Microsoft Edge (Proprietary / Chromium Open Source) | https://www.microsoft.com/en-us/edge |

---

## C) PER-ROW NOTES (Project Usage, Terms & Verification Status)

### NASA Data & Resources
1. **LOLA South Polar DEM (`LDEM_75S_240M.IMG`)**: Primary 240 m/pixel topographic elevation raster used by `pipeline/horizon.py` for 360° horizon ray-marching out to 120 km radius. NASA Open Data / Public Domain. Verified via HTTP 200 GET on PDS Geosciences Node.
2. **LOLA Polar DEM Label (`LDEM_75S_240M.LBL`)**: PDS3 header defining map projection (polar stereographic), pixel scale (240 m), scale factor (0.5 m/DN), and offset (-1737400 m). NASA Public Domain. Verified via HTTP 200 GET on PDS Geosciences Node.
3. **PDS Geosciences Node Directory**: Canonical archive containing documentation and ancillary index files for LOLA gridded products. Verified via HTTP 200 GET on Washington University in St. Louis PDS server.
4. **SPICE SPK Ephemeris (`de440s.bsp`)**: High-precision planetary and lunar ephemeris covering 1900–2050 used by `pipeline/ephemeris.py` to calculate exact Sun and Earth 3D vectors relative to Moon center. NASA / JPL NAIF Open Data. Verified via HTTP 200 GET on NAIF JPL.
5. **SPICE Lunar Frame Kernel (`moon_080317.tf`)**: Reference frame definitions for topocentric East-North-Up frames centered at each candidate landing site in `MOON_ME` (Moon Mean Earth / Polar Axis). NASA Public Domain. Verified via HTTP 200 GET on NAIF JPL.
6. **SPICE Lunar Binary Orientation PCK (`moon_pa_de421_1900-2050.bpc`)**: High-fidelity lunar physical librations and mantle orientation angles across 2026–2030. NASA Public Domain. Verified via HTTP 200 GET on NAIF JPL.
7. **SPICE Leapseconds Kernel (`naif0012.tls`)**: UTC to Ephemeris Time (TDB) time conversion table. NASA Public Domain. Verified via HTTP 200 GET on NAIF JPL.
8. **SPICE Physical Constants Kernel (`pck00010.tpc`)**: Lunar mean radius (1737.4 km) and triaxial ellipsoid dimensions. NASA Public Domain. Verified via HTTP 200 GET on NAIF JPL.
9. **NAIF Generic Kernels Directory**: Official JPL archive page hosting generic planetary ephemerides and documentation. Verified via HTTP 200 GET.
10. **NASA Press Release 22-088**: Canonical NASA announcement identifying the 13 Artemis III Candidate Landing Regions used to establish regional bounding boxes and site coordinates. Verified via HTTP 200 GET on nasa.gov.
11. **NASA Space Apps Challenge 2026 Briefing**: Official challenge prompt defining mission constraints (terrain masking, power potential, direct-to-Earth communication windows without orbital relay). Verified active in browser.
12. **LPI/USRA Lunar South Pole Atlas**: Cartographic reference curated by the Lunar and Planetary Institute under NASA cooperative agreement, used for cross-checking crater rims, elevations, and coordinate conventions. Verified via HTTP 200 GET.
13. **Mazarico et al. (2011) Paper**: Landmark LOLA polar illumination study (*Icarus* 211, 1066–1081) used for ground-truth validation of Shackleton rim illumination (~38–42% baseline). Verified via permanent DOI resolution HTTP 200.
14. **Gläser et al. (2014) Paper**: Landmark illumination benchmark (*Icarus* 243, 78–90) used to validate Connecting Ridge multi-year illumination (40–45% range). Verified via permanent DOI resolution HTTP 200.

### Space Agency Partner & Other Data / Tools
1. **React**: Core declarative frontend view library powering the LunaSite single-page application. MIT License. Verified via HTTP 200 GET.
2. **React DOM**: Browser DOM rendering engine for React components. MIT License. Verified via HTTP 200 GET.
3. **Vite**: Modern ESM-based build bundler and local development server. MIT License. Verified via HTTP 200 GET.
4. **TypeScript**: Strongly typed language compiler providing type safety across the metrics and loading engines. Apache-2.0 License. Verified via HTTP 200 GET.
5. **Tailwind CSS**: Utility-first CSS framework for dark-theme styling, responsive grid layouts, and telemetry badges. MIT License. Verified via HTTP 200 GET.
6. **Lucide React**: Clean feather-derived icon pack for astronomical, communication, and navigation markers. ISC License. Verified via HTTP 200 GET.
7. **Vitest**: Vite-native unit testing framework running the 10 automated test suites. MIT License. Verified via HTTP 200 GET.
8. **SpiceyPy**: Python C-extension binding wrapping the official NASA NAIF CSPICE toolkit. MIT License. Verified via HTTP 200 GET.
9. **NumPy**: Vectorized numerical library used in `pipeline/ephemeris.py` and `pipeline/horizon.py`. BSD-3-Clause License. Verified via HTTP 200 GET.
10. **SciPy**: Scientific computing library used for signal convolution and libration cycle detection in `pipeline/validate.py`. BSD-3-Clause License. Verified via HTTP 200 GET.
11. **Astropy**: Astrodynamics library used for celestial time standard verification. BSD-3-Clause License. Verified via HTTP 200 GET.
12. **jplephem**: Direct binary SPK parser used for secondary ephemeris sanity cross-checks. MIT License. Verified via HTTP 200 GET.
13. **clsx & tailwind-merge**: Micro-utilities for dynamic CSS class composition. MIT License. Verified via HTTP 200 GET.
14. **PostCSS & Autoprefixer**: CSS build toolchain optimizing browser compatibility. MIT License. Verified via HTTP 200 GET.
15. **Google Fonts (Inter & JetBrains Mono)**: Open-source web fonts used for high-legibility UI typography and numerical telemetry. SIL Open Font License 1.1. Verified via HTTP 200 GET.
16. **Python**: Programming language runtime powering the offline scientific computing pipeline. PSF-2.0 License. Verified via HTTP 200 GET.
17. **uv**: Fast Rust-based Python package manager and virtual environment orchestrator. MIT / Apache-2.0 License. Verified via HTTP 200 GET.
18. **Microsoft Edge**: Headless Chromium browser used via Chrome DevTools Protocol (CDP) for capturing automated 1600x1000 DPR 2 screenshots. Proprietary / Chromium Open Source. Verified via HTTP 200 GET.

---

## D) FOR THE AI-USE FIELD

*Draft for the Space Apps Challenge form field: **"AI Tools Used"***

> **AI Tool Used**: Google DeepMind Antigravity / Gemini Advanced Agentic Coding environment (Gemini 2.5 Pro & Flash models).  
> **Specific Uses**:
> 1. **Astrodynamic Pipeline Scaffolding**: Assisting in scaffolding the Python pipeline scripts (`download_kernels.py`, `download_dem.py`, `ephemeris.py`, `horizon.py`, `validate.py`) to interface with NASA NAIF SPICE (`spiceypy`) and ray-march the binary LOLA DEM raster with spherical Moon curvature corrections.
> 2. **Client-Side Component Implementation**: Assisting in writing React 18 / TypeScript components, including the canvas-based timeline ribbon (`TimelineRibbon.tsx`), the 360° panoramic horizon view (`HorizonView.tsx`), the sliding Best-Window Finder (`BestWindowFinder.tsx`), and responsive layout styling (`Tailwind CSS`).
> 3. **Automated Testing & Screen Capture**: Assisting in authoring Vitest unit tests for the explainable viability scoring engine (`metrics.test.ts`) and headless Edge browser automation via Chrome DevTools Protocol to capture clean, high-resolution deck assets.
> 4. **Documentation Drafting**: Formatting structured markdown documentation (`README.md`, `METHODOLOGY.md`, `VALIDATION.md`, and slide deck outlines).  
> 
> **Human Oversight & Ground-Truth Verification**: All mathematical formulas for lunar curvature ray-marching, topocentric frame transformations, and solar disc fraction geometry were reviewed by human domain reasoning. All reported metrics were computed directly from authentic raw NASA SPICE and LOLA DEM data without artificial synthesis or fabrication.

---

## E) GAPS & DATA PROVENANCE AUDIT

1. **Items without a verified URL**: **None**. Every single link in Sections A and B was tested with live HTTP requests and confirmed to load without requiring login, password, or registration.
2. **Non-NASA data disambiguation**:
   - The *Lunar South Pole Atlas* is published by the Lunar and Planetary Institute (LPI), operated by USRA under a cooperative agreement with NASA.
   - The landmark validation papers (*Mazarico et al. 2011* and *Gläser et al. 2014*) were authored by NASA and European planetary scientists using NASA LOLA data, published in *Icarus*, and indexed via persistent DOIs and the NASA Astrophysics Data System (ADS).
   - All code libraries, fonts, and frameworks are standard open-source tools with permissive licenses (MIT, Apache-2.0, BSD-3-Clause, OFL-1.1, ISC) and are properly cataloged in Section B.
3. **Genuine NASA Data Usage Statement**:
   **LunaSite genuinely and directly uses official NASA planetary data.** The application's core functionality is entirely grounded in:
   - `pipeline/dem/ldem_75s_240m.img` (29.06 MB raw binary elevation raster directly downloaded from NASA PDS Geosciences Node).
   - `pipeline/kernels/de440s.bsp` (32.24 MB raw SPK ephemeris kernel directly downloaded from NASA JPL NAIF).
   - `pipeline/kernels/moon_080317.tf` and `moon_pa_de421_1900-2050.bpc` (Official NASA lunar orientation kernels).
   - Coordinates from official NASA Artemis III Candidate Landing Regions (NASA Release 22-088).
   
   The web application does not simulate or invent synthetic terrain or orbital tracks; 100% of the 87,648 calculated epochs and 360° horizon profiles were derived directly from these authentic NASA data files.
