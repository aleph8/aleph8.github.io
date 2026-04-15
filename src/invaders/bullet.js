import { BULLET_SPD_PLAYER, BULLET_SPD_ENEMY, C } from './constants.js';

export class BulletPool {
  constructor() {
    this.bullets = [];
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} angle - radians
   * @param {boolean} fromPlayer
   * @param {number}  bounces
   * @param {number}  [speed]     - optional override
   * @param {string}  [color]     - optional tint
   * @param {Object}  [mods]      - modifier flags { homing, piercing, explosive, wave, wavePhase }
   */
  fire(x, y, angle, fromPlayer, bounces, speed, color, mods = {}) {
    const spd = speed ?? (fromPlayer ? BULLET_SPD_PLAYER : BULLET_SPD_ENEMY);
    this.bullets.push({
      x, y,
      vx: Math.cos(angle) * spd,
      vy: Math.sin(angle) * spd,
      fromPlayer,
      bounces,
      r: fromPlayer ? 3 : 2.5,
      age: 0,
      color: color ?? null,
      // Modifier flags (only meaningful for player bullets)
      homing:     fromPlayer && (mods.homing    ?? false),
      piercing:   fromPlayer && (mods.piercing  ?? false),
      explosive:  fromPlayer && (mods.explosive ?? false),
      wave:       fromPlayer && (mods.wave      ?? false),
      wavePhase:  mods.wavePhase ?? 0,
      // Piercing hit-tracking (avoid re-hitting the same enemy)
      piercedSet: (fromPlayer && mods.piercing) ? new Set() : null,
    });
  }

  /**
   * Update all bullets.
   * @param {number}   dt
   * @param {number}   W
   * @param {number}   H
   * @param {Array}    activeNodes
   * @param {Object}   nodeR
   * @param {Function} onNodeHit
   * @param {Array}    enemies     - needed for homing steering
   */
  update(dt, W, H, activeNodes, nodeR, onNodeHit, enemies = []) {
    const s = dt / 1000;

    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];

      // ── Homing ──────────────────────────────────────────────────────────────
      if (b.homing && enemies.length > 0) {
        let nearest = null, nd2 = Infinity;
        for (const e of enemies) {
          const dx = e.x - b.x, dy = e.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < nd2) { nearest = e; nd2 = d2; }
        }
        if (nearest) {
          const dx   = nearest.x - b.x;
          const dy   = nearest.y - b.y;
          const dist = Math.sqrt(nd2) || 1;
          const turn = 4.5; // steering force
          b.vx += (dx / dist) * turn;
          b.vy += (dy / dist) * turn;
          // Renormalize to maintain original speed
          const spd = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
          if (spd > 0) {
            const target = BULLET_SPD_PLAYER;
            b.vx = b.vx / spd * target;
            b.vy = b.vy / spd * target;
          }
        }
      }

      // ── Wave ────────────────────────────────────────────────────────────────
      if (b.wave) {
        b.wavePhase += s * 5 * Math.PI * 2;
        const angle  = Math.atan2(b.vy, b.vx);
        const perpX  = -Math.sin(angle);
        const perpY  =  Math.cos(angle);
        const drift  = Math.cos(b.wavePhase) * 80 * s;
        b.x += perpX * drift;
        b.y += perpY * drift;
      }

      // ── Base movement ───────────────────────────────────────────────────────
      b.x   += b.vx * s;
      b.y   += b.vy * s;
      b.age += dt;

      // Screen bounds
      if (b.fromPlayer) {
        if (b.x < -20 || b.x > W + 20 || b.y < -20 || b.y > H + 20) {
          this.bullets.splice(i, 1);
          continue;
        }
      } else {
        b.x = ((b.x % W) + W) % W;
        b.y = ((b.y % H) + H) % H;
      }

      if (b.age > 5000) { this.bullets.splice(i, 1); continue; }

      // ── Node collision: reflect + damage ────────────────────────────────────
      let removed = false;
      for (const n of activeNodes) {
        const r  = nodeR[n.type] || 5;
        const dx = b.x - n.x;
        const dy = b.y - n.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < r + b.r) {
          if (b.bounces > 0) {
            const nx  = dx / d, ny = dy / d;
            const dot = b.vx * nx + b.vy * ny;
            b.vx -= 2 * dot * nx;
            b.vy -= 2 * dot * ny;
            b.x   = n.x + nx * (r + b.r + 1);
            b.y   = n.y + ny * (r + b.r + 1);
            b.bounces--;
            if (!b.fromPlayer) onNodeHit(n);
          } else {
            if (!b.fromPlayer) onNodeHit(n);
            this.bullets.splice(i, 1);
            removed = true;
          }
          break;
        }
      }
      if (removed) continue;
    }
  }

  draw(ctx) {
    for (const b of this.bullets) {
      const baseColor = b.color ?? (b.fromPlayer ? C.bulletPlayer : C.bulletEnemy);
      const spd = Math.sqrt(b.vx * b.vx + b.vy * b.vy);

      ctx.save();

      if (b.fromPlayer && (b.homing || b.piercing || b.explosive || b.wave)) {
        // ── Modified bullet rendering ──────────────────────────────────────

        if (b.piercing) {
          // Diamond shape - outlined, no fill
          const r = b.r * 1.3;
          ctx.strokeStyle = '#44ffff';
          ctx.shadowColor = '#44ffff';
          ctx.shadowBlur  = 12;
          ctx.lineWidth   = 1.5;
          ctx.beginPath();
          ctx.moveTo(b.x,     b.y - r);
          ctx.lineTo(b.x + r, b.y);
          ctx.lineTo(b.x,     b.y + r);
          ctx.lineTo(b.x - r, b.y);
          ctx.closePath();
          ctx.stroke();
        } else if (b.explosive) {
          // Larger orb with orange outer ring
          const r = b.r * 1.6;
          ctx.fillStyle   = '#ffaa44';
          ctx.shadowColor = '#ffaa44';
          ctx.shadowBlur  = 18;
          ctx.beginPath();
          ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
          ctx.fill();
          // Inner bright core
          ctx.fillStyle   = '#ffffff';
          ctx.shadowBlur  = 0;
          ctx.beginPath();
          ctx.arc(b.x, b.y, r * 0.4, 0, Math.PI * 2);
          ctx.fill();
        } else if (b.homing) {
          // Pulsing green glow
          const pulse = 8 + Math.sin(b.age * 0.012) * 6;
          const r     = b.r * 1.1;
          ctx.fillStyle   = '#00ff88';
          ctx.shadowColor = '#00ff88';
          ctx.shadowBlur  = pulse;
          ctx.beginPath();
          ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
          ctx.fill();
        } else if (b.wave) {
          // Purple trail with slightly bigger radius
          const r = b.r * 1.2;
          ctx.fillStyle   = '#aa44ff';
          ctx.shadowColor = '#aa44ff';
          ctx.shadowBlur  = 14;
          ctx.beginPath();
          ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
          ctx.fill();
        }

        // Overlay second modifier ring if stacked
        const stackCount = [b.homing, b.piercing, b.explosive, b.wave].filter(Boolean).length;
        if (stackCount > 1 && !b.piercing) {
          ctx.strokeStyle = 'rgba(255,255,255,0.3)';
          ctx.lineWidth   = 0.8;
          ctx.shadowBlur  = 0;
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r * 2.2, 0, Math.PI * 2);
          ctx.stroke();
        }

      } else {
        // ── Standard bullet rendering (unchanged) ─────────────────────────
        const color = baseColor;
        const r = b.fromPlayer && spd < 300 ? b.r * 2.2 : b.r;
        ctx.fillStyle   = color;
        ctx.shadowColor = color;
        ctx.shadowBlur  = b.fromPlayer ? 10 : 7;
        ctx.beginPath();
        ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  clear() { this.bullets = []; }
}
