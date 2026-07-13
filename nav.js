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
  placeMenu();
  mobile.addEventListener('change', placeMenu);

  function setOpen(open) {
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  }

  toggle.addEventListener('click', () => {
    setOpen(!menu.classList.contains('is-open'));
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
