# NASA Space Apps Challenge 2026: Official Project Submission Form Answers

**Project Title**: LunaSite — Lunar South Pole Landing Site & Communication Window Evaluator  
**Challenge Track**: Visualizing Sun & Earth Positions at the Lunar South Pole  
**File Location**: `submission/FORM_ANSWERS.md`  
**License**: Open Source (MIT)

---

## FIELD 1: Summary *
**Field Requirements**: Suggested 50 to 200 words (Target: 120 to 170 words). Plain English, what was developed, how it addresses the challenge, why it is important, no jargon, no unverified claims.  
**Status**: `READY`

### Copy-Paste Answer:
> LunaSite is an open-source, interactive web application developed to evaluate candidate landing sites at the Moon's south pole across the 2026 to 2030 timeframe. Designed for the NASA Space Apps Challenge 2026, LunaSite directly addresses polar mission constraints by enabling users to compare landing regions side-by-side, visualize exact Sun and Earth positions relative to 360-degree topographic horizons, and assess solar power potential alongside direct-to-Earth communication windows. At the lunar south pole, celestial bodies skim low along the horizon, meaning rugged crater rims cast shadows tens of kilometers long that cause severe cold traps and communication blackouts. Conventional flat-horizon estimates dangerously overestimate illumination. LunaSite bridges this gap by combining NASA topographic altimetry and planetary ephemerides into a fast, zero-login web tool. Mission planners, educators, and the public can explore continuous illumination periods, identify optimal 7- to 30-day surface stay windows, and evaluate landing trade-offs in seconds.

**Word Count**: **145 words** (Strictly within the 120–170 word target and the 50–200 word form suggestion).

---

## FIELD 2: Project Demonstration *
**Field Requirements**: Demo presentation (no more than 7 slides, including title) OR video (30 seconds or less). Hosted on a public platform (YouTube, Google Drive, GitHub, OneDrive, Dropbox) with a link requiring no password, permission, or registration. Full https URL.  
**Status**: `READY` (Hosted on GitHub Pages / Public GitHub)

### Slide Deck Verification:
- **Slide Count**: **7 slides exactly** (Verified).
- **Public Interactive Presentation URL (Hosted on GitHub Pages)**:
  ```
  https://nishtha1111.github.io/lunasite/demo_slides.html
  ```
- **Direct GitHub Repository Deck Source**:
  ```
  https://github.com/nishtha1111/lunasite/blob/main/submission/demo_slides.html
  ```

### Copy-Paste Form Field:
```
https://nishtha1111.github.io/lunasite/demo_slides.html
```

### 3-Step Verification in Private Window:
1. Open a **new Incognito / Private Browsing window** (where you are signed out of GitHub).
2. Paste `https://nishtha1111.github.io/lunasite/demo_slides.html`.
3. Verify that the 7-slide presentation loads instantly and responds to keyboard arrows (Left/Right) without requiring login or permissions. (You can also select Print > Save as PDF in your browser to produce a 7-page PDF if desired).

### Alternate Video Option (Verified):
If submitting a video demo instead of a slide deck:
- `submission/demo_video_script_30s.md` and `submission/demo_video_30s.srt` are pre-timed to **30.0 seconds** (Strictly obeys the $\le 30$ second rule).
- Host the MP4 video on YouTube (set as Public or Unlisted) or Google Drive (public access).

---

## FIELD 3: Project *
**Field Requirements**: Publicly accessible link to the project (website, cloud hosting, or code repository). No password, permission, or registration. Full https URL.  
**Status**: `READY`

### Copy-Paste Form Field:
```
https://nishtha1111.github.io/lunasite/
```

### Links Summary:
- **Live Deployed Application (GitHub Pages)**:
  `https://nishtha1111.github.io/lunasite/`
- **Public GitHub Repository**:
  `https://github.com/nishtha1111/lunasite`

### Form Guidance:
- Enter the **Deployed Application URL** (`https://nishtha1111.github.io/lunasite/`) in the form field. It is publicly accessible with zero login, zero password, and loads in under 1 second.

---

## FIELD 4: Project Details *
**Field Requirements**: 250 to 400 words. Detailed technical summary covering pipeline, architecture, metrics, viability score, window finder, 360 horizon simulator, Learn mode, impact, libraries, creative aspects, limitations, and Super Intelligence (SI) disclosure.  
**Status**: `READY`

### Copy-Paste Answer:
> LunaSite was engineered to solve the complex astrodynamic and topographic challenge of landing site evaluation at the lunar south pole. Because the Moon’s obliquity to the ecliptic is only 1.54°, the Sun and Earth skim along the horizon. Crater ridges cast vast shadows that cause extreme thermal freeze-out and sever direct line-of-sight to Earth.
>
> To deliver instantaneous analysis without server latency, LunaSite uses an offline Python pipeline (built with SpiceyPy, NumPy, and Astropy) coupled to a pure client-side web application (built with React 18, TypeScript, and Tailwind CSS). The pipeline ingests NASA NAIF SPICE planetary kernels (DE440s ephemerides in the topocentric MOON_ME frame) and NASA Lunar Reconnaissance Orbiter (LRO) LOLA digital elevation models (LDEM_75S_240M). It ray-marches 360° horizons out to 120 km radius with spherical lunar curvature corrections across 87,648 epochs (2026–2030).
>
> The web interface loads in under one second and evaluates five key operational metrics: sunlit fraction, longest continuous darkness, Direct-with-Earth (DWE) line-of-sight fraction, longest communication outage, and power-plus-comms overlap. An explainable Mission Viability Score (0 to 100) provides customized rankings across four operational presets: Rover, Static Lander, Crewed Stay, and Education. An automated Best-Window Finder scans multi-year timelines to isolate optimal 7-, 14-, or 30-day landing intervals. Users can scrub an interactive 360° panoramic horizon canvas showing extended celestial discs (Sun at 0.53° with chord illumination; Earth at 1.90°) against the local terrain silhouette, toggle between 2 m and 10 m mast heights, and explore a guided Learn walkthrough with a technical glossary.
>
> Impact spans aerospace planners conducting rapid site trade-offs, educators demonstrating polar celestial mechanics, and the public exploring lunar science. Creative aspects include interactive mast-height leverage modeling and instant browser-side window optimization. Known limitations include the 240 m/pixel DEM resolution (smoothing micro-relief below boulder scale), a 30-minute time step, and geometric line-of-sight modeling without radio multipath scattering.
>
> LunaSite was developed with Super Intelligence (SI) assistance using Google DeepMind Antigravity (Gemini 2.5 Pro and Flash) for coding, testing, and UI scaffolding under strict human engineering oversight. Full details are documented in SI_USE.md.

**Word Count**: **335 words** (Strictly within the 250–400 word requirement).

---

## FIELD 5: Use of Super Intelligence (SI) *
**Field Requirements**: Checkboxes indicating how Super Intelligence / AI tools were used in the project, with honest 1-line rationales.  
**Status**: `READY`

### Form Selections:

| Checkbox Option | Selection | Honest 1-Line Justification |
| :--- | :---: | :--- |
| **Ideation or Brainstorming** | **SELECT** | Brainstorming viable UX layouts, multi-site comparison workflows, and mathematical validation criteria for polar illumination. |
| **Research or Information Gathering** | **SELECT** | Locating and verifying canonical NASA PDS LOLA DEM products, NAIF SPICE kernel URLs, and Artemis candidate landing region coordinates. |
| **Data Analysis and Interpretation** | **SELECT** | Structuring quantitative validation comparison tables against peer-reviewed illumination studies (*Mazarico et al. 2011*, *Gläser et al. 2014*). |
| **Building SI/ML Into the Project** | **DO NOT SELECT** | LunaSite runs 100% deterministic astrodynamic ray-marching and geometric vector mathematics; zero machine learning or AI models run in the client or pipeline. |
| **Coding, Debugging, or Troubleshooting** | **SELECT** | Scaffolding boilerplate code, React/TypeScript components, Tailwind styles, Python ray-marching routines, and Vitest test suites under human oversight. |
| **Writing, Editing, or Translation** | **SELECT** | Drafting technical documentation, glossary definitions, slide outlines, and formatting project descriptions. |

*Note for unseen or alternate options*: If the official submission form presents additional, rephrased, or combined checkbox options, select only options corresponding to developer tool assistance, coding acceleration, and documentation formatting. Do **NOT** select any option that implies embedded machine learning models, autonomous science decision-making, or artificial data generation.

---

## FIELD 6: NASA Data
**Field Requirements**: Full list of all NASA data and resources used. Pair of "Link Text" and "Link URL" (entire URL starting with `https://`). Publicly accessible with no login, password, or registration.  
**Status**: `READY`

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

## FIELD 7: Space Agency Partner & Other Data
**Field Requirements**: Full list of all other tools, libraries, fonts, and frameworks used. Pair of "Link Text" and "Link URL" (entire URL starting with `https://`). Publicly accessible with no login, password, or registration.  
**Status**: `READY`

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

## VERIFICATION CHECKLIST: Super Intelligence (SI) Indicators

| Indicator Item | Description | File Location & Reference | Status |
| :--- | :--- | :--- | :---: |
| **a. Dedicated SI Disclosure File** | `SI_USE.md` created at repository root disclosing SI models, pair-programming roles, and human verification protocol | `SI_USE.md` (Lines 1–64) | **PASS** |
| **b. README Indicator** | Prominent "Use of SI tools" section and status badge linking directly to `SI_USE.md` | `README.md` (Line 11, Lines 146–147) | **PASS** |
| **c. Web App Indicators** | `<meta name="si-assisted" content="true">` in HTML head, HTML comment disclosure, and visible footer link "Built with SI assistance" | `web/index.html` (Lines 9–11)<br>`web/src/components/Footer.tsx` (Lines 36–43) | **PASS** |
| **d. Source Code Headers** | Header comment `Portions of this file were generated with SI assistance (see SI_USE.md)` on all pipeline and application source files | 12 Python files in `pipeline/*.py`<br>15 TypeScript/React files in `web/src/**/*.ts(x)` | **PASS** |
| **e. Generated Data Tags** | Metadata attributes (`"si_assisted_generation": true, "generator": "pipeline/*.py", "see": "SI_USE.md"`) added to dataset manifests and exports | `web/public/data/manifest.json` (Lines 78–81)<br>`web/public/data/*.json` (6 site files)<br>`submission/deck_assets/final_metrics.json` (Lines 6–8) | **PASS** |
| **f. Visual Media Disclosure** | Formal disclosure in `SI_USE.md` that screenshots are deterministic browser renders of code without generative image models or altered NASA logos | `SI_USE.md` (Section 4, Lines 43–48) | **PASS** |

---

## SANITIZATION & PRIVACY AUDIT
- **Local File Paths**: 0 local system paths or machine-specific user directories present.
- **Personal Information**: 0 personal names or private email addresses.
- **NASA Logos / Endorsement**: No official NASA insignia, meatballs, worms, or implied endorsements used.
