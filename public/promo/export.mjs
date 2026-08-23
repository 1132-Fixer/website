#!/usr/bin/env node
// Optional rasterizer. No package.json dependency.
// Run from repo root: node public/promo/export.mjs
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '..');
const framesDir = path.join(__dirname, 'frames');
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

const jobs = [
  { file: 'overlay-16x9.png', url: '/promo/overlay.html', w: 1920, h: 1080 },
  { file: 'chrome-16x9.png', url: '/promo/chrome.html', w: 1920, h: 1080 },
  { file: 'promo-1280x640.png', url: '/promo/promo-1280x640.html', w: 1280, h: 640 },
  { file: 'lower-third.png', url: '/promo/lower-third.html', w: 1920, h: 1080, alpha: true },
  { file: 'loop-01-identity.png', url: '/promo/index.html?still=identity', w: 1920, h: 1080 },
  { file: 'loop-02-meeting.png', url: '/promo/index.html?still=meeting', w: 1920, h: 1080 },
  { file: 'loop-03-chrome.png', url: '/promo/index.html?still=chrome', w: 1920, h: 1080 },
  { file: 'loop-04-platforms.png', url: '/promo/index.html?still=platforms', w: 1920, h: 1080 },
  { file: 'loop-05-cta.png', url: '/promo/index.html?still=cta', w: 1920, h: 1080 },
];

function serve() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const u = new URL(req.url, 'http://127.0.0.1');
      let rel = decodeURIComponent(u.pathname);
      if (rel.endsWith('/')) rel += 'index.html';
      const file = path.normalize(path.join(publicDir, rel));
      if (!file.startsWith(publicDir)) {
        res.writeHead(403); res.end(); return;
      }
      fs.readFile(file, (err, data) => {
        if (err) { res.writeHead(404); res.end('not found'); return; }
        res.writeHead(200, { 'content-type': mime[path.extname(file)] || 'application/octet-stream' });
        res.end(data);
      });
    });
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

function loadPlaywright() {
  const require = createRequire(import.meta.url);
  const extra = path.join(process.env.APPDATA || '', 'npm', 'node_modules');
  const id = require.resolve('playwright', { paths: [extra] });
  return require(id);
}

const server = await serve();
const port = server.address().port;
fs.mkdirSync(framesDir, { recursive: true });

const pw = loadPlaywright();
const browser = await pw.chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
  args: ['--font-render-hinting=none'],
});

try {
  for (const job of jobs) {
    const page = await browser.newPage({
      viewport: { width: job.w, height: job.h },
      deviceScaleFactor: 1,
    });
    await page.goto(`http://127.0.0.1:${port}${job.url}`, { waitUntil: 'networkidle' });
    await page.addStyleTag({ content: '.stage{transform:none !important}' });
    await page.waitForTimeout(400);
    const stage = page.locator('#stage');
    const out = path.join(framesDir, job.file);
    await stage.screenshot({ path: out, type: 'png', omitBackground: Boolean(job.alpha) });
    await page.close();
    const st = fs.statSync(out);
    console.log('WROTE', job.file, st.size);
  }
} finally {
  await browser.close();
  server.close();
}

const chroma = path.join(framesDir, 'lower-third-chroma.png');
if (fs.existsSync(chroma)) fs.unlinkSync(chroma);
