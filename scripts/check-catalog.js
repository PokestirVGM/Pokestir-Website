// Validates releases/tracks-data.js and releases/data.js before deploy.
//
// releases.js runs the same kind of checks in the visitor's browser console,
// where nobody looks. This script runs them in CI (see
// .github/workflows/site-checks.yml) so a bad hand edit marks the push with
// a red X and emails the owner. (GitHub Pages still deploys the push; CI
// can't block it, only report it.) Run locally with:
// node scripts/check-catalog.js
//
// Errors fail the run; warnings are printed but pass.

'use strict';

/* The data files are plain browser scripts declaring `const TRACKS` and
   `const RELEASES`; evaluate them and pull both out. A syntax error here is
   itself a catalog error. */
function loadCatalog(tracksSrc, releasesSrc) {
  return new Function(tracksSrc + '\n' + releasesSrc + '\nreturn { TRACKS: TRACKS, RELEASES: RELEASES };')();
}

function validateCatalog(TRACKS, RELEASES) {
  const errors = [];
  const warnings = [];

  const ISRC_RE = /^[A-Z]{2}[A-Z0-9]{3}\d{7}$/;
  const SPOTIFY_PREVIEW_RE = /^https:\/\/p\.scdn\.co\//;
  const DURATION_RE = /^\d+:\d{2}$/;
  const SLUG_RE = /^[a-z0-9-]+$/;
  const DATE_RE = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/;
  const KNOWN_TYPES = ['Single', 'Album'];
  /* Must match PLATFORMS in releases.js: a key that isn't in this list renders
     no button at all, which looks identical to the link simply being absent. */
  const KNOWN_PLATFORMS = ['bandcamp', 'spotify', 'appleMusic', 'youtubeMusic',
    'youtube', 'pandora', 'itunes', 'deezer', 'amazonMusic', 'tidal', 'qobuz'];

  /* ---- tracks ---- */
  for (const [key, track] of Object.entries(TRACKS)) {
    if (!track || typeof track !== 'object') {
      errors.push(`Track ${key}: not an object.`);
      continue;
    }
    if (key.startsWith('isrc:')) {
      const isrc = key.slice(5);
      if (!ISRC_RE.test(isrc)) errors.push(`Track ${key}: malformed ISRC in key.`);
      if (track.isrc !== isrc) errors.push(`Track ${key}: key does not match its isrc field ("${track.isrc}").`);
    } else if (key.startsWith('local:')) {
      if (!SLUG_RE.test(key.slice(6))) errors.push(`Track ${key}: local key must be a lowercase slug.`);
    } else {
      errors.push(`Track ${key}: key must start with "isrc:" or "local:".`);
    }
    if (!track.title || typeof track.title !== 'string') {
      errors.push(`Track ${key}: missing title.`);
    }
    if (track.duration && !DURATION_RE.test(track.duration)) {
      errors.push(`Track ${key}: duration "${track.duration}" is not m:ss.`);
    }
    // Previews must be Spotify MP3s: Deezer preview URLs are signed and
    // expire in minutes; Apple previews are AAC and fail in some browsers.
    if (track.preview && !SPOTIFY_PREVIEW_RE.test(track.preview)) {
      errors.push(`Track ${key}: preview must be a https://p.scdn.co/ URL, got "${track.preview}".`);
    }
  }

  /* ---- releases ---- */
  const seenSlugs = new Set();
  const seenUpcs = new Map();
  const referencedTrackIds = new Set();

  RELEASES.forEach((rel, i) => {
    const label = rel && rel.slug ? `Release ${rel.slug}` : `Release at index ${i}`;
    if (!rel || typeof rel !== 'object') {
      errors.push(`${label}: not an object.`);
      return;
    }
    if (!rel.slug) {
      errors.push(`${label}: missing slug.`);
    } else {
      if (!SLUG_RE.test(rel.slug)) errors.push(`${label}: slug must be a lowercase slug.`);
      if (seenSlugs.has(rel.slug)) errors.push(`${label}: duplicate slug.`);
      seenSlugs.add(rel.slug);
    }
    if (!rel.title || typeof rel.title !== 'string') errors.push(`${label}: missing title.`);
    if (!KNOWN_TYPES.includes(rel.type)) warnings.push(`${label}: unrecognized type "${rel.type}".`);

    const dm = DATE_RE.exec(rel.releaseDate || '');
    if (!dm) {
      errors.push(`${label}: releaseDate "${rel.releaseDate}" is not YYYY-MM or YYYY-MM-DD.`);
    } else {
      const month = parseInt(dm[2], 10);
      const day = dm[3] ? parseInt(dm[3], 10) : 1;
      if (month < 1 || month > 12 || day < 1 || day > 31) {
        errors.push(`${label}: releaseDate "${rel.releaseDate}" has an impossible month or day.`);
      }
    }

    if (rel.upc) {
      if (!/^\d{12,13}$/.test(rel.upc)) errors.push(`${label}: UPC "${rel.upc}" is not 12-13 digits.`);
      if (seenUpcs.has(rel.upc)) warnings.push(`${label}: UPC also used by ${seenUpcs.get(rel.upc)}.`);
      seenUpcs.set(rel.upc, rel.slug || `index ${i}`);
    }

    if (rel.artwork && !/^https:\/\//.test(rel.artwork)) {
      errors.push(`${label}: artwork URL must be https.`);
    }
    for (const [platform, url] of Object.entries(rel.links || {})) {
      if (!KNOWN_PLATFORMS.includes(platform)) {
        errors.push(`${label}: unknown platform key "${platform}" (nothing renders it).`);
      }
      if (url && !/^https:\/\//.test(url)) errors.push(`${label}: ${platform} link must be https.`);
    }
    for (const extra of rel.otherLinks || []) {
      if (!extra || !extra.label || !/^https:\/\//.test(extra.url || '')) {
        errors.push(`${label}: otherLinks entries need a label and an https url.`);
      }
    }

    if (!Array.isArray(rel.tracklist) || !rel.tracklist.length) {
      errors.push(`${label}: tracklist is missing or empty.`);
      return;
    }
    const seenTrackIds = new Set();
    rel.tracklist.forEach((ref, j) => {
      if (!ref || !ref.trackId) {
        errors.push(`${label}: tracklist entry ${j + 1} has no trackId.`);
        return;
      }
      if (!Object.prototype.hasOwnProperty.call(TRACKS, ref.trackId)) {
        errors.push(`${label}: references missing track ${ref.trackId}.`);
      }
      if (seenTrackIds.has(ref.trackId)) errors.push(`${label}: duplicate track ${ref.trackId}.`);
      seenTrackIds.add(ref.trackId);
      referencedTrackIds.add(ref.trackId);
      if (ref.duration && !DURATION_RE.test(ref.duration)) {
        errors.push(`${label}: track ${ref.trackId} duration override "${ref.duration}" is not m:ss.`);
      }
    });
  });

  for (const key of Object.keys(TRACKS)) {
    if (!referencedTrackIds.has(key)) warnings.push(`Track ${key}: not referenced by any release.`);
  }

  return { errors, warnings };
}

/* Node entry point; `require` is absent when the validator is embedded elsewhere. */
if (typeof require !== 'undefined' && typeof module !== 'undefined' && require.main === module) {
  const fs = require('fs');
  const path = require('path');
  const root = path.join(__dirname, '..');
  const tracksSrc = fs.readFileSync(path.join(root, 'releases', 'tracks-data.js'), 'utf8');
  const releasesSrc = fs.readFileSync(path.join(root, 'releases', 'data.js'), 'utf8');

  let catalog;
  try {
    catalog = loadCatalog(tracksSrc, releasesSrc);
  } catch (e) {
    console.error(`Catalog data failed to parse: ${e.message}`);
    process.exit(1);
  }

  const { errors, warnings } = validateCatalog(catalog.TRACKS, catalog.RELEASES);
  for (const w of warnings) console.log(`warning: ${w}`);
  for (const e of errors) console.error(`error: ${e}`);
  console.log(`${Object.keys(catalog.TRACKS).length} tracks, ${catalog.RELEASES.length} releases: ` +
    `${errors.length} error(s), ${warnings.length} warning(s).`);
  process.exit(errors.length ? 1 : 0);
}
