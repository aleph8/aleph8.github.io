import { ALLY_R, ALLY_HP, ALLY_ORBIT_R, ALLY_ORBIT_SPD, ALLY_FIRE_CD, C } from './constants.js';

export class Ally {
  constructor(orbitIndex) {
    // Position will be set on first update; start off-screen
    this.x  = -200;
    this.y  = -200;
    this.vx = 0;
    this.vy = 0;
    this.angle = 0;
    this.r  = ALLY_R;
    this.hp = ALLY_HP;

    this.orbitAngle = orbitIndex * Math.PI; // place allies opposite each other
    this.fireCooldown = ALLY_FIRE_CD * (0.2 + orbitIndex * 0.5);
    this.flashTimer   = 0;
  }

  update(dt, enemies, activeNodes, bulletPool, W, H) {
    const s = dt / 1000;
    this.flashTimer = Math.max(0, this.flashTimer - dt);

    // Compute centroid of surviving nodes (fallback to canvas centre)
    let cx = W / 2, cy = H / 2;
    if (activeNodes.length > 0) {
      cx = activeNodes.reduce((a, n) => a + n.x, 0) / activeNodes.length;
      cy = activeNodes.reduce((a, n) => a + n.y, 0) / activeNodes.length;
    }

    // Orbit position
    this.orbitAngle += ALLY_ORBIT_SPD * s;
    const targetX = cx + Math.cos(this.orbitAngle) * ALLY_ORBIT_R;
    const targetY = cy + Math.sin(this.orbitAngle) * ALLY_ORBIT_R;

    // Move toward orbit target (proportional steering, not instant)
    const dx   = targetX - this.x;
    const dy   = targetY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const spd  = Math.min(350, dist * 4);
    this.vx = (dx / dist) * spd;
    this.vy = (dy / dist) * spd;

    this.x += this.vx * s;
    this.y += this.vy * s;

    // Face direction of movement
    if (Math.abs(this.vx) + Math.abs(this.vy) > 5) {
      this.angle = Math.atan2(this.vy, this.vx);
    }

    // --- Auto-fire at nearest enemy ---
    this.fireCooldown -= dt;
    if (this.fireCooldown <= 0 && enemies.length > 0) {
      let nearest = null;
      let nearestDist = Infinity;
      for (const e of enemies) {
        const edx  = e.x - this.x;
        const edy  = e.y - this.y;
        const d    = Math.sqrt(edx * edx + edy * edy);
        if (d < nearestDist) { nearestDist = d; nearest = e; }
      }
      if (nearest) {
        const aimAngle = Math.atan2(nearest.y - this.y, nearest.x - this.x);
        // fromPlayer=true so bullet behaves like player bullet (no node damage)
        bulletPool.fire(this.x, this.y, aimAngle, true, 0);
        this.fireCooldown = ALLY_FIRE_CD;
      }
    }
  }

  /** Returns true if ally is destroyed. */
  hit() {
    this.hp--;
    this.flashTimer = 200;
    return this.hp <= 0;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle + Math.PI / 2);

    const flash = this.flashTimer > 0;
    const color = flash ? '#ffffff' : C.ally;
    ctx.strokeStyle = color;
    ctx.fillStyle   = flash ? 'rgba(255,255,255,0.2)' : 'rgba(102,126,234,0.12)';
    ctx.shadowColor = color;
    ctx.shadowBlur  = 12;
    ctx.lineWidth   = 1.5;

    const r = this.r;
    ctx.beginPath();
    ctx.moveTo(0,        -r);
    ctx.lineTo(-r * 0.5,  r * 0.7);
    ctx.lineTo(0,          r * 0.25);
    ctx.lineTo(r * 0.5,   r * 0.7);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }
}
