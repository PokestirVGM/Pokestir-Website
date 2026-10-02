(function () {
  'use strict';
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

  // Detail content is already in the HTML. Only playback, return state, and
  // newly released compilation links need script on this page.
  addEventListener('pageswap', (event) => {
    if (!event.viewTransition) return;
    event.viewTransition.ready.catch(() => {});
    let staying = false;
    try { staying = new URL(event.activation.entry.url).pathname.startsWith('/releases/'); } catch { /* no destination */ }
    if (!staying) event.viewTransition.skipTransition();
  });
  const embedded = document.getElementById('release-catalog');
  const root = document.getElementById('detailView');
  if (!embedded || !root) return;
  const catalog = JSON.parse(embedded.textContent);
  const rel = catalog.releases[0];
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const dateMs = (value) => {
    const parts = String(value || '').split('-').map(Number);
    return parts[0] ? new Date(parts[0], (parts[1] || 1) - 1, parts[2] || 1).getTime() : 0;
  };
  if (dateMs(rel.releaseDate) > today) {
    // Preserve the full router's handling of a future release in a visitor's
    // local timezone; the normal detail page never needs archive code.
    const script = document.createElement('script');
    script.src = '/releases/releases.min.js';
    root.hidden = true;
    script.onerror = () => {
      root.hidden = false;
      root.innerHTML = '<a class="back-link" href="/releases/">All Releases</a><p class="grid-msg">Unable to load release data. Please check your connection and refresh the page.</p>';
    };
    document.head.appendChild(script);
    return;
  }
  const host = catalog.releases.slice(1).filter((r) => dateMs(r.releaseDate) <= today)
    .sort((a, b) => dateMs(b.releaseDate) - dateMs(a.releaseDate))[0];
  if (root.dataset.host !== (host ? host.slug : '')) {
    root.querySelector('.d-from')?.remove();
    if (host) {
      const from = document.createElement('div');
      from.className = 'd-from';
      from.innerHTML = `Included in <a href="/releases/${escapeHTML(host.slug)}/">${escapeHTML(host.title)}</a><div class="d-from-note">The listening links below open the compilation.</div>`;
      root.querySelector('.d-facts').after(from);
    }
    const buttons = platformLinks(rel, host);
    let links = root.querySelector('.plat-links');
    if (buttons) {
      if (!links) {
        links = document.createElement('nav');
        links.className = 'plat-links';
        links.setAttribute('aria-label', 'Listen on');
        root.querySelector('.info').appendChild(links);
      }
      links.innerHTML = buttons;
    } else if (links) links.remove();
    root.dataset.host = host ? host.slug : '';
  }
  saveReturnArt(rel);
  initPreviewPlayer(root);


  function escapeHTML(s) {
    return (s == null ? '' : String(s)).replace(/[&<>"']/g, (m) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[m]));
  }

  function platformLinks(rel, host) {
    const links = rel.links || {};
    const hostLinks = (host && host.links) || {};
    const out = [];
    for (const p of PLATFORMS) {
      const url = hostLinks[p.key] || links[p.key];
      if (!url) continue;
      out.push(`
        <a class="btn plat-${p.key}" href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHTML(p.label)} (opens in a new tab)">
          <img src="/images/icons/${p.icon}" width="20" height="20" alt="">${escapeHTML(p.label)}
        </a>`);
    }
    for (const extra of rel.otherLinks || []) {
      if (!extra || !extra.url) continue;
      // Materia (materia.to) is the catalog's Linkfire smart-link; give it
      // the Materia icon and tint instead of a plain text button.
      const isLinkfire = extra.label === 'Listen Everywhere';
      out.push(isLinkfire ? `
        <a class="btn plat-linkfire" href="${escapeHTML(extra.url)}" target="_blank" rel="noopener noreferrer" aria-label="Linkfire (opens in a new tab)">
          <img src="/images/icons/linkfire.png" width="20" height="20" alt="">Linkfire
        </a>` : `
        <a class="btn" href="${escapeHTML(extra.url)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHTML(extra.label)} (opens in a new tab)">${escapeHTML(extra.label)}</a>`);
    }
    return out.join('');
  }

  function saveReturnArt(rel) {
    try {
      const saved = JSON.parse(sessionStorage.getItem('pokestir-releases-list-state')) || {
        q: '', sort: 'newest', y: 0, railX: 0
      };
      if (saved.artSlug !== rel.slug) {
        saved.artSlug = rel.slug;
        saved.artRail = rel.type === 'Album';
      }
      sessionStorage.setItem('pokestir-releases-list-state', JSON.stringify(saved));
    } catch (e) { /* storage unavailable; root crossfade still works */ }
  }

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

    /* `timeupdate` fires about four times a second, so writing --pct straight
       from it steps the progress edge in quarter-second jumps. The CSS glides
       between values (see .track-row); resetting a row back to zero has to skip
       that glide, or a finished preview visibly rewinds itself. */
    function setPct(row, pct, glide) {
      if (!glide) {
        row.classList.add('track-row--jump');
        row.style.setProperty('--pct', pct);
        void row.offsetWidth;   // land the value before the transition returns
        row.classList.remove('track-row--jump');
        return;
      }
      row.style.setProperty('--pct', pct);
    }

    function setRow(row, playing, reset = true) {
      row.classList.toggle('is-playing', playing);
      row.setAttribute('aria-label',
        (playing ? 'Pause preview: ' : 'Play preview: ') + (row.dataset.title || ''));
      if (!playing && reset) setPct(row, '0%', false);
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
    audio.addEventListener('pause', () => { if (current) setRow(current, false, false); });
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
      setPct(current, (audio.currentTime / audio.duration * 100) + '%', true);
    });
  }

}());
