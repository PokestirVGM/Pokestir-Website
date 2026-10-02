// Generates one static page per release: releases/<slug>/index.html.
//
// Why these files exist: link unfurlers (YouTube cards, Discord, iMessage,
// X, Facebook) don't run JavaScript and ignore query strings, so every
// /releases/?r=<slug> URL used to unfurl with the archive's generic title
// and logo. Each generated page carries its own og:title / og:image (the
// album art) / og:description, listening links, and tracks in static markup.
// details.js adds playback and refreshes compilation links when membership
// has changed since generation. Cross-document view transitions
// can capture the incoming artwork before deferred scripts run.
//
// Each page also carries JSON-LD (MusicAlbum / MusicRecording) describing the
// release and its tracks alongside the visible static content.
//
// Also rewrites sitemap.xml (the six hand-listed pages plus every release),
// and the Latest Releases row on the home page: the block between the
// latest-releases markers in index.html, so the home page never loads the
// catalog just to show six covers.
//
// Run after editing releases/data.js:
//   node scripts/build-release-pages.js          # write pages + sitemap
//   node scripts/build-release-pages.js --check  # CI: fail if out of date
//
// If a machine has no Node, this file also runs through JXA: load its text
// with `new Function`, call buildAll(RELEASES, TRACKS, todayMs, indexHtml),
// passing the current index.html text, and write the returned files.
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

function artSrcset(url) {
  return [250, 500, 750, 1000].map((px) => `${escapeHTML(artAtSize(url, px))} ${px}w`).join(', ');
}

// The archive needs searchable metadata and membership, not streaming URLs
// or audio previews. Canonical detail pages still carry their complete data.
function archiveCatalog(RELEASES, TRACKS) {
  const releases = RELEASES.map((rel) => ({ ...prune({
    slug: rel.slug, title: rel.title, subtitle: rel.subtitle, type: rel.type,
    releaseDate: rel.releaseDate, tags: rel.tags, description: rel.description,
    upc: rel.upc, artwork: rel.artwork
  }), tracklist: rel.tracklist }));
  const tracks = {};
  for (const [id, track] of Object.entries(TRACKS)) {
    tracks[id] = prune({ title: track.title, isrc: track.isrc, artists: track.artists });
  }
  return '// Generated by scripts/build-release-pages.js. Do not edit.\n' +
    `const TRACKS=${JSON.stringify(tracks)};\nconst RELEASES=${JSON.stringify(releases)};\n`;
}

/* ── Home page: Latest Releases ──
   The four newest singles and the two newest albums, sorted together by date
   and drawn identically: albums are not set apart, they only add a track
   count to the date. Short titles and the game come out of the house title
   form, `Title (From "Game") [...]`; an album's game comes from its subtitle,
   `Music from "Game"`, and is left out when neither names one. */
const LATEST_START = '<!-- latest-releases:start (generated by scripts/build-release-pages.js; do not edit) -->';
const LATEST_END = '<!-- latest-releases:end -->';

function shortTitle(title) {
  const t = String(title || '');
  const cut = t.search(/\s*[([](?:From|from)\s+["“]/);
  return (cut > 0 ? t.slice(0, cut) : t).trim();
}

function gameName(rel) {
  const m = /["“]([^"”]+)["”]/.exec(`${rel.title || ''} ${rel.subtitle || ''}`);
  return m ? m[1] : '';
}

function latestReleases(released) {
  const singles = released.filter((r) => r.type !== 'Album').slice(0, 4);
  const albums = released.filter((r) => r.type === 'Album').slice(0, 2);
  return singles.concat(albums).sort((a, b) => dateMs(b.releaseDate) - dateMs(a.releaseDate));
}

function renderLatest(released) {
  const tiles = latestReleases(released).map((rel, index) => {
    const n = (rel.tracklist || []).length;
    const game = gameName(rel);
    const count = rel.type === 'Album' && n ? ` · ${n} tracks` : '';
    const img = rel.artwork
      ? `<img src="${escapeHTML(artAtSize(rel.artwork, 500))}" srcset="${artSrcset(rel.artwork)}" sizes="(max-width: 640px) 42vw, (max-width: 1120px) calc((100vw - 116px) / 6), 167px" alt="" width="500" height="500" decoding="async"${index === 0 ? ' fetchpriority="high"' : ' loading="lazy"'}>`
      : '';
    return `        <a class="lt" href="/releases/${escapeHTML(rel.slug)}/">
          <span class="lt-cover">${img}</span>
          <span class="lt-text">
            <span class="lt-name">${escapeHTML(shortTitle(rel.title))}</span>${game ? `
            <span class="lt-game">${escapeHTML(game)}</span>` : ''}
            <span class="lt-date"><time datetime="${escapeHTML(rel.releaseDate)}">${escapeHTML(formatReleaseDate(rel.releaseDate))}</time>${count}</span>
          </span>
        </a>`;
  });
  return `${LATEST_START}\n${tiles.join('\n')}\n        ${LATEST_END}`;
}

function renderHome(indexHtml, released) {
  const a = indexHtml.indexOf(LATEST_START);
  const b = indexHtml.indexOf(LATEST_END);
  if (a < 0 || b < a) throw new Error('index.html is missing the latest-releases markers');
  return indexHtml.slice(0, a) + renderLatest(released) + indexHtml.slice(b + LATEST_END.length);
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
      isrc: canonical.isrc || '',
      artists: canonical.artists,
      preview: canonical.preview
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

/* A detail page needs its own recordings and any containing compilations,
   not the entire archive. Include future compilations too: the browser still
   decides which are released using the visitor's local calendar date. */
function detailCatalog(rel, TRACKS, RELEASES) {
  const ids = new Set((rel.tracklist || []).map((ref) => ref.trackId));
  const releases = [rel, ...RELEASES.filter((other) => {
    if (other === rel || !ids.size || other.tracklist.length <= rel.tracklist.length) return false;
    const otherIds = new Set(other.tracklist.map((ref) => ref.trackId));
    return [...ids].every((id) => otherIds.has(id));
  })];
  const tracks = {};
  for (const release of releases) {
    for (const ref of release.tracklist) {
      const track = TRACKS[ref.trackId];
      tracks[ref.trackId] = ids.has(ref.trackId) ? track : prune({ title: track.title, isrc: track.isrc });
    }
  }
  return { tracks, releases };
}

const PLATFORMS = [
  ['bandcamp', 'Bandcamp', 'bandcamp.svg'], ['spotify', 'Spotify', 'spotify.svg'],
  ['appleMusic', 'Apple Music', 'applemusic.svg'], ['youtubeMusic', 'YouTube Music', 'youtube.svg'],
  ['youtube', 'YouTube', 'youtube.svg'], ['pandora', 'Pandora', 'pandora.svg'],
  ['itunes', 'iTunes Store', 'itunes.svg'], ['deezer', 'Deezer', 'deezer.svg'],
  ['amazonMusic', 'Amazon Music', 'amazonmusic.svg'], ['tidal', 'TIDAL', 'tidal.svg'],
  ['qobuz', 'Qobuz', 'qobuz.svg']
];

function platformButtons(rel, host) {
  const buttons = PLATFORMS.flatMap(([key, label, icon]) => {
    const url = (host && host.links && host.links[key]) || (rel.links && rel.links[key]);
    return url ? [`<a class="btn plat-${key}" href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer" aria-label="${label} (opens in a new tab)"><img src="/images/icons/${icon}" width="20" height="20" alt="">${label}</a>`] : [];
  });
  for (const extra of rel.otherLinks || []) {
    if (!extra || !extra.url) continue;
    const linkfire = extra.label === 'Listen Everywhere';
    const label = linkfire ? 'Linkfire' : escapeHTML(extra.label);
    buttons.push(`<a class="btn${linkfire ? ' plat-linkfire' : ''}" href="${escapeHTML(extra.url)}" target="_blank" rel="noopener noreferrer" aria-label="${label} (opens in a new tab)">${linkfire ? '<img src="/images/icons/linkfire.png" width="20" height="20" alt="">' : ''}${label}</a>`);
  }
  return buttons.join('\n');
}

function staticTrackRows(tracks) {
  return tracks.map((t, i) => {
    const interactive = t.preview ? ` role="button" tabindex="0" data-preview="${escapeHTML(t.preview)}" data-title="${escapeHTML(t.title)}" aria-label="Play preview: ${escapeHTML(t.title)}"` : '';
    const icons = t.preview ? '<span class="t-ic-play"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg></span><span class="t-ic-pause"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg></span>' : '';
    return `<div class="track-row${t.preview ? ' has-preview' : ''}"${interactive}><div class="t-lead" aria-hidden="true"><span class="t-num">${i + 1}</span>${icons}</div><div class="t-main"><div class="t-title">${escapeHTML(t.title)}</div><div class="t-artist">${escapeHTML(t.artists && t.artists.length ? t.artists.join(', ') : 'Pokestir')}</div></div>${t.duration ? `<div class="t-dur">${escapeHTML(t.duration)}</div>` : '<div></div>'}</div>`;
  }).join('\n');
}

function renderReleasePage(rel, TRACKS, RELEASES, todayMs) {
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
  const catalog = detailCatalog(rel, TRACKS, RELEASES);
  const host = catalog.releases.slice(1).filter((other) => isReleased(other, todayMs))
    .sort((a, b) => dateMs(b.releaseDate) - dateMs(a.releaseDate))[0];
  const buttons = platformButtons(rel, host);
  const tracks = resolveTracks(rel, TRACKS);
  const shellFacts = escapeHTML(factsLine(rel)).replace(/ · /g, ' &middot; ');
  const shellArt = rel.artwork
    ? `<img class="detail-art mo-fade is-loaded" src="${escapeHTML(artAtSize(rel.artwork, 500))}" srcset="${artSrcset(rel.artwork)}" sizes="172px" width="500" height="500" alt="" decoding="async" fetchpriority="high">`
    : '<span class="detail-art mo-fade"></span>';

  return `<!doctype html>
<html lang="en">
<head>
  <!-- Generated by scripts/build-release-pages.js from releases/data.js. Do not edit by hand. -->
  <!-- Google tag (gtag.js) -->
  <script async fetchpriority="low" src="https://www.googletagmanager.com/gtag/js?id=G-J1Z4061KGM"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-J1Z4061KGM');
  </script>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script>
    // A cancelled browser transition still completes the navigation.
    addEventListener('pagereveal', (event) => {
      if (event.viewTransition) event.viewTransition.ready.catch(() => {});
    });
  </script>
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
  ${rel.artwork ? `<link rel="preconnect" href="${escapeHTML(/^https?:\/\/[^/]+/.exec(rel.artwork)[0])}" crossorigin>` : ''}
  ${rel.artwork ? `<link rel="preload" as="image" href="${escapeHTML(artAtSize(rel.artwork, 500))}" imagesrcset="${artSrcset(rel.artwork)}" imagesizes="172px" fetchpriority="high">` : ''}
  <link rel="stylesheet" href="../../style.min.css">
  <link rel="stylesheet" href="../releases.min.css">
  <link rel="icon" type="image/png" sizes="128x128" href="../../images/favicon.png">
  <link rel="apple-touch-icon" href="../../images/apple-touch-icon.png">
  <script type="application/json" id="release-catalog">${JSON.stringify(catalog).replace(/</g, '\\u003c')}</script>
  <script src="../../nav.min.js" defer></script>
  <script src="../details.min.js" defer blocking="render"></script>
</head>
<body>
  <a href="#main" class="skip-link">Skip to content</a>
  <nav class="site-nav" aria-label="Site navigation">
    <div class="site-nav__inner">
      <a class="site-nav__brand" href="/"><img src="../../images/icon-96.webp" srcset="../../images/icon-48.webp 48w, ../../images/icon-96.webp 96w, ../../images/icon-192.webp 192w, ../../images/icon.webp 1000w" sizes="48px" alt="Pokestir" width="1000" height="1000" class="site-nav__logo"></a>
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
    <!-- Complete content is in the HTML; JavaScript adds playback. -->
    <div id="listView" hidden></div>
    <div id="detailView" data-rendered="${escapeHTML(rel.slug)}" data-host="${host ? escapeHTML(host.slug) : ''}">
      <a class="back-link" href="/releases/"><span class="back-arrow" aria-hidden="true">&larr;</span> All Releases</a>
      <div class="detail-stack">
        <section class="card detail-head" aria-label="Release overview">
          <div class="art" aria-hidden="true">${shellArt}</div>
          <div class="info">
            <h1 class="d-title">${escapeHTML(rel.title)}</h1>${rel.subtitle ? `
            <div class="d-sub">${escapeHTML(rel.subtitle)}</div>` : ''}
            <div class="d-facts">${shellFacts}</div>
            ${host ? `<div class="d-from">Included in <a href="/releases/${escapeHTML(host.slug)}/">${escapeHTML(host.title)}</a><div class="d-from-note">The listening links below open the compilation.</div></div>` : ''}
            ${rel.description ? `<p class="d-desc">${escapeHTML(rel.description)}</p>` : ''}
            ${buttons ? `<nav class="plat-links" aria-label="Listen on">${buttons}</nav>` : ''}
          </div>
        </section>
        <div class="tracks-section">
          <h2 class="page-title">Tracks</h2>
          ${tracks.some((t) => t.preview) ? '<p class="section-sub">Click a track for a 30-second preview (96 kbps). Full quality is on the links above.</p>' : ''}
          <section class="tracks-list" aria-label="Track list">${staticTrackRows(tracks)}</section>
        </div>
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
`.replace(/[ \t]+$/gm, '');
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
function buildAll(RELEASES, TRACKS, todayMs, indexHtml) {
  const released = RELEASES.filter((rel) => rel.slug && isReleased(rel, todayMs))
    .slice()
    .sort((a, b) => dateMs(b.releaseDate) - dateMs(a.releaseDate));

  const files = released.map((rel) => ({
    path: `releases/${rel.slug}/index.html`,
    content: renderReleasePage(rel, TRACKS, RELEASES, todayMs)
  }));
  files.push({ path: 'releases/catalog.min.js', content: archiveCatalog(RELEASES, TRACKS) });
  // Rare fallback for a known release whose canonical page is unavailable.
  // Kept off the normal archive loading path, without losing links/previews.
  files.push({ path: 'releases/details.json', content: JSON.stringify({ tracks: TRACKS, releases: RELEASES }) + '\n' });
  files.push({ path: 'sitemap.xml', content: renderSitemap(released) });
  if (indexHtml != null) files.push({ path: 'index.html', content: renderHome(indexHtml, released) });
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
    const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
    files = buildAll(catalog.RELEASES, catalog.TRACKS, todayMs, indexHtml);
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
    console.log(`${releasedPageCount(files)} release pages + catalog + sitemap.xml + home Latest Releases: ${bad} out of date.` +
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
  console.log(`${releasedPageCount(files)} release pages + catalog + sitemap.xml + home Latest Releases checked, ${written} written.`);
}

function releasedPageCount(files) {
  return files.filter((f) => /^releases\/[^/]+\/index\.html$/.test(f.path)).length;
}

if (typeof module !== 'undefined') module.exports = { buildAll, loadCatalog, archiveCatalog, detailCatalog, resolveTracks, platformButtons, PLATFORMS };
