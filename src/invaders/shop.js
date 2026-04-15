import { SHOP_ITEMS, WEAPON_TYPES, NODE_HP } from './constants.js';

export class Shop {
  constructor() {
    this.currentItems = [];
  }

  /**
   * Pick up to 3 random valid items for this shop visit.
   * Items that are maxed, owned, or active are excluded.
   * Relics have an additional rarity filter (~25% chance to appear).
   */
  open(player, game) {
    const valid = SHOP_ITEMS.filter(item => this._isAvailable(item, player, game));

    // Shuffle (Fisher-Yates)
    for (let i = valid.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [valid[i], valid[j]] = [valid[j], valid[i]];
    }
    this.currentItems = valid.slice(0, 3);
    return this.currentItems;
  }

  _isAvailable(item, player, game) {
    switch (item.id) {
      case 'weapon_up':
        return player.weaponLevel < 2;
      case 'shield':
        return player.shield === 0;
      case 'extra_life':
        return game.lives < 5;
      case 'speed_up':
        return player.speedMult < 2.0;
      case 'node_repair':
        return game.activeNodes.some(n => {
          const hp    = game.nodeHp.get(n.id) ?? 0;
          const maxHp = game.nodeMaxHp.get(n.id) ?? 1;
          return hp < maxHp;
        });
      case 'node_upgrade':
        return game.activeNodes.some(n => {
          const base  = NODE_HP[n.type] ?? 1;
          const maxHp = game.nodeMaxHp.get(n.id) ?? base;
          return maxHp < base + 2;
        });
      case 'nuke':
        return true;
      case 'mod_homing':    return !player.modifiers.has('homing');
      case 'mod_piercing':  return !player.modifiers.has('piercing');
      case 'mod_explosive': return !player.modifiers.has('explosive');
      case 'mod_wave':      return !player.modifiers.has('wave');
      // Only offer weapons the player doesn't currently have equipped
      case 'equip_beam':    return player.weaponType !== 'beam';
      case 'equip_spread':  return player.weaponType !== 'spread';
      case 'equip_rapid':   return player.weaponType !== 'rapid';
      case 'equip_cannon':  return player.weaponType !== 'cannon';
      // Relics: rare, only if not already owned
      case 'relic_ricochet':  return !player.relics.has('ricochet')  && Math.random() < 0.25;
      case 'relic_harvest':   return !player.relics.has('harvest')   && Math.random() < 0.25;
      case 'relic_overclock': return !player.relics.has('overclock') && Math.random() < 0.25;
      default:
        return true;
    }
  }

  /**
   * Apply a purchased item.
   * Returns true on success, false if insufficient coins or unavailable.
   */
  buy(itemId, player, game) {
    const item = SHOP_ITEMS.find(i => i.id === itemId);
    if (!item) return false;
    if (item.cost > 0 && game.coins < item.cost) return false;

    game.coins -= item.cost;

    switch (itemId) {
      case 'weapon_up':
        player.weaponLevel = Math.min(2, player.weaponLevel + 1);
        break;

      case 'shield':
        player.shield = 1;
        break;

      case 'extra_life':
        game.lives = Math.min(5, game.lives + 1);
        break;

      case 'speed_up':
        player.speedMult = Math.min(2.0, player.speedMult + 0.25);
        break;

      case 'node_repair': {
        let worst = null, worstRatio = Infinity;
        for (const n of game.activeNodes) {
          const hp    = game.nodeHp.get(n.id) ?? 0;
          const maxHp = game.nodeMaxHp.get(n.id) ?? 1;
          const ratio = hp / maxHp;
          if (ratio < 1 && ratio < worstRatio) { worst = n; worstRatio = ratio; }
        }
        if (worst) {
          const cur = game.nodeHp.get(worst.id) ?? 0;
          const max = game.nodeMaxHp.get(worst.id) ?? 1;
          game.nodeHp.set(worst.id, Math.min(max, cur + 1));
          game.nodeFlash.set(worst.id, 400);
        }
        break;
      }

      case 'node_upgrade': {
        let worst = null, worstRatio = Infinity;
        for (const n of game.activeNodes) {
          const hp    = game.nodeHp.get(n.id) ?? 0;
          const maxHp = game.nodeMaxHp.get(n.id) ?? 1;
          const base  = NODE_HP[n.type] ?? 1;
          if (maxHp < base + 2) {
            const ratio = hp / maxHp;
            if (ratio < worstRatio) { worst = n; worstRatio = ratio; }
          }
        }
        if (worst) {
          const newMax = (game.nodeMaxHp.get(worst.id) ?? 1) + 1;
          game.nodeMaxHp.set(worst.id, newMax);
          const cur = game.nodeHp.get(worst.id) ?? 0;
          game.nodeHp.set(worst.id, Math.min(newMax, cur + 1));
          game.nodeFlash.set(worst.id, 500);
        }
        break;
      }

      case 'nuke':
        for (const e of game.enemies) {
          game.particles.explode(e.x, e.y, '#ff4422', 14);
        }
        game.enemies.length = 0;
        break;

      case 'mod_homing':    player.modifiers.add('homing');    break;
      case 'mod_piercing':  player.modifiers.add('piercing');  break;
      case 'mod_explosive': player.modifiers.add('explosive'); break;
      case 'mod_wave':      player.modifiers.add('wave');       break;

      case 'relic_ricochet':  player.relics.add('ricochet');  break;
      case 'relic_harvest':   player.relics.add('harvest');   break;
      case 'relic_overclock': player.relics.add('overclock'); break;

      case 'equip_beam':
      case 'equip_spread':
      case 'equip_rapid':
      case 'equip_cannon': {
        const type = itemId.replace('equip_', '');
        if (WEAPON_TYPES[type]) {
          player.weaponType  = type;
          player.weaponLevel = 0;
        }
        break;
      }
    }

    if (game.hud?.setWeapon) {
      const spec = WEAPON_TYPES[player.weaponType] ?? WEAPON_TYPES.beam;
      game.hud.setWeapon(spec.label, spec.color);
    }

    return true;
  }
}
