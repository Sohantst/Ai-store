/* AgentX motion layer — pure DOM, no libraries, doesn't touch app logic */
(function () {
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn();
  }

  ready(function () {
    var doc = document.documentElement, nav = document.querySelector('.nav');

    // Scroll progress + sticky nav state
    var bar = document.createElement('div'); bar.className = 'progress'; document.body.appendChild(bar);
    function onScroll() {
      var max = doc.scrollHeight - doc.clientHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? doc.scrollTop / max : 0) + ')';
      if (nav) nav.classList.toggle('scrolled', doc.scrollTop > 8);
    }
    addEventListener('scroll', onScroll, { passive: true }); onScroll();
    if (reduce) return;

    // Headline: word-by-word reveal
    var h1 = document.querySelector('main h1');
    if (h1) {
      var i = 0;
      (function walk(n) {
        Array.prototype.slice.call(n.childNodes).forEach(function (c) {
          if (c.nodeType === 3) {
            var f = document.createDocumentFragment();
            c.textContent.split(/(\s+)/).forEach(function (p) {
              if (!p) return;
              if (/^\s+$/.test(p)) { f.appendChild(document.createTextNode(' ')); return; }
              var w = document.createElement('span'); w.className = 'w';
              var wi = document.createElement('span'); wi.className = 'wi';
              wi.style.transitionDelay = (0.07 * i++) + 's'; wi.textContent = p;
              w.appendChild(wi); f.appendChild(w);
            });
            c.parentNode.replaceChild(f, c);
          } else if (c.nodeType === 1) walk(c);
        });
      })(h1);
      requestAnimationFrame(function () { requestAnimationFrame(function () { h1.classList.add('split-in'); }); });
    }

    // Scroll reveal (also picks up dynamically rendered cards/rows)
    var sel = '.section-intro,.lede,.step,.agent-row,.review,.price-box,.detail-stats,.form-field,.admin-row,.empty-state,.filters,.detail-head';
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
    function prep(el) {
      if (el.dataset.fx || (el.closest && el.closest('.hero') && el.classList.contains('lede'))) return;
      el.dataset.fx = '1';
      var idx = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
      el.style.setProperty('--d', Math.min(idx, 8) * 0.07 + 's');
      el.classList.add('rv'); io.observe(el);
    }
    function scan(root) {
      if (root.matches && root.matches(sel)) prep(root);
      root.querySelectorAll && root.querySelectorAll(sel).forEach(prep);
    }
    scan(document);
    new MutationObserver(function (ms) {
      ms.forEach(function (m) { m.addedNodes.forEach(function (n) { if (n.nodeType === 1) scan(n); }); });
    }).observe(document.body, { childList: true, subtree: true });

    // Spotlight follows cursor inside cards
    var glowSel = '.step,.price-box,.agent-row,.empty-state';
    document.addEventListener('pointermove', function (e) {
      var t = e.target.closest && e.target.closest(glowSel); if (!t) return;
      var r = t.getBoundingClientRect();
      t.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      t.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });

    if (fine) {
      // Soft cursor glow
      var g = document.createElement('div'); g.className = 'cursor-glow'; document.body.appendChild(g);
      var tx = innerWidth / 2, ty = innerHeight / 2, cx = tx, cy = ty;
      addEventListener('pointermove', function (e) { tx = e.clientX; ty = e.clientY; g.style.opacity = 1; }, { passive: true });
      (function loop() {
        cx += (tx - cx) * 0.12; cy += (ty - cy) * 0.12;
        g.style.transform = 'translate3d(' + (cx - 200) + 'px,' + (cy - 200) + 'px,0)';
        requestAnimationFrame(loop);
      })();

      // Magnetic primary buttons
      var mag = '.btn-primary:not([disabled]),.nav-links a.cta';
      document.addEventListener('pointermove', function (e) {
        var b = e.target.closest && e.target.closest(mag); if (!b) return;
        var r = b.getBoundingClientRect();
        b.style.translate = ((e.clientX - r.left - r.width / 2) * 0.18) + 'px ' + ((e.clientY - r.top - r.height / 2) * 0.28) + 'px';
      }, { passive: true });
      document.addEventListener('pointerout', function (e) {
        var b = e.target.closest && e.target.closest(mag);
        if (b && !b.contains(e.relatedTarget)) b.style.translate = '';
      });
    }

    // Particle network background
    var cv = document.createElement('canvas'); cv.className = 'bg-canvas'; document.body.insertBefore(cv, document.body.firstChild);
    var ctx = cv.getContext('2d'), W, H, dpr = Math.min(devicePixelRatio || 1, 2), pts = [], mouse = { x: -999, y: -999 };
    function size() {
      W = innerWidth; H = innerHeight;
      cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(Math.min(70, W * H / 20000));
      while (pts.length < n) pts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35, r: Math.random() * 1.4 + .6 });
      pts.length = n;
    }
    size(); addEventListener('resize', size);
    addEventListener('pointermove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    function frame() {
      if (!document.hidden) {
        ctx.clearRect(0, 0, W, H);
        for (var a = 0; a < pts.length; a++) {
          var p = pts[a];
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > W) p.vx *= -1;
          if (p.y < 0 || p.y > H) p.vy *= -1;
          var dm = Math.hypot(p.x - mouse.x, p.y - mouse.y);
          if (dm < 170) {
            p.x += (mouse.x - p.x) * 0.006; p.y += (mouse.y - p.y) * 0.006;
            ctx.strokeStyle = 'rgba(255,216,138,' + (0.35 * (1 - dm / 170)) + ')';
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
          }
          ctx.fillStyle = 'rgba(232,163,61,.7)';
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
          for (var b = a + 1; b < pts.length; b++) {
            var q = pts[b], d = Math.hypot(p.x - q.x, p.y - q.y);
            if (d < 130) {
              ctx.strokeStyle = 'rgba(232,163,61,' + (0.16 * (1 - d / 130)) + ')';
              ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
            }
          }
        }
      }
      requestAnimationFrame(frame);
    }
    frame();
  });
})();
