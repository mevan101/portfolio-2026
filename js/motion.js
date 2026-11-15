/* Motion for msaevan.com. GSAP + ScrollTrigger + SplitText + Lenis.
   Everything is progressive: without JS, or with reduced motion, the page is static and complete. */
(function () {
  var r = document.documentElement;
  function q(s, c) { return (c || document).querySelector(s); }
  function qa(s, c) { return [].slice.call((c || document).querySelectorAll(s)); }
  function release() { r.classList.remove('pre'); }
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (still || !window.gsap || !window.ScrollTrigger || !window.SplitText) { release(); if (!still && window.startTerm) startTerm(); return; }

  gsap.registerPlugin(ScrollTrigger, SplitText, window.ScrambleTextPlugin || {});
  var fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  var wide = matchMedia('(min-width:981px)').matches;
  var OUT = 'expo.out';
  r.classList.add('mo');
  if (fine) r.classList.add('fine');

  /* ---------- smooth scroll ---------- */
  var lenis = null;
  if (fine && window.Lenis) {
    r.style.scrollBehavior = 'auto';
    lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
    qa('a[href^="#"]:not(.skip)').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href'), t = id.length > 1 && document.getElementById(id.slice(1));
        if (!t) return;
        e.preventDefault();
        lenis.scrollTo(t, { offset: -60, duration: 1.5 });
        history.replaceState(null, '', id);
        if (!t.hasAttribute('tabindex')) t.setAttribute('tabindex', '-1');
        t.focus({ preventScroll: true });
      });
    });
  }

  /* ---------- scroll progress in the menu bar ---------- */
  var bar = q('.menubar'), fx = document.createElement('i');
  fx.className = 'fx'; fx.setAttribute('aria-hidden', 'true'); bar.appendChild(fx);
  gsap.to(fx, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });

  /* ---------- hero ---------- */
  var desk = q('.desk'), about = q('.w-about'), photo = q('.w-photo'), term = q('.w-term'), stk = q('.sticker');
  var fonts = document.fonts ? document.fonts.ready : Promise.resolve();
  Promise.race([fonts, new Promise(function (res) { setTimeout(res, 900); })]).then(intro);

  function intro() {
    var name = q('#h-name');
    var split = SplitText.create(name.children, { type: 'lines,chars', mask: 'lines', linesClass: 'ln', aria: 'auto' });
    gsap.set([about, photo, term], { transformPerspective: 1400 });
    qa('.term p').forEach(function (p) { p.style.visibility = 'hidden'; });
    var tl = gsap.timeline({ defaults: { ease: OUT } });
    tl.from(bar, { yPercent: -100, duration: 1 }, 0)
      .from(qa('.links a, .right > *'), { y: -16, autoAlpha: 0, duration: 0.8, stagger: 0.04 }, 0.25)
      .fromTo(about, { clipPath: 'inset(50% 50% 50% 50%)' }, { clipPath: 'inset(0% -3% -3% 0%)', duration: 1.2, ease: 'expo.inOut', clearProps: 'clipPath' }, 0.05)
      .from(about.querySelector('.tb'), { scaleX: 0, duration: 0.9, transformOrigin: '50% 50%' }, 0.35)
      .from(split.chars, { yPercent: 120, rotate: 6, duration: 1.2, stagger: 0.028 }, 0.55)
      .from(qa('.hello, .role, .pitch, .ctas .btn', about), { y: 28, autoAlpha: 0, duration: 1.1, stagger: 0.08 }, 0.85)
      .from(photo, { y: 160, x: 60, rotationY: -38, rotationX: 14, rotation: 10, autoAlpha: 0, duration: 1.6 }, 0.35)
      .from(term, { y: 120, rotationX: -32, autoAlpha: 0, duration: 1.4, onStart: function () { setTimeout(function () { window.startTerm && startTerm(); }, 500); } }, 0.6)
      .from(stk, { scale: 0, rotation: -90, duration: 1, ease: 'back.out(2.4)' }, 1.35)
      .add(afterIntro, 1.9);
    release();
    pixelPhoto(0.55);
  }

  function afterIntro() {
    gsap.to(stk, { rotation: '+=5', y: -4, duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    /* windows drift apart as the desk scrolls away */
    var out = { trigger: desk, start: 'top top', end: 'bottom top', scrub: 0.6 };
    gsap.to(about, { yPercent: -10, ease: 'none', scrollTrigger: out });
    gsap.to(photo, { yPercent: -26, rotation: 5, ease: 'none', scrollTrigger: out });
    gsap.to(term, { yPercent: -60, rotation: -4, ease: 'none', scrollTrigger: out });
    /* depth parallax with the pointer */
    if (fine && wide) {
      var layers = [[about, 10], [photo, 26], [term, 40]].map(function (l) {
        var el = l[0], o = { duration: 1.4, ease: 'power3' };
        return { el: el, d: l[1], x: gsap.quickTo(el, 'x', o), y: gsap.quickTo(el, 'y', o), rx: gsap.quickTo(el, 'rotationX', o), ry: gsap.quickTo(el, 'rotationY', o) };
      });
      desk.addEventListener('pointermove', function (e) {
        var nx = e.clientX / innerWidth - 0.5, ny = e.clientY / innerHeight - 0.5;
        layers.forEach(function (L) {
          if (L.el.classList.contains('dragging')) return;
          L.x(-nx * L.d); L.y(-ny * L.d); L.ry(nx * 6); L.rx(-ny * 6);
        });
      });
      desk.addEventListener('pointerleave', function () { layers.forEach(function (L) { L.x(0); L.y(0); L.rx(0); L.ry(0); }); });
    }
  }

  /* ---------- the hero photo: WebGL depixelate + a pixel lens under the cursor ---------- */
  function pixelPhoto(delay) {
    var fig = q('.photo'), img = fig && fig.querySelector('img');
    if (!img) return;
    var cv = document.createElement('canvas'), gl;
    try { gl = cv.getContext('webgl', { premultipliedAlpha: false, antialias: false }); } catch (e) {}
    if (!gl) return;
    var vs = 'attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;gl_Position=vec4(p,0.,1.);}';
    var fs = 'precision mediump float;uniform sampler2D t;uniform vec2 res,m;uniform float h,px;varying vec2 v;' +
      'void main(){vec2 a=vec2(res.x/res.y,1.);float d=distance(v*a,m*a);float f=h*smoothstep(.3,.02,d);' +
      'float b=max(px,f<.08?1.:4.+floor(f*4.)*5.);vec2 g=b/res;vec2 uv=b>1.5?(floor(v/g)+.5)*g:v;float s=f*.014+(px>1.5?.004:0.);' +
      'vec3 c=vec3(texture2D(t,uv+vec2(s,0.)).r,texture2D(t,uv).g,texture2D(t,uv-vec2(s,0.)).b);' +
      'c*=1.-.18*f*step(.5,fract(v.y*res.y/3.));gl_FragColor=vec4(c,1.);}';
    function sh(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; }
    var pr = gl.createProgram();
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
    gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var U = {}; ['res', 'm', 'h', 'px'].forEach(function (n) { U[n] = gl.getUniformLocation(pr, n); });
    var st = { px: 64, h: 0, mx: 0.5, my: 0.5 }, tx = gl.createTexture(), ready = false, dirty = true;
    function upload() {
      gl.bindTexture(gl.TEXTURE_2D, tx);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      ['TEXTURE_WRAP_S', 'TEXTURE_WRAP_T'].forEach(function (k) { gl.texParameteri(gl.TEXTURE_2D, gl[k], gl.CLAMP_TO_EDGE); });
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      ready = true; size(); fig.classList.add('gl');
    }
    function size() {
      var d = Math.min(devicePixelRatio || 1, 2), w = img.clientWidth, h = img.clientHeight;
      cv.width = Math.round(w * d); cv.height = Math.round(h * d); gl.viewport(0, 0, cv.width, cv.height); dirty = true;
    }
    function draw() {
      if (!ready || !dirty) return; dirty = false;
      gl.uniform2f(U.res, cv.width, cv.height); gl.uniform2f(U.m, st.mx, st.my);
      gl.uniform1f(U.h, st.h); gl.uniform1f(U.px, st.px * (cv.width / 480));
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    cv.setAttribute('aria-hidden', 'true');
    fig.insertBefore(cv, img.nextSibling);
    gsap.ticker.add(draw);
    if ('ResizeObserver' in window) new ResizeObserver(size).observe(img);
    function go() { try { upload(); } catch (e) { cv.remove(); return; } gsap.to(st, { px: 1, duration: 1.8, delay: delay, ease: 'power3.inOut', onUpdate: function () { dirty = true; } }); }
    if (img.complete && img.naturalWidth) go(); else img.addEventListener('load', go, { once: true });
    if (fine) {
      var mx = gsap.quickTo(st, 'mx', { duration: 0.5, ease: 'power3', onUpdate: function () { dirty = true; } });
      var my = gsap.quickTo(st, 'my', { duration: 0.5, ease: 'power3', onUpdate: function () { dirty = true; } });
      fig.addEventListener('pointerenter', function () { gsap.to(st, { h: 1, duration: 0.6, ease: OUT, onUpdate: function () { dirty = true; } }); });
      fig.addEventListener('pointerleave', function () { gsap.to(st, { h: 0, duration: 0.8, ease: OUT, onUpdate: function () { dirty = true; } }); });
      fig.addEventListener('pointermove', function (e) { var b = fig.getBoundingClientRect(); mx((e.clientX - b.left) / b.width); my(1 - (e.clientY - b.top) / b.height); });
    }
  }

  /* ---------- partner ticker reacts to scroll speed ---------- */
  var row = q('.ticker .row');
  if (row) {
    row.style.animation = 'none';
    var loop = gsap.to(row, { xPercent: -50, duration: 38, ease: 'none', repeat: -1 });
    var skew = gsap.quickTo(row, 'skewX', { duration: 0.5, ease: 'power3' });
    var calm;
    ScrollTrigger.create({ start: 0, end: 'max', onUpdate: function (s) {
      var v = s.getVelocity(), k = gsap.utils.clamp(-6, 6, v / 300);
      loop.timeScale(1 + Math.abs(k) * 1.6); skew(gsap.utils.clamp(-8, 8, -v / 250));
      clearTimeout(calm); calm = setTimeout(function () { gsap.to(loop, { timeScale: 1, duration: 1.2, ease: 'power2.out' }); skew(0); }, 120);
    } });
    q('.ticker').addEventListener('pointerenter', function () { gsap.to(loop, { timeScale: 0.15, duration: 0.6 }); });
    q('.ticker').addEventListener('pointerleave', function () { gsap.to(loop, { timeScale: 1, duration: 0.6 }); });
  }

  /* ---------- section headings: characters rise out of a mask ---------- */
  qa('.sh').forEach(function (sh) {
    var h = sh.querySelector('h2'), ico = h.querySelector('svg'), tn = [].slice.call(h.childNodes).filter(function (n) { return n.nodeType === 3 && n.textContent.trim(); })[0];
    var chars = [];
    if (tn) { var sp = document.createElement('span'); h.replaceChild(sp, tn); sp.textContent = tn.textContent; chars = SplitText.create(sp, { type: 'chars', mask: 'chars', charsClass: 'ch', aria: 'auto' }).chars; }
    var tl = gsap.timeline({ scrollTrigger: { trigger: sh, start: 'top 85%', once: true }, defaults: { ease: OUT } });
    if (ico) tl.from(ico, { scale: 0, rotation: -25, duration: 1, ease: 'back.out(2)' }, 0);
    tl.from(chars, { yPercent: 110, duration: 1.1, stagger: 0.03 }, 0.05);
    var p = sh.querySelector('p'); if (p) tl.from(p, { y: 24, autoAlpha: 0, duration: 1.1 }, 0.25);
  });

  /* ---------- windows: rise in with a slight 3D tip ---------- */
  var wins = qa('section.s .win, .contact .win');
  gsap.set(wins, { y: 90, rotationX: -10, transformPerspective: 1600, transformOrigin: '50% 0%', autoAlpha: 0 });
  ScrollTrigger.batch(wins, { start: 'top 90%', once: true, onEnter: function (b) {
    gsap.to(b, { y: 0, rotationX: 0, autoAlpha: 1, duration: 1.3, ease: OUT, stagger: 0.12, clearProps: 'transform' });
  } });

  /* event photos drift inside their frames */
  qa('.shot img').forEach(function (im) {
    gsap.fromTo(im, { yPercent: -7, scale: 1.16 }, { yPercent: 7, scale: 1.16, ease: 'none', scrollTrigger: { trigger: im.parentNode, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  /* rows inside windows arrive in sequence */
  var rows = qa('.job, .lv-g, .trophies li, .inbox li, .edu li, .chips li, .nums div, .field, .compose .msg, .compose .ctas, .social');
  gsap.set(rows, { y: 26, autoAlpha: 0 });
  ScrollTrigger.batch(rows, { start: 'top 94%', once: true, onEnter: function (b) {
    gsap.to(b, { y: 0, autoAlpha: 1, duration: 1, ease: OUT, stagger: 0.06, delay: 0.15 });
  } });

  /* numbers count up */
  qa('.nums dd').forEach(function (dd) {
    var m = dd.textContent.match(/^([\d,]+)(.*)$/); if (!m) return;
    var end = +m[1].replace(/,/g, ''), suf = m[2], o = { v: 0 };
    ScrollTrigger.create({ trigger: dd, start: 'top 94%', once: true, onEnter: function () {
      gsap.to(o, { v: end, duration: 1.8, delay: 0.2, ease: 'power4.out', onUpdate: function () { dd.textContent = Math.round(o.v).toLocaleString('en-US') + suf; } });
    } });
    dd.textContent = '0' + suf;
  });

  /* ---------- journey: a lit rail and the current year ---------- */
  var log = q('.log');
  if (log) {
    var rail = document.createElement('span'); rail.className = 'rail'; rail.setAttribute('aria-hidden', 'true'); rail.innerHTML = '<i></i>'; log.appendChild(rail);
    gsap.to(rail.firstChild, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: log, start: 'top 60%', end: 'bottom 60%', scrub: 0.4 } });
    qa('li', log).forEach(function (li) {
      var yr = li.querySelector('.yr'), y = yr.textContent;
      ScrollTrigger.create({ trigger: li, start: 'top 62%', end: 'bottom 62%',
        onToggle: function (s) { li.classList.toggle('now', s.isActive); },
        onEnter: function () { li.classList.add('lit'); if (window.ScrambleTextPlugin) gsap.to(yr, { duration: 0.8, scrambleText: { text: y, chars: '0123456789', speed: 0.6 } }); },
        onLeaveBack: function () { li.classList.remove('lit'); } });
    });
  }

  /* ---------- experience: a selection frame glides to the hovered row ---------- */
  var list = q('.win.list');
  if (list && fine) {
    var hl = document.createElement('span'); hl.className = 'hl'; hl.setAttribute('aria-hidden', 'true'); list.appendChild(hl);
    qa('.job', list).forEach(function (j) {
      j.addEventListener('pointerenter', function () {
        gsap.to(hl, { y: j.offsetTop, height: j.offsetHeight, autoAlpha: 1, duration: 0.55, ease: OUT });
      });
    });
    list.addEventListener('pointerleave', function () { gsap.to(hl, { autoAlpha: 0, duration: 0.4 }); });
  }

  /* ---------- contact headline ---------- */
  var hc = q('#h-contact');
  if (hc) {
    var sc = SplitText.create(hc, { type: 'lines,chars', mask: 'lines', linesClass: 'ln', aria: 'auto' });
    gsap.from(sc.chars, { yPercent: 120, rotate: 8, duration: 1.2, ease: OUT, stagger: 0.025, scrollTrigger: { trigger: hc, start: 'top 88%', once: true } });
  }

  /* ---------- pointer niceties: cursor, magnetic buttons, scrambled nav ---------- */
  if (fine) {
    var dot = document.createElement('i'), ring = document.createElement('i');
    dot.className = 'cz cz-dot'; ring.className = 'cz cz-ring';
    [dot, ring].forEach(function (e) { e.setAttribute('aria-hidden', 'true'); document.body.appendChild(e); });
    var dx = gsap.quickTo(dot, 'x', { duration: 0.08 }), dy = gsap.quickTo(dot, 'y', { duration: 0.08 });
    var rx = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' }), ry = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' });
    var shown = false;
    addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      if (!shown) { shown = true; gsap.set([dot, ring], { x: e.clientX, y: e.clientY }); gsap.to([dot, ring], { opacity: 1, duration: 0.3 }); }
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
      var t = e.target, drag = wide && t.closest && t.closest('.drag .tb'), link = t.closest && t.closest('a,button');
      ring.classList.toggle('drag', !!drag); ring.textContent = drag ? 'DRAG' : '';
      ring.classList.toggle('link', !drag && !!link);
    });
    document.addEventListener('pointerleave', function () { shown = false; gsap.to([dot, ring], { opacity: 0, duration: 0.3 }); });
    addEventListener('pointerdown', function () { gsap.to(ring, { scale: 0.75, duration: 0.15 }); });
    addEventListener('pointerup', function () { gsap.to(ring, { scale: 1, duration: 0.5, ease: 'elastic.out(1,.4)' }); });

    qa('.btn, .cvbtn, .social a, .ib').forEach(function (b) {
      var x = gsap.quickTo(b, 'x', { duration: 0.6, ease: 'power3' }), y = gsap.quickTo(b, 'y', { duration: 0.6, ease: 'power3' });
      b.addEventListener('pointermove', function (e) { var k = b.getBoundingClientRect(); x((e.clientX - k.left - k.width / 2) * 0.28); y((e.clientY - k.top - k.height / 2) * 0.4); });
      b.addEventListener('pointerleave', function () { gsap.to(b, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1,.35)' }); });
    });

    if (window.ScrambleTextPlugin) qa('.links a, footer nav a').forEach(function (a) {
      var txt = a.textContent;
      a.addEventListener('pointerenter', function () { gsap.to(a, { duration: 0.6, scrambleText: { text: txt, chars: '01#%/<>_', speed: 0.8, revealDelay: 0.1 } }); });
    });
  }

  addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
