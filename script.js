/* ─── WEB AUDIO API (SOUND DESIGN) ─── */
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;
let canPlaySound = false;

function initAudio() {
  if(!audioCtx) {
    audioCtx = new AudioContext();
    canPlaySound = true;
  }
}
window.addEventListener('click', initAudio, {once: true});
window.addEventListener('mousemove', initAudio, {once: true});

function playClick() {
  if(!canPlaySound || !audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.type = 'square';
  osc.frequency.setValueAtTime(200, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.05);
  gain.gain.setValueAtTime(0.015, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.05);
}

function playTyping() {
  if(!canPlaySound || !audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(600 + Math.random()*300, audioCtx.currentTime);
  gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.03);
}

document.querySelectorAll('.sound-hover').forEach(el => {
  el.addEventListener('mouseenter', playClick);
});

/* ─── TOGGLE RED TEAM / BLUE TEAM ─── */
const toggleBtn = document.getElementById('team-toggle');
const lblRed = document.getElementById('lbl-red');
const lblBlue = document.getElementById('lbl-blue');
let isBlueTeam = false;

toggleBtn.addEventListener('click', () => {
    isBlueTeam = !isBlueTeam;
    document.body.classList.toggle('blue-team', isBlueTeam);
    
    if(isBlueTeam) {
        lblRed.classList.remove('active');
        lblBlue.classList.add('active');
    } else {
        lblRed.classList.add('active');
        lblBlue.classList.remove('active');
    }

    // Mettre à jour la vitesse des particules instantanément
    bgSetTeam();
    playClick();
});


/* ─── CUSTOM CURSOR & MAGNÉTISME AVANCÉ ─── */
const cd = document.getElementById('cd');
const cr = document.getElementById('cr');
const gw = document.getElementById('glow');
let mx = window.innerWidth/2, my = window.innerHeight/2, rx = mx, ry = my;

let isMagnetic = false;
let magX = 0, magY = 0;

window.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  if(!isMagnetic) {
      cd.style.left = mx + 'px';
      cd.style.top  = my + 'px';
  }
  gw.style.left = mx + 'px';
  gw.style.top  = my + 'px';
});

(function trackRing() {
  let targetX = isMagnetic ? magX : mx;
  let targetY = isMagnetic ? magY : my;
  rx += (targetX - rx) * .15;
  ry += (targetY - ry) * .15;
  cr.style.left = rx + 'px';
  cr.style.top  = ry + 'px';
  
  if(isMagnetic) {
      cd.style.left = magX + 'px';
      cd.style.top = magY + 'px';
  }
  requestAnimationFrame(trackRing);
})();

document.querySelectorAll('.hover-target').forEach(el => {
  el.addEventListener('mouseenter', () => cr.classList.add('big'));
  el.addEventListener('mouseleave', () => cr.classList.remove('big'));
});

document.querySelectorAll('.mag-target').forEach(el => {
  el.addEventListener('mouseenter', () => { isMagnetic = true; });
  el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      magX = r.left + r.width/2;
      magY = r.top + r.height/2;
  });
  el.addEventListener('mouseleave', () => { isMagnetic = false; });
});


/* ─── SCRAMBLE ─── */
function scramble(el, final, dur = 1100) {
  const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&?';
  const blink = '<span class="bk"></span>';
  let iter = 0;
  const steps = final.length * 2.6;
  const id = setInterval(() => {
    const decoded = Math.floor(iter / 2.6);
    el.innerHTML = final.split('').map((c, i) => {
      if (c === ' ') return ' ';
      if (i < decoded) return c;
      return pool[Math.floor(Math.random() * pool.length)];
    }).join('') + blink;
    
    if(iter % 3 === 0) playTyping(); 
    if (++iter > steps) { clearInterval(id); el.innerHTML = final + blink; }
  }, dur / steps);
}

/* ─── LOADER ─── */
const ldr    = document.getElementById('ldr');
const lnum   = document.getElementById('lnum');
const lphase = document.getElementById('lphase');
const lhex   = document.getElementById('lhex');
const lbf    = document.getElementById('lbfill');
const phases = ['initializing...', 'loading assets...', 'building network...', 'ready ✓'];
let pct = 0;

const hexId = setInterval(() => {
  lhex.textContent = '0x' + Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase().padStart(4,'0');
  if(pct < 100) playTyping();
}, 75);

const tickId = setInterval(() => {
  pct += Math.random() * 2.8 + .6;
  if (pct > 100) pct = 100;
  lnum.textContent  = Math.floor(pct);
  lbf.style.width   = pct + '%';
  lphase.textContent = phases[Math.min(Math.floor(pct / 25), 3)];
  if (pct >= 100) {
    clearInterval(tickId);
    clearInterval(hexId);
    lhex.textContent = '0xFFFF ✓';
    setTimeout(() => {
      ldr.classList.add('out');
      setTimeout(() => scramble(document.getElementById('hname'), 'Fouad Azzouzi'), 500);
    }, 620);
  }
}, 28);

/* ─── FOND : COURBES DE NIVEAU (topographie) ─── */
const cvs  = document.getElementById('cvs');
const gctx = cvs.getContext('2d');
let W = 0, H = 0, DPR = 1;

function accent(a) { return isBlueTeam ? `rgba(0,229,255,${a})` : `rgba(255,42,42,${a})`; }

{ const st = document.createElement('style');
  st.textContent = '#hero::before{display:none}';
  document.head.appendChild(st); }

/* — bruit 2D (pour 'topo') — */
const PERM = new Uint8Array(512);
(function () { const p = [...Array(256).keys()]; let s = 1337;
  for (let i = 255; i > 0; i--) { s = (s * 16807) % 2147483647; const j = s % (i + 1); [p[i], p[j]] = [p[j], p[i]]; }
  for (let i = 0; i < 512; i++) PERM[i] = p[i & 255]; })();
function grad(h, x, y) { const a = (h & 7) * Math.PI / 4; return Math.cos(a) * x + Math.sin(a) * y; }
function noise(x, y) {
  const X = Math.floor(x) & 255, Y = Math.floor(y) & 255, xf = x - Math.floor(x), yf = y - Math.floor(y);
  const f = t => t * t * t * (t * (t * 6 - 15) + 10), u = f(xf), v = f(yf);
  const aa = PERM[PERM[X] + Y], ab = PERM[PERM[X] + Y + 1], ba = PERM[PERM[X + 1] + Y], bb = PERM[PERM[X + 1] + Y + 1];
  const l1 = grad(aa, xf, yf) + u * (grad(ba, xf - 1, yf) - grad(aa, xf, yf));
  const l2 = grad(ab, xf, yf - 1) + u * (grad(bb, xf - 1, yf - 1) - grad(ab, xf, yf - 1));
  return l1 + v * (l2 - l1);
}
function fbm(x, y) { return noise(x, y) * .6 + noise(x * 2.1, y * 2.1) * .3 + noise(x * 4.3, y * 4.3) * .1; }

let topoCanvas = null;
function buildTopo() {
  const pad = 400, w = W + pad, h = H + pad, cell = 10;
  topoCanvas = document.createElement('canvas');
  topoCanvas.width = w * DPR; topoCanvas.height = h * DPR;
  const c = topoCanvas.getContext('2d'); c.scale(DPR, DPR);
  const cols = Math.ceil(w / cell) + 1, rows = Math.ceil(h / cell) + 1, sc = 0.0042;
  const v = new Float32Array(cols * rows);
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) v[j * cols + i] = fbm(i * cell * sc, j * cell * sc);
  const levels = 22;
  for (let L = 0; L < levels; L++) {
    const t = -0.6 + 1.2 * L / levels, major = L % 4 === 0;
    c.beginPath();
    for (let j = 0; j < rows - 1; j++) for (let i = 0; i < cols - 1; i++) {
      const a = v[j * cols + i], b = v[j * cols + i + 1], d = v[(j + 1) * cols + i], e = v[(j + 1) * cols + i + 1];
      const k = (a > t ? 8 : 0) | (b > t ? 4 : 0) | (e > t ? 2 : 0) | (d > t ? 1 : 0);
      if (k === 0 || k === 15) continue;
      const x = i * cell, y = j * cell, lp = (p, q) => (t - p) / (q - p);
      const T = [x + cell * lp(a, b), y], R = [x + cell, y + cell * lp(b, e)],
            B = [x + cell * lp(d, e), y + cell], Lf = [x, y + cell * lp(a, d)];
      const seg = (p, q) => { c.moveTo(p[0], p[1]); c.lineTo(q[0], q[1]); };
      switch (k) {
        case 1: case 14: seg(Lf, B); break;   case 2: case 13: seg(B, R); break;
        case 3: case 12: seg(Lf, R); break;   case 4: case 11: seg(T, R); break;
        case 5: seg(Lf, T); seg(B, R); break; case 6: case 9: seg(T, B); break;
        case 7: case 8: seg(Lf, T); break;    case 10: seg(T, R); seg(Lf, B); break;
      }
    }
    c.strokeStyle = major ? 'rgba(255,255,255,0.13)' : 'rgba(255,255,255,0.06)';
    c.lineWidth = major ? 1 : .7;
    c.stroke();
  }
}

function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  W = window.innerWidth; H = window.innerHeight;
  cvs.width = W * DPR; cvs.height = H * DPR;
  gctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  buildTopo();
}

function bgSetTeam() {}

let topoT = 0;
function drawTopo() {
  if (!topoCanvas) return;
  topoT += isBlueTeam ? 0.05 : 0.12;
  const ox = -200 + Math.sin(topoT / 400) * 120 + (mx / W - .5) * -30;
  const oy = -200 + Math.cos(topoT / 500) * 120 + (my / H - .5) * -30;
  gctx.drawImage(topoCanvas, ox, oy, W + 400, H + 400);
  const g = gctx.createRadialGradient(mx, my, 0, mx, my, 260);
  g.addColorStop(0, accent(0.07)); g.addColorStop(1, accent(0));
  gctx.fillStyle = g; gctx.fillRect(0, 0, W, H);
}

(function frame() {
  gctx.clearRect(0, 0, W, H);
  drawTopo();
  requestAnimationFrame(frame);
})();

window.addEventListener('resize', resize);
resize();

/* ─── SCROLL PROGRESS + ACTIVE NAV ─── */
const prog = document.getElementById('prog');
const secs = ['about','curriculum','expertise','projets','skills','contact'];
const navLinks = document.querySelectorAll('.nlinks a[data-sec]');

const navEl = document.querySelector('nav');
window.addEventListener('scroll', () => {
  navEl.classList.toggle('scrolled', scrollY > 40);
  const p = scrollY / (document.documentElement.scrollHeight - innerHeight);
  prog.style.width = Math.min(p * 100, 100) + '%';
  let cur = '';
  secs.forEach(id => {
    const el = document.getElementById(id);
    if (el && scrollY >= el.offsetTop - 200) cur = id;
  });
  navLinks.forEach(a => a.classList.toggle('act', a.dataset.sec === cur));
}, {passive: true});

/* ─── SCROLL REVEAL ─── */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.rv').forEach((el) => { io.observe(el); });

/* ─── COUNTERS ─── */
function countUp(el, to, suf) {
  const start = performance.now(), dur = 1500;
  (function upd(now) {
    const t = Math.min((now - start) / dur, 1);
    const e = 1 - Math.pow(1 - t, 4);
    el.textContent = Math.round(to * e) + (suf || '');
    if (t < 1) requestAnimationFrame(upd);
  })(performance.now());
}

new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && !e.target.dataset.done) {
      e.target.dataset.done = 1;
      e.target.querySelectorAll('.stn').forEach(n => {
        if (n.dataset.nocount) { n.textContent = n.dataset.count; return; }
        countUp(n, +n.dataset.count, n.dataset.suf || '');
      });
    }
  });
}, { threshold: 0.5 }).observe(document.getElementById('stats'));

/* ─── MAGNETIC BUTTONS ─── */
document.querySelectorAll('.mag').forEach(el => {
  el.addEventListener('mouseenter', () => {
    el.style.transition = 'transform .08s linear, color .2s, border-color .2s';
  });
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    el.style.transform = `translate(${((e.clientX - r.left - r.width/2) * .3).toFixed(1)}px,${((e.clientY - r.top - r.height/2) * .3).toFixed(1)}px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transition = 'transform .55s cubic-bezier(.23,1,.32,1), color .2s, border-color .2s';
    el.style.transform  = 'translate(0,0)';
  });
});

/* ─── CURSUS : ANNÉES → SEMESTRES ─── */
const years = document.querySelectorAll('.year');
const semLabel = document.getElementById('sem-label');

function showSem(btn) {
  document.querySelectorAll('.tbtn').forEach(b => b.classList.remove('on'));
  document.querySelectorAll('.sem').forEach(s => s.classList.remove('on'));
  years.forEach(y => y.classList.remove('on', 'open'));
  btn.classList.add('on');
  const year = btn.closest('.year');
  year.classList.add('on');
  semLabel.innerHTML = year.querySelector('.ylbl').innerHTML + ' · ' + btn.textContent;
  const sem = document.getElementById(btn.dataset.s);
  sem.classList.add('on');
  sem.querySelectorAll('.rv').forEach((el, i) => {
    el.classList.remove('in');
    el.style.transitionDelay = '0ms';
    setTimeout(() => { el.style.transitionDelay = i * 60 + 'ms'; el.classList.add('in'); }, 25);
  });
  if (document.activeElement) document.activeElement.blur();
}

document.querySelectorAll('.tbtn').forEach(btn => {
  btn.addEventListener('click', e => { e.stopPropagation(); showSem(btn); playClick(); });
});

// Clic sur une année : ouvre le menu (écrans tactiles) et affiche son 1er semestre
years.forEach(y => {
  y.querySelector('.ybtn').addEventListener('click', e => {
    e.stopPropagation();
    const wasOpen = y.classList.contains('open');
    years.forEach(o => o.classList.remove('open'));
    if (!wasOpen) y.classList.add('open');
    if (!y.classList.contains('on')) showSem(y.querySelector('.tbtn')), y.classList.add('open');
  });
});
document.addEventListener('click', () => years.forEach(y => y.classList.remove('open')));

setTimeout(() => {
  document.querySelectorAll('#s1 .rv').forEach((el, i) => {
    setTimeout(() => el.classList.add('in'), 2600 + i * 65);
  });
}, 0);