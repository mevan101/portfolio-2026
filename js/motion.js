/* Motion for msaevan.com.
   One quiet language: things fade and rise a short distance on a single ease.
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

  /* reading progress along the menu bar */
  var bar = q('.menubar'), fx = document.createElement('i');
  fx.className = 'fx'; fx.setAttribute('aria-hidden', 'true'); bar.appendChild(fx);
  gsap.to(fx, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.4 } });

  /* ---------- hero ---------- */
  var about = q('.w-about'), photo = q('.w-photo'), term = q('.w-term'), stk = q('.sticker');
  var fonts = document.fonts ? document.fonts.ready : Promise.resolve();
  Promise.race([fonts, new Promise(function (res) { setTimeout(res, 800); })]).then(intro);

  function intro() {
    var name = SplitText.create(q('#h-name').children, { type: 'lines', mask: 'lines', linesClass: 'ln', aria: 'auto' });
    var lines = qa('.term p');
    var img = photo.querySelector('img');
    var tl = gsap.timeline();
    tl.from(about, { y: 32, autoAlpha: 0, duration: 1.1 }, 0)
      .from(name.lines, { yPercent: 105, duration: 1.2, stagger: 0.1, ease: 'expo.out' }, 0.15)
      .from(qa('.hello, .role, .pitch, .ctas', about), { y: 18, autoAlpha: 0, stagger: 0.08 }, 0.35)
      .fromTo(photo, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% -3% -3% 0%)', duration: 1.3, ease: 'expo.inOut', clearProps: 'clipPath' }, 0.2)
      .from(img, { scale: 1.12, duration: 1.8, ease: 'expo.out' }, 0.45)
      .from(term, { y: 32, autoAlpha: 0, duration: 1.1 }, 0.6)
      .from(lines, { autoAlpha: 0, x: -8, duration: 0.6, stagger: 0.12, ease: 'power2.out' }, 0.95)
      .from(stk, { scale: 0.85, autoAlpha: 0, duration: 0.8, ease: 'back.out(1.6)' }, 1.2);
    release();
  }

  /* ---------- section headings: lines rise from behind a mask ---------- */
  qa('.sh').forEach(function (sh) {
    var h = sh.querySelector('h2'), p = sh.querySelector('p');
    var tl = gsap.timeline({ scrollTrigger: { trigger: sh, start: 'top 85%', once: true } });
    tl.from(h, { yPercent: 40, autoAlpha: 0, duration: 1.1, ease: 'expo.out' });
    if (p) tl.from(p, { y: 16, autoAlpha: 0 }, 0.12);
  });

  /* ---------- windows and the rows inside them ---------- */
  var wins = qa('section.s .win, .contact .win');
  gsap.set(wins, { y: 40, autoAlpha: 0 });
  ScrollTrigger.batch(wins, { start: 'top 90%', once: true, onEnter: function (b) {
    gsap.to(b, { y: 0, autoAlpha: 1, duration: 1.1, stagger: 0.1, clearProps: 'transform' });
  } });

  var rows = qa('.job, .lv-g, .trophies li, .inbox li, .edu li, .log li');
  gsap.set(rows, { y: 14, autoAlpha: 0 });
  ScrollTrigger.batch(rows, { start: 'top 94%', once: true, onEnter: function (b) {
    gsap.to(b, { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.05, delay: 0.1, clearProps: 'transform' });
  } });

  /* ---------- journey: a rail fills as you read, the current year is marked ---------- */
  var log = q('.log');
  if (log) {
    var rail = document.createElement('span'); rail.className = 'rail'; rail.setAttribute('aria-hidden', 'true'); rail.innerHTML = '<i></i>'; log.appendChild(rail);
    gsap.to(rail.firstChild, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: log, start: 'top 60%', end: 'bottom 60%', scrub: 0.6 } });
    qa('li', log).forEach(function (li) {
      ScrollTrigger.create({ trigger: li, start: 'top 60%', end: 'bottom 60%', onToggle: function (s) { li.classList.toggle('now', s.isActive); } });
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
        gsap.to(hl, { y: j.offsetTop, height: j.offsetHeight, autoAlpha: 1, duration: 0.5, ease: 'power3.out', overwrite: true });
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
