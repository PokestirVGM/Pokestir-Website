(function () {
  'use strict';
  const path = window.location.pathname;
  let page = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
  if (page === '' || page === '/') page = 'index.html';
  document.querySelectorAll('.site-nav__links a').forEach(function (a) {
    a.removeAttribute('aria-current');
    if ((a.getAttribute('href') || '') === page) {
      a.setAttribute('aria-current', 'page');
    }
  });

  const toggle = document.querySelector('.site-nav__toggle');
  const menu = document.getElementById('site-nav-links');
  const siteNav = document.querySelector('.site-nav');

  // On mobile, move the menu element outside <nav> so its backdrop-filter
  // can see the full viewport rather than being clipped by the nav's own
  // backdrop root stacking context.
  if (menu && siteNav && window.matchMedia('(max-width: 640px)').matches) {
    siteNav.insertAdjacentElement('afterend', menu);
  }

  function updateMenuTop() {
    if (menu && siteNav) {
      if (window.innerWidth <= 640) {
        menu.style.top = siteNav.offsetHeight + 'px';
      } else {
        menu.style.top = '';
      }
    }
  }
  updateMenuTop();
  window.addEventListener('resize', updateMenuTop);
  if (siteNav) new ResizeObserver(updateMenuTop).observe(siteNav);

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      const open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });
    document.addEventListener('click', function (e) {
      // Close when clicking outside both the nav bar and the (now-detached) menu
      if (!e.target.closest('.site-nav') && !menu.contains(e.target) && menu.classList.contains('is-open')) {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open navigation');
      }
    });
  }
}());
