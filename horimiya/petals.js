// Ultra-lightweight, High-Framerate Sakura & Spring Sky Leaves Engine
// High DPR / Retina Aware, Pre-rendered Offscreen Sprites, 60-144 FPS Compositing
// Dynamic Color Harmony: Cherry Blossom Pinks & Katagiri Spring Sky Blues (Sora-iro)
// Animation Velocity: 1.5x Atmospheric Breeze

export function initPetalsEngine() {
  const canvas = document.getElementById('leaves-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let cssWidth = window.innerWidth;
  let cssHeight = window.innerHeight;

  function resizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    cssWidth = window.innerWidth;
    cssHeight = window.innerHeight;
    canvas.width = Math.round(cssWidth * dpr);
    canvas.height = Math.round(cssHeight * dpr);
    canvas.style.width = cssWidth + 'px';
    canvas.style.height = cssHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resizeCanvas();

  let resizeDebounce = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeDebounce);
    resizeDebounce = setTimeout(resizeCanvas, 150);
  });

  // Pre-cached crisp petal sprites on offscreen canvases
  // Enhanced palette with rich Pink & Sky-Blue variations (Sora-iro & Sakura)
  const spriteCache = [];
  const PALETTE = [
    // Sakura Soft & Vibrant Pinks
    { start: '#ffffff', end: '#fca5a5', type: 'petal' }, // Soft Sakura Pink
    { start: '#fff1f2', end: '#fb7185', type: 'petal' }, // Vibrant Sakura Rose
    { start: '#ffffff', end: '#f472b6', type: 'petal' }, // Blossom Rose
    { start: '#fff5f7', end: '#fda4af', type: 'petal' }, // Delicate Cherry Petal
    { start: '#ffe4e6', end: '#e11d48', type: 'petal' }, // Deep Crimson Sakura
    // Sora-iro (Katagiri Spring Sky Blue Variations)
    { start: '#ffffff', end: '#7dd3fc', type: 'petal' }, // Soft Sky Blue
    { start: '#f0f9ff', end: '#38bdf8', type: 'petal' }, // Vibrant Azure Sky
    { start: '#e0f2fe', end: '#0ea5e9', type: 'petal' }, // Deep Sora-iro Blue
    { start: '#f8fafc', end: '#93c5fd', type: 'petal' }, // Pastel Periwinkle Sky
    // Pink & Sky-Blue Duotone Blends
    { start: '#fbcfe8', end: '#7dd3fc', type: 'petal' }, // Pink to Sky Blue Duotone
    { start: '#bae6fd', end: '#f472b6', type: 'petal' }, // Sky Blue to Rose Pink Duotone
    // Katagiri Spring Fresh Leaves
    { start: '#f0fdf4', end: '#34d399', type: 'leaf' },  // Fresh Katagiri Spring Leaf
    { start: '#ecfdf5', end: '#10b981', type: 'leaf' }   // Moegi Wakakusa Leaf
  ];

  const SIZES = [11, 15, 19, 23];

  PALETTE.forEach((color) => {
    SIZES.forEach((sz) => {
      const off = document.createElement('canvas');
      const offSz = Math.round(sz * 2.2 * dpr);
      off.width = offSz;
      off.height = offSz;
      const offCtx = off.getContext('2d');
      if (!offCtx) return;
      offCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cx = (sz * 2.2) / 2;
      const cy = (sz * 2.2) / 2;

      const grad = offCtx.createRadialGradient(cx, cy, 1, cx, cy, sz);
      grad.addColorStop(0, color.start);
      grad.addColorStop(0.72, color.end);
      grad.addColorStop(1, color.end + 'cc');

      offCtx.fillStyle = grad;
      offCtx.beginPath();

      if (color.type === 'petal') {
        // Classic Japanese cherry blossom notched petal shape
        offCtx.moveTo(cx, cy - sz * 0.95);
        offCtx.bezierCurveTo(cx - sz * 0.75, cy - sz * 0.85, cx - sz * 0.9, cy + sz * 0.25, cx, cy + sz * 0.95);
        offCtx.bezierCurveTo(cx + sz * 0.9, cy + sz * 0.25, cx + sz * 0.75, cy - sz * 0.85, cx, cy - sz * 0.95);
      } else {
        // Slender spring bud leaf shape
        offCtx.moveTo(cx, cy - sz * 0.9);
        offCtx.quadraticCurveTo(cx + sz * 0.55, cy, cx, cy + sz * 0.9);
        offCtx.quadraticCurveTo(cx - sz * 0.55, cy, cx, cy - sz * 0.9);
      }
      offCtx.fill();

      spriteCache.push({
        canvas: off,
        cssW: sz * 2.2,
        cssH: sz * 2.2,
        halfW: (sz * 2.2) / 2,
        halfH: (sz * 2.2) / 2
      });
    });
  });

  class Petal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * (cssWidth + 140) - 70;
      this.y = initial ? Math.random() * cssHeight : -35;

      const depth = Math.random();
      // 1.5x Faster Falling Speed Configuration
      if (depth < 0.35) {
        // Background tiny petals (drift layer)
        this.scale = 0.45 + Math.random() * 0.22;
        this.vy = prefersReducedMotion ? 20 : 60 + Math.random() * 38; // 1.5x
        this.vx = 22 + Math.random() * 22;                           // 1.5x
        this.opacity = 0.45 + Math.random() * 0.25;
      } else if (depth < 0.82) {
        // Midground primary petals
        this.scale = 0.75 + Math.random() * 0.28;
        this.vy = prefersReducedMotion ? 36 : 98 + Math.random() * 52; // 1.5x
        this.vx = 36 + Math.random() * 36;                           // 1.5x
        this.opacity = 0.68 + Math.random() * 0.22;
      } else {
        // Foreground large fluttering petals
        this.scale = 1.05 + Math.random() * 0.3;
        this.vy = prefersReducedMotion ? 50 : 135 + Math.random() * 60; // 1.5x
        this.vx = 50 + Math.random() * 45;                            // 1.5x
        this.opacity = 0.85 + Math.random() * 0.15;
      }

      this.angle = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * (prefersReducedMotion ? 0.6 : 1.8); // 1.5x
      this.pitch = Math.random() * Math.PI * 2;
      this.pitchSpeed = prefersReducedMotion ? 0.9 : 2.1 + Math.random() * 2.4;  // 1.5x

      this.flutterPhase = Math.random() * Math.PI * 2;
      this.flutterSpeed = prefersReducedMotion ? 1.2 : 2.7 + Math.random() * 2.1; // 1.5x

      this.sprite = spriteCache[Math.floor(Math.random() * spriteCache.length)];
    }

    update(dt, time) {
      this.pitch += this.pitchSpeed * dt;
      this.angle += this.rotSpeed * dt;

      // Gentle spring breeze sway
      const sway = Math.sin(time * this.flutterSpeed + this.flutterPhase) * (prefersReducedMotion ? 12 : 28);
      this.x += (this.vx + sway) * dt;
      this.y += this.vy * dt;

      if (this.y > cssHeight + 35 || this.x > cssWidth + 100) {
        this.reset(false);
      }
    }

    draw() {
      if (!this.sprite) return;
      const flipY = Math.max(0.12, Math.abs(Math.cos(this.pitch)));
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.scale(this.scale, this.scale * flipY);
      ctx.globalAlpha = this.opacity;
      ctx.drawImage(
        this.sprite.canvas,
        0,
        0,
        this.sprite.canvas.width,
        this.sprite.canvas.height,
        -this.sprite.halfW,
        -this.sprite.halfH,
        this.sprite.cssW,
        this.sprite.cssH
      );
      ctx.restore();
    }
  }

  // Increased petal count: 140 petals on normal, 35 on reduced motion (perbanyak jumlah bunga sakura)
  const COUNT = prefersReducedMotion ? 35 : 140;
  const particles = [];
  for (let i = 0; i < COUNT; i++) {
    particles.push(new Petal());
  }

  let lastTime = performance.now();
  let isRunning = true;

  document.addEventListener('visibilitychange', () => {
    isRunning = !document.hidden;
    if (isRunning) {
      lastTime = performance.now();
      requestAnimationFrame(loop);
    }
  });

  function loop(now) {
    if (!isRunning) return;
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    ctx.clearRect(0, 0, cssWidth, cssHeight);
    const time = now / 1000;

    for (let i = 0; i < COUNT; i++) {
      particles[i].update(dt, time);
      particles[i].draw();
    }

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}
