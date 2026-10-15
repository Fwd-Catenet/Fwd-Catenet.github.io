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
    pts.forEach(p => p.setTeamSpeed(isBlueTeam));
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

/* ─── CANVAS AVANCÉ (RED TEAM vs BLUE TEAM) ─── */
const cvs  = document.getElementById('cvs');
const gctx = cvs.getContext('2d');
let pts = [];
let N = window.innerWidth > 768 ? 130 : 50; 
const DIST = 160;

function resize() {
  cvs.width  = window.innerWidth;
  cvs.height = window.innerHeight;
  N = window.innerWidth > 768 ? 130 : 50;
  initPts();
}

class Pt {
  constructor() {
    this.x  = Math.random() * window.innerWidth;
    this.y  = Math.random() * window.innerHeight;
    this.r  = Math.random() * 2 + 1;
    this.a  = Math.random() * .7 + .3;
    this.setTeamSpeed(isBlueTeam);
  }
  
  setTeamSpeed(isBlue) {
    if(isBlue) {
        // Vitesse très lente (Défense/Monitoring)
        this.vx = (Math.random() - .5) * 0.15;
        this.vy = (Math.random() - .5) * 0.15;
    } else {
        // Vitesse agressive (Attaque)
        this.vx = (Math.random() - .5) * 0.5;
        this.vy = (Math.random() - .5) * 0.5;
    }
  }

  move() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > window.innerWidth)  this.vx *= -1;
    if (this.y < 0 || this.y > window.innerHeight) this.vy *= -1;
    
    const dx = this.x - mx, dy = this.y - my;
    const d  = Math.sqrt(dx*dx + dy*dy);
    
    if(!isBlueTeam) {
        // RED TEAM : Attraction agressive
        if (d < 200 && d > 0) {
          const f = (200 - d) / 200;
          this.x += (dx / d) * f * 2.5;
          this.y += (dy / d) * f * 2.5;
        }
    } else {
        // BLUE TEAM : Répulsion douce (Bouclier/Shield)
        if (d < 150 && d > 0) {
          const f = (150 - d) / 150;
          this.x -= (dx / d) * f * 0.5;
          this.y -= (dy / d) * f * 0.5;
        }
    }
  }
  draw() {
    gctx.beginPath();
    gctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    gctx.fillStyle = isBlueTeam ? `rgba(0, 229, 255, ${this.a})` : `rgba(255, 42, 42, ${this.a})`;
    gctx.fill();
  }
}

function initPts() { pts = Array.from({length: N}, () => new Pt()); }

(function frame() {
  gctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  for (let i = 0; i < pts.length; i++) {
    pts[i].move(); pts[i].draw();
    for (let j = i + 1; j < pts.length; j++) {
      const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
      const d  = Math.sqrt(dx*dx + dy*dy);
      if (d < DIST) {
        gctx.beginPath();
        gctx.moveTo(pts[i].x, pts[i].y);
        
        if(isBlueTeam) {
            // Lignes Circuit Imprimé (Orthogonales)
            gctx.lineTo(pts[i].x, pts[j].y);
            gctx.lineTo(pts[j].x, pts[j].y);
            gctx.strokeStyle = `rgba(0, 229, 255, ${(1 - d/DIST) * 0.25})`; 
        } else {
            // Lignes Directes Agressives
            gctx.lineTo(pts[j].x, pts[j].y);
            gctx.strokeStyle = `rgba(255, 42, 42, ${(1 - d/DIST) * 0.25})`; 
        }
        
        gctx.lineWidth   = .8;
        gctx.stroke();
      }
    }
    
    // Lignes vers la souris
    const dMouse = Math.sqrt(Math.pow(pts[i].x - mx, 2) + Math.pow(pts[i].y - my, 2));
    if(dMouse < 250) {
        gctx.beginPath();
        gctx.moveTo(pts[i].x, pts[i].y);
        
        if(isBlueTeam) {
             gctx.lineTo(pts[i].x, my);
             gctx.lineTo(mx, my);
             gctx.strokeStyle = `rgba(0, 229, 255, ${(1 - dMouse/250) * 0.5})`;
        } else {
             gctx.lineTo(mx, my);
             gctx.strokeStyle = `rgba(255, 42, 42, ${(1 - dMouse/250) * 0.8})`;
        }
        
        gctx.lineWidth = isBlueTeam ? 1 : 1.5;
        gctx.stroke();
    }
  }
  requestAnimationFrame(frame);
})();

window.addEventListener('resize', resize);
resize();

/* ─── SCROLL PROGRESS + ACTIVE NAV ─── */
const prog = document.getElementById('prog');
const secs = ['about','curriculum','expertise','projets','skills','contact'];
const navLinks = document.querySelectorAll('.nlinks a[data-sec]');

window.addEventListener('scroll', () => {
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