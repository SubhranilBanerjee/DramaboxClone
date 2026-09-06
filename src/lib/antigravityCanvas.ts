// lib/antigravityCanvas.ts
// Pure Canvas 2D physics engine — no external dependencies.
// Renders a full-viewport overlay with upward-defying mercury droplets
// that paint the screen into the new theme on detonation.

export type Theme = 'dark' | 'light' | 'violet' | 'neon';

interface Droplet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  color: string;
  glowColor: string;
  lifetime: number;
  age: number;
  trail: { x: number; y: number; alpha: number }[];
}

const THEME_PALETTES: Record<Theme, { accent: string; accent2: string; accent3: string; bg: string }> = {
  dark: {
    accent: '#ff2a8d',
    accent2: '#00f0ff',
    accent3: '#b026ff',
    bg: 'rgba(7, 6, 14, 0.92)',
  },
  light: {
    accent: '#7c3aed',
    accent2: '#db2777',
    accent3: '#f59e0b',
    bg: 'rgba(248, 248, 255, 0.92)',
  },
  violet: {
    accent: '#8b5cf6',
    accent2: '#c084fc',
    accent3: '#e879f9',
    bg: 'rgba(18, 10, 46, 0.92)',
  },
  neon: {
    accent: '#00f0ff',
    accent2: '#ff2a8d',
    accent3: '#39ff14',
    bg: 'rgba(4, 3, 13, 0.92)',
  },
};

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function pickColor(palette: (typeof THEME_PALETTES)[Theme]): string {
  const colors = [palette.accent, palette.accent2, palette.accent3];
  return colors[Math.floor(Math.random() * colors.length)];
}

export function runAntigravityTransition(
  originX: number,
  originY: number,
  newTheme: Theme,
  onComplete: () => void
): void {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = `
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    z-index: 99998;
    pointer-events: none;
  `;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d')!;
  const palette = THEME_PALETTES[newTheme];
  const DROPLET_COUNT = 52;
  const TOTAL_FRAMES = 200;

  // === Create droplets ===
  const droplets: Droplet[] = Array.from({ length: DROPLET_COUNT }, () => {
    const angle = randomBetween(0, Math.PI * 2);
    const speed = randomBetween(4, 18);
    const upwardBias = randomBetween(0.5, 1.0);
    const color = pickColor(palette);
    return {
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed * (1 - upwardBias * 0.6),
      vy: -Math.abs(Math.sin(angle) * speed) - randomBetween(4, 14),
      radius: randomBetween(4, 18),
      alpha: 1,
      color,
      glowColor: color,
      lifetime: randomBetween(80, TOTAL_FRAMES - 10),
      age: 0,
      trail: [],
    };
  });

  // === Shockwave ring state ===
  let ringRadius = 0;
  const maxRingRadius = Math.hypot(window.innerWidth, window.innerHeight) * 1.1;
  let ringAlpha = 0.9;

  let frame = 0;
  let raf: number;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const progress = frame / TOTAL_FRAMES;

    // ─── 1. Background wipe — radial gradient expanding from origin ───
    if (ringRadius < maxRingRadius) {
      ringRadius += (maxRingRadius - ringRadius) * 0.055 + 6;
      ringAlpha = Math.max(0, 0.9 - progress * 0.9);

      const grad = ctx.createRadialGradient(
        originX, originY, 0,
        originX, originY, ringRadius
      );
      const bgAlpha = ringAlpha.toFixed(2);
      const bgAlphaHalf = (ringAlpha * 0.6).toFixed(2);
      grad.addColorStop(0, palette.bg.replace('0.92', bgAlpha));
      grad.addColorStop(0.7, palette.bg.replace('0.92', bgAlphaHalf));
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // ─── 2. Shockwave ring pulse ───
    if (frame < 40) {
      const shockR = (frame / 40) * 300;
      const shockAlpha = Math.max(0, 1 - frame / 40);
      const shockHex = Math.floor(shockAlpha * 255).toString(16).padStart(2, '0');
      const shockHex2 = Math.floor(shockAlpha * 200).toString(16).padStart(2, '0');

      ctx.beginPath();
      ctx.arc(originX, originY, shockR, 0, Math.PI * 2);
      ctx.strokeStyle = `${palette.accent}${shockHex}`;
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(originX, originY, shockR * 0.6, 0, Math.PI * 2);
      ctx.strokeStyle = `${palette.accent2}${shockHex2}`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // ─── 3. Mercury droplets ───
    for (const d of droplets) {
      if (d.age >= d.lifetime) continue;

      // Anti-gravity: accelerate UPWARD as they age
      d.vy -= 0.22;
      d.vx *= 0.992;
      d.x += d.vx;
      d.y += d.vy;
      d.age++;

      const lifeRatio = d.age / d.lifetime;
      d.alpha = Math.pow(1 - lifeRatio, 1.4);

      // Trail
      d.trail.push({ x: d.x, y: d.y, alpha: d.alpha });
      if (d.trail.length > 8) d.trail.shift();

      for (let t = 0; t < d.trail.length - 1; t++) {
        const tp = d.trail[t];
        const trailAlpha = tp.alpha * (t / d.trail.length) * 0.4;
        if (trailAlpha <= 0) continue;
        ctx.beginPath();
        ctx.arc(tp.x, tp.y, d.radius * (t / d.trail.length) * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = `${d.color}${Math.floor(trailAlpha * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();
      }

      // Droplet core
      ctx.save();
      ctx.globalAlpha = d.alpha;

      // Outer glow
      const glow = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.radius * 2.5);
      glow.addColorStop(0, d.glowColor + 'cc');
      glow.addColorStop(0.5, d.glowColor + '44');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.radius * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Solid mercury sphere with specular highlight
      const sphere = ctx.createRadialGradient(
        d.x - d.radius * 0.3, d.y - d.radius * 0.3, 0,
        d.x, d.y, d.radius
      );
      sphere.addColorStop(0, '#ffffff');
      sphere.addColorStop(0.3, d.color);
      sphere.addColorStop(1, d.glowColor + '88');
      ctx.fillStyle = sphere;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    frame++;

    if (frame >= TOTAL_FRAMES) {
      canvas.style.opacity = '0';
      canvas.style.transition = 'opacity 0.3s ease';
      setTimeout(() => {
        canvas.remove();
        onComplete();
      }, 300);
      return;
    }

    raf = requestAnimationFrame(draw);
  }

  raf = requestAnimationFrame(draw);

  // Safety cleanup after 5 s
  setTimeout(() => {
    cancelAnimationFrame(raf);
    canvas.remove();
    onComplete();
  }, 5000);
}
