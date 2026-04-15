// Node graph config (must match graph-renderer.js nodeConfig radii)
export const NODE_R  = { project: 14, post: 9, doc: 6, tag: 4 };
export const NODE_HP = { project: 5,  post: 3, doc: 2, tag: 1 };

// Player
export const PLAYER_R          = 13;
export const PLAYER_SPEED      = 420;   // px/s
export const PLAYER_ACCEL      = 1500;  // px/s²
export const PLAYER_FRICTION   = 0.94;  // per-frame at 60fps
export const PLAYER_FIRE_CD    = 130;   // ms between shots (base, weapon level reduces it)
export const PLAYER_INVINCIBLE = 2200;  // ms of invincibility after taking a hit
export const PLAYER_LIVES      = 3;

/**
 * Weapon archetypes. Each has distinct base stats.
 * weaponLevel (0–2) applies a 15%-per-level cooldown reduction and +1 bullet on spread/rapid.
 */
export const WEAPON_TYPES = {
  beam: {
    label:    'Beam',
    color:    '#00ffcc',
    cooldown: 120,   // ms
    count:    1,
    spread:   0,
    bounces:  2,
    speed:    560,
    desc:     'Precise · ricochets protect nodes',
  },
  spread: {
    label:    'Spread',
    color:    '#ffaa00',
    cooldown: 240,
    count:    5,
    spread:   0.45,  // rad half-angle
    bounces:  1,
    speed:    400,
    desc:     'Fan shot · clears groups, weak at range',
  },
  rapid: {
    label:    'Rapid',
    color:    '#ff44ff',
    cooldown: 52,
    count:    1,
    spread:   0.04,
    bounces:  0,
    speed:    720,
    desc:     'Max DPS · zero bounces, nodes exposed',
  },
  cannon: {
    label:    'Cannon',
    color:    '#ff7700',
    cooldown: 600,
    count:    1,
    spread:   0,
    bounces:  6,
    speed:    250,
    desc:     'Slow slug · maximum bounces, best node defense',
  },
};

// Powerups
export const POWERUP_LIFETIME  = 9000;  // ms before it disappears
export const POWERUP_FADE_MS   = 2500;  // ms at end over which it fades
export const POWERUP_DROP_RATE = 0.55;  // probability enemy drops one on death
export const POWERUP_RADIUS    = 12;    // collection + draw radius

// Enemies (base stats - scaled up each wave in game.js)
export const ENEMY_R            = 11;
export const ENEMY_HP           = 2;
export const ENEMY_SPEED_WANDER = 40;
export const ENEMY_SPEED_CHASE  = 75;   // slower so player can dodge
export const ENEMY_SPEED_MAX    = 105;
export const ENEMY_FIRE_CD_BASE = 4500; // ms - generous cooldown at wave 1
export const ENEMY_STATE_CD     = 4500; // ms before re-evaluating AI state

// Bullets
export const BULLET_SPD_PLAYER  = 540;
export const BULLET_SPD_ENEMY   = 195;  // slow enough to dodge
export const BULLET_BOUNCES_PLR = 2;    // player bullets ricochet off nodes
export const BULLET_BOUNCES_ENE = 2;    // enemy bullets: 2 bounces (was 3)

// Waves - infinite arcade escalation
export const WAVE_PAUSE_MS   = 3000;
export const WAVE_BANNER_MS  = 1600;

/**
 * Enemy count grows gradually: 1, 2, 2, 3, 3, 4, 4, 5, 5 … (capped at 12).
 * Formula: floor((w + 3) / 2) clamped to [1, 12].
 */
export const waveEnemyCount = (w) => Math.min(12, Math.max(1, Math.floor((w + 3) / 2)));

/**
 * Difficulty multiplier applied to enemy speed & fire rate each wave.
 * Grows to ~3× by wave 20, then slows to avoid becoming literally unplayable.
 */
export const waveDifficulty = (w) => 1 + Math.log(w) * 0.55;

// Score
export const SCORE_ENEMY_KILL = 100;
export const SCORE_BOSS_KILL  = 500;
export const SCORE_WAVE_BONUS = 500;

// Coins (arcade currency, separate from score)
export const COIN_PER_KILL   = 30;
export const COIN_BOSS_KILL  = 90;
export const COIN_WAVE_BONUS = 50;

// Combo
export const COMBO_TIMEOUT_MS = 2500; // ms before combo resets after last kill

// Shop
export const SHOP_EVERY_N = 2; // open shop after every Nth wave (waves 2, 4, …)

export const SHOP_ITEMS = [
  // ── Upgrades (stackable, show level progress) ─────────────────────────────
  {
    id:       'weapon_up',
    category: 'upgrade',
    label:    'Weapon',
    desc:     '-15% cooldown on current weapon',
    cost:     110,
    icon:     '⚡',
    color:    '#ffe066',
    maxLevel: 2,
  },
  {
    id:       'speed_up',
    category: 'upgrade',
    label:    'Engine',
    desc:     'Ship moves 25% faster',
    cost:     150,
    icon:     '▶',
    color:    '#88ffcc',
    maxLevel: 4,
  },
  {
    id:       'extra_life',
    category: 'upgrade',
    label:    'Life',
    desc:     '+1 life (max 5)',
    cost:     200,
    icon:     '♥',
    color:    '#ff6680',
  },
  {
    id:       'shield',
    category: 'upgrade',
    label:    'Shield',
    desc:     'Absorbs the next hit',
    cost:     80,
    icon:     '◈',
    color:    '#44aaff',
    maxLevel: 1,
  },
  // ── Bullet modifiers (one-time, permanent) ────────────────────────────────
  {
    id:       'mod_homing',
    category: 'modifier',
    label:    'Homing',
    desc:     'Bullets curve toward nearest enemy',
    cost:     200,
    icon:     '◎',
    color:    '#00ff88',
  },
  {
    id:       'mod_piercing',
    category: 'modifier',
    label:    'Piercing',
    desc:     'Bullets pass through enemies',
    cost:     180,
    icon:     '⊳',
    color:    '#44ffff',
  },
  {
    id:       'mod_explosive',
    category: 'modifier',
    label:    'Explosive',
    desc:     'Bullets burst on impact (AoE)',
    cost:     220,
    icon:     '✸',
    color:    '#ffaa44',
  },
  {
    id:       'mod_wave',
    category: 'modifier',
    label:    'Wavefront',
    desc:     'Bullets travel in a wave',
    cost:     160,
    icon:     '〜',
    color:    '#aa44ff',
  },
  // ── Weapons (switch type, show active) ────────────────────────────────────
  {
    id:       'equip_beam',
    category: 'weapon',
    label:    'Beam',
    desc:     'Precise · ricochets protect nodes',
    cost:     0,
    icon:     '⬡',
    color:    '#00ffcc',
  },
  {
    id:       'equip_spread',
    category: 'weapon',
    label:    'Spread',
    desc:     'Fan shot · clears groups',
    cost:     130,
    icon:     '◀▶',
    color:    '#ffaa00',
  },
  {
    id:       'equip_rapid',
    category: 'weapon',
    label:    'Rapid',
    desc:     'Max DPS · zero bounces',
    cost:     130,
    icon:     '▸▸',
    color:    '#ff44ff',
  },
  {
    id:       'equip_cannon',
    category: 'weapon',
    label:    'Cannon',
    desc:     'Slow slug · max bounces',
    cost:     130,
    icon:     '◉',
    color:    '#ff7700',
  },
  // ── Consumables (always usable) ───────────────────────────────────────────
  {
    id:       'node_repair',
    category: 'consumable',
    label:    'Repair',
    desc:     'Restore 1 HP to the most damaged node',
    cost:     100,
    icon:     '✦',
    color:    '#aaddff',
  },
  {
    id:       'node_upgrade',
    category: 'consumable',
    label:    'Reinforce',
    desc:     'Increase max HP of the weakest node (+1)',
    cost:     180,
    icon:     '⬡',
    color:    '#88ccff',
  },
  {
    id:       'nuke',
    category: 'consumable',
    label:    'Nuke',
    desc:     'Destroy all enemies on screen',
    cost:     250,
    icon:     '☢',
    color:    '#ff4422',
  },
  // ── Relics (rare passive items, one-time) ─────────────────────────────────
  {
    id:       'relic_ricochet',
    category: 'relic',
    label:    'Optical Fiber',
    desc:     'All bullets +2 bounces',
    cost:     280,
    icon:     '⟳',
    color:    '#ccffaa',
    rare:     true,
  },
  {
    id:       'relic_harvest',
    category: 'relic',
    label:    'Data Harvest',
    desc:     '+15 coins per kill',
    cost:     240,
    icon:     '◉',
    color:    '#ffee88',
    rare:     true,
  },
  {
    id:       'relic_overclock',
    category: 'relic',
    label:    'Overclock',
    desc:     'Fire rate permanently -20%',
    cost:     260,
    icon:     '∞',
    color:    '#ff88ff',
    rare:     true,
  },
];

// Visual colours
export const C = {
  player:       '#00ffcc',
  enemy:        '#ff4422',
  bulletPlayer: '#00ffcc',
  bulletEnemy:  '#ff6644',
  nodeDamage:   '#ff4444',
  particle:     '#ffffff',
};
