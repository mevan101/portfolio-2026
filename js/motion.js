/* Motion for msaevan.com.
   Scroll drives the page: almost everything is scrubbed to the scroll position with
   a little inertia, so it moves with the reader and reverses when they scroll back.
   Without JS, or with reduced motion, the page is static and complete. */
(function () {
  var r = document.documentElement;
  function q(s, c) { return (c || document).querySelector(s); }
  function qa(s, c) { return [].slice.call((c || document).querySelectorAll(s)); }
  function release() { r.classList.remove('pre'); }
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (still || !window.gsap || !window.ScrollTrigger || !window.SplitText) { release(); if (!still && window.startTerm) startTerm(); return; }

  gsap.registerPlugin(ScrollTrigger, SplitText);
  gsap.defaults({ ease: 'power3.out', duration: 1 });
  r.classList.add('mo');
  var fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  var clamp = gsap.utils.clamp;

  /* reading progress along the menu bar */
  var bar = q('.menubar'), fx = document.createElement('i');
  fx.className = 'fx'; fx.setAttribute('aria-hidden', 'true'); bar.appendChild(fx);
  gsap.to(fx, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.4 } });

  /* ---------- hero: a calm entrance, then the windows part as you scroll away ---------- */
  var desk = q('.desk'), about = q('.w-about'), photo = q('.w-photo'), term = q('.w-term'), stk = q('.sticker');
  var fonts = document.fonts ? document.fonts.ready : Promise.resolve();
  Promise.race([fonts, new Promise(function (res) { setTimeout(res, 800); })]).then(intro);

  function intro() {
    var name = SplitText.create(q('#h-name').children, { type: 'lines', mask: 'lines', linesClass: 'ln', aria: 'auto' });
    var img = photo.querySelector('img');
    var tl = gsap.timeline();
    tl.from(about, { y: 32, autoAlpha: 0, duration: 1.1 }, 0)
      .from(name.lines, { yPercent: 105, duration: 1.2, stagger: 0.1, ease: 'expo.out' }, 0.15)
      .from(qa('.hello, .role, .pitch, .ctas', about), { y: 18, autoAlpha: 0, stagger: 0.08 }, 0.35)
      .fromTo(photo, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% -3% -3% 0%)', duration: 1.3, ease: 'expo.inOut', clearProps: 'clipPath' }, 0.2)
      .from(img, { scale: 1.12, duration: 1.8, ease: 'expo.out' }, 0.45)
      .from(term, { y: 32, autoAlpha: 0, duration: 1.1 }, 0.6)
      .from(qa('.term p'), { autoAlpha: 0, x: -8, duration: 0.6, stagger: 0.12, ease: 'power2.out' }, 0.95)
      .from(stk, { scale: 0.85, autoAlpha: 0, duration: 0.8, ease: 'back.out(1.6)' }, 1.2)
      .add(function () {
        var out = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: desk, start: 'top top', end: 'bottom top', scrub: 1 } });
        out.to(about, { yPercent: -6, autoAlpha: 0.35 }, 0)
          .to(photo, { yPercent: -22, autoAlpha: 0.35 }, 0)
          .to(term, { yPercent: -45, autoAlpha: 0.35 }, 0);
      });
    release();
  }

  /* ---------- section headings ---------- */
  qa('.sh').forEach(function (sh) {
    var h = sh.querySelector('h2'), p = sh.querySelector('p');
    var tl = gsap.timeline({ scrollTrigger: { trigger: sh, start: 'top 85%', once: true } });
    tl.from(h, { yPercent: 40, autoAlpha: 0, duration: 1.1, ease: 'expo.out' });
    if (p) tl.from(p, { y: 16, autoAlpha: 0 }, 0.12);
  });

  /* ---------- scrubbed reveals: rise, scale and come into focus with the scroll ---------- */
  function scrubIn(els, from, start, end) {
    els.forEach(function (el) {
      var to = { ease: 'none', scrollTrigger: { trigger: el, start: start, end: end, scrub: 1 } };
      Object.keys(from).forEach(function (k) { to[k] = k === 'filter' ? 'blur(0px)' : k === 'autoAlpha' || k === 'scale' ? 1 : 0; });
      gsap.fromTo(el, from, to);
    });
  }
  var wins = qa('section.s .win, .contact .win').filter(function (w) { return !w.querySelector('.log'); });
  scrubIn(wins, { y: 90, scale: 0.94, autoAlpha: 0 }, 'top 100%', 'top 62%');
  scrubIn(qa('.trophies li, .inbox li, .edu li, .kit > div'), { y: 26, autoAlpha: 0, filter: 'blur(6px)' }, 'top 98%', 'top 78%');
  scrubIn(qa('.job, .lv-g'), { y: 22, autoAlpha: 0 }, 'top 98%', 'top 82%');
  qa('.shot img').forEach(function (im) {
    gsap.fromTo(im, { scale: 1.18, yPercent: -5 }, { scale: 1.08, yPercent: 5, ease: 'none', scrollTrigger: { trigger: im.parentNode, start: 'top bottom', end: 'bottom top', scrub: 1 } });
  });

  /* ---------- journey ---------- */
  var log = q('.log'), mm = gsap.matchMedia();
  if (log) {
    var lwin = log.closest('.win'), items = qa('li', log), n = items.length;
    gsap.from(lwin, { y: 60, autoAlpha: 0, duration: 1.2, scrollTrigger: { trigger: lwin, start: 'top 90%', once: true } });

    /* desktop: pinned dial, the years orbit a ring */
    mm.add('(min-width: 981px)', function () {
      lwin.classList.add('orbit');
      var STEP = 17, years = items.map(function (li) { return li.querySelector('.yr').textContent; });
      var dial = document.createElement('div'); dial.className = 'dial'; dial.setAttribute('aria-hidden', 'true');
      years.forEach(function (y, i) { var b = document.createElement('b'); b.textContent = y; b.dataset.i = i; dial.appendChild(b); });
      var big = document.createElement('div'); big.className = 'bigyr'; big.setAttribute('aria-hidden', 'true'); big.innerHTML = '<span>' + years[0] + '</span>';
      var cnt = document.createElement('div'); cnt.className = 'orbit-n'; cnt.setAttribute('aria-hidden', 'true'); cnt.innerHTML = '<span>01</span><i></i>' + (n < 10 ? '0' : '') + n;
      log.prepend(dial); log.append(big, cnt);
      var yspan = big.firstChild, ticks = qa('b', dial), W, H, R, cx, cy, hs = [], cur = -1;
      function measure() {
        W = log.clientWidth; H = log.clientHeight; R = Math.max(H * 1.25, 680); cx = W * 0.46 - R; cy = H / 2;
        gsap.set(dial, { width: R * 2, height: R * 2, left: cx - R, top: cy - R });
        ticks.forEach(function (b, i) { var a = i * STEP * Math.PI / 180, rr = R - 34; gsap.set(b, { x: Math.cos(a) * rr - 40, y: Math.sin(a) * rr - 10 }); });
        hs = items.map(function (li) { return li.offsetHeight; });
      }
      function render(p) {
        var k = p * (n - 1);
        items.forEach(function (li, i) {
          var d = i - k, ad = Math.abs(d), a = d * STEP * Math.PI / 180;
          gsap.set(li, {
            x: cx + Math.cos(a) * R, y: cy + Math.sin(a) * R - hs[i] / 2, rotation: d * STEP,
            scale: 1 - Math.min(ad, 2) * 0.07, autoAlpha: clamp(0, 1, 1.25 - ad * 0.6),
            filter: ad < 0.04 ? 'none' : 'blur(' + (Math.min(ad, 2) * 3).toFixed(2) + 'px)', zIndex: 20 - Math.round(ad * 4)
          });
        });
        gsap.set(dial, { rotation: -k * STEP });
        var c = Math.round(k);
        if (c !== cur) {
          var dir = c > cur ? 1 : -1; cur = c;
          gsap.to(yspan, { yPercent: -35 * dir, autoAlpha: 0, duration: 0.18, ease: 'power2.in', overwrite: true, onComplete: function () {
            yspan.textContent = years[cur];
            gsap.fromTo(yspan, { yPercent: 35 * dir }, { yPercent: 0, autoAlpha: 1, duration: 0.55, ease: 'expo.out' });
          } });
          cnt.firstChild.textContent = (c + 1 < 10 ? '0' : '') + (c + 1);
          ticks.forEach(function (b, i) { b.classList.toggle('on', i === c); });
          items.forEach(function (li, i) { li.setAttribute('aria-current', i === c ? 'step' : 'false'); });
        }
        cnt.style.setProperty('--p', p);
      }
      measure(); render(0);
      /* scroll progress is eased through a proxy, which gives the dial its inertia */
      var prox = { p: 0 }, sm = gsap.quickTo(prox, 'p', { duration: 0.9, ease: 'power3', onUpdate: function () { render(prox.p); } });
      var st2 = ScrollTrigger.create({
        trigger: '#journey', pin: true, start: 'top top', end: '+=' + (n - 1) * 75 + '%',
        onRefresh: function (s) { measure(); render(s.progress); prox.p = s.progress; },
        onUpdate: function (s) { sm(s.progress); }
      });
      return function () {
        st2.kill(); dial.remove(); big.remove(); cnt.remove(); lwin.classList.remove('orbit');
        gsap.set(items, { clearProps: 'all' }); items.forEach(function (li) { li.removeAttribute('aria-current'); });
      };
    });

    /* smaller screens: a rail fills as you read, the current year is marked */
    mm.add('(max-width: 980px)', function () {
      var rail = document.createElement('span'); rail.className = 'rail'; rail.setAttribute('aria-hidden', 'true'); rail.innerHTML = '<i></i>'; log.appendChild(rail);
      var tw = gsap.to(rail.firstChild, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: log, start: 'top 60%', end: 'bottom 60%', scrub: 1 } });
      var sts = items.map(function (li) {
        gsap.fromTo(li, { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, ease: 'none', scrollTrigger: { trigger: li, start: 'top 98%', end: 'top 80%', scrub: 1 } });
        return ScrollTrigger.create({ trigger: li, start: 'top 60%', end: 'bottom 60%', onToggle: function (s) { li.classList.toggle('now', s.isActive); } });
      });
      return function () { tw.scrollTrigger.kill(); sts.forEach(function (s) { s.kill(); }); rail.remove(); };
    });
  }

  /* ---------- experience: a selection frame glides to the hovered row ---------- */
  var list = q('.win.list');
  if (list && fine) {
    var hl = document.createElement('span'); hl.className = 'hl'; hl.setAttribute('aria-hidden', 'true'); list.appendChild(hl);
    var first = true;
    qa('.job', list).forEach(function (j) {
      j.addEventListener('pointerenter', function () {
        if (first) { gsap.set(hl, { y: j.offsetTop, height: j.offsetHeight }); first = false; }
        gsap.to(hl, { y: j.offsetTop, height: j.offsetHeight, autoAlpha: 1, duration: 0.5, overwrite: true });
      });
    });
    list.addEventListener('pointerleave', function () { first = true; gsap.to(hl, { autoAlpha: 0, duration: 0.3 }); });
  }

  /* ---------- contact headline ---------- */
  var hc = q('#h-contact');
  if (hc) {
    var sc = SplitText.create(hc, { type: 'lines', mask: 'lines', linesClass: 'ln', aria: 'auto' });
    gsap.from(sc.lines, { yPercent: 105, duration: 1.2, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: hc, start: 'top 88%', once: true } });
  }

  addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
