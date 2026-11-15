// Portions of this file were generated with SI assistance (see SI_USE.md)
const fs = require('fs');
const path = require('path');
const puppeteer = require('./node_modules/puppeteer-core');

const ROOT_DIR = path.resolve(__dirname, '..');
const DECK_ASSETS = path.join(ROOT_DIR, 'submission', 'deck_assets');
const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

function getBase64(filename) {
  const filePath = path.join(DECK_ASSETS, filename);
  const data = fs.readFileSync(filePath);
  return `data:image/png;base64,${data.toString('base64')}`;
}

console.log('Encoding deck assets to base64...');
const imgCompareHero = getBase64('compare_hero.png');
const imgCompareBestWindow = getBase64('compare_best_window.png');
const imgHorizonHero = getBase64('horizon_hero.png');
const imgHorizonBlocked = getBase64('horizon_blocked.png');
const imgLearnStep = getBase64('learn_step.png');
const imgMobileCompare = getBase64('mobile_compare.png');

console.log('Generating self-contained demo_slides.html...');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LunaSite – NASA Space Apps Challenge 2026 Presentation Deck (7 Slides)</title>
  <meta name="si-assisted" content="true">
  <!-- Portions of this presentation were prepared with SI assistance (see SI_USE.md) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-dark: #06090e;
      --card-bg: rgba(15, 23, 42, 0.85);
      --card-border: rgba(51, 65, 85, 0.7);
      --sun-gold: #f59e0b;
      --earth-cyan: #06b6d4;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --accent-emerald: #10b981;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    html, body {
      background-color: var(--bg-dark);
      color: var(--text-main);
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    
    /* Screen View: presentation frame */
    @media screen {
      body {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px 0;
      }
      .deck-container {
        width: 1280px;
        height: 720px;
        position: relative;
        background: radial-gradient(circle at 50% 0%, rgba(30, 41, 59, 0.5) 0%, rgba(6, 9, 14, 0.98) 100%);
        border: 1px solid var(--card-border);
        border-radius: 12px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.85);
        overflow: hidden;
      }
      .slide {
        display: none;
        width: 100%;
        height: 100%;
        padding: 40px 50px 70px 50px;
        flex-direction: column;
        justify-content: space-between;
      }
      .slide.active {
        display: flex;
      }
      .controls {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 50px;
        background: rgba(15, 23, 42, 0.9);
        border-top: 1px solid var(--card-border);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 30px;
        font-size: 12px;
        color: var(--text-muted);
        backdrop-filter: blur(8px);
      }
    }

    /* Print / PDF View: 16:9 Landscape Pages */
    @media print {
      @page {
        size: 16in 9in;
        margin: 0;
      }
      body {
        width: 16in;
        background: #06090e !important;
      }
      .deck-container {
        width: 16in !important;
        border: none !important;
        box-shadow: none !important;
        background: transparent !important;
      }
      .slide {
        display: flex !important;
        width: 16in !important;
        height: 9in !important;
        page-break-after: always !important;
        break-after: page !important;
        padding: 50px 70px 50px 70px !important;
        flex-direction: column !important;
        justify-content: space-between !important;
        background: radial-gradient(circle at 50% 0%, rgba(30, 41, 59, 0.5) 0%, rgba(6, 9, 14, 0.98) 100%) !important;
        border-bottom: 1px solid #1e293b !important;
      }
      .controls {
        display: none !important;
      }
    }

    .slide-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      background: rgba(245, 158, 11, 0.15);
      color: var(--sun-gold);
      border: 1px solid rgba(245, 158, 11, 0.35);
      margin-bottom: 8px;
    }
    h2 {
      font-size: 30px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 6px;
      letter-spacing: -0.02em;
    }
    .subtitle {
      font-size: 15px;
      color: var(--text-muted);
      margin-bottom: 18px;
    }
    .content-grid {
      display: grid;
      grid-template-columns: 1.15fr 1fr;
      gap: 28px;
      align-items: center;
      flex: 1;
      min-height: 0;
    }
    .content-col {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 8px;
      padding: 14px 18px;
    }
    .card h3 {
      font-size: 15px;
      font-weight: 600;
      color: var(--sun-gold);
      margin-bottom: 4px;
    }
    .card p {
      font-size: 13px;
      line-height: 1.45;
      color: var(--text-muted);
    }
    .highlight-stat {
      font-family: 'JetBrains Mono', monospace;
      font-size: 22px;
      font-weight: 700;
      color: #fff;
    }
    .img-box {
      width: 100%;
      height: 100%;
      max-height: 440px;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid var(--card-border);
      background: #000;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .img-box img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .btn-group {
      display: flex;
      gap: 8px;
    }
    button {
      background: #1e293b;
      color: #fff;
      border: 1px solid #334155;
      padding: 6px 14px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      transition: all 0.15s;
    }
    button:hover {
      background: #334155;
      border-color: #475569;
    }
    .slide-counter {
      font-family: 'JetBrains Mono', monospace;
      font-weight: 600;
      color: var(--sun-gold);
    }
    .slide-footer-tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: #64748b;
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
    }
  </style>
</head>
<body>

  <div class="deck-container">

    <!-- Slide 1: Title & Hook -->
    <div class="slide active" id="slide-1">
      <div>
        <div class="slide-badge">NASA Space Apps Challenge 2026</div>
        <h2 style="font-size: 34px; margin-top: 4px;">LunaSite: Rapid Terrain-Masked Mission Planning</h2>
        <p class="subtitle">Empowering Mission Planners, Educators & Public with Real LOLA Topography & NAIF SPICE Astrodynamics</p>
      </div>
      <div class="content-grid">
        <div class="content-col">
          <div class="card" style="border-left: 3px solid var(--sun-gold);">
            <h3>The South Pole Dilemma</h3>
            <p>At the lunar south pole, celestial bodies never rise far above the horizon. A flat-horizon model is dangerously misleading—a 200 m crater rim kilometers away casts long shadows, plunging landers into cryogenic freeze-out.</p>
          </div>
          <div class="card" style="border-left: 3px solid var(--earth-cyan);">
            <h3>Zero-Backend Static Architecture</h3>
            <p>Combines offline high-precision astrodynamics (NAIF SPICE DE440s) and LOLA polar DEM ray-marching into a pure client-side web application loading in under 1 second with zero login.</p>
          </div>
          <div style="display: flex; gap: 12px;">
            <div class="card" style="flex: 1;">
              <div class="highlight-stat">6 Candidate Sites</div>
              <p style="font-size: 11px;">Artemis III Regions (2026–2030)</p>
            </div>
            <div class="card" style="flex: 1;">
              <div class="highlight-stat">87,648 Epochs</div>
              <p style="font-size: 11px;">Evaluated at 30-min precision</p>
            </div>
          </div>
        </div>
        <div class="img-box">
          <img src="${imgCompareHero}" alt="LunaSite Compare View Hero">
        </div>
      </div>
      <div class="slide-footer-tag">
        <span>LunaSite Presentation Deck</span>
        <span>Slide 1 of 7</span>
      </div>
    </div>

    <!-- Slide 2: The South Pole Challenge -->
    <div class="slide" id="slide-2">
      <div>
        <div class="slide-badge">Challenge Background</div>
        <h2>Extreme Lighting & Telecommunication Constraints</h2>
        <p class="subtitle">Why flat-horizon models fail at the Lunar South Pole</p>
      </div>
      <div class="content-grid">
        <div class="content-col">
          <div class="card">
            <h3>1.54° Lunar Obliquity</h3>
            <p>Because the Moon's axial tilt to the ecliptic is only 1.54°, the Sun skims between -3° and +7° across the horizon. Local topography completely governs solar power collection.</p>
          </div>
          <div class="card">
            <h3>Cryogenic Freeze-Out Danger</h3>
            <p>Flat-horizon approximations overestimate solar illumination by 25% to 40%. A single shadow event can exceed 400 continuous hours without power at sub-40 K temperatures.</p>
          </div>
          <div class="card">
            <h3>Direct-with-Earth (DWE) Line-of-Sight</h3>
            <p>Earth oscillates with a ~27.32-day sidereal libration cycle, dipping below crater ridges and breaking direct communication links when lunar relays are unavailable.</p>
          </div>
        </div>
        <div class="content-col">
          <div class="card" style="background: rgba(15, 23, 42, 0.95);">
            <h3 style="color: #fff; margin-bottom: 12px;">Illumination Discrepancy (Flat vs. Topography)</h3>
            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #334155;">
              <span style="color: var(--text-muted); font-size: 14px;">Shackleton Peak (Flat Ground)</span>
              <span class="highlight-stat" style="font-size: 16px; color: var(--sun-gold);">50.5%</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #334155;">
              <span style="color: var(--text-muted); font-size: 14px;">Shackleton Peak (2 m Lander Deck)</span>
              <span class="highlight-stat" style="font-size: 16px; color: #ef4444;">33.6% (-16.9%)</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 10px 0;">
              <span style="color: var(--text-muted); font-size: 14px;">Shackleton Peak (10 m Deployable Mast)</span>
              <span class="highlight-stat" style="font-size: 16px; color: var(--accent-emerald);">46.5% (+12.9%)</span>
            </div>
          </div>
          <div class="card">
            <h3>Mast Elevation Leverage</h3>
            <p>A 10-meter deployable mast clears low foreground ridges, boosting illuminated time by up to +13% across 5 years and mitigating prolonged blackout risks.</p>
          </div>
        </div>
      </div>
      <div class="slide-footer-tag">
        <span>LunaSite Presentation Deck</span>
        <span>Slide 2 of 7</span>
      </div>
    </div>

    <!-- Slide 3: Offline Pipeline & Architecture -->
    <div class="slide" id="slide-3">
      <div>
        <div class="slide-badge">Architecture & Pipeline</div>
        <h2>High-Precision Astrodynamics with Zero-Backend Static Delivery</h2>
        <p class="subtitle">Reproducible planetary pipeline built entirely on open NASA data</p>
      </div>
      <div class="content-grid">
        <div class="content-col">
          <div class="card">
            <h3>NASA NAIF SPICE Kernels</h3>
            <p>Uses planetary ephemeris kernel <code>de440s.bsp</code>, lunar body-fixed frame <code>moon_080317.tf</code> (MOON_ME), and high-precision orientation PCK <code>moon_pa_de421</code> across 2026–2030.</p>
          </div>
          <div class="card">
            <h3>NASA LRO LOLA Topography</h3>
            <p>Ray-marches 360 azimuth rays out to 120 km radius over <code>LDEM_75S_240M</code> (240 m/px) with spherical Moon curvature corrections to compute terrain horizon silhouettes.</p>
          </div>
          <div class="card">
            <h3>Ultra-Compact Client Packaging</h3>
            <p>Quantizes 87,648 4-variable epochs into a compact 701 KB binary buffer per site. Full 5-year multi-site dataset downloads in &lt; 4.5 MB with zero runtime backend dependency.</p>
          </div>
        </div>
        <div class="content-col">
          <div class="card" style="padding: 22px;">
            <h3 style="color: #fff; margin-bottom: 12px;">Architecture Dataflow</h3>
            <div style="font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.7; color: var(--text-muted); background: #0b1120; padding: 16px; border-radius: 6px; border: 1px solid #1e293b;">
              <span style="color: #38bdf8;">NASA PDS & NAIF SPICE</span><br>
              &nbsp;&nbsp;│ (Ephemeris DE440s & LOLA DEM LDEM_75S_240M)<br>
              &nbsp;&nbsp;▼<br>
              <span style="color: #fbbf24;">Python Pipeline (SpiceyPy + NumPy)</span><br>
              &nbsp;&nbsp;│ Topocentric Ray-Marching & Spherical Curvature<br>
              &nbsp;&nbsp;▼<br>
              <span style="color: #34d399;">Typed Binary Buffers + JSON (701 KB / site)</span><br>
              &nbsp;&nbsp;│ Static CDN / GitHub Pages Delivery<br>
              &nbsp;&nbsp;▼<br>
              <span style="color: #a78bfa;">React 18 + Canvas Client (&lt; 75 KB gzipped JS)</span>
            </div>
          </div>
        </div>
      </div>
      <div class="slide-footer-tag">
        <span>LunaSite Presentation Deck</span>
        <span>Slide 3 of 7</span>
      </div>
    </div>

    <!-- Slide 4: 360 Horizon View -->
    <div class="slide" id="slide-4">
      <div>
        <div class="slide-badge">Interactive Feature</div>
        <h2>Real-Time 360° Panoramic Horizon & Celestial Simulator</h2>
        <p class="subtitle">Immediate visual confirmation of terrain occlusion and line-of-sight</p>
      </div>
      <div class="content-grid">
        <div class="content-col">
          <div class="card">
            <h3>Exact LOLA Terrain Silhouette</h3>
            <p>Renders true lunar ridge profiles across all 360° azimuths. Topographic relief shows peaks and crater rims in crisp detail.</p>
          </div>
          <div class="card">
            <h3>Extended Celestial Discs</h3>
            <p>Models Sun as a 0.53° angular disc with partial chord illumination, and Earth as a 1.90° disc with RF direct line-of-sight status.</p>
          </div>
          <div class="card">
            <h3>Interactive Scrubber & Simulation</h3>
            <p>Scrub smoothly across 5 years with 1x to 120x playback rates. Telemetry badges display precise elevations above local terrain.</p>
          </div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div class="img-box" style="height: 205px;">
            <img src="${imgHorizonHero}" alt="Horizon view with Sun & Earth visible">
          </div>
          <div class="img-box" style="height: 205px;">
            <img src="${imgHorizonBlocked}" alt="Horizon view with Earth blocked by crater ridge">
          </div>
        </div>
      </div>
      <div class="slide-footer-tag">
        <span>LunaSite Presentation Deck</span>
        <span>Slide 4 of 7</span>
      </div>
    </div>

    <!-- Slide 5: Decision Support & Best Window Finder -->
    <div class="slide" id="slide-5">
      <div>
        <div class="slide-badge">Decision Support</div>
        <h2>Mission Viability Scoring & Best-Window Finder</h2>
        <p class="subtitle">Algorithmic multi-factor optimization for landing and surface operations</p>
      </div>
      <div class="content-grid">
        <div class="content-col">
          <div class="card">
            <h3>Explainable Viability Score (0 to 100)</h3>
            <p>Balances sunlit fraction, darkness penalty, Earth DWE coverage, and comms outage duration. Four operational presets: <em>Rover Mobility</em>, <em>Static Lander</em>, <em>Crewed Stay</em>, and <em>Education</em>.</p>
          </div>
          <div class="card">
            <h3>Sliding-Window Optimization</h3>
            <p>Scans the 5-year timeline to identify and rank the top 5 landing intervals for 7-day, 14-day, or 30-day surface missions.</p>
          </div>
          <div class="card">
            <h3>One-Click Application</h3>
            <p>Click "Apply" to jump the entire synchronized timeline directly into the optimal mission window.</p>
          </div>
        </div>
        <div class="img-box">
          <img src="${imgCompareBestWindow}" alt="Best Window Finder showing top ranked windows">
        </div>
      </div>
      <div class="slide-footer-tag">
        <span>LunaSite Presentation Deck</span>
        <span>Slide 5 of 7</span>
      </div>
    </div>

    <!-- Slide 6: Scientific Validation -->
    <div class="slide" id="slide-6">
      <div>
        <div class="slide-badge">Scientific Rigor</div>
        <h2>Rigorously Validated Against Analytical Bounds & Published Literature</h2>
        <p class="subtitle">Complete transparency and honest scientific reporting</p>
      </div>
      <div class="content-grid">
        <div class="content-col">
          <div class="card">
            <h3>Solar Latitude Bound (VAL-EPHEM-01)</h3>
            <p>100% of the 87,648 calculated solar elevations obey celestial mechanics limits derived from lunar obliquity: E_sun,max &le; (90° - |lat|) + 1.543° within ±0.03°.</p>
          </div>
          <div class="card">
            <h3>Earth Libration Period (VAL-EPHEM-02)</h3>
            <p>Fundamental oscillation of Earth elevation measures <strong>27.21 ± 0.08 days</strong>, exactly matching the 27.32-day sidereal month across 66 complete cycles.</p>
          </div>
          <div class="card">
            <h3>Literature Benchmarks (Mazarico 2011 & Gläser 2014)</h3>
            <p>Peak Near Shackleton 5-year illumination of 38.1% matches published LOLA baselines (38–42%), and winter darkness of 59 days replicates published lunar winter occultations.</p>
          </div>
        </div>
        <div class="img-box">
          <img src="${imgLearnStep}" alt="Learn Mode and Technical Glossary">
        </div>
      </div>
      <div class="slide-footer-tag">
        <span>LunaSite Presentation Deck</span>
        <span>Slide 6 of 7</span>
      </div>
    </div>

    <!-- Slide 7: Impact & Accessibility -->
    <div class="slide" id="slide-7">
      <div>
        <div class="slide-badge">Global Impact</div>
        <h2>Democratizing Lunar Exploration for Planners, Students & the World</h2>
        <p class="subtitle">Production-ready, accessible, and 100% open source</p>
      </div>
      <div class="content-grid">
        <div class="content-col">
          <div class="card">
            <h3>Mission Planners & Engineers</h3>
            <p>Perform complex multi-site trade-offs in seconds instead of waiting hours for heavy orbital software suites.</p>
          </div>
          <div class="card">
            <h3>Educators & Students</h3>
            <p>Learn Mode features a 6-step guided walkthrough and an interactive glossary covering astrodynamics, telecommunications, and topography.</p>
          </div>
          <div class="card">
            <h3>Accessibility & Portability</h3>
            <p>WCAG AA contrast compliant, colorblind-safe palettes, mobile responsive down to 360 px, and one-click CSV/PNG export.</p>
          </div>
        </div>
        <div class="img-box" style="background: #06090e;">
          <img src="${imgMobileCompare}" alt="Mobile responsive compare view on phone screen" style="object-fit: contain;">
        </div>
      </div>
      <div class="slide-footer-tag">
        <span>LunaSite Presentation Deck</span>
        <span>Slide 7 of 7</span>
      </div>
    </div>

    <!-- Bottom Controls (Screen Only) -->
    <div class="controls">
      <div>
        <span>NASA Space Apps 2026 | Team LunaSite</span>
      </div>
      <div class="slide-counter" id="counter">Slide 1 of 7</div>
      <div class="btn-group">
        <button id="prevBtn" onclick="changeSlide(-1)">◀ Previous</button>
        <button id="nextBtn" onclick="changeSlide(1)">Next ▶</button>
      </div>
    </div>

  </div>

  <script>
    let currentSlide = 1;
    const totalSlides = 7;

    function showSlide(n) {
      if (n > totalSlides) currentSlide = 1;
      else if (n < 1) currentSlide = totalSlides;
      else currentSlide = n;

      for (let i = 1; i <= totalSlides; i++) {
        const slide = document.getElementById('slide-' + i);
        if (slide) {
          slide.classList.remove('active');
        }
      }
      const activeSlide = document.getElementById('slide-' + currentSlide);
      if (activeSlide) activeSlide.classList.add('active');

      document.getElementById('counter').innerText = \`Slide \${currentSlide} of \${totalSlides}\`;
    }

    function changeSlide(direction) {
      showSlide(currentSlide + direction);
    }

    document.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        changeSlide(1);
      } else if (e.key === 'ArrowLeft') {
        changeSlide(-1);
      }
    });
  </script>
</body>
</html>`;

// Write self-contained HTML
const submissionHtml = path.join(ROOT_DIR, 'submission', 'demo_slides.html');
const publicHtml = path.join(ROOT_DIR, 'web', 'public', 'demo_slides.html');
const distHtml = path.join(ROOT_DIR, 'web', 'dist', 'demo_slides.html');

fs.writeFileSync(submissionHtml, htmlContent, 'utf8');
fs.writeFileSync(publicHtml, htmlContent, 'utf8');
fs.writeFileSync(distHtml, htmlContent, 'utf8');
console.log('Saved self-contained demo_slides.html to submission/, web/public/, and web/dist/');

async function renderPdf() {
  console.log('Launching Edge via puppeteer-core...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Load local HTML
    const fileUrl = 'file:///' + submissionHtml.replace(/\\/g, '/');
    console.log('Navigating to:', fileUrl);
    await page.goto(fileUrl, { waitUntil: 'networkidle0' });

    // Wait for fonts to load
    await page.evaluateHandle('document.fonts.ready');

    const pdfSubmission = path.join(ROOT_DIR, 'submission', 'LunaSite_Demo_Deck_7Slides.pdf');
    const pdfRoot = path.join(ROOT_DIR, 'LunaSite_Demo_Deck_7Slides.pdf');
    const pdfPublic = path.join(ROOT_DIR, 'web', 'public', 'LunaSite_Demo_Deck_7Slides.pdf');
    const pdfDist = path.join(ROOT_DIR, 'web', 'dist', 'LunaSite_Demo_Deck_7Slides.pdf');

    console.log('Rendering PDF...');
    await page.pdf({
      path: pdfSubmission,
      width: '16in',
      height: '9in',
      printBackground: true,
      preferCSSPageSize: true
    });

    // Copy to root, public, and dist
    fs.copyFileSync(pdfSubmission, pdfRoot);
    fs.copyFileSync(pdfSubmission, pdfPublic);
    fs.copyFileSync(pdfSubmission, pdfDist);

    const stat = fs.statSync(pdfSubmission);
    console.log('SUCCESS! PDF generated: ' + pdfSubmission + ' (' + (stat.size / 1024).toFixed(1) + ' KB)');
  } finally {
    await browser.close();
  }
}

renderPdf().catch(err => {
  console.error('PDF rendering failed:', err);
  process.exit(1);
});
