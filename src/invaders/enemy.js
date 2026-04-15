import {
  ENEMY_R, ENEMY_HP,
  ENEMY_SPEED_WANDER, ENEMY_SPEED_CHASE, ENEMY_SPEED_MAX,
  ENEMY_FIRE_CD_BASE, ENEMY_STATE_CD,
  C, BULLET_BOUNCES_ENE,
} from './constants.js';

export class Enemy {
  /**
   * @param {number} x
   * @param {number} y
   * @param {number} difficulty  - multiplier ≥ 1
   * @param {Object} opts        - { isBoss, bossName, targetNode, type, isMiniSplitter }
   *
   * Enemy types:
   *   'standard'   - default red diamond, shoots at player/nodes
   *   'splitter'   - larger, 3 HP; splits into 2 mini-splitters on death
   *   'shielded'   - frontal shield deflects bullets (unless piercing/explosive)
   *   'hacker'     - small, fast, parks on a node and drains its HP over time
   */
  constructor(x, y, difficulty = 1, opts = {}) {
    this.x   = x;
    this.y   = y;
    this.vx  = 0;
    this.vy  = 0;
    this.angle = 0;
    this.r   = ENEMY_R;
    this.hp  = ENEMY_HP;

    this.type           = opts.type           ?? 'standard';
    this.isMiniSplitter = opts.isMiniSplitter ?? false;
    this.isBoss         = opts.isBoss         ?? false;
    this.bossName       = opts.bossName       ?? '';

    this._diff        = Math.min(difficulty, 2.5);
    this.fireCooldown = (ENEMY_FIRE_CD_BASE / this._diff) * (0.5 + Math.random() * 0.8);
    this.stateTimer   = ENEMY_STATE_CD * Math.random();
    this.state        = 'wander';
    this.targetNode   = null;

    this.wanderAngle  = Math.random() * Math.PI * 2;
    this.wanderTimer  = 0;
    this.flashTimer   = 0;

    // ── Type-specific overrides ───────────────────────────────────────────────
    if (this.type === 'splitter') {
      this.hp = this.isMiniSplitter ? 1 : 3;
      this.r  = ENEMY_R * (this.isMiniSplitter ? 0.7 : 1.4);
    }

    if (this.type === 'shielded') {
      this.hp = 2;
      // r stays ENEMY_R
    }

    if (this.type === 'hacker') {
      this.hp           = 1;
      this.r            = ENEMY_R * 0.8;
      this.drainTimer   = 3200;
      this.fireCooldown = Infinity; // hackers never shoot
      // Hackers always target nodes, never the player directly
      this.state        = 'attack_node';
    }

    if (this.isBoss) {
      this.r          = ENEMY_R * 2.2;
      this.hp         = 10;
      this.state      = 'attack_node';
      this.targetNode = opts.targetNode ?? null;
      this.stateTimer = Infinity;
    }
  }

  /**
   * @param {Function} onDrain  - (node) => void  called when hacker drains a node
   */
  update(dt, player, activeNodes, allEnemies, bulletPool, W, H, onDrain) {
    const s = dt / 1000;

    this.flashTimer = Math.max(0, this.flashTimer - dt);

    // --- AI state transitions ---
    this.stateTimer -= dt;
    if (this.stateTimer <= 0) {
      this.stateTimer = ENEMY_STATE_CD * (0.75 + Math.random() * 0.5);
      // Hackers always stay in attack_node; bosses handled separately
      if (this.type !== 'hacker' && !this.isBoss) {
        if (activeNodes.length > 0 && Math.random() < 0.5) {
          this.state      = 'attack_node';
          this.targetNode = activeNodes[Math.floor(Math.random() * activeNodes.length)];
        } else {
          this.state      = 'chase_player';
          this.targetNode = null;
        }
      }
    }

    // Invalidate dead/null node target
    if (this.state === 'attack_node' && (!this.targetNode || !activeNodes.includes(this.targetNode))) {
      if (this.isBoss) {
        this.state      = 'chase_player';
        this.targetNode = null;
      } else if (this.type === 'hacker') {
        // Pick a new target node or wander if none left
        if (activeNodes.length > 0) {
          this.targetNode = activeNodes[Math.floor(Math.random() * activeNodes.length)];
        } else {
          this.state      = 'wander';
          this.targetNode = null;
        }
      } else {
        this.state      = 'wander';
        this.targetNode = null;
      }
    }

    // --- Steering ---
    let ax = 0, ay = 0;
    const speedScale = this._diff;

    if (this.state === 'wander') {
      this.wanderTimer -= dt;
      if (this.wanderTimer <= 0) {
        this.wanderAngle += (Math.random() - 0.5) * Math.PI * 0.9;
        this.wanderTimer  = 500 + Math.random() * 700;
      }
      ax = Math.cos(this.wanderAngle) * ENEMY_SPEED_WANDER * speedScale;
      ay = Math.sin(this.wanderAngle) * ENEMY_SPEED_WANDER * speedScale;
    } else {
      const tx   = this.state === 'chase_player' ? player.x : this.targetNode.x;
      const ty   = this.state === 'chase_player' ? player.y : this.targetNode.y;
      const dx   = tx - this.x;
      const dy   = ty - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;

      let spd = ENEMY_SPEED_CHASE * speedScale;
      // Hackers move faster on the way to a node
      if (this.type === 'hacker') spd *= 1.9;

      if (this.state === 'attack_node') {
        const arriveR = 130;
        if (dist < arriveR) spd *= Math.max(0, (dist - 60) / arriveR);
      }

      ax = (dx / dist) * spd;
      ay = (dy / dist) * spd;
    }

    // --- Separation from other enemies ---
    for (const other of allEnemies) {
      if (other === this) continue;
      const dx   = this.x - other.x;
      const dy   = this.y - other.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      if (dist < 55) {
        const push = (55 - dist) / 55 * 220;
        ax += (dx / dist) * push;
        ay += (dy / dist) * push;
      }
    }

    // --- Integrate ---
    this.vx += ax * s;
    this.vy += ay * s;

    const maxSpd = ENEMY_SPEED_MAX * this._diff;
    const spd = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (spd > maxSpd) {
      this.vx = this.vx / spd * maxSpd;
      this.vy = this.vy / spd * maxSpd;
    }

    const friction = Math.pow(0.86, s * 60);
    this.vx *= friction;
    this.vy *= friction;

    this.x += this.vx * s;
    this.y += this.vy * s;

    const margin  = 60;
    const edgePush = 280;
    if (this.x < margin)     this.vx += edgePush * s;
    if (this.x > W - margin) this.vx -= edgePush * s;
    if (this.y < margin)     this.vy += edgePush * s;
    if (this.y > H - margin) this.vy -= edgePush * s;

    this.x = Math.max(-this.r, Math.min(W + this.r, this.x));
    this.y = Math.max(-this.r, Math.min(H + this.r, this.y));

    if (Math.abs(this.vx) + Math.abs(this.vy) > 5) {
      this.angle = Math.atan2(this.vy, this.vx);
    }

    // --- Hacker drain ---
    if (this.type === 'hacker' && this.targetNode) {
      const tn   = this.targetNode;
      const dx   = tn.x - this.x;
      const dy   = tn.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < tn.r + this.r + 8) {
        this.drainTimer -= dt;
        if (this.drainTimer <= 0) {
          this.drainTimer = 3200;
          if (onDrain) onDrain(tn);
        }
      } else {
        // Not close yet - reset drain timer while approaching
        this.drainTimer = Math.min(this.drainTimer + dt * 0.5, 3200);
      }
    }

    // --- Fire ---
    this.fireCooldown -= dt;
    if (this.fireCooldown <= 0 && this.state !== 'wander' && this.type !== 'hacker') {
      const tx = this.state === 'chase_player' ? player.x : (this.targetNode ? this.targetNode.x : null);
      const ty = this.state === 'chase_player' ? player.y : (this.targetNode ? this.targetNode.y : null);
      if (tx !== null) {
        const aimAngle = Math.atan2(ty - this.y, tx - this.x);
        bulletPool.fire(this.x, this.y, aimAngle, false, BULLET_BOUNCES_ENE);
        this.fireCooldown = (ENEMY_FIRE_CD_BASE / this._diff) * (0.75 + Math.random() * 0.4);
      }
    }
  }

  /** Mark this enemy as hit; returns true if it dies. */
  hit() {
    this.hp--;
    this.flashTimer = 180;
    return this.hp <= 0;
  }

  draw(ctx) {
    if (this.isBoss)              { this._drawBoss(ctx);     return; }
    if (this.type === 'splitter') { this._drawSplitter(ctx); return; }
    if (this.type === 'shielded') { this._drawShielded(ctx); return; }
    if (this.type === 'hacker')   { this._drawHacker(ctx);   return; }
    this._drawStandard(ctx);
  }

  _drawStandard(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    const flash = this.flashTimer > 0;
    const color = flash ? '#ffffff' : C.enemy;
    ctx.strokeStyle = color;
    ctx.fillStyle   = flash ? 'rgba(255,255,255,0.25)' : 'rgba(255,68,34,0.18)';
    ctx.shadowColor = color;
    ctx.shadowBlur  = 15;
    ctx.lineWidth   = 1.5;

    const r = this.r;
    ctx.beginPath();
    ctx.moveTo(0,        -r);
    ctx.lineTo(r * 0.7,  0);
    ctx.lineTo(0,         r);
    ctx.lineTo(-r * 0.7,  0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    if (this.hp === 1 && !flash) {
      ctx.shadowBlur  = 0;
      ctx.strokeStyle = 'rgba(255,68,34,0.5)';
      ctx.lineWidth   = 0.7;
      ctx.beginPath();
      ctx.moveTo(-r * 0.35, -r * 0.35); ctx.lineTo(r * 0.35, r * 0.35);
      ctx.moveTo(r * 0.35, -r * 0.35);  ctx.lineTo(-r * 0.35, r * 0.35);
      ctx.stroke();
    }
    ctx.restore();
  }

  _drawSplitter(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    const flash  = this.flashTimer > 0;
    const color  = flash ? '#ffffff' : (this.isMiniSplitter ? '#aaff44' : '#ddff00');
    const r      = this.r;

    ctx.shadowColor = color;
    ctx.shadowBlur  = flash ? 20 : 12;
    ctx.strokeStyle = color;
    ctx.lineWidth   = 1.5;

    // Two overlapping diamonds offset slightly
    const offsets = this.isMiniSplitter
      ? [[0, 0]]
      : [[-r * 0.22, 0], [r * 0.22, 0]];

    for (const [ox, oy] of offsets) {
      const pr = r * (this.isMiniSplitter ? 1 : 0.75);
      ctx.fillStyle = flash ? 'rgba(255,255,255,0.2)' : 'rgba(180,255,0,0.15)';
      ctx.beginPath();
      ctx.moveTo(ox,           oy - pr);
      ctx.lineTo(ox + pr * 0.7, oy);
      ctx.lineTo(ox,           oy + pr);
      ctx.lineTo(ox - pr * 0.7, oy);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // HP pips for non-mini splitters
    if (!this.isMiniSplitter && !flash) {
      ctx.shadowBlur  = 0;
      ctx.fillStyle   = color;
      for (let i = 0; i < this.hp; i++) {
        ctx.beginPath();
        ctx.arc(-r * 0.3 + i * r * 0.3, r + 5, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  _drawShielded(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    const flash = this.flashTimer > 0;
    const r     = this.r;
    const color = flash ? '#ffffff' : '#ff8844';

    ctx.shadowColor = color;
    ctx.shadowBlur  = 15;
    ctx.strokeStyle = color;
    ctx.fillStyle   = flash ? 'rgba(255,255,255,0.2)' : 'rgba(255,136,68,0.15)';
    ctx.lineWidth   = 1.5;

    // Standard diamond body
    ctx.beginPath();
    ctx.moveTo(0,        -r);
    ctx.lineTo(r * 0.7,  0);
    ctx.lineTo(0,         r);
    ctx.lineTo(-r * 0.7,  0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Frontal shield arc (points toward angle=0, i.e., facing right in local space)
    if (!flash) {
      ctx.shadowColor = '#44aaff';
      ctx.shadowBlur  = 18;
      ctx.strokeStyle = '#44aaff';
      ctx.lineWidth   = 2.5;
      ctx.beginPath();
      // Arc centered at enemy, from -72° to +72° pointing "forward" (right = 0 in local space)
      ctx.arc(0, 0, r + 4, -Math.PI * 0.4, Math.PI * 0.4);
      ctx.stroke();

      // Small shield nodes at arc ends
      ctx.shadowBlur = 10;
      ctx.fillStyle  = '#44aaff';
      for (const a of [-Math.PI * 0.4, Math.PI * 0.4]) {
        ctx.beginPath();
        ctx.arc(Math.cos(a) * (r + 4), Math.sin(a) * (r + 4), 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  _drawHacker(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    const flash   = this.flashTimer > 0;
    const r       = this.r;
    const pulse   = Math.sin(Date.now() * 0.007) * 0.35 + 0.65;
    const color   = flash ? '#ffffff' : `rgba(0,255,220,${pulse})`;
    const glowCol = flash ? '#ffffff' : '#00ffdc';

    ctx.shadowColor = glowCol;
    ctx.shadowBlur  = flash ? 20 : 14 * pulse;
    ctx.strokeStyle = color;
    ctx.lineWidth   = 1.5;

    // Small circle with diagonal cross (cyber hacker icon)
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.stroke();

    if (!flash) {
      ctx.shadowBlur  = 0;
      ctx.strokeStyle = `rgba(0,255,220,${pulse * 0.6})`;
      ctx.lineWidth   = 0.8;
      // Cross
      ctx.beginPath();
      ctx.moveTo(-r * 0.6, -r * 0.6); ctx.lineTo(r * 0.6, r * 0.6);
      ctx.moveTo(r * 0.6, -r * 0.6);  ctx.lineTo(-r * 0.6, r * 0.6);
      ctx.stroke();

      // Drain indicator: pulsing inner ring when close to a node
      if (this.drainTimer < 2000) {
        const progress = 1 - this.drainTimer / 3200;
        ctx.strokeStyle = `rgba(255,80,80,${progress * 0.8})`;
        ctx.shadowColor = '#ff5050';
        ctx.shadowBlur  = 10;
        ctx.lineWidth   = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.55, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  _drawBoss(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    const flash = this.flashTimer > 0;
    const color = flash ? '#ffffff' : '#aa44ff';
    const r     = this.r;

    ctx.shadowColor = color;
    ctx.shadowBlur  = 28;
    ctx.strokeStyle = color;
    ctx.fillStyle   = flash ? 'rgba(255,255,255,0.3)' : 'rgba(170,68,255,0.18)';
    ctx.lineWidth   = 2;

    ctx.beginPath();
    ctx.moveTo(0,       -r);
    ctx.lineTo(r * 0.7,  0);
    ctx.lineTo(0,        r);
    ctx.lineTo(-r * 0.7, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    if (!flash) {
      ctx.shadowBlur  = 0;
      ctx.strokeStyle = 'rgba(170,68,255,0.5)';
      ctx.lineWidth   = 1;
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.5); ctx.lineTo(0,  r * 0.5);
      ctx.moveTo(-r * 0.35, 0); ctx.lineTo(r * 0.35, 0);
      ctx.stroke();
    }

    ctx.shadowBlur  = 0;
    ctx.font        = `500 11px 'JetBrains Mono', monospace`;
    ctx.fillStyle   = flash ? 'rgba(255,255,255,0.9)' : 'rgba(170,68,255,0.85)';
    ctx.textAlign   = 'center';
    ctx.fillText(this.bossName, 0, -r - 10);

    ctx.restore();
  }
}
