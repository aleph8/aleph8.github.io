import {
  PLAYER_R, PLAYER_SPEED, PLAYER_ACCEL, PLAYER_FRICTION,
  PLAYER_INVINCIBLE, C, BULLET_BOUNCES_PLR,
  WEAPON_TYPES,
} from './constants.js';

export class Player {
  constructor(x, y) {
    this.x   = x;
    this.y   = y;
    this.vx  = 0;
    this.vy  = 0;
    this.angle = -Math.PI / 2; // nose pointing up initially
    this.r   = PLAYER_R;

    // Start aim far above so the ship noses upward before first mouse event
    this.mouseX = x;
    this.mouseY = y - 9999;
    this.firing = false;

    this.fireCooldown = 0;
    this.invincible   = 0;  // ms remaining

    // Upgrades
    this.weaponType  = 'beam'; // 'beam' | 'spread' | 'rapid' | 'cannon'
    this.weaponLevel = 0;      // 0–2, upgrades current type
    this.shield      = 0;      // 0 = none, 1 = active
    this.speedMult   = 1.0;    // multiplied onto PLAYER_SPEED; max 2.0

    this._thrusting  = false;
    this.autoFire    = false; // toggle with F key

    // Active bullet modifiers (stackable)
    this.modifiers = new Set(); // 'homing' | 'piercing' | 'explosive' | 'wave'

    // Passive relics (one-time permanent effects)
    this.relics = new Set(); // 'ricochet' | 'harvest' | 'overclock'
  }

  /** Return current weapon spec with level bonuses applied. */
  _weaponSpec() {
    const base = WEAPON_TYPES[this.weaponType] ?? WEAPON_TYPES.beam;
    const lvl  = this.weaponLevel;
    // Each level: -15% cooldown, +1 bullet on spread/rapid
    const overclockMult = this.relics.has('overclock') ? 0.80 : 1.0;
    const cooldown = base.cooldown * Math.pow(0.85, lvl) * overclockMult;
    const count    = (this.weaponType === 'spread' || this.weaponType === 'rapid')
      ? base.count + lvl
      : base.count;
    return { ...base, cooldown, count };
  }

  /** Apply a collected random field powerup. Returns a display string. */
  applyPowerup(type) {
    if (type === 'WEAPON') {
      this.weaponLevel = Math.min(2, this.weaponLevel + 1);
      const spec = WEAPON_TYPES[this.weaponType] ?? WEAPON_TYPES.beam;
      return `${spec.label} LV ${this.weaponLevel + 1}`;
    }
    if (type === 'SHIELD') {
      this.shield = 1;
      return 'SHIELD UP';
    }
    if (type === 'SPEED') {
      this.speedMult = Math.min(2.0, this.speedMult + 0.25);
      return 'SPEED UP';
    }
    return '';
  }

  update(dt, keys, W, H, bulletPool) {
    const s = dt / 1000;

    // --- Movement ---
    let ax = 0, ay = 0;
    if (keys['ArrowLeft']  || keys['KeyA']) ax -= 1;
    if (keys['ArrowRight'] || keys['KeyD']) ax += 1;
    if (keys['ArrowUp']    || keys['KeyW']) ay -= 1;
    if (keys['ArrowDown']  || keys['KeyS']) ay += 1;

    const inputLen = Math.sqrt(ax * ax + ay * ay);
    if (inputLen > 0) { ax /= inputLen; ay /= inputLen; }
    this._thrusting = inputLen > 0;

    this.vx += ax * PLAYER_ACCEL * s;
    this.vy += ay * PLAYER_ACCEL * s;

    // Frame-rate independent friction
    const f = Math.pow(PLAYER_FRICTION, s * 60);
    this.vx *= f;
    this.vy *= f;

    // Cap speed (scaled by speedMult from shop upgrades)
    const maxSpd = PLAYER_SPEED * this.speedMult;
    const spd = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (spd > maxSpd) {
      this.vx = this.vx / spd * maxSpd;
      this.vy = this.vy / spd * maxSpd;
    }

    this.x += this.vx * s;
    this.y += this.vy * s;
    this.x = Math.max(this.r, Math.min(W - this.r, this.x));
    this.y = Math.max(this.r, Math.min(H - this.r, this.y));

    // --- Aim ---
    if (this.autoFire && inputLen > 0) {
      // Auto-fire mode: aim follows movement direction
      this.angle = Math.atan2(ay, ax);
    } else {
      // IJKL = explicit keyboard aim (takes priority when pressed)
      let kax = 0, kay = 0;
      if (keys['KeyJ']) kax -= 1;
      if (keys['KeyL']) kax += 1;
      if (keys['KeyI']) kay -= 1;
      if (keys['KeyK']) kay += 1;
      const kLen = Math.sqrt(kax * kax + kay * kay);
      if (kLen > 0) {
        this.angle = Math.atan2(kay / kLen, kax / kLen);
      } else {
        // Mouse / touchpad aim fallback
        const mdx = this.mouseX - this.x;
        const mdy = this.mouseY - this.y;
        if (Math.abs(mdx) + Math.abs(mdy) > 2) {
          this.angle = Math.atan2(mdy, mdx);
        }
      }
    }

    // --- Fire ---
    this.fireCooldown -= dt;
    const spec = this._weaponSpec();
    const shouldFire = this.firing || keys['Space'] || (this.autoFire && inputLen > 0);
    if (shouldFire && this.fireCooldown <= 0) {
      this._shoot(bulletPool, spec);
      this.fireCooldown = spec.cooldown;
    }

    if (this.invincible > 0) this.invincible -= dt;
  }

  _shoot(bulletPool, spec) {
    const { count, spread, bounces, speed, color } = spec;
    const mods = {
      homing:    this.modifiers.has('homing'),
      piercing:  this.modifiers.has('piercing'),
      explosive: this.modifiers.has('explosive'),
      wave:      this.modifiers.has('wave'),
    };
    // Optical Fiber relic: +2 bounces on all bullets
    const extraBounces = this.relics.has('ricochet') ? 2 : 0;

    if (count === 1) {
      bulletPool.fire(this.x, this.y, this.angle, true, bounces + extraBounces, speed, color,
        { ...mods, wavePhase: Math.random() * Math.PI * 2 });
    } else {
      const half = spread;
      const step = count > 1 ? (half * 2) / (count - 1) : 0;
      for (let i = 0; i < count; i++) {
        const a = this.angle - half + step * i;
        bulletPool.fire(this.x, this.y, a, true, bounces + extraBounces, speed, color,
          { ...mods, wavePhase: Math.random() * Math.PI * 2 });
      }
    }
  }

  /**
   * Register a hit. Shield absorbs it first.
   * Returns true if a life was actually lost.
   */
  hit() {
    if (this.invincible > 0) return false;
    if (this.shield > 0) {
      this.shield = 0;
      this.invincible = 800;
      return false;
    }
    this.invincible = PLAYER_INVINCIBLE;
    return true;
  }

  draw(ctx) {
    // Flash while invincible
    if (this.invincible > 0 && Math.floor(this.invincible / 80) % 2 === 0) return;

    const spec  = WEAPON_TYPES[this.weaponType] ?? WEAPON_TYPES.beam;
    const color = spec.color;

    ctx.save();

    // Shield ring
    if (this.shield > 0) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r + 9, 0, Math.PI * 2);
      ctx.strokeStyle = '#44aaff';
      ctx.lineWidth   = 2;
      ctx.shadowColor = '#44aaff';
      ctx.shadowBlur  = 16;
      ctx.globalAlpha = 0.7 + Math.sin(Date.now() * 0.006) * 0.3;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle + Math.PI / 2);

    ctx.strokeStyle = color;
    ctx.fillStyle   = color + '22';
    ctx.shadowColor = color;
    ctx.shadowBlur  = 18;
    ctx.lineWidth   = 2;

    const r = this.r;
    ctx.beginPath();
    ctx.moveTo(0,        -r);
    ctx.lineTo(-r * 0.6,  r * 0.8);
    ctx.lineTo(0,          r * 0.35);
    ctx.lineTo(r * 0.6,   r * 0.8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Engine thrust
    if (this._thrusting) {
      ctx.fillStyle   = color + 'aa';
      ctx.shadowBlur  = 22;
      const tlen = 5 + Math.random() * 6;
      ctx.beginPath();
      ctx.ellipse(0, r * 0.55, 2.5, tlen, 0, 0, Math.PI * 2);
      ctx.fill();
      // Side exhausts for spread and cannon (heavier weapons)
      if (this.weaponType === 'spread' || this.weaponType === 'cannon') {
        ctx.fillStyle = color + '55';
        ctx.beginPath();
        ctx.ellipse(-r * 0.35, r * 0.7, 1.5, tlen * 0.7, 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(r * 0.35, r * 0.7, 1.5, tlen * 0.7, -0.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }
}
