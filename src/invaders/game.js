import { Player }        from './player.js';
import { Enemy }         from './enemy.js';
import { BulletPool }    from './bullet.js';
import { ParticleSystem }from './particles.js';
import { WaveManager }   from './waves.js';
import { PowerupManager }from './powerup.js';
import { Shop }          from './shop.js';
import {
  NODE_R, NODE_HP,
  ENEMY_R, PLAYER_R,
  PLAYER_LIVES,
  SCORE_ENEMY_KILL, SCORE_BOSS_KILL, SCORE_WAVE_BONUS,
  COIN_PER_KILL, COIN_BOSS_KILL, COIN_WAVE_BONUS,
  COMBO_TIMEOUT_MS,
  POWERUP_DROP_RATE,
  C, WAVE_BANNER_MS,
  waveDifficulty,
  WEAPON_TYPES,
} from './constants.js';

const HS_KEY = 'kgraph_hs';

function circles(ax, ay, ar, bx, by, br) {
  const dx = ax - bx, dy = ay - by;
  return dx * dx + dy * dy < (ar + br) * (ar + br);
}

export class Game {
  constructor(getWH, graphNodes, graphLinks, hud) {
    this.getWH     = getWH;
    this._allNodes = graphNodes;
    this._allLinks = graphLinks;
    this.hud       = hud;

    this.state     = 'EXPLORE';

    this.player    = null;
    this.enemies   = [];
    this.bullets   = new BulletPool();
    this.particles = new ParticleSystem();
    this.waves     = new WaveManager();
    this.powerups  = new PowerupManager();
    this.shop      = new Shop();

    this.activeNodes = [];
    this.activeLinks = [];
    this.nodeHp    = new Map();
    this.nodeMaxHp = new Map();
    this.nodeFlash = new Map();

    this.lives = PLAYER_LIVES;
    this.score = 0;
    this.coins = 0;
    this._keys = {};

    // Combo
    this.combo      = 0;
    this.comboTimer = 0;

    // Screen shake
    this._shakeTimer     = 0;
    this._shakeIntensity = 0;
    this._shakeDuration  = 1;
  }

  // ── Public API ────────────────────────────────────────────────────────────

  enter() {
    const { W, H } = this.getWH();

    this.state      = 'PLAYING';
    this.lives      = PLAYER_LIVES;
    this.score      = 0;
    this.coins      = 0;
    this.arcadeMode = false;
    this.enemies    = [];
    this.bullets.clear();
    this.powerups.clear();
    this.particles  = new ParticleSystem();

    this.combo      = 0;
    this.comboTimer = 0;
    this._shakeTimer = 0;

    this.activeNodes = this._allNodes.map(n => {
      n.pinned = true; n.vx = 0; n.vy = 0; return n;
    });
    this.activeLinks = [...this._allLinks];

    this.nodeHp.clear();
    this.nodeMaxHp.clear();
    this.nodeFlash.clear();
    for (const n of this.activeNodes) {
      const hp = NODE_HP[n.type] ?? 1;
      this.nodeHp.set(n.id, hp);
      this.nodeMaxHp.set(n.id, hp);
    }

    this.player = new Player(W / 2, H / 2);

    this.waves.start(
      (count, waveNum) => this._spawnEnemyWave(count, waveNum),
      (waveNum) => {
        this.hud.setWave(waveNum);
        this.hud.showBanner(`WAVE ${waveNum}`, WAVE_BANNER_MS);
        // Reset combo on each new wave
        this.combo = 0;
        this.comboTimer = 0;
        if (this.hud.setCombo) this.hud.setCombo(0);
      },
      () => this._enterShop()
    );

    this.hud.setScore(0);
    this.hud.setLives(this.lives);
    this.hud.setCoins(0);
    const initSpec = WEAPON_TYPES[this.player.weaponType] ?? WEAPON_TYPES.beam;
    if (this.hud.setWeapon) this.hud.setWeapon(initSpec.label, initSpec.color);
    if (this.hud.setCombo)  this.hud.setCombo(0);
    this.hud.hideAll();
    this.hud.showGame();
  }

  exit() {
    this.state   = 'EXPLORE';
    this.enemies = [];
    this.bullets.clear();
    this.powerups.clear();
    for (const n of this._allNodes) n.pinned = false;
    this.waves.reset();
    this.hud.hideAll();
    this.hud.showExplore();
  }

  update(dt) {
    if (this.state !== 'PLAYING') return;
    const { W, H } = this.getWH();

    // Flash timers
    for (const [id, t] of this.nodeFlash) {
      const next = t - dt;
      if (next <= 0) this.nodeFlash.delete(id);
      else           this.nodeFlash.set(id, next);
    }

    // Combo decay
    if (this.combo > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) {
        this.combo = 0;
        if (this.hud.setCombo) this.hud.setCombo(0);
      }
    }

    // Shake decay
    if (this._shakeTimer > 0) this._shakeTimer -= dt;

    this.player.update(dt, this._keys, W, H, this.bullets);

    for (const e of this.enemies) {
      e.update(dt, this.player, this.activeNodes, this.enemies, this.bullets, W, H,
               n => this._hitNode(n));
    }

    this.bullets.update(dt, W, H, this.activeNodes, NODE_R, n => this._hitNode(n), this.enemies);
    this.particles.update(dt);
    this.powerups.update(dt);
    this.waves.update(dt, this.enemies);

    // Collect powerups
    const collected = this.powerups.checkCollect(this.player.x, this.player.y, this.player.r);
    if (collected) {
      const label = this.player.applyPowerup(collected);
      this.hud.showBanner(label, 1200);
      this.particles.explode(
        this.player.x, this.player.y,
        collected === 'WEAPON' ? '#ffcc00' : '#44aaff',
        10, 30, 80
      );
    }

    this._checkCollisions();

    // Wave-clear bonus
    if (this._justCleared) {
      this._justCleared = false;
      this._addScore(SCORE_WAVE_BONUS);
      this._addCoins(COIN_WAVE_BONUS + this.waves.wave * 5);

      if (this.waves.wave >= 5 && !this.arcadeMode) {
        this._showVictory();
        return;
      }
    }

    if (this.lives <= 0 || this.activeNodes.length === 0) {
      this._endGame('GAME_OVER');
    }
  }

  draw(ctx) {
    if (this.state === 'EXPLORE') return;

    // Screen shake
    const shaking = this._shakeTimer > 0;
    if (shaking) {
      const t = this._shakeTimer / this._shakeDuration;
      const s = this._shakeIntensity * t;
      ctx.save();
      ctx.translate((Math.random() - 0.5) * s * 2, (Math.random() - 0.5) * s * 2);
    }

    this.powerups.draw(ctx);
    for (const e of this.enemies) e.draw(ctx);
    if (this.player) this.player.draw(ctx);
    this.bullets.draw(ctx);
    this.particles.draw(ctx);

    if (shaking) ctx.restore();
  }

  // ── Shop API ──────────────────────────────────────────────────────────────

  buyItem(itemId) {
    const ok = this.shop.buy(itemId, this.player, this);
    if (ok) {
      this.hud.setCoins(this.coins);
      this.hud.setLives(this.lives);
      const spec = WEAPON_TYPES[this.player.weaponType] ?? WEAPON_TYPES.beam;
      if (this.hud.setWeapon)    this.hud.setWeapon(spec.label, spec.color);
      if (this.hud.setModifiers) this.hud.setModifiers(this.player.modifiers);
      // Nuke shakes the screen
      if (itemId === 'nuke') this._triggerShake(8, 500);
      const items = this.shop.open(this.player, this);
      this.hud.updateShop(items, this.coins, this._playerSnapshot());
    }
    return ok;
  }

  resumeFromShop() {
    this.hud.hideShop();
    this.state = 'PLAYING';
    this.hud.showGame();
    this.waves.triggerNextWave();
  }

  // ── Input ─────────────────────────────────────────────────────────────────

  setKey(code, down)  { this._keys[code] = down; }
  setMouse(x, y)      { if (this.player) { this.player.mouseX = x; this.player.mouseY = y; } }
  setFiring(down)     { if (this.player) this.player.firing = down; }

  // ── Private ───────────────────────────────────────────────────────────────

  _triggerShake(intensity, duration) {
    this._shakeIntensity = intensity;
    this._shakeDuration  = duration;
    this._shakeTimer     = duration;
  }

  _enterShop() {
    this.state = 'SHOP';
    this.bullets.clear();
    const items = this.shop.open(this.player, this);
    this.hud.hideAll();
    this.hud.showShop(items, this.coins, this.waves.wave, this._playerSnapshot());
  }

  _playerSnapshot() {
    return {
      weaponType:   this.player.weaponType,
      weaponLevel:  this.player.weaponLevel,
      speedMult:    this.player.speedMult,
      lives:        this.lives,
      startLives:   PLAYER_LIVES,
      shield:       this.player.shield,
      modifiers:    new Set(this.player.modifiers),
      relics:       new Set(this.player.relics),
    };
  }

  _spawnEnemyWave(count, waveNum) {
    const { W, H } = this.getWH();
    const difficulty = waveDifficulty(waveNum);
    this._justCleared = false;

    const isBossWave   = waveNum % 5 === 0;
    const regularCount = isBossWave ? Math.max(0, count - 1) : count;

    for (let i = 0; i < regularCount; i++) {
      const edge = Math.floor(Math.random() * 4);
      let x, y;
      switch (edge) {
        case 0: x = Math.random() * W; y = -30;               break;
        case 1: x = W + 30;            y = Math.random() * H; break;
        case 2: x = Math.random() * W; y = H + 30;            break;
        default: x = -30;              y = Math.random() * H;
      }

      // Introduce new enemy types gradually by wave
      let type = 'standard';
      const roll = Math.random();
      if      (waveNum >= 5 && roll < 0.15)       type = 'splitter';
      else if (waveNum >= 4 && roll < 0.30)       type = 'shielded';
      else if (waveNum >= 3 && roll < 0.50)       type = 'hacker';

      this.enemies.push(new Enemy(x, y, difficulty, { type }));
    }

    if (isBossWave) {
      const projectNodes = this.activeNodes.filter(n => n.type === 'project');
      if (projectNodes.length > 0) {
        const target   = projectNodes[Math.floor(Math.random() * projectNodes.length)];
        const bossName = target.label;
        this.enemies.push(new Enemy(W / 2, -60, difficulty, { isBoss: true, bossName, targetNode: target }));
        this.hud.showBanner(`BOSS: ${bossName} CORRUPTED`, 2200);
        this._triggerShake(7, 400);
      } else {
        this.enemies.push(new Enemy(W / 2, -60, difficulty * 1.5));
      }
    }
  }

  _hitNode(node) {
    if (!this.nodeHp.has(node.id)) return;
    const hp = this.nodeHp.get(node.id) - 1;
    this.nodeFlash.set(node.id, 260);
    this._triggerShake(3, 200);
    if (hp <= 0) {
      this.nodeHp.delete(node.id);
      const idx = this.activeNodes.indexOf(node);
      if (idx !== -1) this.activeNodes.splice(idx, 1);
      this.activeLinks = this.activeLinks.filter(l => l.source !== node && l.target !== node);
      this.particles.explode(node.x, node.y, '#ff4444', 16, 80, 220);
      if (this.hud.showNodeLoss) this.hud.showNodeLoss(node.label);
    } else {
      this.nodeHp.set(node.id, hp);
    }
  }

  _checkCollisions() {
    const { enemies, bullets, player, particles } = this;

    const prevCount = enemies.length;

    // Player bullets → enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
      const e = enemies[i];
      for (let j = bullets.bullets.length - 1; j >= 0; j--) {
        const b = bullets.bullets[j];
        if (!b.fromPlayer) continue;
        if (!circles(b.x, b.y, b.r, e.x, e.y, e.r)) continue;

        // Shielded: deflect if bullet hits frontal arc (unless piercing/explosive)
        if (e.type === 'shielded' && !b.piercing && !b.explosive) {
          const hitAngle = Math.atan2(b.y - e.y, b.x - e.x);
          let diff = ((hitAngle - e.angle + Math.PI) % (2 * Math.PI)) - Math.PI;
          if (Math.abs(diff) < Math.PI * 0.4) {
            bullets.bullets.splice(j, 1);
            particles.explode(b.x, b.y, '#44aaff', 4, 40, 80);
            continue;
          }
        }

        // Piercing: skip enemies already hit by this bullet
        if (b.piercing && b.piercedSet && b.piercedSet.has(i)) continue;

        const killed = e.hit();

        if (b.piercing && b.piercedSet) {
          b.piercedSet.add(i);
        } else {
          bullets.bullets.splice(j, 1);
        }

        if (killed) {
          const eColor = e.isBoss ? '#aa44ff' : (e.type === 'splitter' ? '#ddff00' : e.type === 'hacker' ? '#00ffdc' : C.enemy);
          const eCount = e.isBoss ? 24 : 12;
          particles.explode(e.x, e.y, eColor, eCount);
          if (Math.random() < POWERUP_DROP_RATE) this.powerups.drop(e.x, e.y);

          // Combo multiplier
          this.combo++;
          this.comboTimer = COMBO_TIMEOUT_MS;
          if (this.hud.setCombo) this.hud.setCombo(this.combo);

          const baseScore = e.isBoss ? SCORE_BOSS_KILL : SCORE_ENEMY_KILL;
          this._addScore(baseScore * Math.max(1, this.combo));
          this._addCoins(e.isBoss ? COIN_BOSS_KILL : COIN_PER_KILL);

          // Data Harvest relic
          if (this.player.relics.has('harvest')) this._addCoins(15);

          enemies.splice(i, 1);

          // Splitter: spawn 2 mini-splitters
          if (e.type === 'splitter' && !e.isMiniSplitter) {
            for (let s = 0; s < 2; s++) {
              const a = Math.random() * Math.PI * 2;
              enemies.push(new Enemy(
                e.x + Math.cos(a) * 16, e.y + Math.sin(a) * 16,
                e._diff, { type: 'splitter', isMiniSplitter: true }
              ));
            }
          }

          // Explosive AoE
          if (b.explosive) {
            const blastR = 80;
            particles.explode(e.x, e.y, '#ffaa44', 18, 100, 300);
            for (let k = enemies.length - 1; k >= 0; k--) {
              const ek = enemies[k];
              const dx = ek.x - e.x, dy = ek.y - e.y;
              if (dx * dx + dy * dy < blastR * blastR) {
                if (ek.hit()) {
                  particles.explode(ek.x, ek.y, '#ffaa44', 10);
                  enemies.splice(k, 1);
                  this._addScore(ek.isBoss ? SCORE_BOSS_KILL : SCORE_ENEMY_KILL);
                  this._addCoins(ek.isBoss ? COIN_BOSS_KILL  : COIN_PER_KILL);
                  if (Math.random() < POWERUP_DROP_RATE) this.powerups.drop(ek.x, ek.y);
                }
              }
            }
          }
        }

        if (!b.piercing) break;
      }
    }

    // Detect wave just cleared
    if (prevCount > 0 && enemies.length === 0) {
      this._justCleared = true;
    }

    // Enemy bullets → player
    for (let j = bullets.bullets.length - 1; j >= 0; j--) {
      const b = bullets.bullets[j];
      if (b.fromPlayer) continue;
      if (!circles(b.x, b.y, b.r, player.x, player.y, PLAYER_R)) continue;
      bullets.bullets.splice(j, 1);
      if (player.hit()) {
        this.lives--;
        particles.explode(player.x, player.y, C.player, 8);
        this.hud.setLives(this.lives);
        this._triggerShake(5, 280);
      }
    }

    // Enemies ramming player
    for (const e of enemies) {
      if (circles(e.x, e.y, e.r, player.x, player.y, PLAYER_R)) {
        if (player.hit()) {
          this.lives--;
          particles.explode(player.x, player.y, C.player, 8);
          this.hud.setLives(this.lives);
          this._triggerShake(5, 280);
        }
      }
    }
  }

  _addScore(pts) {
    this.score += pts;
    this.hud.setScore(this.score);
  }

  _addCoins(n) {
    this.coins += n;
    this.hud.setCoins(this.coins);
  }

  _showVictory() {
    this.state = 'VICTORY';
    this.bullets.clear();
    this.hud.hideAll();
    const prev  = parseInt(localStorage.getItem(HS_KEY) || '0', 10);
    const isNew = this.score > prev;
    if (isNew) localStorage.setItem(HS_KEY, String(this.score));
    this.hud.showOverlay('VICTORY', this.score, this.waves.wave,
      this.activeNodes.length, this._allNodes.length, prev, isNew);
  }

  continueArcade() {
    this.arcadeMode = true;
    this.state = 'PLAYING';
    this.hud.hideAll();
    this.hud.showGame();
    this.waves.triggerNextWave();
  }

  _endGame(outcome) {
    this.state = outcome;
    const prev  = parseInt(localStorage.getItem(HS_KEY) || '0', 10);
    const isNew = this.score > prev;
    if (isNew) localStorage.setItem(HS_KEY, String(this.score));
    this.hud.showOverlay(outcome, this.score, this.waves.wave,
      this.activeNodes.length, this._allNodes.length, prev, isNew);
  }
}
