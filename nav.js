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
}());
