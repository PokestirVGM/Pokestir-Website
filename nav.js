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
    /* Where the pill actually lives. Normally that is the group itself, which
       is the simplest thing that works and is what the in-page groups use.

       The nav passes a `layer` instead, because its group sits inside
       `.site-nav`, which carries `backdrop-filter: blur(32px) saturate(180%)`.
       The pill animates width and height, so it repaints every frame, and a
       repaint inside a backdrop-filtered element drags the filtered region
       along with it: the most expensive surface on the site was being redrawn
       sixty times a second for the length of every journey. Hosting the pill in
       a layer that overlays the nav from outside keeps the per-frame damage to
       the pill's own box, and changes nothing about how it looks -- it painted
       above the links before and it paints above them now.

       This is why the About/Commissions tabs and the gear filter never felt
       heavy on the same code: they sit in ordinary flow with no glass over
       them, so they pass no layer and nothing here changes for them. */
    const host = opts.layer || container;
    let pill = null;
    let ink = null;
    let lastIndex = -1;
    let placed = false;
    // The pair of animations of the journey currently in flight, so a
    // repositioning that lands mid-journey can call it off. See `update`.
    let travelling = [];
    // Where that journey is heading. A reposition that agrees with it must
    // leave it alone rather than cancel it. See `update`.
    let travelTo = null;

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
      // Prepended within a group so it sits under the real labels in source
       // order; appended to a layer, which holds nothing else.
      if (opts.layer) host.appendChild(pill);
      else container.prepend(pill);
    }

    /* The ink copy has to sit exactly where the container sits, whatever the
       pill is doing, so its offset is measured from the container's origin
       rather than from zero. With no layer the container *is* the host, that
       origin is (0,0), and this reduces to the inverse of the pill's own
       offset, which is what it was before. */
    /* Position is carried by `left`/`top`, not by a transform, and that is a
       correctness requirement rather than a style choice. See the note on the
       keyframes in `update` for what a transform did here. The ink's own
       `-1px` CSS offset, which backs out the pill's border, is folded into the
       value because an inline `left` overrides it. */
    function set(x, y, w, h) {
      const o = containerOrigin();
      pill.style.left = x + 'px';
      pill.style.top = y + 'px';
      pill.style.width = w + 'px';
      pill.style.height = h + 'px';
      ink.style.left = (o.x - x - 1) + 'px';
      ink.style.top = (o.y - y - 1) + 'px';
    }

    /* A running animation overrides the inline geometry underneath it, and these
       are declared `fill: 'backwards'` only, so the override lifts the instant
       the journey ends. Anything that repositions the pill mid-journey without
       calling it off therefore has no visible effect until that moment and then
       all of it at once, as a snap. The repositioning callers are exactly the
       ones that fire at unpredictable times: the ResizeObserver on the group,
       which both the web font landing and a scrollbar appearing trip, and the
       viewport crossing the mobile breakpoint. */
    function stopTravel() {
      travelTo = null;
      if (!travelling.length) return;
      travelling.forEach((a) => a.cancel());
      travelling = [];
    }

    function hide() {
      if (!pill) return;
      stopTravel();
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
      const base = host.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      return { x: r.left - base.left, y: r.top - base.top, w: r.width, h: r.height };
    }

    // The container's own origin in host coordinates: (0,0) when there is no
    // layer, and where the nav's links begin when there is.
    function containerOrigin() {
      if (host === container) return { x: 0, y: 0 };
      const base = host.getBoundingClientRect();
      const c = container.getBoundingClientRect();
      return { x: c.left - base.left, y: c.top - base.top };
    }

    // The pill's live on-screen box, including whatever an animation in flight
    // is currently doing to it. Used to re-aim a journey without snapping.
    function liveBox() {
      const base = host.getBoundingClientRect();
      const r = pill.getBoundingClientRect();
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
      let move = source && source !== target ? travelPath(box(source), to) : null;

      /* A reposition that lands mid-journey used to cancel it unconditionally,
         which snapped the pill the rest of the way. The repositioning callers
         are the ones that fire at unpredictable times, and the group's own
         ResizeObserver is tripped by the web font landing: Lato is
         `font-display: swap`, so the swap relays out every link in the group,
         and it lands in exactly the window the cross-page travel starts in.
         A journey killed a third of the way across and finished as a jump is
         what "the animation plays wrong" was.

         So only interrupt a journey that no longer agrees with where the group
         has ended up. One that is still heading for the same box is left to
         finish; the geometry it was given is still correct. */
      const settled = travelTo && !move && travelling.length &&
        Math.abs(travelTo.x - to.x) < .5 && Math.abs(travelTo.y - to.y) < .5 &&
        Math.abs(travelTo.w - to.w) < .5 && Math.abs(travelTo.h - to.h) < .5;
      if (settled) {
        container.classList.add('has-pill');
        placed = true;
        lastIndex = index;
        return;
      }
      /* The group moved under a journey that is still running, and it moved
         somewhere new: a late catalog reflowing the page, a scrollbar
         appearing, the viewport changing. Cancelling here is what made the
         travel "half play and then cut off", because the pill was dropped
         wherever it happened to be and the corrected geometry took over as a
         jump. Re-aim from where the pill actually is instead, so the journey
         bends towards the new destination and still arrives as one movement. */
      if (!move && travelling.length && !reduced.matches) {
        move = travelPath(liveBox(), to);
      }
      // Every path below writes the pill's geometry, so the journey in flight
      // is over either way. Measuring first is safe: the boxes come from the
      // group's own items, which no pill animation touches.
      stopTravel();

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
      /* Both halves move on `left`/`top`, and neither may use a transform.

         The pill animates width and height, which the compositor cannot do, so
         its animation always runs on the main thread. The ink copy used to
         animate `translate` alone, which the compositor *can* do, so Chrome
         promoted it and ran it on the compositor thread: two halves of one
         movement, on two threads.

         While both keep up, nothing shows. The moment the main thread stalls --
         a heavy page still building, a slow load, anything -- the compositor
         carries on sliding the ink while the pill sits frozen, and the dark
         label walks straight off the blue and comes to rest beside the real
         label it is meant to be covering. That is the "it freezes, then jumps
         and plays half the animation" that this chased for a long time, and it
         is why frame sampling never found it: rAF and long-task timing only see
         the main thread, and the fault is *between* the threads.

         Naming a non-compositable property alongside the transform is not
         enough -- a value that never changes is not treated as animated, and
         the promotion happens anyway. Moving on `left`/`top` is what actually
         settles it: neither animation can be promoted, so the two cannot come
         apart, and the pill was already paying for layout every frame because
         of width and height. */
      const pillAnim = pill.animate(move.path.map((k) => ({
        left: k.x + 'px',
        top: k.y + 'px',
        width: k.w + 'px',
        height: k.h + 'px',
        offset: k.offset,
        easing: k.easing
      })), timing);

      /* The ink copy rides the exact inverse, so it stays welded to the real
         labels in page space while the pill slides across underneath it. Same
         timing and same easing per segment, or the two drift and the dark text
         smears off its own letters. */
      const origin = containerOrigin();
      const inkAnim = ink.animate(move.path.map((k) => ({
        left: (origin.x - k.x - 1) + 'px',
        top: (origin.y - k.y - 1) + 'px',
        offset: k.offset,
        easing: k.easing
      })), timing);

      travelling = [pillAnim, inkAnim];
      travelTo = to;
      const settle = () => {
        if (travelling[0] !== pillAnim) return;
        travelling = [];
        travelTo = null;
      };
      pillAnim.finished.then(settle, settle);
    }

    // For groups whose items are re-rendered rather than restyled: the clone is
    // a snapshot, so it has to be retaken when the originals change.
    function rebuild() {
      stopTravel();
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

  /* The pill's own layer, outside the nav so its per-frame repaint does not
     drag the nav's backdrop-filter along with it. Fixed at the top of the
     viewport, which is where the nav always is: it is the first thing in the
     body apart from the fixed skip link, and it is `position: sticky; top: 0`,
     so it neither moves on scroll nor starts anywhere else. Item boxes are
     measured live against this layer on every placement, so the pill still
     lands wherever the nav actually is rather than trusting that assumption. */
  const pillLayer = document.createElement('div');
  pillLayer.className = 'site-nav__pill-layer';
  document.body.appendChild(pillLayer);

  const pill = window.PokestirMotion.travellingPill(menu, {
    items: navLinks,
    active: activeIndex,
    enabled: () => !mobile.matches,
    pillClass: 'site-nav__pill',
    layer: pillLayer
  });

  /* Where the pill sat on the page we came from. The nav is identical on every
     page, so that item's geometry here is the geometry it had there. The index
     is what is stored rather than the href, because hrefs are relative and
     differ by page depth while the nav order is the same everywhere. */
  /* How long to keep waiting for a thread that can carry the travel, counted
     from the first contentful paint. It doubles as the ceiling on how late the
     journey may start: it either begins within this long of the page appearing
     or it does not happen, so it can never slide across a nav the visitor has
     finished reading.

     Counted from the paint rather than from here because "here" is the wrong
     clock. Deferred scripts run before the browser has drawn anything, so a
     deadline started at this line is spent almost entirely on the load. */
  const ARRIVAL_DEADLINE = 1200;
  // Backstop for a web font that never resolves, so the journey is not held
  // hostage to it. Comfortably longer than a swap on a slow connection, since
  // firing early is the failure it exists to avoid.
  const FONT_BACKSTOP = 800;

  /* Hand back the frame after the page's first contentful paint.

     Nothing before that paint is a safe place to start this animation, and the
     paint frame itself is the worst one there is: it is where the whole
     document rasterizes for the first time and where the sticky nav's
     backdrop-filter is composited over a backdrop that has only just arrived.
     Measured on the releases and gear pages under a throttled load, the travel
     was being started 8ms *before* first paint, every single time, so all 400ms
     of it were spent on frames the browser had no room to draw. That is the
     stutter, and it is also why it looked random: whether any given frame
     survived depended on how the paint and the catalog build happened to
     interleave that visit. */
  function afterFirstPaint(run) {
    // One more frame past the paint, since the entry is delivered inside the
    // frame that did the work and that is the frame being stepped over.
    const go = () => requestAnimationFrame(() => requestAnimationFrame(run));
    const types = (window.PerformanceObserver && PerformanceObserver.supportedEntryTypes) || [];
    /* No paint timing to wait on, so take the two frames and let
       `whenNavSettled` be the whole test. Deliberately not a timeout alongside
       the observer: a
       fallback clock short enough to be useful would fire before the paint on
       exactly the slow load this is here to protect, which is the failure it is
       meant to prevent. Either the browser can tell us when it painted or it
       cannot. */
    if (types.indexOf('paint') < 0) return go();
    const po = new PerformanceObserver((list) => {
      if (!list.getEntries().some((e) => e.name === 'first-contentful-paint')) return;
      po.disconnect();
      go();
    });
    // `buffered` covers the paint that already happened: on a warm load this
    // script can run after it, and without this the entry is gone.
    po.observe({ type: 'paint', buffered: true });
  }

  /* Then wait until the nav has stopped changing shape, and draw.

     What stood here asked whether the main thread *felt* fast: it sampled
     frame gaps and played only after catching two consecutive ones under 34ms
     within 600ms of the paint. That is a coin flip, and it is the reason the
     travel "works half the time". The same page travelled or did not travel
     from one visit to the next depending on how the load happened to
     interleave that visit, and on a slow load it usually lost, so the flourish
     went missing exactly where it was most wanted. Every version of this that
     tuned the numbers kept the coin flip and only changed its bias.

     The question that actually decides whether the journey looks right is not
     "is the thread fast" but "has the nav finished moving".
     `document.fonts.ready` answers that one, and answers it definitively: Lato
     is `font-display: swap`, so the swap relays out every link in the group,
     and it lands in the same window the travel used to start in. Waiting for
     it means the journey measures final geometry and the group's
     ResizeObserver has already fired, which is the other half of why the
     animation used to end as a snap.

     The timeout is a backstop for a font that never arrives, not a race
     against one. */
  function whenNavSettled(run) {
    let ran = false;
    let timer = null;
    const go = () => {
      if (ran) return;
      ran = true;
      clearTimeout(timer);
      run();
    };
    timer = setTimeout(go, FONT_BACKSTOP);
    const fonts = document.fonts && document.fonts.ready;
    if (!fonts) return;
    // One frame past the swap, so the relayout it causes is already committed
    // and the boxes this measures are the ones that will be on screen.
    fonts.then(() => requestAnimationFrame(go), () => go());
  }

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

       Frame health is *not* the question, though it was asked for a long
       time. It cannot be sampled without guessing, and a flourish that fires
       at random reads as a bug rather than as motion. What the journey needs
       is that the page is on screen and that the nav has stopped changing
       shape underneath it, and both of those can be observed exactly:
       `afterFirstPaint` and `whenNavSettled` above, which is also where the
       reasoning for each lives.

       Skipping loses a flourish, and nothing else: the pill was already put in
       its correct place above, so the failure mode is simply that it was
       always there. */
    /* On screen, then settled, then travel. Whether it plays is now decided by
       how late we are, which is a property of the load, rather than by frame
       jitter, which is a property of nothing. A given page on a given
       connection behaves the same way every time.

       Past the ceiling the pill is simply already in place, which is what it
       was anyway whenever the old gate lost its coin flip. */
    const askedAt = performance.now();
    afterFirstPaint(() => whenNavSettled(() => {
      if (performance.now() - askedAt > ARRIVAL_DEADLINE) return;
      pill.update({ from });
    }));
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
