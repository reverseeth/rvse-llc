/* RVSE LLC — interactions: scroll reveal, pill nav, mobile menu */

(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var touchUI = window.matchMedia('(hover: none)').matches;

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

  /* ── ticker: clone groups so the -50% loop never runs dry ─ */
  var track = document.querySelector('.ticker__track');

  if (track && !reduce) {
    var buildTicker = function () {
      var groupEl = track.firstElementChild;
      if (!groupEl) return;
      var groupW = groupEl.getBoundingClientRect().width;
      var hostW = track.parentElement.getBoundingClientRect().width;
      if (!groupW || !hostW) return;

      /* one half of the track must be at least as wide as the host */
      var perHalf = Math.max(1, Math.ceil(hostW / groupW));
      var total = perHalf * 2;
      while (track.children.length < total) track.appendChild(groupEl.cloneNode(true));
      while (track.children.length > total) track.removeChild(track.lastElementChild);

      /* constant speed (~70px/s) whatever the width */
      track.style.animationDuration = ((groupW * perHalf) / 70).toFixed(2) + 's';
    };

    buildTicker();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(buildTicker);
    window.addEventListener('load', buildTicker);

    var tickerRaf = 0;
    window.addEventListener('resize', function () {
      window.cancelAnimationFrame(tickerRaf);
      tickerRaf = window.requestAnimationFrame(buildTicker);
    });
  }

  /* ── touch: scroll position takes over from hover ──────── */
  if (touchUI && !reduce && 'IntersectionObserver' in window) {
    var focusables = document.querySelectorAll('.card, .step');
    if (focusables.length) {
      var fio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          entry.target.classList.toggle('is-focus', entry.isIntersecting);
        });
      }, { rootMargin: '-38% 0px -38% 0px', threshold: 0 });
      focusables.forEach(function (el) { fio.observe(el); });
    }
  }

  /* ── touch: the ticker leans into scroll velocity ───────── */
  if (touchUI && !reduce && track && typeof track.getAnimations === 'function') {
    var tickerAnim = null;
    var vel = 0;
    var rate = 1;
    var lastVelY = window.scrollY;

    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      vel = y - lastVelY;
      lastVelY = y;
    }, { passive: true });

    var pump = function () {
      if (!tickerAnim) {
        var anims = track.getAnimations();
        tickerAnim = anims.length ? anims[0] : null;
      }
      var target = 1 + Math.min(Math.abs(vel) / 14, 2.2);
      vel *= 0.86;
      rate += (target - rate) * 0.09;
      if (tickerAnim) tickerAnim.playbackRate = rate;
      window.requestAnimationFrame(pump);
    };
    window.requestAnimationFrame(pump);
  }

  /* ── nav: floating pill + slip away on downward scroll ──── */
  var nav = document.getElementById('nav');

  if (nav) {
    var ticking = false;
    var lastNavY = window.scrollY;
    var syncNav = function () {
      var y = window.scrollY;
      nav.classList.toggle('is-pill', y > 24);
      var menuOpen = !document.getElementById('menu').hidden;
      if (menuOpen || y < 260 || y < lastNavY - 2) {
        nav.classList.remove('is-away');
      } else if (y > lastNavY + 4) {
        nav.classList.add('is-away');
      }
      lastNavY = y;
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
      if (open && nav) nav.classList.remove('is-away');
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
