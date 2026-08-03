(function () {
  'use strict';

  function escapeHTML(s) {
    return (s == null ? '' : String(s)).replace(/[&<>"']/g, (m) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[m]));
  }

  /* The reduced-motion rules in style.css can only reach CSS transitions, so
     motion driven from script has to ask for itself. Queried live rather than
     cached at load, because the setting can change mid-session. Duplicated in
     releases.js and gear.js by choice: a one-line matchMedia is cheaper to copy
     than to share. The travelling pill below is the opposite case, so nav.js is
     loaded first and page scripts degrade gracefully if it is ever missing. */
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const scrollBehavior = () => (reducedMotion.matches ? 'auto' : 'smooth');

  /* =========================
     ABOUT / COMMISSIONS TABS
     ========================= */
  const tabAbout = document.getElementById('tabAbout');
  const tabComms = document.getElementById('tabComms');
  const bioView = document.getElementById('bioView');
  const commView = document.getElementById('commView');
  const rightAbout = document.getElementById('rightAbout');
  const rightTerms = document.getElementById('rightTerms');

  /* The selected tab is marked by the shared travelling pill, the same element
     and the same commit-and-settle curve the nav uses. The tabs are a
     single-select group of two, which is exactly what the pill is for. */
  const tablist = tabAbout && tabAbout.closest('.tabs');
  const tabs = tablist ? [tabAbout, tabComms] : [];
  const tabPill = tablist && window.PokestirMotion
    ? window.PokestirMotion.travellingPill(tablist, {
        items: () => tabs,
        active: () => tabs.findIndex((t) => t.classList.contains('active'))
      })
    : null;

  function setTab(which) {
    const isAbout = which === 'about';
    if (tabAbout && tabComms) {
      tabAbout.classList.toggle('active', isAbout);
      tabComms.classList.toggle('active', !isAbout);
      tabAbout.setAttribute('aria-selected', String(isAbout));
      tabComms.setAttribute('aria-selected', String(!isAbout));
      if (tabPill) tabPill.update();
    }
    if (bioView) bioView.hidden = !isAbout;
    if (commView) commView.hidden = isAbout;
    if (rightAbout) rightAbout.hidden = !isAbout;
    if (rightTerms) rightTerms.hidden = isAbout;
  }

  // Widths shift with the viewport, and the web font lands after first paint.
  if (tablist) new ResizeObserver(() => tabPill && tabPill.update({ travel: false })).observe(tablist);

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('#tabAbout, #tabComms');
    if (!btn) return;
    e.preventDefault();
    setTab(btn.id === 'tabAbout' ? 'about' : 'comms');
  });

  document.addEventListener('keydown', (e) => {
    if (e.target === tabAbout || e.target === tabComms) {
      if (e.key === 'ArrowRight') { e.preventDefault(); setTab('comms'); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); setTab('about'); }
    }
  });

  setTab('about');

  /* =========================
     MY WORK PLAYER
     ========================= */
  (function () {
    if (typeof TRACKS === 'undefined' || !TRACKS.length) return;

    const audio = document.getElementById('mwAudio');
    const titleEl = document.getElementById('mwTitle');
    const ptagsEl = document.getElementById('mwPtags');
    const infoEl = titleEl.closest('.mw-info');
    const seekEl = document.getElementById('mwSeek');
    const curEl = document.getElementById('mwCur');
    const durEl = document.getElementById('mwDur');
    const playBtn = document.getElementById('mwPlay');
    const prevBtn = document.getElementById('mwPrev');
    const nextBtn = document.getElementById('mwNext');
    const chipsEl = document.getElementById('mwChips');
    const listEl = document.getElementById('mwList');

    let currentIdx = -1;
    let pendingCopy = null;
    const selectedTags = new Set();
    let filtered = TRACKS.slice();

    const allTags = [...new Set(TRACKS.flatMap((t) => t.tags))].sort();

    /* One SVG with two paths that morph between the triangle's halves and the
       two pause bars; the shapes themselves live in home.css so the whole
       transition is declarative. Replacing innerHTML on every press, as this
       once did, swapped the element out from under the interaction: nothing can
       animate across a element that no longer exists, and the pressed state got
       thrown away mid-click. */
    playBtn.innerHTML =
      '<svg class="mw-ic" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
        '<path class="mw-ic-a"/><path class="mw-ic-b"/>' +
      '</svg>';

    function fmt(s) {
      if (!isFinite(s) || s < 0) return '0:00';
      const m = Math.floor(s / 60);
      const sec = Math.floor(s % 60);
      return m + ':' + String(sec).padStart(2, '0');
    }

    // Position of the current track within the filtered list (-1 if filtered out).
    function filteredPos() {
      return filtered.findIndex((t) => TRACKS.indexOf(t) === currentIdx);
    }

    function showPlayIcon() {
      playBtn.classList.remove('is-playing');
      playBtn.setAttribute('aria-label', 'Play');
    }

    function renderChips() {
      chipsEl.innerHTML = '';
      const allBtn = document.createElement('button');
      allBtn.className = 'pill' + (selectedTags.size === 0 ? ' active' : '');
      allBtn.textContent = 'All';
      allBtn.addEventListener('click', () => { selectedTags.clear(); applyFilter(); });
      chipsEl.appendChild(allBtn);
      allTags.forEach((tag) => {
        const btn = document.createElement('button');
        btn.className = 'pill' + (selectedTags.has(tag) ? ' active' : '');
        btn.textContent = tag;
        btn.addEventListener('click', () => {
          if (selectedTags.has(tag)) selectedTags.delete(tag);
          else selectedTags.add(tag);
          applyFilter();
        });
        chipsEl.appendChild(btn);
      });
    }

    function applyFilter() {
      filtered = selectedTags.size === 0
        ? TRACKS.slice()
        : TRACKS.filter((t) => [...selectedTags].every((tag) => t.tags.includes(tag)));
      renderChips();
      renderList();
    }

    function renderList() {
      listEl.innerHTML = '';
      if (!filtered.length) {
        const li = document.createElement('li');
        li.className = 'mw-empty';
        li.textContent = 'No tracks match the selected tags.';
        listEl.appendChild(li);
        return;
      }
      filtered.forEach((track) => {
        const idx = TRACKS.indexOf(track);
        const li = document.createElement('li');
        li.setAttribute('role', 'option');
        li.setAttribute('aria-selected', String(idx === currentIdx));
        li.setAttribute('tabindex', '0');
        li.dataset.idx = String(idx);   // lets syncSelection find rows without a rebuild
        li.innerHTML = `
          <div class="mw-item-info">
            <div class="mw-item-title">${escapeHTML(track.title)}</div>
            <div class="mw-item-meta">${escapeHTML(track.tags.join(' · '))}</div>
          </div>
          ${track.duration ? `<span class="mw-item-dur">${escapeHTML(track.duration)}</span>` : ''}
        `;
        li.addEventListener('click', () => play(idx));
        li.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); play(idx); }
        });
        listEl.appendChild(li);
      });
    }

    /* Selecting a track used to call renderList(), which rebuilt every row from
       scratch. That destroyed and recreated the element whose highlight was
       meant to move, so the `background` transition on it could never run: the
       selection blinked from one row to another. Moving the attribute on the
       existing rows is both cheaper and the only way it can animate. */
    function syncSelection() {
      for (const li of listEl.children) {
        if (li.dataset.idx === undefined) continue;   // the .mw-empty placeholder
        li.setAttribute('aria-selected', String(Number(li.dataset.idx) === currentIdx));
      }
    }

    function paintTrackCopy(track) {
      titleEl.textContent = track.title;
      ptagsEl.innerHTML = track.tags.map((t) => `<span class="mw-ptag">${escapeHTML(t)}</span>`).join('');
    }

    /* Title and tags share one exit beat, swap while hidden, then fade back in.
       transitionend supplies the handoff instead of a timer, and repeated track
       changes only replace pendingCopy so the in-flight fade stays reversible. */
    function swapTrackCopy(track) {
      pendingCopy = track;
      if (!infoEl.classList.contains('is-copy-swapping')) {
        infoEl.classList.add('is-copy-swapping');
      }
    }

    titleEl.addEventListener('transitionend', (e) => {
      if (e.propertyName !== 'opacity' || !infoEl.classList.contains('is-copy-swapping')) return;
      const next = pendingCopy;
      pendingCopy = null;
      if (next) paintTrackCopy(next);
      infoEl.classList.remove('is-copy-swapping');
    });

    function play(idx) {
      const track = TRACKS[idx];
      if (!track) return;
      const changed = idx !== currentIdx;
      currentIdx = idx;
      audio.src = track.src;
      audio.play().catch(() => {});
      if (changed) swapTrackCopy(track);
      seekEl.value = 0;
      /* Drop the previous track's scale with it. `max` used to survive the
         change and only be replaced once the new metadata arrived, so a drag in
         that window mapped the thumb against the wrong song's length: measured
         switching tracks, `max` stayed on the first loaded duration for every
         track after it. A zero range simply cannot be dragged, which is the
         truth until the media reports a length. */
      seekEl.max = 0;
      setPct('0%', false);   // a new track restarts the fill, it doesn't rewind it
      curEl.textContent = '0:00';
      durEl.textContent = track.duration || '0:00';
      syncSelection();
      const active = listEl.querySelector('[aria-selected="true"]');
      /* The list is its own scroller, so the page-level `scroll-behavior: smooth`
         doesn't reach it and this was a hard jump. Auto-advance between tracks
         moves the highlight on its own, and a jump there reads as a glitch. */
      if (active) active.scrollIntoView({ block: 'nearest', behavior: scrollBehavior() });
    }

    /* `timeupdate` only fires about four times a second, so writing --pct
       straight from it steps the fill in quarter-second jumps. The CSS glides
       between values instead (see .mw-seek); this suppresses that glide for
       jumps that aren't playback progress, where interpolating would just look
       like lag: track changes, and the user dragging the scrubber. */
    let scrubbing = false;

    function setPct(pct, glide) {
      if (!glide) {
        seekEl.classList.add('mw-seek--jump');
        seekEl.style.setProperty('--pct', pct);
        void seekEl.offsetWidth;   // land the value before the transition returns
        seekEl.classList.remove('mw-seek--jump');
        return;
      }
      seekEl.style.setProperty('--pct', pct);
    }

    /* The scrubber's scale is the media's duration, and the media is allowed to
       revise it. An MP3's length is derived from its header and refined as the
       file decodes, so the browser reports one number at `loadedmetadata` and
       may correct it later through `durationchange`. Listening only to the
       first event left the bar scaled to a stale value on exactly the tracks
       where it got corrected: the fill reached the end before the song did, or
       never arrived at all. Both events run the same sync now. */
    function syncDuration() {
      const total = audio.duration;
      if (!isFinite(total) || total <= 0) return;
      seekEl.max = total;
      durEl.textContent = fmt(total);
      if (!scrubbing) setPct(Math.min(100, audio.currentTime / total * 100) + '%', false);
    }
    audio.addEventListener('loadedmetadata', syncDuration);
    audio.addEventListener('durationchange', syncDuration);

    audio.addEventListener('timeupdate', () => {
      const total = audio.duration;
      if (!isFinite(total) || total <= 0) return;
      seekEl.value = audio.currentTime;
      // Clamped: currentTime can sit a hair past a duration that was revised
      // downward, which would otherwise push the fill past the end of its track.
      setPct(Math.min(100, audio.currentTime / total * 100) + '%', !scrubbing);
      curEl.textContent = fmt(audio.currentTime);
    });

    audio.addEventListener('play', () => {
      playBtn.classList.add('is-playing');
      playBtn.setAttribute('aria-label', 'Pause');
    });

    audio.addEventListener('pause', showPlayIcon);

    audio.addEventListener('ended', () => {
      const i = filteredPos();
      if (i >= 0 && i + 1 < filtered.length) play(TRACKS.indexOf(filtered[i + 1]));
      else showPlayIcon();
    });

    /* While the thumb is being dragged the fill has to track the pointer exactly,
       so the glide is off for the duration of the gesture rather than per event.
       `change` fires at the end of a drag; pointerup covers releasing outside. */
    const endScrub = () => {
      if (!scrubbing) return;
      scrubbing = false;
      seekEl.classList.remove('is-scrubbing');
    };
    seekEl.addEventListener('pointerdown', () => {
      scrubbing = true;
      seekEl.classList.add('is-scrubbing');
    });
    seekEl.addEventListener('change', endScrub);
    document.addEventListener('pointerup', endScrub);

    seekEl.addEventListener('input', () => {
      const total = audio.duration;
      // There is nothing to seek into until the media reports a length, and
      // writing currentTime before then only acts on whatever the last track
      // left behind.
      if (!isFinite(total) || total <= 0) return;
      audio.currentTime = seekEl.value;
      setPct((seekEl.value / total * 100) + '%', false);
    });

    playBtn.addEventListener('click', () => {
      if (currentIdx === -1) {
        if (filtered.length) play(TRACKS.indexOf(filtered[0]));
        return;
      }
      if (audio.paused) audio.play().catch(() => {});
      else audio.pause();
    });

    prevBtn.addEventListener('click', () => {
      if (audio.currentTime > 3) { audio.currentTime = 0; return; }
      const i = filteredPos();
      if (i > 0) play(TRACKS.indexOf(filtered[i - 1]));
    });

    nextBtn.addEventListener('click', () => {
      const i = filteredPos();
      if (i >= 0 && i + 1 < filtered.length) play(TRACKS.indexOf(filtered[i + 1]));
    });

    renderChips();
    renderList();
  }());

}());
