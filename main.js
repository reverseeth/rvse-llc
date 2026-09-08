/* RVSE LLC — interactions: scroll reveal, sticky nav state, mobile menu */

(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── scroll reveal ─────────────────────────────────────── */
  var revealables = document.querySelectorAll('.reveal');

  if (reduce || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    revealables.forEach(function (el) {
      var step = parseFloat(el.dataset.d || '0');
      el.style.setProperty('--delay', (step * 0.09) + 's');
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    revealables.forEach(function (el) { io.observe(el); });

    /* A deep link (…/#model) scrolls after the observer has already sampled
       positions, which can leave that section stuck at opacity 0. Sweep once
       the page has settled and reveal anything sitting in the viewport. */
    var sweep = function () {
      revealables.forEach(function (el) {
        if (el.classList.contains('is-in')) return;
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) {
          el.classList.add('is-in');
          io.unobserve(el);
        }
      });
    };

    window.addEventListener('load', function () {
      sweep();
      window.setTimeout(sweep, 260);
    });
  }

  /* ── sticky nav hairline ───────────────────────────────── */
  var nav = document.getElementById('nav');

  if (nav) {
    var ticking = false;
    var syncNav = function () {
      nav.classList.toggle('is-stuck', window.scrollY > 8);
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(syncNav);
    }, { passive: true });
    syncNav();
  }

  /* ── mobile menu ───────────────────────────────────────── */
  var toggle = document.querySelector('.nav__toggle');
  var menu = document.getElementById('menu');

  if (toggle && menu) {
    var setMenu = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      menu.hidden = !open;
    };

    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });

    menu.addEventListener('click', function (event) {
      if (event.target.closest('a')) setMenu(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        toggle.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) setMenu(false);
    });
  }
})();
