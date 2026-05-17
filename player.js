    /* =========================
       MUSIC: Manual Spotify list
       ========================= */
    const releases = [
      // Most recent → oldest | monthYear format consistent (e.g., "May 2025")
      { name:'Battle Themes Collection: Pokémon, Vol. 3',                           type:'album', id:'2SFMCYyUkiHXWGS3IywUo5', monthYear:'March 2026' },
      { name:'Hyrule Okeanos (Music from "The Legend of Zelda: The Wind Waker")',    type:'album', id:'5wFdEgKLebHECAqxKTv2Rg', monthYear:'October 2025' },
      { name:'Sill Bird (Music from "Chrono Trigger")',                              type:'album', id:'3a6OmKsFbb9tAj3qM9sXdn', monthYear:'September 2025' },
      { name:'Hyrule Tempus (Music from "The Legend of Zelda: Ocarina of Time")',    type:'album', id:'3jAmav8EAGMrv8p8YenzPL', monthYear:'September 2025' },
      { name:'World Themes Collection: Pokémon, Vol. 5',                            type:'album', id:'2KMBQ9PrRVWoc7abiNO7oN', monthYear:'August 2025' },
      { name:'Super Mario Classics Collection',                                      type:'album', id:'7C8mazhT2QhgUWds54vRKn', monthYear:'August 2025' },
      { name:'Mii Channels Collection',                                              type:'album', id:'5Yyrx0CTPHrPv5DBloEsmw', monthYear:'May 2025' },
      { name:'Alola Adventures',                                                     type:'album', id:'4UTytdnpTZ95LHw9u5uRce', monthYear:'Sep 2024' },
      { name:'World Themes Collection: Pokémon, Vol. 4',                            type:'album', id:'4V9EV0LocVpADhN3YD3mjI', monthYear:'May 2024' },
      { name:'Kalos Towns & Cities Collection',                                      type:'album', id:'4UFVXeicDN4Zl9y2pLIOCR', monthYear:'Nov 2023' },
      { name:'Battle Themes Collection: Pokémon, Vol. 2',                           type:'album', id:'1TYyDGLSOmHEsSPSxOPGOP', monthYear:'Nov 2023' },
      { name:'Battle Themes Collection: Pokémon, Vol. 1',                           type:'album', id:'7e4x3VdWtWoAJD46JPfo5j', monthYear:'Sep 2022' },
      { name:'World Themes Collection — Pokémon, Vol. 3',                           type:'album', id:'1cn4hO4bLen8ybLB4Xdoph', monthYear:'Aug 2022' },
      { name:'World Themes Collection — Pokémon, Vol. 2',                           type:'album', id:'0VVcplKK4JRHlQFFIaEeze', monthYear:'Jan 2022' },
      { name:'World Themes Collection: Pokémon, Vol. 1',                            type:'album', id:'2ikzlVg14ieFr39MujeVVC', monthYear:'Aug 2021' },
    ];

    const albumsEl = document.getElementById('albums');
    const embedEl  = document.getElementById('spotifyEmbed');

    embedEl.addEventListener('load', () => {
      if (embedEl.src && embedEl.src !== 'about:blank') embedEl.style.opacity = '1';
    });

    function embedSrc(item){
      return item.type === 'track'
        ? `https://open.spotify.com/embed/track/${item.id}`
        : `https://open.spotify.com/embed/album/${item.id}`;
    }

    function setActive(item, tile){
      embedEl.style.opacity = '0';
      embedEl.src = embedSrc(item);
      embedEl.style.height = item.type === 'track' ? '232px' : '500px';
      for (const el of albumsEl.querySelectorAll('.album')) el.classList.remove('selected');
      if (tile) tile.classList.add('selected');
      else {
        const found = albumsEl.querySelector(`[data-id="${item.id}"]`);
        if (found) found.classList.add('selected');
      }
    }

    async function fetchArt(item) {
      try {
        const type = item.type === 'track' ? 'track' : 'album';
        const res = await fetch(
          `https://open.spotify.com/oembed?url=https://open.spotify.com/${type}/${item.id}`
        );
        const data = await res.json();
        return data.thumbnail_url || null;
      } catch { return null; }
    }

    function makeTile(item, idx){
      const div = document.createElement('div');
      div.className = 'album';
      div.dataset.id = item.id;
      div.innerHTML = `
        <div class="ainfo">
          <div class="aname">${item.name || 'Loading…'}</div>
          ${item.monthYear ? `<div class="ameta">${item.monthYear}</div>` : ''}
        </div>
      `;

      fetchArt(item).then(url => {
        if (url) div.style.setProperty('--art-url', `url("${url}")`);
      });

      div.addEventListener('click', () => setActive(item, div));
      div.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActive(item, div); }
      });
      div.setAttribute('role', 'button');
      div.setAttribute('tabindex', '0');
      return div;
    }

    releases.forEach((it, i) => albumsEl.appendChild(makeTile(it, i)));
    if (releases[0]) setActive(releases[0]);

    /* =========================
       ABOUT/COMMISSIONS TABS
       ========================= */
    const tabAbout   = document.getElementById('tabAbout');
    const tabComms   = document.getElementById('tabComms');
    const bioView    = document.getElementById('bioView');
    const commView   = document.getElementById('commView');
    const rightAbout = document.getElementById('rightAbout');
    const rightTerms = document.getElementById('rightTerms');

    function setTab(which){
      const isAbout = which === 'about';
      if (tabAbout && tabComms){
        tabAbout.classList.toggle('active', isAbout);
        tabComms.classList.toggle('active', !isAbout);
        tabAbout.setAttribute('aria-selected', String(isAbout));
        tabComms.setAttribute('aria-selected', String(!isAbout));
      }
      if (bioView)  bioView.hidden  = !isAbout;
      if (commView) commView.hidden =  isAbout;
      if (rightAbout) rightAbout.hidden = !isAbout;
      if (rightTerms) rightTerms.hidden =  isAbout;
    }

    document.addEventListener('click', (e)=>{
      const btn = e.target.closest('#tabAbout, #tabComms');
      if (!btn) return;
      e.preventDefault();
      setTab(btn.id === 'tabAbout' ? 'about' : 'comms');
    });

    document.addEventListener('keydown', (e)=>{
      if (e.target === tabAbout || e.target === tabComms){
        if (e.key === 'ArrowRight'){ e.preventDefault(); setTab('comms'); }
        if (e.key === 'ArrowLeft'){  e.preventDefault(); setTab('about'); }
      }
    });

    setTab('about');

    /* ── My Work player ── */
    (function () {
      if (typeof TRACKS === 'undefined' || !TRACKS.length) return;

      const audio   = document.getElementById('mwAudio');
      const titleEl = document.getElementById('mwTitle');
      const ptagsEl = document.getElementById('mwPtags');
      const seekEl  = document.getElementById('mwSeek');
      const curEl   = document.getElementById('mwCur');
      const durEl   = document.getElementById('mwDur');
      const playBtn = document.getElementById('mwPlay');
      const prevBtn = document.getElementById('mwPrev');
      const nextBtn = document.getElementById('mwNext');
      const chipsEl = document.getElementById('mwChips');
      const listEl  = document.getElementById('mwList');

      let currentIdx = -1;
      const selectedTags = new Set();
      let filtered = TRACKS.slice();

      const allTags = [...new Set(TRACKS.flatMap(t => t.tags))].sort();

      const SVG_PLAY  = '<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
      const SVG_PAUSE = '<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';

      playBtn.innerHTML = SVG_PLAY;

      function fmt(s) {
        if (!isFinite(s) || s < 0) return '0:00';
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return m + ':' + String(sec).padStart(2, '0');
      }

      function renderChips() {
        chipsEl.innerHTML = '';
        const allBtn = document.createElement('button');
        allBtn.className = 'mw-chip' + (selectedTags.size === 0 ? ' active' : '');
        allBtn.textContent = 'All';
        allBtn.addEventListener('click', () => { selectedTags.clear(); applyFilter(); });
        chipsEl.appendChild(allBtn);
        allTags.forEach(tag => {
          const btn = document.createElement('button');
          btn.className = 'mw-chip' + (selectedTags.has(tag) ? ' active' : '');
          btn.textContent = tag;
          btn.addEventListener('click', () => {
            selectedTags.has(tag) ? selectedTags.delete(tag) : selectedTags.add(tag);
            applyFilter();
          });
          chipsEl.appendChild(btn);
        });
      }

      function applyFilter() {
        filtered = selectedTags.size === 0
          ? TRACKS.slice()
          : TRACKS.filter(t => [...selectedTags].every(tag => t.tags.includes(tag)));
        renderChips();
        renderList();
      }

      function renderList() {
        listEl.innerHTML = '';
        if (!filtered.length) {
          const li = document.createElement('li');
          li.style.cssText = 'padding:16px 18px;color:var(--muted);cursor:default;pointer-events:none';
          li.textContent = 'No tracks match the selected tags.';
          listEl.appendChild(li);
          return;
        }
        filtered.forEach(track => {
          const idx = TRACKS.indexOf(track);
          const li = document.createElement('li');
          li.setAttribute('role', 'option');
          li.setAttribute('aria-selected', String(idx === currentIdx));
          li.setAttribute('tabindex', '0');
          li.innerHTML = `
            <div class="mw-item-info">
              <div class="mw-item-title">${track.title}</div>
              <div class="mw-item-meta">${track.tags.join(' · ')}</div>
            </div>
            ${track.duration ? `<span class="mw-item-dur">${track.duration}</span>` : ''}
          `;
          li.addEventListener('click', () => play(idx));
          li.addEventListener('keydown', e => {
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
        audio.play();
        titleEl.textContent = track.title;
        ptagsEl.innerHTML = track.tags.map(t => `<span class="mw-ptag">${t}</span>`).join('');
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

      audio.addEventListener('pause', () => {
        playBtn.innerHTML = SVG_PLAY;
        playBtn.setAttribute('aria-label', 'Play');
      });

      audio.addEventListener('ended', () => {
        const i = filtered.findIndex(t => TRACKS.indexOf(t) === currentIdx);
        if (i >= 0 && i + 1 < filtered.length) {
          play(TRACKS.indexOf(filtered[i + 1]));
        } else {
          playBtn.innerHTML = SVG_PLAY;
          playBtn.setAttribute('aria-label', 'Play');
        }
      });

      seekEl.addEventListener('input', () => { audio.currentTime = seekEl.value; });

      playBtn.addEventListener('click', () => {
        if (currentIdx === -1) {
          if (filtered.length) play(TRACKS.indexOf(filtered[0]));
          return;
        }
        audio.paused ? audio.play() : audio.pause();
      });

      prevBtn.addEventListener('click', () => {
        if (audio.currentTime > 3) { audio.currentTime = 0; return; }
        const i = filtered.findIndex(t => TRACKS.indexOf(t) === currentIdx);
        if (i > 0) play(TRACKS.indexOf(filtered[i - 1]));
      });

      nextBtn.addEventListener('click', () => {
        const i = filtered.findIndex(t => TRACKS.indexOf(t) === currentIdx);
        if (i >= 0 && i + 1 < filtered.length) play(TRACKS.indexOf(filtered[i + 1]));
      });

      renderChips();
      renderList();
    }());

    /* ── Scroll dots active state ── */
    window.addEventListener('load', function() {
      const dots = Array.from(document.querySelectorAll('.scroll-dot'));
      const ids = ['about', 'mywork-header', 'music-header'];
      const sections = ids.map(id => document.getElementById(id)).filter(Boolean);
      if (!dots.length || !sections.length) return;
      const offset = 90;
      function update() {
        let active = 0;
        sections.forEach((el, i) => {
          if (el.getBoundingClientRect().top <= offset) active = i;
        });
        dots.forEach((d, i) => d.classList.toggle('active', i === active));
      }
      window.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update, { passive: true });
      update();
    });