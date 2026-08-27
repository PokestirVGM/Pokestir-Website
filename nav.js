/* ── Shared motion primitives ──
   Loaded on every page, so page scripts can reach the same movement the nav
   uses instead of each inventing its own. Two things live here:

   `travelPath` is the site's law for moving one thing from A to B. Duration
   scales with distance and the arrival commits, overshoots, answers with a
   smaller counter-swing and rests. Anything that slides across the screen uses
   it, so a nav pill, a tab highlight and a filter highlight all move with the
   same hand.

   `travellingPill` is the highlight itself: one element that travels between
   the items of a single-select group rather than vanishing from one and
   reappearing on the next, carrying an inverted copy of the group's own labels
   so the text under the blue reads dark without any crossfade.

   The label copy is a clone of the whole container rather than a hand-built
   row. The nav's version mirrored `.site-nav__links a`'s padding, font and
   border by hand and carried a comment warning that the two had to be kept in
   step; cloning the container reproduces its layout exactly, for any group,
   with nothing to keep in step. Containers must have no padding of their own,
   since item offsets are measured from the container's padding edge. */
(function () {
  'use strict';

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  /* Commit and double settle. The counter-swing is about a third of the
     overshoot: more than that reads as indecision rather than as something
     sprung losing its energy. Returns null when there is no real journey. */
  function travelPath(from, to) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 1) return null;
    const ux = dx / dist;
    const uy = dy / dist;
    const over = Math.min(7, 2.5 + dist * 0.022);
    // Distance-scaled, then held to the --mo-view ceiling on the longest hop.
    const duration = Math.min(420, Math.min(340, Math.max(190, 190 + dist * 0.32)) + 160);
    const path = [
      { x: from.x, y: from.y, w: from.w, h: from.h, easing: 'cubic-bezier(.7,0,.35,1)' },
      { x: to.x + ux * over, y: to.y + uy * over, w: to.w, h: to.h, offset: .6, easing: 'cubic-bezier(.4,0,.3,1)' },
      { x: to.x - ux * over * .32, y: to.y - uy * over * .32, w: to.w, h: to.h, offset: .82, easing: 'cubic-bezier(.4,0,.3,1)' },
      { x: to.x, y: to.y, w: to.w, h: to.h }
    ];
    /* `path` is the ready-made keyframe list for callers that move a box, which
       is the pill itself. The grids cannot use it: they animate `transform` on
       a tile that is already in its final place, so they need the shape of the
       journey rather than its coordinates, and they rebuild their own keyframes
       from the unit vector and the overshoot. Both of them were already written
       against `over`, `ux` and `uy` and had been reading them as `undefined`,
       which put `translate(NaNpx, NaNpx)` into the two middle keyframes; the
       browser drops a keyframe whose value does not parse, so every surviving
       tile on the releases archive and the gear grid slid straight to its
       destination with the commit and the counter-swing silently missing. */
    return { path, duration, dist, over, ux, uy };
  }

  function travellingPill(container, opts) {
    const enabled = opts.enabled || (() => true);
    let pill = null;
    let ink = null;
    let lastIndex = -1;
    let placed = false;

    function build() {
      // Clone before the pill is inserted, or the copy contains a copy.
      const clone = container.cloneNode(true);
      clone.classList.add('mo-pill__ink', 'has-pill');
      clone.removeAttribute('id');
      clone.removeAttribute('role');
      clone.querySelectorAll('[id]').forEach((n) => n.removeAttribute('id'));
      // Belt and braces for focus: `inert` covers modern engines, stripping
      // href and forcing tabindex covers the rest. This copy is decoration and
      // must never become a second set of tab stops or a second set of labels
      // for a screen reader.
      clone.querySelectorAll('a[href]').forEach((a) => a.removeAttribute('href'));
      clone.querySelectorAll('a, button, input, select, textarea').forEach((n) => {
        n.setAttribute('tabindex', '-1');
      });
      clone.inert = true;

      pill = document.createElement('span');
      pill.className = 'mo-pill' + (opts.pillClass ? ' ' + opts.pillClass : '');
      pill.setAttribute('aria-hidden', 'true');
      pill.appendChild(clone);
      ink = clone;
      /* Opaque from the moment it exists, so the very first placement does not
         fade. The group's own highlight (the nav's blue chip, the active tab,
         the selected filter) is handed over in the same frame the pill is
         positioned, by `has-pill`. If the pill had to fade up from the CSS
         `opacity: 0` while that handover happened, the two would not overlap:
         the old highlight is gone instantly and the new one takes --mo-quick to
         arrive, so the selected item is left unmarked for that whole window.

         On a warm load none of this is visible, because the script runs before
         first paint. On a slow connection it is: measured against a simulated
         3G load, the page had been on screen for 1.2 seconds before this ran,
         and the highlight blinked out and came back a second after the visitor
         started reading. Setting the inline value here rather than after
         insertion is what skips the transition: a newly inserted element has no
         before-change style, so its first computed opacity is simply 1.

         The CSS transition is left in place for the case it was written for, a
         group emptying out and refilling: `hide()` sets opacity back to 0 on an
         element that is already laid out, and that one does fade. */
      pill.style.opacity = '1';
      container.prepend(pill);
    }

    function set(x, y, w, h) {
      pill.style.translate = x + 'px ' + y + 'px';
      pill.style.width = w + 'px';
      pill.style.height = h + 'px';
      ink.style.translate = (-x) + 'px ' + (-y) + 'px';
    }

    function hide() {
      if (!pill) return;
      pill.style.opacity = '0';
      container.classList.remove('has-pill');
      placed = false;
      lastIndex = -1;
    }

    /* Measured off rects rather than offsetLeft/offsetTop, which the browser
       rounds to whole pixels. Half a pixel is invisible on the pill itself but
       not on the ink copy: it rides the exact inverse of the pill's offset, so
       any rounding there lands the dark text half a pixel off the light text it
       is meant to cover, which reads as a smear. Offsets are taken from the
       container's own rect, so the container must have no border or padding of
       its own, matching where an absolutely positioned child starts. */
    function box(el) {
      const base = container.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      return { x: r.left - base.left, y: r.top - base.top, w: r.width, h: r.height };
    }

    function update(o) {
      const options = o || {};
      if (!enabled()) {
        if (pill) pill.hidden = true;
        container.classList.remove('has-pill');
        placed = false;
        return;
      }
      if (!pill) build();
      pill.hidden = false;
      // The copy has to be laid out at the container's own width, or its items
      // wrap differently and the ink lands on the wrong letters.
      ink.style.width = container.getBoundingClientRect().width + 'px';

      const items = opts.items();
      const index = opts.active();
      const target = items[index];
      // Groups can have nothing selected (a deselected filter, a page with no
      // nav entry). Show no pill and let the items keep their own styling, so
      // nothing is left unmarked.
      if (!target || !target.offsetWidth) return hide();

      const to = box(target);
      const fromIndex = 'from' in options ? options.from : lastIndex;
      const source = options.travel === false || reduced.matches || !placed
        ? null
        : items[fromIndex];
      const move = source && source !== target ? travelPath(box(source), to) : null;

      /* Commit the starting pose before anything else when there is a journey
         to make. Setting the destination first and only then starting an
         animation that begins elsewhere leaves a frame where the pill is
         already at its target, which reads as a flash before it jumps back. */
      if (move) {
        const start = move.path[0];
        set(start.x, start.y, start.w, start.h);
        pill.style.opacity = '1';
        void pill.offsetWidth;
      }

      pill.style.opacity = '1';
      set(to.x, to.y, to.w, to.h);
      container.classList.add('has-pill');
      placed = true;
      lastIndex = index;
      if (!move) return;

      const timing = { duration: move.duration, fill: 'backwards' };
      pill.animate(move.path.map((k) => ({
        translate: k.x + 'px ' + k.y + 'px',
        width: k.w + 'px',
        height: k.h + 'px',
        offset: k.offset,
        easing: k.easing
      })), timing);

      /* The ink copy rides the exact inverse, so it stays welded to the real
         labels in page space while the pill slides across underneath it. Same
         timing and same easing per segment, or the two drift and the dark text
         smears off its own letters. */
      ink.animate(move.path.map((k) => ({
        translate: (-k.x) + 'px ' + (-k.y) + 'px',
        offset: k.offset,
        easing: k.easing
      })), timing);
    }

    // For groups whose items are re-rendered rather than restyled: the clone is
    // a snapshot, so it has to be retaken when the originals change.
    function rebuild() {
      if (pill) pill.remove();
      pill = null;
      ink = null;
      update({ travel: false });
    }

    return { update, rebuild, hide };
  }

  window.PokestirMotion = { reduced, travelPath, travellingPill };
}());

(function () {
  'use strict';

  // Highlight the current page in the nav. Every page is either the root
  // index.html or a <section>/index.html folder page, so the location and
  // each nav href both reduce to a section name ('home' for the root).
  const parts = window.location.pathname.split('/').filter(Boolean);
  const section = parts.find((p) => !p.endsWith('.html')) || 'home';
  document.querySelectorAll('.site-nav__links a').forEach((a) => {
    const m = a.getAttribute('href').match(/(?:^|\/)([^/.]+)\/$/);
    if ((m ? m[1] : 'home') === section) a.setAttribute('aria-current', 'page');
  });

  const siteNav = document.querySelector('.site-nav');
  const toggle = document.querySelector('.site-nav__toggle');
  const menu = document.getElementById('site-nav-links');
  if (!siteNav || !toggle || !menu) return;

  // Expose the measured nav height as --nav-h so CSS can position elements
  // directly below it (mobile dropdown menu, sticky filter bars).
  function setNavHeight() {
    document.documentElement.style.setProperty('--nav-h', siteNav.offsetHeight + 'px');
  }
  setNavHeight();
  new ResizeObserver(setNavHeight).observe(siteNav);

  // On mobile, move the menu element outside <nav> so its backdrop-filter
  // can see the full viewport rather than being clipped by the nav's own
  // backdrop root stacking context. Move it back when the viewport widens.
  const mobile = window.matchMedia('(max-width: 640px)');
  const menuHome = menu.parentElement;
  function placeMenu() {
    if (mobile.matches) siteNav.insertAdjacentElement('afterend', menu);
    else menuHome.appendChild(menu);
  }
  /* ── Active-page pill ──
     The current page's highlight is one element that catches up to the new item
     rather than vanishing from one and reappearing on another.

     It animates on arrival rather than during the navigation. Carrying it
     across the navigation itself would mean a cross-document view transition,
     where both ends are *snapshots*: resizing the group stretches a bitmap, so
     the 1px border smears and the corner radius goes elliptical. Animating a
     live element here keeps every frame sharp at both widths, keeps the
     duration scaled to the distance, and works in browsers without view
     transitions at all.

     Which item to come *from* is the previous page's active index, kept in
     sessionStorage. The index is what is stored rather than the href, because
     hrefs are relative and differ by page depth, while the nav order is
     identical everywhere. */
  const PILL_KEY = 'pokestir:nav-pill';

  const navLinks = () => Array.from(menu.querySelectorAll('a:not([tabindex="-1"])'));
  const activeIndex = () => navLinks().findIndex((a) => a.hasAttribute('aria-current'));

  const pill = window.PokestirMotion.travellingPill(menu, {
    items: navLinks,
    active: activeIndex,
    enabled: () => !mobile.matches,
    pillClass: 'site-nav__pill'
  });

  /* Where the pill sat on the page we came from. The nav is identical on every
     page, so that item's geometry here is the geometry it had there. The index
     is what is stored rather than the href, because hrefs are relative and
     differ by page depth while the nav order is the same everywhere. */
  /* How long to wait for a free main thread before giving up on the arrival
     travel. It doubles as the ceiling on how late the travel may start: the
     journey either begins within this long of the nav becoming live, or it does
     not happen, so it can never slide across a nav the visitor has finished
     reading. */
  const ARRIVAL_IDLE_TIMEOUT = 400;

  function arrive() {
    let from = -1;
    const current = activeIndex();
    try {
      const prev = parseInt(sessionStorage.getItem(PILL_KEY), 10);
      if (prev >= 0 && prev !== current) from = prev;
      sessionStorage.setItem(PILL_KEY, String(current));
    } catch (e) { /* storage unavailable (private mode); no travel, just place */ }
    // A cross-page arrival is the one case with no previous on-page position to
    // travel from, so the source index is passed in explicitly.
    pill.update({ travel: false });
    if (from < 0) return;

    /* Then decide whether the journey is affordable, because this one is not
       cheap: it animates width and height, so every frame runs layout on the
       main thread and there is no compositor to fall back on. That is the
       price of the ink copy staying welded to the real labels, and it is worth
       paying on a page that is ready to draw it.

       It is not worth paying during the load. Deferred scripts run while the
       page is still being assembled, so starting here drops a 400ms
       layout-bound animation onto the busiest moment there is: on the heavier
       pages that is a few hundred KB of catalog and several hundred tiles
       being built. The slide loses most of its frames and jerks across the nav,
       which reads far worse than a pill that was simply already in place.

       Frame health is the real question, not how long the document took: a
       page that spent two seconds on the network but is idle by the time it
       paints can carry the animation perfectly well, while one that downloaded
       instantly and is now building a catalog cannot.

       So the test is simply whether the main thread goes free, asked of the
       browser directly. An idle callback that runs because there was idle time
       is the thread reporting it has room; one that runs because its timeout
       expired is the thread reporting it never did, and that is the case worth
       skipping.

       This used to watch three animation frames go by and commit only if all
       three arrived within 50ms of each other, with a second ceiling on
       `performance.now()`. Both parts misfired on exactly the connection this
       is meant to serve. The ceiling counted from navigation start rather than
       from anything to do with the thread, so any load slower than 1.5s failed
       it outright no matter how idle the page was by then, which is the case
       the paragraph above says should play. And sampling three consecutive
       frames during the load samples the noisiest moment there is: one late
       frame anywhere in the window abandoned the whole thing, so on a marginal
       connection the same page could travel or not travel from one visit to
       the next. Unpredictable is worse than either answer consistently, since
       a flourish that fires at random reads as a bug rather than as motion.

       Skipping loses a flourish, and nothing else: the pill was already put in
       its correct place above, so the failure mode is simply that it was
       always there. Playing it on a stalled thread loses the illusion. */
    const commit = () => pill.update({ from });
    if (typeof requestIdleCallback === 'function') {
      requestIdleCallback((deadline) => {
        if (deadline.didTimeout) return;
        commit();
      }, { timeout: ARRIVAL_IDLE_TIMEOUT });
    } else {
      // Safari before 16.4. One frame is enough to clear the current task.
      requestAnimationFrame(commit);
    }
  }

  placeMenu();
  arrive();
  mobile.addEventListener('change', () => { placeMenu(); pill.update({ travel: false }); });
  // Widths shift with the viewport, and web fonts land after first paint.
  new ResizeObserver(() => pill.update({ travel: false })).observe(menu);

  function setOpen(open) {
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  }

  toggle.addEventListener('click', () => {
    setOpen(!menu.classList.contains('is-open'));
  });

  /* Close as soon as a destination is chosen, before the navigation starts.
     The menu used to stay open until the next document replaced it, which is
     invisible on most of the site because the old page is gone immediately.
     The releases pages are the exception: they opt into a cross-document view
     transition, and that holds the *outgoing* page opaque while the new one
     fades in over it. So the snapshot taken on the way out still had the menu
     open, and an open menu sat on screen through the whole transition before
     the arriving page finally covered it. Choosing "Releases" while already on
     Releases was the worst version, since the destination looks identical and
     the lingering panel was the only thing that appeared to happen. */
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) setOpen(false);
  });

  // Close when clicking outside both the nav bar and the (possibly detached) menu.
  document.addEventListener('click', (e) => {
    if (menu.classList.contains('is-open') && !e.target.closest('.site-nav') && !menu.contains(e.target)) {
      setOpen(false);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) {
      setOpen(false);
      toggle.focus();
    }
  });

}());

/* ── Press gesture ──
   Hover, press and release are one move, not three unrelated states. CSS can
   express the first two but not the third: going from :active back to :hover is
   a transition, and a release needs to overshoot. So the pressed and released
   states are driven as classes here and the timing lives in CSS.

   Delegated from the document so it covers controls that pages render at
   runtime (platform buttons, filter chips, gear cards) without every page
   script opting in, and kept in its own scope so it does not depend on the nav
   markup existing: the block above returns early when the nav is absent. */
(function () {
  'use strict';

  const PRESSABLE = '.btn, .lrow, .release-tile, .rail-btn, .back-link, .social-strip a, .mw-list li, .crow, .codebox';
  /* Reduced motion removes the rebound animation, so nothing would ever signal
     the end of it and the released flag would sit on the element indefinitely.
     Skip the flag entirely there rather than relying on a cleanup that cannot
     run. */
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

  function pressOn(el) {
    if (!el) return;
    el.classList.remove('is-released');
    el.classList.add('is-pressed');
  }
  function pressOff(el, rebound) {
    if (!el || !el.classList.contains('is-pressed')) return;
    el.classList.remove('is-pressed');
    if (!rebound || reducedMotion.matches) return;
    el.classList.add('is-released');

    /* Cleared when the rebound actually finishes, whatever it happens to be
       and however many animations it runs. This used to listen for an
       animation name ending in "unsquash", which quietly required every
       pressable to own a keyframe named that way: anything added without one
       would have kept `is-released` forever. Reading the element's own
       animations asks the question directly instead.

       The reflow is load-bearing. The class was added on the line above and
       its animations do not exist until style has been recalculated, so
       without it a real rebound can read as no animation at all.

       `subtree` is load-bearing too: a release tile carries `is-released`
       itself but runs the rebound on its `.tile-cover` child, so asking only
       the element returns nothing and the flag is dropped before the animation
       it was meant to outlive has even started. Endless animations are
       excluded, or an ambient loop anywhere underneath would hold the flag
       forever. */
    void el.offsetWidth;
    const rebounds = el.getAnimations({ subtree: true }).filter((a) => {
      const timing = a.effect && a.effect.getComputedTiming();
      return timing && timing.endTime !== Infinity;
    });
    if (!rebounds.length) {
      el.classList.remove('is-released');
      return;
    }
    Promise.allSettled(rebounds.map((a) => a.finished))
      .then(() => el.classList.remove('is-released'));
  }

  document.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    pressOn(e.target.closest(PRESSABLE));
  });
  // Release anywhere: dragging off a control still has to end its pressed state.
  document.addEventListener('pointerup', (e) => {
    const el = e.target.closest(PRESSABLE);
    document.querySelectorAll('.is-pressed').forEach((p) => pressOff(p, p === el));
  });
  document.addEventListener('pointercancel', () => {
    document.querySelectorAll('.is-pressed').forEach((p) => pressOff(p, false));
  });

  /* Keyboard activation deserves the same gesture. Space and Enter are what
     actually fire a button or a link, and previously neither gave any feedback
     at all: only a mouse got an answer. */
  document.addEventListener('keydown', (e) => {
    if (e.repeat || (e.key !== ' ' && e.key !== 'Enter')) return;
    const el = e.target.closest && e.target.closest(PRESSABLE);
    if (el === document.activeElement) pressOn(el);
  });
  document.addEventListener('keyup', (e) => {
    if (e.key !== ' ' && e.key !== 'Enter') return;
    const el = e.target.closest && e.target.closest(PRESSABLE);
    pressOff(el, true);
  });
  document.addEventListener('blur', (e) => {
    const el = e.target.closest && e.target.closest(PRESSABLE);
    pressOff(el, false);
  }, true);

  // Two animations run on release; clear the flag after the longer one.
  document.addEventListener('animationend', (e) => {
    if (/unsquash$/.test(e.animationName)) e.target.classList.remove('is-released');
  });
}());

/* The animated card edge is paint bound. Keep the signature motion on cards
   in or near the viewport, but do not run dozens of copies below the fold. */
(function () {
  'use strict';

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let cardObserver = null;

  function cardsWithin(node) {
    if (!(node instanceof Element)) return [];
    const cards = node.matches('.card') ? [node] : [];
    return cards.concat(Array.from(node.querySelectorAll('.card')));
  }

  function observeCard(card) {
    card.classList.remove('is-slidebar-active');
    if (reduced.matches) return;
    if (cardObserver) cardObserver.observe(card);
    else card.classList.add('is-slidebar-active');
  }

  function startCardObserver() {
    if (cardObserver || reduced.matches) return;
    if ('IntersectionObserver' in window) {
      cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('is-slidebar-active', entry.isIntersecting);
        });
      }, { rootMargin: '160px 0px' });
    }
    document.querySelectorAll('.card').forEach(observeCard);
  }

  function stopCardObserver() {
    if (cardObserver) cardObserver.disconnect();
    cardObserver = null;
    document.querySelectorAll('.card').forEach((card) => {
      card.classList.remove('is-slidebar-active');
    });
  }

  const cardMutations = new MutationObserver((records) => {
    records.forEach((record) => {
      record.removedNodes.forEach((node) => {
        if (!cardObserver) return;
        cardsWithin(node).forEach((card) => cardObserver.unobserve(card));
      });
      record.addedNodes.forEach((node) => cardsWithin(node).forEach(observeCard));
    });
  });
  cardMutations.observe(document.body, { childList: true, subtree: true });

  startCardObserver();
  reduced.addEventListener('change', () => {
    if (reduced.matches) stopCardObserver();
    else startCardObserver();
  });
}());
