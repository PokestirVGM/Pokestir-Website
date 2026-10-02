// Guard the reductions that make a difference on slow links, and verify that
// pruning browser data never changes search or generated release content.
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { loadCatalog, PLATFORMS } = require('./build-release-pages.js');
const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
for (const file of ['releases/releases.js', 'releases/details.js']) {
  const array = /const PLATFORMS = (\[[\s\S]*?\n  \]);/.exec(read(file));
  assert.ok(array, `${file} is missing its platform definitions.`);
  const platforms = new Function(`return (${array[1]});`)();
  assert.deepEqual(platforms.map(p => [p.key, p.label, p.icon]), PLATFORMS, `${file} and the static generator must use identical platforms.`);
}
const source = loadCatalog(read('releases/tracks-data.js'), read('releases/data.js'));
const compact = new Function(read('releases/catalog.min.js') + '\nreturn { TRACKS, RELEASES };')();
assert.equal(compact.RELEASES.length, source.RELEASES.length, 'Archive must retain all releases, including future ones.');
const searchable = rel => [rel.title, rel.subtitle, rel.type, rel.description, rel.upc, rel.slug,
  rel.releaseDate, (rel.tags || []).join(' '), JSON.stringify(rel.tracklist)].join('|');
for (let i = 0; i < source.RELEASES.length; i++) {
  assert.equal(searchable(compact.RELEASES[i]), searchable(source.RELEASES[i]), `Lost archive metadata: ${source.RELEASES[i].slug}`);
}
for (const [id, track] of Object.entries(source.TRACKS)) {
  const reduced = compact.TRACKS[id];
  assert.ok(reduced, `Missing search recording: ${id}`);
  for (const key of ['title', 'isrc', 'artists']) {
    const empty = key === 'artists' ? [] : '';
    assert.deepEqual(reduced[key] || empty, track[key] || empty, `Lost searchable ${key}: ${id}`);
  }
  assert.ok(!reduced.preview, 'The archive must not download preview URLs.');
}
assert.deepEqual(JSON.parse(read('releases/details.json')), { tracks: source.TRACKS, releases: source.RELEASES }, 'Missing-page fallback must retain the complete catalog.');
let pages = 0;
for (const rel of source.RELEASES) {
  const file = path.join(root, 'releases', rel.slug, 'index.html');
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, 'utf8');
  const embedded = /<script type="application\/json" id="release-catalog">(.*?)<\/script>/s.exec(html);
  assert.ok(embedded, `Missing detail data: ${rel.slug}`);
  const catalog = JSON.parse(embedded[1]);
  assert.deepEqual(catalog.releases[0], rel, `Changed detail release: ${rel.slug}`);
  for (const ref of rel.tracklist) {
    assert.deepEqual(catalog.tracks[ref.trackId], source.TRACKS[ref.trackId], `Lost detail track: ${ref.trackId}`);
  }
  assert.equal((html.match(/class="track-row(?: has-preview)?"/g) || []).length, rel.tracklist.length, `Missing static tracks: ${rel.slug}`);
  assert.ok(!html.includes('src="../releases.min.js"'), `Detail page loads archive code: ${rel.slug}`);
  pages++;
}
const budgets = {
  'nav.min.js': 12000,
  'style.min.css': 18000,
  'home/player.min.js': 10000,
  'releases/releases.min.js': 26000,
  'releases/details.min.js': 7000,
  'releases/catalog.min.js': 180000,
  'gear/gear.min.js': 14000
};
for (const [file, budget] of Object.entries(budgets)) {
  const bytes = Buffer.byteLength(read(file));
  assert.ok(bytes <= budget, `${file}: ${bytes} bytes exceeds the ${budget}-byte performance budget.`);
}
for (const file of ['index.html', 'releases/index.html', 'gear/index.html', 'terms/index.html',
  'contact/index.html', 'links/index.html', 'juicy16/index.html', '404.html']) {
  const html = read(file);
  for (const match of html.matchAll(/(?:src|href)="([^"]+\.(?:js|css))"/g)) {
    assert.ok(match[1].includes('.min.'), `${file} loads unoptimized ${match[1]}`);
    const target = match[1].startsWith('/') ? path.join(root, match[1]) : path.resolve(root, path.dirname(file), match[1]);
    assert.ok(fs.existsSync(target), `${file} references missing asset ${match[1]}`);
  }
}
console.log(`Performance budgets, full archive search data, and ${pages} static detail pages: passed.`);
