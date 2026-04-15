export class ParticleSystem {
  constructor() {
    this.pool = [];
  }

  /** Emit a burst of particles at (x, y). */
  explode(x, y, color, count = 12, speedMin = 50, speedMax = 180) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = speedMin + Math.random() * (speedMax - speedMin);
      this.pool.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        r: 1.2 + Math.random() * 2.2,
        life: 1,         // 1.0 → 0.0
        decay: 1.8 + Math.random() * 1.4, // units per second
      });
    }
  }

  update(dt) {
    const s = dt / 1000;
    for (let i = this.pool.length - 1; i >= 0; i--) {
      const p = this.pool[i];
      p.x   += p.vx * s;
      p.y   += p.vy * s;
      p.vx  *= 0.96;
      p.vy  *= 0.96;
      p.life -= p.decay * s;
      if (p.life <= 0) this.pool.splice(i, 1);
    }
  }

  draw(ctx) {
    for (const p of this.pool) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle    = p.color;
      ctx.shadowColor  = p.color;
      ctx.shadowBlur   = 5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
}
