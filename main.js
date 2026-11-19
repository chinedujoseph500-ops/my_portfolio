const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- 1. Mobile menu ---------- */
const btn = document.getElementById('menu-btn');
const menu = document.getElementById('menu');
const header = document.querySelector('.site-header');

function setMenu(open) {
  menu.classList.toggle('open', open);
  btn.classList.toggle('open', open);
  btn.setAttribute('aria-expanded', open);
  btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}
if (btn && menu) {
  btn.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));   // close after choosing a page
  document.addEventListener('click', e => { if (!header.contains(e.target)) setMenu(false); }); // tap outside closes
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  window.addEventListener('resize', () => { if (window.innerWidth > 768) setMenu(false); });
}

/* ---------- 2. Footer year ---------- */
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

/* ---------- 3. Scroll reveal ---------- */
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reduceMotion) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.15 });
  reveals.forEach((el, i) => { el.style.transitionDelay = (i % 3) * 90 + 'ms'; io.observe(el); });
} else {
  reveals.forEach(el => el.classList.add('in'));
}

/* ---------- 4. Card spotlight follows the pointer ---------- */
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('pointermove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    card.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });
});

/* ---------- 5. Home page only: typing role, photo tilt, moving constellation ---------- */
const typed = document.getElementById('typed');
if (typed && !reduceMotion) {
  const words = typed.dataset.words.split('|');
  let i = 0, j = words[0].length, deleting = true;
  const tick = () => {
    const w = words[i];
    typed.textContent = w.slice(0, j);
    let delay = deleting ? 35 : 70;
    if (!deleting && j === w.length) { deleting = true; delay = 1700; }
    else if (deleting && j === 0) { deleting = false; i = (i + 1) % words.length; delay = 300; }
    else j += deleting ? -1 : 1;
    setTimeout(tick, delay);
  };
  setTimeout(tick, 1800);
}

const wrap = document.querySelector('.hero-wrap');
const portrait = document.getElementById('portrait');
if (wrap && portrait && !reduceMotion) {
  wrap.addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    const r = wrap.getBoundingClientRect();
    const dx = (e.clientX - r.left) / r.width - 0.5;
    const dy = (e.clientY - r.top) / r.height - 0.5;
    portrait.style.transform = `perspective(800px) rotateY(${dx * 14}deg) rotateX(${-dy * 14}deg)`;
  });
  wrap.addEventListener('pointerleave', () => { portrait.style.transform = ''; });
}

const canvas = document.getElementById('stars');
if (canvas && wrap && !reduceMotion) {
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w = 0, h = 0, dots = [], running = false;
  const mouse = { x: -999, y: -999 };

  function resize() {
    const r = wrap.getBoundingClientRect();
    w = r.width; h = r.height;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(Math.min(70, (w * h) / 15000));
    dots = Array.from({ length: n }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - .5) * .28, vy: (Math.random() - .5) * .28,
      r: Math.random() * 1.4 + .5, red: Math.random() < .2
    }));
  }
  function frame() {
    if (!running) return;
    ctx.clearRect(0, 0, w, h);
    for (const d of dots) {
      d.x += d.vx; d.y += d.vy;
      if (d.x < 0 || d.x > w) d.vx *= -1;
      if (d.y < 0 || d.y > h) d.vy *= -1;
      ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, 6.283);
      ctx.fillStyle = d.red ? 'rgba(176,42,71,.9)' : 'rgba(201,204,211,.75)';
      ctx.fill();
    }
    // draw lines between dots that are close (and to the pointer)
    const pts = dots.concat([{ x: mouse.x, y: mouse.y, red: true }]);
    for (let a = 0; a < pts.length; a++) {
      for (let b = a + 1; b < pts.length; b++) {
        const dx = pts[a].x - pts[b].x, dy = pts[a].y - pts[b].y;
        const dist = Math.hypot(dx, dy);
        if (dist < 120) {
          ctx.strokeStyle = (pts[a].red || pts[b].red ? 'rgba(176,42,71,' : 'rgba(201,204,211,') + (0.22 * (1 - dist / 120)) + ')';
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(pts[a].x, pts[a].y); ctx.lineTo(pts[b].x, pts[b].y); ctx.stroke();
        }
      }
    }
    requestAnimationFrame(frame);
  }
  wrap.addEventListener('pointermove', e => {
    const r = wrap.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
  });
  wrap.addEventListener('pointerleave', () => { mouse.x = mouse.y = -999; });
  window.addEventListener('resize', resize);
  resize();
  // only animate while the hero is on screen (saves battery)
  new IntersectionObserver(([en]) => {
    running = en.isIntersecting;
    if (running) requestAnimationFrame(frame);
  }).observe(wrap);
}