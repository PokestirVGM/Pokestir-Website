(function () {
  'use strict';

  function escapeHTML(s) {
    return (s == null ? '' : String(s)).replace(/[&<>"']/g, (m) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[m]));
  }

  /* =========================
     ABOUT / COMMISSIONS TABS
     ========================= */
  const tabAbout = document.getElementById('tabAbout');
  const tabComms = document.getElementById('tabComms');
  const bioView = document.getElementById('bioView');
  const commView = document.getElementById('commView');
  const rightAbout = document.getElementById('rightAbout');
  const rightTerms = document.getElementById('rightTerms');

  function setTab(which) {
    const isAbout = which === 'about';
    if (tabAbout && tabComms) {
      tabAbout.classList.toggle('active', isAbout);
      tabComms.classList.toggle('active', !isAbout);
      tabAbout.setAttribute('aria-selected', String(isAbout));
      tabComms.setAttribute('aria-selected', String(!isAbout));
    }
    if (bioView) bioView.hidden = !isAbout;
    if (commView) commView.hidden = isAbout;
    if (rightAbout) rightAbout.hidden = !isAbout;
    if (rightTerms) rightTerms.hidden = isAbout;
  }

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
    const seekEl = document.getElementById('mwSeek');
    const curEl = document.getElementById('mwCur');
    const durEl = document.getElementById('mwDur');
    const playBtn = document.getElementById('mwPlay');
    const prevBtn = document.getElementById('mwPrev');
    const nextBtn = document.getElementById('mwNext');
    const chipsEl = document.getElementById('mwChips');
    const listEl = document.getElementById('mwList');

    let currentIdx = -1;
    const selectedTags = new Set();
    let filtered = TRACKS.slice();

    const allTags = [...new Set(TRACKS.flatMap((t) => t.tags))].sort();

    const SVG_PLAY = '<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
    const SVG_PAUSE = '<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';

    playBtn.innerHTML = SVG_PLAY;

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
      playBtn.innerHTML = SVG_PLAY;
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

    function play(idx) {
      const track = TRACKS[idx];
      if (!track) return;
      currentIdx = idx;
      audio.src = track.src;
      audio.play().catch(() => {});
      titleEl.textContent = track.title;
      ptagsEl.innerHTML = track.tags.map((t) => `<span class="mw-ptag">${escapeHTML(t)}</span>`).join('');
      seekEl.value = 0;
      seekEl.style.setProperty('--pct', '0%');
      curEl.textContent = '0:00';
      durEl.textContent = track.duration || '0:00';
      renderList();
      const active = listEl.querySelector('[aria-selected="true"]');
      if (active) active.scrollIntoView({ block: 'nearest' });
    }

    audio.addEventListener('loadedmetadata', () => {
      seekEl.max = audio.duration;
      durEl.textContent = fmt(audio.duration);
    });

    audio.addEventListener('timeupdate', () => {
      if (!isFinite(audio.duration)) return;
      seekEl.value = audio.currentTime;
      seekEl.style.setProperty('--pct', (audio.currentTime / audio.duration * 100) + '%');
      curEl.textContent = fmt(audio.currentTime);
    });

    audio.addEventListener('play', () => {
      playBtn.innerHTML = SVG_PAUSE;
      playBtn.setAttribute('aria-label', 'Pause');
    });

    audio.addEventListener('pause', showPlayIcon);

    audio.addEventListener('ended', () => {
      const i = filteredPos();
      if (i >= 0 && i + 1 < filtered.length) play(TRACKS.indexOf(filtered[i + 1]));
      else showPlayIcon();
    });

    seekEl.addEventListener('input', () => { audio.currentTime = seekEl.value; });

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
