// Production copies only: keep editing the readable .js/.css sources.
// Generated assets are committed so GitHub Pages still serves static files.
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { transformSync } = require('esbuild');
const root = path.join(__dirname, '..');
const check = process.argv.includes('--check');
const entries = {
  'nav.min.js': ['nav.js'],
  'home/player.min.js': ['home/tracks.js', 'home/player.js'],
  'releases/releases.min.js': ['releases/releases.js'],
  'releases/details.min.js': ['releases/details.js'],
  'gear/gear.min.js': ['gear/gear.js']
};
for (const file of ['style.css', 'home/home.css', 'releases/releases.css', 'gear/gear.css',
  'terms/terms.css', 'contact/contact.css', 'links/links.css', 'juicy16/juicy16.css']) {
  entries[file.replace('.css', '.min.css')] = [file];
}
let stale = 0;
let before = 0;
let after = 0;
for (const [dest, sources] of Object.entries(entries)) {
  const source = sources.map(file => fs.readFileSync(path.join(root, file), 'utf8')).join('\n');
  const loader = dest.endsWith('.css') ? 'css' : 'js';
  const { code } = transformSync(source, {
    loader, sourcefile: sources.join('+'), charset: 'utf8', legalComments: 'none',
    minifyWhitespace: true, minifyIdentifiers: loader === 'js', minifySyntax: false
  });
  const output = path.join(root, dest);
  before += Buffer.byteLength(source);
  after += Buffer.byteLength(code);
  let current = null;
  try { current = fs.readFileSync(output, 'utf8'); } catch { /* first build */ }
  if (current === code) continue;
  if (check) {
    console.error(`error: ${dest} is missing or out of date. Run: npm run build`);
    stale++;
  } else fs.writeFileSync(output, code);
}
console.log(`Browser assets: ${before.toLocaleString()} -> ${after.toLocaleString()} bytes; ${stale} stale.`);
if (stale) process.exitCode = 1;
