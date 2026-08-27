// Generates one static page per release: releases/<slug>/index.html.
//
// Why these files exist: link unfurlers (YouTube cards, Discord, iMessage,
// X, Facebook) don't run JavaScript and ignore query strings, so every
// /releases/?r=<slug> URL used to unfurl with the archive's generic title
// and logo. Each generated page carries its own og:title / og:image (the
// album art) / og:description in static markup, then hands rendering to the
// same releases.js the archive already uses (it reads the slug out of the
// path). The page body includes a static overview shell so cross-document
// view transitions can capture the incoming artwork before deferred scripts
// run; releases.js replaces it with the full detail view.
//
// Each page also carries JSON-LD (MusicAlbum / MusicRecording) describing the
// release and its tracks, since the visible body is rendered by releases.js
// and a crawler reading the static HTML would otherwise see nothing.
//
// Also rewrites sitemap.xml (the six hand-listed pages plus every release).
//
// Run after editing releases/data.js:
//   node scripts/build-release-pages.js          # write pages + sitemap
//   node scripts/build-release-pages.js --check  # CI: fail if out of date
//
// If a machine has no Node, this file also runs through JXA: load its text
// with `new Function`, call buildAll(RELEASES, TRACKS, todayMs), and write
// the returned files.
//
// Releases dated in the future are left out entirely: releases.js hides them
// from the archive until the date passes, so their pages get generated on the
// next run after release day (--check turns that into a red X as a reminder).

'use strict';

const ORIGIN = 'https://pokestir.com';

/* Pages hand-listed in the sitemap before releases were added to it. */
const STATIC_PAGES = ['/', '/releases/', '/gear/', '/terms/', '/links/', '/contact/', '/juicy16/'];

/* Same keys as PLATFORMS in releases/releases.js; used for the sameAs list
   in the structured data below. check-catalog.js rejects any other key. */
const PLATFORM_KEYS = ['bandcamp', 'spotify', 'appleMusic', 'youtubeMusic', 'youtube',
  'pandora', 'itunes', 'deezer', 'amazonMusic', 'tidal', 'qobuz'];

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

/* The data files are plain browser scripts declaring `const TRACKS` and
   `const RELEASES`; evaluate them and pull both out. */
function loadCatalog(tracksSrc, releasesSrc) {
  return new Function(tracksSrc + '\n' + releasesSrc + '\nreturn { TRACKS: TRACKS, RELEASES: RELEASES };')();
}

function escapeHTML(s) {
  return (s == null ? '' : String(s)).replace(/[&<>"']/g, (m) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[m]));
}

/* Accepts "YYYY-MM-DD" or "YYYY-MM" (same rules as releases.js). */
function parseReleaseDate(s) {
  const parts = String(s || '').split('-').map((p) => parseInt(p, 10));
  if (!parts.length || Number.isNaN(parts[0])) return null;
  return { y: parts[0], m: parts[1] || 1, d: parts[2] || null };
}

function formatReleaseDate(s) {
  const p = parseReleaseDate(s);
  if (!p) return '';
  const month = MONTHS[p.m - 1] || '';
  return p.d ? `${month} ${p.d}, ${p.y}` : `${month} ${p.y}`;
}

function dateMs(s) {
  const p = parseReleaseDate(s);
  return p ? new Date(p.y, p.m - 1, p.d || 1).getTime() : 0;
}

function isReleased(rel, todayMs) {
  return dateMs(rel.releaseDate) <= todayMs;
}

/* The same muted facts line the page itself shows: "Single · March 3, 2024 · 5 tracks". */
function factsLine(rel) {
  const n = (rel.tracklist || []).length;
  return [rel.type, formatReleaseDate(rel.releaseDate), n ? (n === 1 ? '1 track' : `${n} tracks`) : '']
    .filter(Boolean).join(' · ');
}

/* Unfurls truncate anyway; keep descriptions short and on a word boundary. */
function clamp(s, max) {
  const text = String(s || '').replace(/\s+/g, ' ').trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const space = cut.lastIndexOf(' ');
  return (space > max * 0.6 ? cut.slice(0, space) : cut).replace(/[,;:]$/, '') + '…';
}

/* The unfurl and the search result both print og:title above this, so the
   description doesn't repeat the title: it carries the facts line and
   nothing else unless the release has something of its own to say. Prose
   generated from the title was tried here and removed; it read as padding
   next to a title that already names the piece and its source. */
function metaDescription(rel) {
  const own = [rel.subtitle, rel.description].filter(Boolean).join('. ');
  return own ? clamp(own, 280) : factsLine(rel);
}

/* og:image dimensions help crawlers lay the card out without fetching the
   file first. Every artwork URL in the catalog is a 1000x1000 crop; read the
   size out of the URL rather than assuming it. */
function artworkSize(url) {
  const m = /\/(\d{2,4})x(\d{2,4})/.exec(url || '');
  return m ? { w: m[1], h: m[2] } : null;
}

/* Match the archive's lighter list/detail crop without changing the source
   catalog. Deezer exposes the same cover at each square size. */
function artAtSize(url, px) {
  return String(url || '').replace(/1000x1000/, `${px}x${px}`);
}

/* ── Structured data ──
   The page body is rendered by releases.js from the shared catalog, so the
   static HTML a crawler reads first carries nothing about the music. This
   block is the machine-readable version of what the page will show, and it
   is what search engines use for music results. Album -> MusicAlbum with a
   track list; a one-track single -> MusicRecording; anything in between
   (a two-track single) -> MusicAlbum tagged as a single release.

   ISRC and UPC are included here deliberately. They are the identifiers that
   tie these pages to the same recordings on every streaming service, which
   is the whole point of emitting them; they stay out of the *rendered*
   metadata line exactly as before. */

const ARTIST = { '@type': 'MusicGroup', name: 'Pokestir', url: `${ORIGIN}/` };

/* "3:21" -> "PT3M21S" */
function isoDuration(text) {
  const m = /^(\d+):([0-5]\d)$/.exec(String(text || '').trim());
  return m ? `PT${parseInt(m[1], 10)}M${parseInt(m[2], 10)}S` : null;
}

/* Resolve a release's tracklist the same way releases.js does: canonical
   recording from TRACKS, with per-release title/duration overrides. */
function resolveTracks(rel, TRACKS) {
  return (rel.tracklist || []).map((ref) => {
    const canonical = (TRACKS && TRACKS[ref.trackId]) || {};
    const has = (k) => Object.prototype.hasOwnProperty.call(ref, k);
    return {
      title: has('title') ? ref.title : canonical.title,
      duration: has('duration') ? ref.duration : canonical.duration,
      isrc: canonical.isrc || ''
    };
  }).filter((t) => t.title);
}

function prune(obj) {
  for (const k of Object.keys(obj)) {
    const v = obj[k];
    if (v == null || v === '' || (Array.isArray(v) && !v.length)) delete obj[k];
  }
  return obj;
}

/* No byArtist here: every recording on a release is by the release's artist,
   which the enclosing MusicAlbum already states. */
function recordingNode(track, position) {
  return prune({
    '@type': 'MusicRecording',
    position,
    name: track.title,
    duration: isoDuration(track.duration),
    isrcCode: track.isrc
  });
}

function structuredData(rel, tracks) {
  const sameAs = PLATFORM_KEYS.map((k) => rel.links && rel.links[k]).filter(Boolean)
    .concat((rel.otherLinks || []).map((l) => l && l.url).filter(Boolean));

  // A single holding one recording is that recording; it gets no album wrapper.
  const single = rel.type !== 'Album' && tracks.length === 1;
  const only = single ? tracks[0] : null;

  return prune({
    '@context': 'https://schema.org',
    '@type': single ? 'MusicRecording' : 'MusicAlbum',
    name: rel.title,
    url: `${ORIGIN}/releases/${rel.slug}/`,
    image: rel.artwork || `${ORIGIN}/images/og.jpg`,
    datePublished: rel.releaseDate || '',
    genre: rel.tags || [],
    byArtist: ARTIST,
    duration: single ? isoDuration(only.duration) : undefined,
    isrcCode: single ? only.isrc : undefined,
    albumReleaseType: single ? undefined : (rel.type === 'Album'
      ? 'https://schema.org/AlbumRelease'
      : 'https://schema.org/SingleRelease'),
    numTracks: single ? undefined : (tracks.length || undefined),
    identifier: (!single && rel.upc)
      ? { '@type': 'PropertyValue', propertyID: 'UPC', value: rel.upc }
      : undefined,
    track: single ? undefined : tracks.map((t, i) => recordingNode(t, i + 1)),
    sameAs
  });
}

/* JSON-LD sits inside <script>, so the only sequence that can break out of
   it is a literal "</script>"; escaping the slash is enough and keeps the
   payload readable. */
function jsonLd(data) {
  return JSON.stringify(data, null, 2).replace(/<\//g, '<\\/');
}

function renderReleasePage(rel, TRACKS) {
  const url = `${ORIGIN}/releases/${rel.slug}/`;
  const title = `Pokestir - ${rel.title}`;
  const desc = metaDescription(rel);
  const image = rel.artwork || `${ORIGIN}/images/og.jpg`;
  const size = artworkSize(image) || (rel.artwork ? null : { w: '1200', h: '1200' });
  const ogType = rel.type === 'Album' ? 'music.album' : 'music.song';

  const imageDims = size
    ? `\n  <meta property="og:image:width" content="${size.w}">\n  <meta property="og:image:height" content="${size.h}">`
    : '';

  const schema = jsonLd(structuredData(rel, resolveTracks(rel, TRACKS)));
  const shellFacts = escapeHTML(factsLine(rel)).replace(/ · /g, ' &middot; ');
  const shellArt = rel.artwork
    ? `<span class="detail-art mo-fade is-loaded" style="--art-url:url(${escapeHTML(JSON.stringify(artAtSize(rel.artwork, 500)))})"></span>`
    : '<span class="detail-art mo-fade"></span>';

  return `<!doctype html>
<html lang="en">
<head>
  <!-- Generated by scripts/build-release-pages.js from releases/data.js. Do not edit by hand. -->
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-J1Z4061KGM"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-J1Z4061KGM');
  </script>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escapeHTML(desc)}">
  <meta name="theme-color" content="#0b0f19">
  <meta property="og:type" content="${ogType}">
  <meta property="og:site_name" content="Pokestir">
  <meta property="og:title" content="${escapeHTML(title)}">
  <meta property="og:description" content="${escapeHTML(desc)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${escapeHTML(image)}">
  <meta property="og:image:alt" content="${escapeHTML(rel.title)} cover art">${imageDims}
  <meta name="twitter:card" content="summary">
  <meta name="twitter:site" content="@pokestir">
  <meta name="twitter:creator" content="@pokestir">
  <link rel="canonical" href="${url}">
  <title>${escapeHTML(title)}</title>
  <script type="application/ld+json">
${schema}
  </script>
  <!-- The display face, ahead of the stylesheet that references it. Without
       this it is only discovered once style.css has downloaded and parsed, a
       second round trip: on a slow connection every .page-title and .card-title
       renders in system-ui first and then reflows when Lato lands. Only the
       latin subset is listed; nothing in the catalog needs latin-ext, so
       preloading that one too would spend a request on a file no page uses. -->
  <link rel="preload" as="font" type="font/woff2" href="../../fonts/lato-700-latin.woff2" crossorigin>
  <link rel="stylesheet" href="../../style.css">
  <link rel="stylesheet" href="../releases.css">
  <link rel="icon" href="../../images/icon.png">
  <link rel="apple-touch-icon" href="../../images/apple-touch-icon.png">
  <script src="../tracks-data.js" defer></script>
  <script src="../data.js" defer></script>
  <script src="../releases.js" defer></script>
  <script src="../../nav.js" defer></script>
</head>
<body>
  <a href="#main" class="skip-link">Skip to content</a>
  <nav class="site-nav" aria-label="Site navigation">
    <div class="site-nav__inner">
      <a class="site-nav__brand" href="/"><img src="../../images/icon.png" alt="Pokestir" class="site-nav__logo"></a>
      <button class="site-nav__toggle" aria-label="Open navigation" aria-expanded="false" aria-controls="site-nav-links"><span class="site-nav__burger" aria-hidden="true"></span></button>
      <div class="site-nav__links" id="site-nav-links">
        <a href="/">Home</a>
        <a href="/releases/">Releases</a>
        <a href="/gear/">Software & Gear</a>
        <a href="/terms/">Usage Terms & Claims</a>
      </div>
    </div>
  </nav>

  <main class="wrap" role="main" id="main">
    <!-- The static overview gives the incoming view transition an artwork target. -->
    <div id="listView" hidden></div>
    <div id="detailView">
      <a class="back-link" href="/releases/">&larr; All Releases</a>
      <div class="detail-stack">
        <section class="card detail-head" aria-label="Release overview">
          <div class="art" aria-hidden="true">${shellArt}</div>
          <div class="info">
            <h1 class="d-title">${escapeHTML(rel.title)}</h1>${rel.subtitle ? `
            <div class="d-sub">${escapeHTML(rel.subtitle)}</div>` : ''}
            <div class="d-facts">${shellFacts}</div>
          </div>
        </section>
      </div>
    </div>

    <footer class="site-footer" role="contentinfo">
      <nav class="social-strip" aria-label="Social and support links">
        <a href="https://www.youtube.com/pokestir" target="_blank" rel="noopener noreferrer" aria-label="YouTube — opens in a new tab" style="--icon:url(../../images/icons/youtube.svg)"></a>
        <a href="https://x.com/pokestir" target="_blank" rel="noopener noreferrer" aria-label="X / Twitter — opens in a new tab" style="--icon:url(../../images/icons/x.svg)"></a>
        <a href="https://bsky.app/profile/pokestir.com" target="_blank" rel="noopener noreferrer" aria-label="Bluesky — opens in a new tab" style="--icon:url(../../images/icons/bluesky.svg)"></a>
        <a href="https://www.instagram.com/pokestir_/" target="_blank" rel="noopener noreferrer" aria-label="Instagram — opens in a new tab" style="--icon:url(../../images/icons/instagram.svg)"></a>
        <a href="https://discord.com/invite/7CGg9Tk" target="_blank" rel="noopener noreferrer" aria-label="Discord — opens in a new tab" style="--icon:url(../../images/icons/discord.svg)"></a>
        <a href="https://www.patreon.com/c/pokestir" target="_blank" rel="noopener noreferrer" aria-label="Patreon — opens in a new tab" style="--icon:url(../../images/icons/patreon.svg)"></a>
        <a href="https://ko-fi.com/pokestir" target="_blank" rel="noopener noreferrer" aria-label="Ko&#8209;fi — opens in a new tab" style="--icon:url(../../images/icons/kofi.svg)"></a>
      </nav>
      <p>Copyright &copy; 2026 Pokestir. All rights reserved. <a class="all-links" href="../../links/">All links</a> &middot; <a class="all-links" href="../../contact/">Contact me</a></p>
    </footer>
  </main>
</body>
</html>
`;
}

function renderSitemap(releases) {
  const locs = STATIC_PAGES.map((p) => ORIGIN + p)
    .concat(releases.map((rel) => `${ORIGIN}/releases/${rel.slug}/`));
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${locs.map((loc) => `  <url><loc>${loc}</loc></url>`).join('\n')}
</urlset>
`;
}

/* Returns every file the catalog implies, as repo-relative paths.
   TRACKS is needed for the per-release structured data (track names,
   durations, ISRCs). */
function buildAll(RELEASES, TRACKS, todayMs) {
  const released = RELEASES.filter((rel) => rel.slug && isReleased(rel, todayMs))
    .slice()
    .sort((a, b) => dateMs(b.releaseDate) - dateMs(a.releaseDate));

  const files = released.map((rel) => ({
    path: `releases/${rel.slug}/index.html`,
    content: renderReleasePage(rel, TRACKS)
  }));
  files.push({ path: 'sitemap.xml', content: renderSitemap(released) });
  return files;
}

/* Node entry point; `require` is absent when this is embedded elsewhere. */
if (typeof require !== 'undefined' && typeof module !== 'undefined' && require.main === module) {
  const fs = require('fs');
  const path = require('path');
  const root = path.join(__dirname, '..');
  const check = process.argv.includes('--check');

  const tracksSrc = fs.readFileSync(path.join(root, 'releases', 'tracks-data.js'), 'utf8');
  const releasesSrc = fs.readFileSync(path.join(root, 'releases', 'data.js'), 'utf8');
  const now = new Date();
  const todayMs = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  let files;
  try {
    const catalog = loadCatalog(tracksSrc, releasesSrc);
    files = buildAll(catalog.RELEASES, catalog.TRACKS, todayMs);
  } catch (e) {
    console.error(`Catalog data failed to parse: ${e.message}`);
    process.exit(1);
  }

  if (check) {
    const stale = files.filter((f) => {
      let current = null;
      try { current = fs.readFileSync(path.join(root, f.path), 'utf8'); } catch (e) { /* missing */ }
      return current !== f.content;
    });
    // A page left behind by a renamed or deleted release keeps serving stale
    // metadata, so orphans are failures too.
    const expected = new Set(files.map((f) => f.path));
    const orphans = fs.readdirSync(path.join(root, 'releases'), { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => `releases/${d.name}/index.html`)
      .filter((p) => !expected.has(p) && fs.existsSync(path.join(root, p)));

    for (const f of stale) console.error(`error: ${f.path} is missing or out of date.`);
    for (const p of orphans) console.error(`error: ${p} has no matching release in data.js.`);
    const bad = stale.length + orphans.length;
    console.log(`${files.length - 1} release pages + sitemap.xml: ${bad} out of date.` +
      (bad ? ' Run: node scripts/build-release-pages.js' : ''));
    process.exit(bad ? 1 : 0);
  }

  let written = 0;
  for (const f of files) {
    const dest = path.join(root, f.path);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    let current = null;
    try { current = fs.readFileSync(dest, 'utf8'); } catch (e) { /* new file */ }
    if (current === f.content) continue;
    fs.writeFileSync(dest, f.content);
    written++;
  }
  console.log(`${files.length - 1} release pages + sitemap.xml checked, ${written} written.`);
}
