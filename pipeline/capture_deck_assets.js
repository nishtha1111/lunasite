import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import os from 'node:os';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const DIST_DIR = path.resolve('web/dist');
const OUT_DIR = path.resolve('submission/deck_assets');
const ARTIFACT_DIR = 'C:\\Users\\Nishtha patel\\.gemini\\antigravity\\brain\\dac62b62-8604-49c4-a577-3af8849dad33';
const PORT = 8098;
const CDP_PORT = 9224;

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.bin': 'application/octet-stream',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function startStaticServer() {
  const server = http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0].split('#')[0];
    if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
    const filePath = path.join(DIST_DIR, reqPath);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
    } else {
      const indexPath = path.join(DIST_DIR, 'index.html');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      fs.createReadStream(indexPath).pipe(res);
    }
  });

  return new Promise((resolve) => {
    server.listen(PORT, '127.0.0.1', () => {
      console.log(`[SERVER] Serving web/dist on http://127.0.0.1:${PORT}`);
      resolve(server);
    });
  });
}

async function getCdpWebSocketUrl() {
  for (let i = 0; i < 25; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`);
      if (res.ok) {
        const data = await res.json();
        return data.webSocketDebuggerUrl;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error('Could not connect to Edge CDP endpoint');
}

class CdpClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 1;
    this.pending = new Map();

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };
  }

  waitOpen() {
    if (this.ws.readyState === WebSocket.OPEN) return Promise.resolve();
    return new Promise((resolve) => {
      this.ws.onopen = resolve;
    });
  }

  send(method, params = {}) {
    const id = this.id++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    this.ws.close();
  }
}

async function capture() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const server = await startStaticServer();
  const tmpUserDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'edge-cdp-assets-'));

  console.log(`[EDGE] Launching headless Edge on debug port ${CDP_PORT}...`);
  const edgeProc = spawn(EDGE_PATH, [
    '--headless=new',
    `--remote-debugging-port=${CDP_PORT}`,
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    '--force-dark-mode',
    `--user-data-dir=${tmpUserDataDir}`,
    'about:blank'
  ]);

  try {
    const browserWsUrl = await getCdpWebSocketUrl();
    const browserClient = new CdpClient(browserWsUrl);
    await browserClient.waitOpen();

    const shots = [
      {
        name: 'compare_hero.png',
        url: `http://127.0.0.1:${PORT}/#sites=shackleton_peak,connecting_ridge,malapert_massif&view=compare&start=2026-11-14&end=2026-12-14`,
        width: 1600,
        height: 1000,
        dpr: 2,
        prepare: async (page) => {
          // Frame header, timeline ribbons, and the #1 recommendation card
          await page.send('Runtime.evaluate', {
            expression: `window.scrollTo(0, 0);`
          });
        }
      },
      {
        name: 'compare_best_window.png',
        url: `http://127.0.0.1:${PORT}/#sites=shackleton_peak,connecting_ridge,malapert_massif&view=compare&start=2026-11-14&end=2026-12-14`,
        width: 1600,
        height: 1000,
        dpr: 2,
        prepare: async (page) => {
          // Scroll down so Best-Window Finder and the 5 ranked 7-day stay cards are prominent
          await page.send('Runtime.evaluate', {
            expression: `
              const el = Array.from(document.querySelectorAll('h3')).find(h => h.textContent.includes('Best Mission Windows'));
              if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
              else window.scrollTo({ top: 380, behavior: 'instant' });
            `
          });
        }
      },
      {
        name: 'horizon_hero.png',
        // Connecting Ridge on 2026-09-06 at epoch 11935: Sun at +0.94°, horizon at +0.88° (partially hidden/grazing), Earth at +4.10° visible
        url: `http://127.0.0.1:${PORT}/#site=connecting_ridge&view=horizon&start=2026-09-06&end=2026-09-08&epoch=11935`,
        width: 1600,
        height: 1000,
        dpr: 2,
        prepare: async (page) => {
          await page.send('Runtime.evaluate', {
            expression: `window.scrollTo(0, 0);`
          });
        }
      },
      {
        name: 'horizon_blocked.png',
        // Malapert Massif on 2026-01-10 at epoch 441: Earth at -0.03°, mountain horizon at +0.93° (Earth blocked by terrain!)
        url: `http://127.0.0.1:${PORT}/#site=malapert_massif&view=horizon&start=2026-01-10&end=2026-01-12&epoch=441`,
        width: 1600,
        height: 1000,
        dpr: 2,
        prepare: async (page) => {
          await page.send('Runtime.evaluate', {
            expression: `window.scrollTo(0, 0);`
          });
        }
      },
      {
        name: 'learn_step.png',
        url: `http://127.0.0.1:${PORT}/#view=learn`,
        width: 1600,
        height: 1000,
        dpr: 2,
        prepare: async (page) => {
          // Advance to Step 2: The Grazing Sun Dilemma and scroll slightly to frame step + glossary
          await page.send('Runtime.evaluate', {
            expression: `
              const nextBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Next Step'));
              if (nextBtn) nextBtn.click();
              window.scrollTo({ top: 80, behavior: 'instant' });
            `
          });
        }
      },
      {
        name: 'mobile_compare.png',
        url: `http://127.0.0.1:${PORT}/#sites=shackleton_peak,connecting_ridge&view=compare&start=2026-11-14&end=2026-12-14`,
        width: 390,
        height: 844,
        dpr: 2,
        prepare: async (page) => {
          await page.send('Runtime.evaluate', {
            expression: `window.scrollTo(0, 0);`
          });
        }
      }
    ];

    for (const shot of shots) {
      console.log(`[CAPTURE] Setting up target for ${shot.name}...`);

      // Create a fresh tab for each shot
      const { targetId } = await browserClient.send('Target.createTarget', { url: 'about:blank' });
      const targetWsUrl = `ws://127.0.0.1:${CDP_PORT}/devtools/page/${targetId}`;
      const pageClient = new CdpClient(targetWsUrl);
      await pageClient.waitOpen();

      await pageClient.send('Page.enable');
      await pageClient.send('DOM.enable');
      await pageClient.send('Runtime.enable');
      await pageClient.send('Emulation.setEmulatedMedia', {
        media: 'screen',
        features: [{ name: 'prefers-color-scheme', value: 'dark' }]
      });

      await pageClient.send('Emulation.setDeviceMetricsOverride', {
        width: shot.width,
        height: shot.height,
        deviceScaleFactor: shot.dpr,
        mobile: shot.width < 600
      });

      await pageClient.send('Page.navigate', { url: shot.url });

      // Poll until loading spinner is gone and DOM is complete
      for (let attempt = 0; attempt < 50; attempt++) {
        await new Promise((r) => setTimeout(r, 200));
        const res = await pageClient.send('Runtime.evaluate', {
          expression: `!document.querySelector('.animate-spin') && document.readyState === 'complete'`
        });
        if (res.result && res.result.value === true) break;
      }

      if (shot.prepare) {
        await shot.prepare(pageClient);
        await new Promise((r) => setTimeout(r, 600)); // Layout settle
      }

      const screenshot = await pageClient.send('Page.captureScreenshot', {
        format: 'png',
        fromSurface: true
      });

      const buf = Buffer.from(screenshot.data, 'base64');
      const outPath = path.join(OUT_DIR, shot.name);
      fs.writeFileSync(outPath, buf);

      // Mirror to artifact dir for report
      if (fs.existsSync(ARTIFACT_DIR)) {
        fs.writeFileSync(path.join(ARTIFACT_DIR, shot.name), buf);
      }

      const sizeKb = (buf.byteLength / 1024).toFixed(1);
      console.log(`  [OK] Saved ${shot.name}: ${sizeKb} KB`);

      try {
        await pageClient.send('Page.close');
      } catch {}
      pageClient.close();
    }

    browserClient.close();
  } finally {
    edgeProc.kill();
    server.close();
    try {
      fs.rmSync(tmpUserDataDir, { recursive: true, force: true });
    } catch {}
  }

  console.log('[COMPLETE] All deck asset screenshots captured successfully.');
}

capture().catch((err) => {
  console.error('[ERROR]', err);
  process.exit(1);
});
