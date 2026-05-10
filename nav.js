(function () {
  'use strict';
  var path = window.location.pathname;
  var page = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
  if (page === '' || page === '/') page = 'index.html';
  document.querySelectorAll('.site-nav__links a').forEach(function (a) {
    a.removeAttribute('aria-current');
    if ((a.getAttribute('href') || '') === page) {
      a.setAttribute('aria-current', 'page');
    }
  });

  var toggle = document.querySelector('.site-nav__toggle');
  var menu = document.getElementById('site-nav-links');
  var siteNav = document.querySelector('.site-nav');

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
      var open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.site-nav') && menu.classList.contains('is-open')) {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open navigation');
      }
    });
  }
}());
