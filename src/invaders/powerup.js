import { POWERUP_LIFETIME, POWERUP_FADE_MS, POWERUP_RADIUS } from './constants.js';

const COLORS = {
  WEAPON: '#ffcc00',
  SHIELD: '#44aaff',
};

export class PowerupManager {
  constructor() {
    this.items = [];
  }

  /** Spawn a powerup at (x, y). Type is random unless specified. */
  drop(x, y, type = null) {
    const t     = type ?? (Math.random() < 0.5 ? 'WEAPON' : 'SHIELD');
    const angle = Math.random() * Math.PI * 2;
    const speed = 25 + Math.random() * 35;
    this.items.push({
      x, y,
      vx:  Math.cos(angle) * speed,
      vy:  Math.sin(angle) * speed,
      type: t,
      age:  0,
      // rotation for the icon shape
      rot:  Math.random() * Math.PI * 2,
    });
  }

  update(dt) {
    const s = dt / 1000;
    for (let i = this.items.length - 1; i >= 0; i--) {
      const p = this.items[i];
      p.x   += p.vx * s;
      p.y   += p.vy * s;
      p.vx  *= Math.pow(0.96, s * 60); // slow drift
      p.vy  *= Math.pow(0.96, s * 60);
      p.rot += s * 1.2;
      p.age += dt;
      if (p.age >= POWERUP_LIFETIME) this.items.splice(i, 1);
    }
  }

  /** Returns the type of collected powerup, or null. */
  checkCollect(px, py, pr) {
    const threshold = pr + POWERUP_RADIUS + 4;
    for (let i = this.items.length - 1; i >= 0; i--) {
      const p = this.items[i];
      const dx = px - p.x, dy = py - p.y;
      if (dx * dx + dy * dy < threshold * threshold) {
        const t = p.type;
        this.items.splice(i, 1);
        return t;
      }
    }
    return null;
  }

  draw(ctx) {
    for (const p of this.items) {
      // Fade out in last POWERUP_FADE_MS
      const remaining = POWERUP_LIFETIME - p.age;
      const alpha = remaining < POWERUP_FADE_MS
        ? remaining / POWERUP_FADE_MS
        : 1;

      const color = COLORS[p.type];

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);

      const r = POWERUP_RADIUS;

      // Hexagon outline
      ctx.shadowColor = color;
      ctx.shadowBlur  = 14;
      ctx.strokeStyle = color;
      ctx.fillStyle   = color + '18';
      ctx.lineWidth   = 1.5;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
        else          ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Inner symbol
      ctx.rotate(-p.rot); // counter-rotate so text stays upright
      ctx.shadowBlur = 6;
      ctx.fillStyle  = color;
      ctx.font       = `bold 9px 'JetBrains Mono', monospace`;
      ctx.textAlign  = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.type === 'WEAPON' ? 'W' : 'S', 0, 0);

      ctx.restore();
    }
  }

  clear() { this.items = []; }
}
