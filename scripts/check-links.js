// Checks that the catalog's hotlinked media still resolves: release artwork
// on Deezer's CDN and track previews on Spotify's CDN. Neither URL scheme is
// guaranteed by those services, and when one dies the site degrades silently
// (placeholder artwork, preview row resets), so this runs on a weekly CI
// schedule (see .github/workflows/site-checks.yml) and fails loudly instead.
// Run locally with: node scripts/check-links.js
//
// Only definitive failures (4xx after a GET retry) fail the run; timeouts,
// 5xx and rate limits are reported but tolerated to avoid false alarms.

'use strict';

const fs = require('fs');
const path = require('path');

const CONCURRENCY = 8;
const TIMEOUT_MS = 15000;

const root = path.join(__dirname, '..');
const tracksSrc = fs.readFileSync(path.join(root, 'releases', 'tracks-data.js'), 'utf8');
const releasesSrc = fs.readFileSync(path.join(root, 'releases', 'data.js'), 'utf8');
const { TRACKS, RELEASES } = new Function(
  tracksSrc + '\n' + releasesSrc + '\nreturn { TRACKS: TRACKS, RELEASES: RELEASES };')();

const targets = [];
for (const rel of RELEASES) {
  if (rel.artwork) targets.push({ url: rel.artwork, what: `artwork for ${rel.slug}` });
}
for (const [key, track] of Object.entries(TRACKS)) {
  if (track.preview) targets.push({ url: track.preview, what: `preview for ${key}` });
}

async function fetchStatus(url, method) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method,
      redirect: 'follow',
      signal: controller.signal,
      headers: method === 'GET' ? { Range: 'bytes=0-0' } : {}
    });
    // Drain nothing: a Range GET returns at most one byte.
    return res.status;
  } finally {
    clearTimeout(timer);
  }
}

async function check(target) {
  try {
    let status = await fetchStatus(target.url, 'HEAD');
    // Some CDNs reject HEAD; only trust a failure confirmed by GET.
    if (status >= 400) status = await fetchStatus(target.url, 'GET');
    if (status >= 200 && status < 400) return { target, ok: true };
    if (status === 429 || status >= 500) return { target, ok: true, note: `tolerated HTTP ${status}` };
    return { target, ok: false, note: `HTTP ${status}` };
  } catch (e) {
    return { target, ok: true, note: `tolerated network error (${e.name || e.message})` };
  }
}

async function main() {
  const queue = targets.slice();
  const dead = [];
  let noted = 0;

  async function worker() {
    for (let t = queue.shift(); t; t = queue.shift()) {
      const res = await check(t);
      if (!res.ok) {
        dead.push(res);
        console.error(`dead: ${res.target.what}: ${res.note} for ${res.target.url}`);
      } else if (res.note) {
        noted++;
        console.log(`note: ${res.target.what}: ${res.note}`);
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  console.log(`Checked ${targets.length} URLs: ${dead.length} dead, ${noted} tolerated.`);
  if (dead.length) {
    console.error('Dead media links found. Replace the URLs above in releases/data.js ' +
      'or releases/tracks-data.js (artwork), or refresh the Spotify preview URL (previews).');
    process.exit(1);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
