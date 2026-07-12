(function () {
  'use strict';

  /* Known platforms, in display order. Keys match the `links` object in
     data.js; icons live in ../images/icons/. */
  const PLATFORMS = [
    { key: 'bandcamp',     label: 'Bandcamp',      icon: 'bandcamp.svg' },
    { key: 'spotify',      label: 'Spotify',       icon: 'spotify.svg' },
    { key: 'appleMusic',   label: 'Apple Music',   icon: 'applemusic.svg' },
    { key: 'youtubeMusic', label: 'YouTube Music', icon: 'youtube.svg' },
    { key: 'youtube',      label: 'YouTube',       icon: 'youtube.svg' },
    { key: 'pandora',      label: 'Pandora',       icon: 'pandora.svg' },
    { key: 'itunes',       label: 'iTunes Store',  icon: 'itunes.svg' },
    { key: 'deezer',       label: 'Deezer',        icon: 'deezer.svg' },
    { key: 'amazonMusic',  label: 'Amazon Music',  icon: 'amazonmusic.svg' },
    { key: 'tidal',        label: 'TIDAL',         icon: 'tidal.svg' },
    { key: 'qobuz',        label: 'Qobuz',         icon: 'qobuz.svg' }
  ];

  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const collator = new Intl.Collator(undefined, { sensitivity: 'base' });
  const compareText = (a, b) => collator.compare(a || '', b || '');

  function escapeHTML(s) {
    return (s == null ? '' : String(s)).replace(/[&<>"']/g, (m) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[m]));
  }

  /* Accepts "YYYY-MM-DD" or "YYYY-MM". */
  function parseReleaseDate(s) {
    const parts = String(s || '').split('-').map((p) => parseInt(p, 10));
    if (!parts.length || Number.isNaN(parts[0])) return null;
    return { y: parts[0], m: parts[1] || 1, d: parts[2] || null };
  }

  function dateMs(s) {
    const p = parseReleaseDate(s);
    return p ? new Date(p.y, p.m - 1, p.d || 1).getTime() : 0;
  }

  function formatReleaseDate(s) {
    const p = parseReleaseDate(s);
    if (!p) return '';
    const month = MONTHS[p.m - 1] || '';
    return p.d ? `${month} ${p.d}, ${p.y}` : `${month} ${p.y}`;
  }

  function buildDerived(rel) {
    const haystack = [
      rel.title, rel.subtitle, rel.type, rel.description, rel.upc, rel.slug,
      rel.releaseDate, formatReleaseDate(rel.releaseDate),
      (rel.tags || []).join(' '),
      (rel.tracks || []).map((t) => t.title + ' ' + (t.isrc || '')).join(' ')
    ].join(' ').toLowerCase();
    return { ...rel, dateMs: dateMs(rel.releaseDate), searchHaystack: haystack };
  }

  const TRACK_CATALOG = typeof TRACKS !== 'undefined' && TRACKS ? TRACKS : {};
  const RELEASE_CATALOG = typeof RELEASES !== 'undefined' && RELEASES ? RELEASES : [];
  const catalogErrors = [];

  for (const [trackId, track] of Object.entries(TRACK_CATALOG)) {
    if (!track || typeof track !== 'object') {
      catalogErrors.push(`Track ${trackId} is not an object.`);
      continue;
    }
    if (trackId.startsWith('isrc:') && trackId !== `isrc:${track.isrc || ''}`) {
      catalogErrors.push(`Track ${trackId} does not match its stored ISRC.`);
    }
  }

  function resolveTrackReference(ref, releaseSlug) {
    if (!ref || typeof ref !== 'object' || !ref.trackId) {
      catalogErrors.push(`Release ${releaseSlug} has an invalid track reference.`);
      return null;
    }
    const canonical = TRACK_CATALOG[ref.trackId];
    if (!canonical) {
      catalogErrors.push(`Release ${releaseSlug} references missing track ${ref.trackId}.`);
      return null;
    }
    return {
      ...canonical,
      title: Object.prototype.hasOwnProperty.call(ref, 'title') ? ref.title : canonical.title,
      duration: Object.prototype.hasOwnProperty.call(ref, 'duration') ? ref.duration : canonical.duration
    };
  }

  // Resolve normalized track references once at startup. Invalid references
  // are omitted so one bad catalog row cannot prevent the archive from loading.
  const seenSlugs = new Set();
  const DB = RELEASE_CATALOG.flatMap((rel) => {
    if (!rel || !rel.slug) {
      catalogErrors.push('A release is missing its slug.');
      return [];
    }
    if (seenSlugs.has(rel.slug)) {
      catalogErrors.push(`Duplicate release slug ${rel.slug}; the later entry was ignored.`);
      return [];
    }
    seenSlugs.add(rel.slug);
    const refs = Array.isArray(rel.tracklist) ? rel.tracklist : [];
    if (!Array.isArray(rel.tracklist)) {
      catalogErrors.push(`Release ${rel.slug} is missing its tracklist array.`);
    }
    const trackIds = [];
    const seenTrackIds = new Set();
    const tracks = [];
    for (const ref of refs) {
      if (ref && ref.trackId) {
        if (seenTrackIds.has(ref.trackId)) {
          catalogErrors.push(`Release ${rel.slug} contains duplicate track ${ref.trackId}.`);
        }
        seenTrackIds.add(ref.trackId);
        trackIds.push(ref.trackId);
      }
      const track = resolveTrackReference(ref, rel.slug);
      if (track) tracks.push(track);
    }
    return [buildDerived({ ...rel, tracks, trackIds })];
  });

  if (catalogErrors.length) {
    console.error(`Pokestir release catalog: ${catalogErrors.length} validation error(s).`, catalogErrors);
  }

  /* A recording can appear on multiple releases: most of the old
     singles' tracks were re-released on the newer compilation albums — a
     new UPC around the same underlying recordings. Derive that membership
     from shared normalized track IDs rather than baking it into data.js, so it can
     never drift out of sync with the catalog. A release is "included in"
     another when every one of its tracks appears there and the
     other release has more tracks (the pointer only goes single -> album,
     never sideways between equal releases or back down). */
  for (const rel of DB) {
    rel.trackIdSet = new Set(rel.trackIds);
  }
  for (const rel of DB) {
    rel.includedIn = !rel.trackIdSet.size ? [] : DB.filter((other) =>
      other !== rel &&
      (other.tracks || []).length > (rel.tracks || []).length &&
      [...rel.trackIdSet].every((trackId) => other.trackIdSet.has(trackId))
    ).sort((a, b) => b.dateMs - a.dateMs);
    // searching a compilation's name should also surface its singles
    if (rel.includedIn.length) {
      rel.searchHaystack += ' ' + rel.includedIn.map((h) => h.title).join(' ').toLowerCase();
    }
  }

  /* Artwork URLs are stored directly in data.js rather than fetched live in
     the browser — at catalog scale, hundreds of live lookups on page load
     would be slow and unreliable. Elements without artwork keep the CSS
     gradient placeholder. */
  function applyArt(el, rel) {
    if (rel.artwork) el.style.setProperty('--art-url', `url(${JSON.stringify(rel.artwork)})`);
  }

  /* The list view can hold hundreds of tiles; setting every background image
     immediately would fetch all of them on load. Defer each tile's image
     until it's about to scroll into view (same IntersectionObserver pattern
     gear.js uses for pagination). */
  let artObserver = null;
  function applyArtLazy(el, rel) {
    if (!rel.artwork) return;
    if (!artObserver) {
      artObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          applyArt(entry.target, entry.target._release);
          artObserver.unobserve(entry.target);
        }
      }, { rootMargin: '400px' });
    }
    el._release = rel;
    artObserver.observe(el);
  }

  function trackCountText(rel) {
    const n = (rel.tracks || []).length;
    return n === 1 ? '1 track' : `${n} tracks`;
  }

  /* =========================
     LIST VIEW
     ========================= */
  const listView = document.getElementById('listView');
  const detailView = document.getElementById('detailView');
  const grid = document.getElementById('rgrid');
  const countEl = document.getElementById('count');
  const qEl = document.getElementById('q');
  const sortSel = document.getElementById('sortSel');

  const state = { q: '', sort: 'newest' };

  const compareByTitle = (a, b) => compareText(a.title, b.title);
  const SORTERS = {
    newest: (a, b) => (b.dateMs - a.dateMs) || compareByTitle(a, b),
    oldest: (a, b) => (a.dateMs - b.dateMs) || compareByTitle(a, b),
    title: compareByTitle,
    tracks: (a, b) => ((b.tracks || []).length - (a.tracks || []).length) || compareByTitle(a, b)
  };

  function match(rel) {
    if (state.q && !rel.searchHaystack.includes(state.q)) return false;
    return true;
  }

  function releaseCard(rel) {
    const a = document.createElement('a');
    a.className = 'release-tile' + (rel.type === 'Album' ? ' release-tile--album' : '');
    a.href = `?r=${encodeURIComponent(rel.slug)}`;

    const meta = [rel.type, formatReleaseDate(rel.releaseDate), trackCountText(rel)]
      .filter(Boolean).map(escapeHTML).join(' &middot; ');

    const host = (rel.includedIn || [])[0] || null;
    a.innerHTML = `
      <div class="tile-cover" aria-hidden="true"></div>
      <div class="rinfo">
        <div class="rname">${escapeHTML(rel.title)}</div>
        ${rel.subtitle ? `<div class="rsub">${escapeHTML(rel.subtitle)}</div>` : ''}
        <div class="rmeta">${meta}</div>
        ${host ? `<div class="rcomp" title="Included in ${escapeHTML(host.title)}">Included in ${escapeHTML(host.title)}</div>` : ''}
      </div>`;

    applyArtLazy(a.querySelector('.tile-cover'), rel);
    return a;
  }

  function tileGrid(list, variant) {
    const g = document.createElement('div');
    g.className = 'rgrid' + (variant ? ` ${variant}` : '');
    for (const rel of list) g.appendChild(releaseCard(rel));
    return g;
  }

  function sectionTitle(text, count) {
    const h = document.createElement('h2');
    h.className = 'grid-section-title';
    h.innerHTML = `${escapeHTML(text)} <span class="muted">${count}</span>`;
    return h;
  }

  const SVG_CHEVRON_L = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>';
  const SVG_CHEVRON_R = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>';

  /* Section header with chevron buttons that page the rail sideways —
     the rail's own scrollbar is hidden (see .rgrid--rail). */
  function railHead(text, count, rail) {
    const head = document.createElement('div');
    head.className = 'rail-head';
    head.appendChild(sectionTitle(text, count));

    const nav = document.createElement('div');
    nav.className = 'rail-nav';
    const prev = document.createElement('button');
    const next = document.createElement('button');
    prev.className = next.className = 'rail-btn';
    prev.type = next.type = 'button';
    prev.setAttribute('aria-label', 'Scroll albums back');
    next.setAttribute('aria-label', 'Scroll albums forward');
    prev.innerHTML = SVG_CHEVRON_L;
    next.innerHTML = SVG_CHEVRON_R;
    nav.appendChild(prev);
    nav.appendChild(next);
    head.appendChild(nav);

    const page = () => Math.max((rail.clientWidth || 0) * 0.9, 280);
    prev.addEventListener('click', () => rail.scrollBy({ left: -page(), behavior: 'smooth' }));
    next.addEventListener('click', () => rail.scrollBy({ left: page(), behavior: 'smooth' }));

    const sync = () => {
      const max = (rail.scrollWidth || 0) - (rail.clientWidth || 0);
      prev.disabled = (rail.scrollLeft || 0) <= 0;
      next.disabled = (rail.scrollLeft || 0) >= max - 1;
    };
    rail.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync, { passive: true });
    // Layout isn't done during render; measure once the frame settles.
    requestAnimationFrame(sync);

    return head;
  }

  function render() {
    const sorter = SORTERS[state.sort] || SORTERS.newest;
    const list = DB.filter(match).sort(sorter);

    countEl.textContent = list.length === 1 ? '1 release' : `${list.length} releases`;

    // Re-rendering (e.g. on every search keystroke) discards the old tiles;
    // drop the observer watching them so it doesn't keep growing forever.
    if (artObserver) { artObserver.disconnect(); artObserver = null; }

    grid.replaceChildren();
    if (!list.length) {
      const p = document.createElement('p');
      p.className = 'grid-msg';
      p.textContent = DB.length
        ? 'No releases match the selected filters.'
        : 'Unable to load release data. Please refresh the page.';
      grid.appendChild(p);
      return;
    }

    // Default view: a horizontally scrolling rail of album covers up top,
    // then the complete list below it. Searching collapses to one flat grid.
    if (!state.q) {
      const albums = list.filter((r) => r.type === 'Album');
      const frag = document.createDocumentFragment();
      if (albums.length) {
        const rail = tileGrid(albums, 'rgrid--rail');
        frag.appendChild(railHead('Albums & Collections', albums.length, rail));
        frag.appendChild(rail);
      }
      frag.appendChild(sectionTitle('All Releases', list.length));
      frag.appendChild(tileGrid(list));
      grid.appendChild(frag);
    } else {
      grid.appendChild(tileGrid(list));
    }
  }

  function debounce(fn, waitMs) {
    let timerId = 0;
    return (...args) => {
      clearTimeout(timerId);
      timerId = setTimeout(() => fn(...args), waitMs);
    };
  }

  function initList() {
    qEl.addEventListener('input', debounce(() => {
      state.q = qEl.value.trim().toLowerCase();
      render();
    }, 200));

    sortSel.addEventListener('change', () => {
      state.sort = sortSel.value;
      render();
    });

    document.getElementById('clear').addEventListener('click', () => {
      state.q = '';
      qEl.value = '';
      render();
    });

    render();
  }

  /* =========================
     DETAIL VIEW  (?r=<slug>)
     ========================= */
  /* When a release is included in a compilation, each platform button
     defaults to the compilation's URL (old singles get delisted as their
     compilations take over) and only falls back to the release's own link. */
  function platformLinks(rel, host) {
    const links = rel.links || {};
    const hostLinks = (host && host.links) || {};
    const out = [];
    for (const p of PLATFORMS) {
      const url = hostLinks[p.key] || links[p.key];
      if (!url) continue;
      out.push(`
        <a class="btn plat-${p.key}" href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHTML(p.label)} (opens in a new tab)">
          <img src="../images/icons/${p.icon}" width="20" height="20" alt="">${escapeHTML(p.label)}
        </a>`);
    }
    for (const extra of rel.otherLinks || []) {
      if (!extra || !extra.url) continue;
      // Materia (materia.to) is the catalog's Linkfire smart-link; give it
      // the Materia icon and tint instead of a plain text button.
      const isLinkfire = extra.label === 'Listen Everywhere';
      out.push(isLinkfire ? `
        <a class="btn plat-linkfire" href="${escapeHTML(extra.url)}" target="_blank" rel="noopener noreferrer" aria-label="Linkfire (opens in a new tab)">
          <img src="../images/icons/linkfire.png" width="20" height="20" alt="">Linkfire
        </a>` : `
        <a class="btn" href="${escapeHTML(extra.url)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHTML(extra.label)} (opens in a new tab)">${escapeHTML(extra.label)}</a>`);
    }
    return out.join('');
  }

  const SVG_PLAY = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
  const SVG_PAUSE = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';

  function trackRows(rel) {
    return (rel.tracks || []).map((t, i) => {
      const interactive = t.preview
        ? ` role="button" tabindex="0" data-preview="${escapeHTML(t.preview)}" data-title="${escapeHTML(t.title)}" aria-label="Play preview: ${escapeHTML(t.title)}"`
        : '';
      return `
      <div class="track-row${t.preview ? ' has-preview' : ''}"${interactive}>
        <div class="t-lead" aria-hidden="true">
          <span class="t-num">${i + 1}</span>
          ${t.preview ? `<span class="t-ic-play">${SVG_PLAY}</span><span class="t-ic-pause">${SVG_PAUSE}</span>` : ''}
        </div>
        <div class="t-main">
          <div class="t-title">${escapeHTML(t.title)}</div>
          ${t.isrc ? `<div class="t-isrc">ISRC ${escapeHTML(t.isrc)}</div>` : ''}
        </div>
        ${t.duration ? `<div class="t-dur">${escapeHTML(t.duration)}</div>` : '<div></div>'}
      </div>`;
    }).join('');
  }

  /* One shared audio element plays 30-second track previews. Clicking a row
     pauses/resumes it; clicking another row switches to that track. */
  function initPreviewPlayer(root) {
    const rows = Array.from(root.querySelectorAll('.track-row.has-preview'));
    if (!rows.length) return;

    const audio = new Audio();
    audio.preload = 'none';
    let current = null;

    function play(row) {
      audio.play().catch(() => {
        if (current !== row) return;
        setRow(row, false);
        current = null;
      });
    }

    function setRow(row, playing) {
      row.classList.toggle('is-playing', playing);
      row.setAttribute('aria-label',
        (playing ? 'Pause preview: ' : 'Play preview: ') + (row.dataset.title || ''));
      if (!playing) row.style.setProperty('--pct', '0%');
    }

    function toggle(row) {
      if (current === row) {
        if (audio.paused) play(row);
        else audio.pause();
        return;
      }
      if (current) setRow(current, false);
      current = row;
      audio.src = row.dataset.preview;
      audio.load();
      play(row);
    }

    for (const row of rows) {
      row.addEventListener('click', () => toggle(row));
      row.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(row); }
      });
    }

    audio.addEventListener('play', () => { if (current) setRow(current, true); });
    audio.addEventListener('pause', () => { if (current) setRow(current, false); });
    audio.addEventListener('ended', () => {
      if (current) { setRow(current, false); current = null; }
    });
    // If a preview URL ever goes dead, reset the row instead of leaving it
    // stuck. The replacement can be edited directly in tracks-data.js.
    audio.addEventListener('error', () => {
      if (current) { setRow(current, false); current = null; }
    });
    audio.addEventListener('timeupdate', () => {
      if (!current || !isFinite(audio.duration) || !audio.duration) return;
      current.style.setProperty('--pct', (audio.currentTime / audio.duration * 100) + '%');
    });
  }

  function renderNotFound() {
    detailView.innerHTML = `
      <a class="back-link" href="./">&larr; All Releases</a>
      <section class="card detail-head">
        <div class="info">
          <h1 class="d-title">Release not found</h1>
          <p class="d-desc">There's no release at this address. It may have been renamed or removed.</p>
        </div>
      </section>`;
  }

  function renderDetail(slug) {
    listView.hidden = true;
    detailView.hidden = false;

    const rel = DB.find((r) => r.slug === slug);
    if (!rel) {
      document.title = 'Pokestir - Releases';
      renderNotFound();
      return;
    }

    document.title = `Pokestir - ${rel.title}`;

    const chips = [rel.type, ...(rel.tags || [])].filter(Boolean)
      .map((t) => `<span class="chip">${escapeHTML(t)}</span>`).join('');
    const facts = [formatReleaseDate(rel.releaseDate), trackCountText(rel)]
      .filter(Boolean).map(escapeHTML).join(' &middot; ');

    const host = (rel.includedIn || [])[0] || null;
    const fromAlbum = host ? `
      <div class="d-from">Included in <a href="?r=${encodeURIComponent(host.slug)}">${escapeHTML(host.title)}</a>
        <div class="d-from-note">The listening links below open the compilation.</div>
      </div>` : '';

    const buttons = platformLinks(rel, host);
    const hasPreviews = (rel.tracks || []).some((t) => t.preview);

    detailView.innerHTML = `
      <a class="back-link" href="./">&larr; All Releases</a>
      <div class="detail-stack">
        <section class="card detail-head" aria-label="Release overview">
          <div class="art" aria-hidden="true"></div>
          <div class="info">
            <h1 class="d-title">${escapeHTML(rel.title)}</h1>
            ${rel.subtitle ? `<div class="d-sub">${escapeHTML(rel.subtitle)}</div>` : ''}
            ${chips ? `<div class="d-chips">${chips}</div>` : ''}
            <div class="d-facts">${facts}</div>
            ${fromAlbum}
            ${rel.upc ? `<div class="d-upc">UPC <span>${escapeHTML(rel.upc)}</span></div>` : ''}
            ${rel.description ? `<p class="d-desc">${escapeHTML(rel.description)}</p>` : ''}
            ${buttons ? `<nav class="plat-links" aria-label="Listen on">${buttons}</nav>` : ''}
          </div>
        </section>

        <div class="tracks-section">
          <h2 class="page-title">Tracks</h2>
          ${hasPreviews ? '<p class="section-sub">Click a track for a 30-second preview (96 kbps). Full quality is on the links above.</p>' : ''}
          <section class="tracks-list" aria-label="Track list">
            ${trackRows(rel)}
          </section>
        </div>
      </div>`;

    applyArt(detailView.querySelector('.art'), rel);
    initPreviewPlayer(detailView);
  }

  /* =========================
     ROUTER
     ========================= */
  const slug = new URLSearchParams(window.location.search).get('r');
  if (slug) renderDetail(slug);
  else initList();
}());
