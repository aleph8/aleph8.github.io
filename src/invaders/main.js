import { createGraphRenderer } from './graph-renderer.js';
import { Game }               from './game.js';
import { WEAPON_TYPES }       from './constants.js';

/**
 * init() - called from graph.astro after window.__GRAPH_DATA is set.
 * Sets up the canvas, graph renderer, game, event listeners, and the rAF loop.
 */
export function init() {
  const data   = window.__GRAPH_DATA;
  const canvas = document.getElementById('graph-canvas');
  const ctx    = canvas.getContext('2d');

  let W = 0, H = 0;
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();

  // ── Graph renderer ────────────────────────────────────────────────────────
  const renderer = createGraphRenderer(data, W, H);
  renderer.prewarm(280);

  // ── HUD helpers ───────────────────────────────────────────────────────────
  const hudScore      = document.getElementById('hud-score-val');
  const hudLivesWrap  = document.getElementById('hud-lives');
  const hudWaveVal    = document.getElementById('hud-wave-val');
  const hudCoinsVal   = document.getElementById('hud-coins-val');
  const gameBanner    = document.getElementById('game-banner');
  const gameHUD       = document.getElementById('game-hud');
  const btnSave       = document.getElementById('btn-save-knowledge');
  const overlayEl     = document.getElementById('game-overlay');
  const overlayTitle  = document.getElementById('overlay-title');
  const overlayScore  = document.getElementById('overlay-score');
  const btnExplore    = document.getElementById('btn-back-explore');
  const btnPlayAgain  = document.getElementById('btn-play-again');
  const graphLegend   = document.getElementById('graph-legend');
  const graphTitle    = document.getElementById('graph-title');
  const shopOverlay   = document.getElementById('shop-overlay');
  const shopItemsEl   = document.getElementById('shop-items');
  const shopCoinsEl   = document.getElementById('shop-coins-display');
  const shopWaveEl    = document.getElementById('shop-wave-display');
  const hudComboEl    = document.getElementById('hud-combo');
  const hudComboVal   = document.getElementById('hud-combo-val');

  let bannerTimeout = null;

  /** Pulse the coin counter to give visual feedback on purchase. */
  function pulseCoins() {
    if (!shopCoinsEl) return;
    shopCoinsEl.classList.remove('coin-pop');
    void shopCoinsEl.offsetWidth; // force reflow to restart animation
    shopCoinsEl.classList.add('coin-pop');
  }

  /** Spawn a floating "+label" text on a card element. */
  function spawnFloatText(cardEl, text) {
    const el = document.createElement('div');
    el.className = 'shop-float-text';
    el.textContent = text;
    cardEl.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }

  /**
   * Build a level-dot indicator: filled dots up to current level.
   * e.g. levelDots(2, 4) → '●●○○'
   */
  function levelDots(current, max) {
    if (!max || max <= 0) return '';
    const c = Math.max(0, Math.min(Math.round(current ?? 0), max));
    return '●'.repeat(c) + '○'.repeat(max - c);
  }

  /**
   * Return level progress info for items that have upgrade levels.
   */
  function itemLevelInfo(item, ps) {
    if (!ps) return null;
    switch (item.id) {
      case 'weapon_up': return { level: ps.weaponLevel,                              max: 2 };
      case 'speed_up':  return { level: Math.round((ps.speedMult - 1.0) / 0.25),    max: 4 };
      case 'extra_life':return { level: ps.lives,                                    max: 5 };
      case 'shield':    return { level: ps.shield,                                   max: 1 };
      default:          return null;
    }
  }

  /**
   * Render 3 shop item cards into #shop-items.
   * @param {Array}  items  - Up to 3 items from shop.open()
   * @param {number} coins  - Current coin count
   * @param {Object} ps     - playerSnapshot from game._playerSnapshot()
   */
  function renderShopCards(items, coins, ps) {
    if (!shopItemsEl) return;
    shopItemsEl.innerHTML = '';

    for (const item of items) {
      const color     = item.color || '#ffcc00';
      const canAfford = coins >= item.cost;
      const lvInfo    = itemLevelInfo(item, ps);

      // Level dots HTML
      let levelHtml = '';
      if (lvInfo) {
        const dots = levelDots(lvInfo.level, lvInfo.max);
        levelHtml = `<div class="shop-card-level" style="color:${color}">${dots}</div>`;
      }

      const card = document.createElement('div');
      card.className = 'shop-card' + (canAfford ? '' : ' shop-card--disabled');
      card.style.setProperty('--card-color', color);
      card.dataset.itemId = item.id;

      const costLabel = item.cost === 0 ? 'FREE' : `¢ ${item.cost}`;
      card.innerHTML = `
        <div class="shop-card-body">
          <div class="shop-card-icon">${item.icon}</div>
          <div class="shop-card-label">${item.label}</div>
          ${levelHtml}
          <div class="shop-card-desc">${item.desc}</div>
        </div>
        <div class="shop-card-divider"></div>
        <div class="shop-card-footer">
          <div class="shop-card-cost">${costLabel}</div>
          <button class="shop-buy-btn" data-id="${item.id}" ${canAfford ? '' : 'disabled'}>Buy</button>
        </div>
      `;
      shopItemsEl.appendChild(card);
    }

    // Wire buy buttons
    shopItemsEl.querySelectorAll('.shop-buy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const ok = game.buyItem(btn.dataset.id);
        if (ok) {
          const card = btn.closest('.shop-card');
          if (card) {
            card.classList.remove('shop-card--disabled');
            card.classList.add('shop-card--bought');
            spawnFloatText(card, 'ACQUIRED');
          }
          btn.textContent = 'ACQUIRED';
          btn.classList.add('btn-acquired');
          btn.disabled = true;
          pulseCoins();
        }
      });
    });
  }

  const hud = {
    setScore(s) {
      if (hudScore) hudScore.textContent = String(s).padStart(6, '0');
    },
    setLives(n) {
      if (!hudLivesWrap) return;
      hudLivesWrap.innerHTML = '';
      // Support up to 5 lives
      for (let i = 0; i < Math.max(n, 3); i++) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 20 20');
        svg.setAttribute('width', '14');
        svg.setAttribute('height', '14');
        const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        poly.setAttribute('points', '10,1 14,16 10,12 6,16');
        poly.setAttribute('fill', i < n ? '#00ffcc' : '#333');
        poly.setAttribute('stroke', i < n ? '#00ffcc' : '#444');
        poly.setAttribute('stroke-width', '1');
        svg.appendChild(poly);
        hudLivesWrap.appendChild(svg);
      }
    },
    setWave(n) {
      if (hudWaveVal) hudWaveVal.textContent = String(n);
    },
    setCoins(n) {
      if (hudCoinsVal) hudCoinsVal.textContent = String(n);
    },
    setCombo(n) {
      if (!hudComboEl) return;
      if (n >= 2) {
        hudComboEl.style.display = 'flex';
        if (hudComboVal) hudComboVal.textContent = `×${n}`;
        // Brief pulse animation on increase
        hudComboEl.classList.remove('combo-pop');
        void hudComboEl.offsetWidth;
        hudComboEl.classList.add('combo-pop');
      } else {
        hudComboEl.style.display = 'none';
      }
    },
    showBanner(text, durationMs) {
      if (!gameBanner) return;
      clearTimeout(bannerTimeout);
      gameBanner.textContent   = text;
      gameBanner.style.opacity = '1';
      gameBanner.style.display = 'flex';
      bannerTimeout = setTimeout(() => {
        gameBanner.style.opacity = '0';
        setTimeout(() => { gameBanner.style.display = 'none'; }, 400);
      }, durationMs);
    },
    showGame() {
      if (gameHUD)    { gameHUD.style.display = 'flex'; }
      if (btnSave)    { btnSave.style.display = 'none'; }
      if (graphLegend){ graphLegend.style.display = 'none'; }
      if (graphTitle) { graphTitle.style.display = 'none'; }
      canvas.style.cursor = 'crosshair';
    },
    hideAll() {
      if (overlayEl)   { overlayEl.style.display = 'none'; }
      if (shopOverlay) { shopOverlay.style.display = 'none'; }
      if (gameBanner)  { gameBanner.style.display = 'none'; }
    },
    showExplore() {
      if (gameHUD)    { gameHUD.style.display = 'none'; }
      if (btnSave)    { btnSave.style.display = 'block'; }
      if (graphLegend){ graphLegend.style.display = 'flex'; }
      if (graphTitle) { graphTitle.style.display = 'block'; }
      if (nodeLossLog){ nodeLossLog.innerHTML = ''; }
      if (hudComboEl) { hudComboEl.style.display = 'none'; }
      const modEl = document.getElementById('hud-modifiers');
      if (modEl) modEl.innerHTML = '';
      canvas.style.cursor = 'default';
    },
    showOverlay(outcome, score, wave, preserved, total, highScore, isNewRecord) {
      if (!overlayEl) return;
      overlayEl.style.display = 'flex';
      const isVictory = outcome === 'VICTORY';
      if (overlayTitle) {
        overlayTitle.textContent = isVictory ? 'KNOWLEDGE SAVED' : 'KNOWLEDGE LOST';
        overlayTitle.style.textShadow = isVictory
          ? '0 0 40px rgba(0,255,204,0.7)'
          : '0 0 40px rgba(102,126,234,0.7)';
      }
      if (overlayScore) {
        overlayScore.textContent = `Wave ${wave ?? '?'}  ·  Score: ${String(score).padStart(6, '0')}`;
      }
      const nodesEl = document.getElementById('overlay-nodes');
      if (nodesEl && preserved != null) {
        nodesEl.textContent = `${preserved} / ${total} nodes preserved`;
        nodesEl.style.display = 'block';
      }
      // High score
      const hsEl = document.getElementById('overlay-highscore');
      if (hsEl) {
        const best = isNewRecord ? score : (highScore ?? 0);
        hsEl.textContent = `BEST  ${String(best).padStart(6, '0')}`;
        hsEl.style.display = 'block';
      }
      const nrEl = document.getElementById('overlay-newrecord');
      if (nrEl) nrEl.style.display = isNewRecord ? 'inline-block' : 'none';
      const continueBtn = document.getElementById('btn-victory-continue');
      if (continueBtn) continueBtn.style.display = isVictory ? 'inline-block' : 'none';
      if (btnPlayAgain) btnPlayAgain.style.display = isVictory ? 'none' : 'inline-block';
    },
    showShop(items, coins, wave, ps) {
      if (!shopOverlay) return;
      if (shopCoinsEl) shopCoinsEl.textContent = `¢ ${coins}`;
      if (shopWaveEl)  shopWaveEl.textContent  = wave != null ? `Wave ${wave}` : '';
      renderShopCards(items, coins, ps);
      shopOverlay.style.display = 'flex';
      if (gameHUD) gameHUD.style.display = 'none';
    },
    hideShop() {
      if (shopOverlay) shopOverlay.style.display = 'none';
    },
    updateShop(items, coins, ps) {
      if (shopCoinsEl) shopCoinsEl.textContent = `¢ ${coins}`;
      if (hudCoinsVal) hudCoinsVal.textContent = String(coins);
      renderShopCards(items, coins, ps);
    },
    showNodeLoss(label) {
      if (!nodeLossLog) return;
      const el = document.createElement('div');
      el.className = 'node-loss-entry';
      el.textContent = `▼ ${label}`;
      nodeLossLog.appendChild(el);
      el.addEventListener('animationend', () => el.remove());
    },
    setWeapon(label, color) {
      const badge = document.getElementById('hud-weapon-badge');
      if (!badge) return;
      badge.textContent = label;
      badge.style.color = color;
    },
    setModifiers(modSet) {
      const el = document.getElementById('hud-modifiers');
      if (!el) return;
      el.innerHTML = '';
      const defs = [
        { key: 'homing',    label: 'HOM', color: '#00ff88' },
        { key: 'piercing',  label: 'PRC', color: '#44ffff' },
        { key: 'explosive', label: 'EXP', color: '#ffaa44' },
        { key: 'wave',      label: 'WAV', color: '#aa44ff' },
      ];
      for (const d of defs) {
        if (modSet.has(d.key)) {
          const span = document.createElement('span');
          span.className = 'mod-badge';
          span.textContent = d.label;
          span.style.color = d.color;
          span.style.borderColor = d.color;
          span.style.textShadow = `0 0 6px ${d.color}88`;
          el.appendChild(span);
        }
      }
    },
  };

  // ── Game ──────────────────────────────────────────────────────────────────
  const game = new Game(
    () => ({ W, H }),
    renderer.nodes,
    renderer.links,
    hud
  );

  // ── Button wiring ─────────────────────────────────────────────────────────
  btnSave?.addEventListener('click', () => game.enter());

  document.getElementById('btn-abort')?.addEventListener('click', () => {
    game.exit();
    renderer.sim.alpha(0.1).restart();
  });

  btnExplore?.addEventListener('click', () => {
    game.exit();
    renderer.sim.alpha(0.1).restart();
  });

  btnPlayAgain?.addEventListener('click', () => {
    hud.hideAll();
    game.enter();
  });

  document.getElementById('btn-victory-continue')?.addEventListener('click', () => {
    hud.hideAll();
    game.continueArcade();
  });

  document.getElementById('btn-shop-skip')?.addEventListener('click', () => {
    game.resumeFromShop();
  });

  // ── Keyboard ──────────────────────────────────────────────────────────────
  const WEAPON_CYCLE = ['beam', 'spread', 'rapid', 'cannon'];

  window.addEventListener('keydown', e => {
    game.setKey(e.code, true);

    if (e.code === 'Escape' && game.state === 'PLAYING') {
      game.exit();
      renderer.sim.alpha(0.1).restart();
    }

    // F - toggle auto-fire (aim + fire follow WASD movement direction)
    if (e.code === 'KeyF' && game.state === 'PLAYING' && game.player) {
      game.player.autoFire = !game.player.autoFire;
      hud.showBanner(game.player.autoFire ? 'AUTO-FIRE ON' : 'AUTO-FIRE OFF', 1000);
    }

    // Q - cycle weapon type during gameplay
    if (e.code === 'KeyQ' && game.state === 'PLAYING' && game.player) {
      const idx  = WEAPON_CYCLE.indexOf(game.player.weaponType);
      const next = WEAPON_CYCLE[(idx + 1) % WEAPON_CYCLE.length];
      game.player.weaponType  = next;
      game.player.weaponLevel = 0;
      const spec = WEAPON_TYPES[next];
      if (game.hud.setWeapon) game.hud.setWeapon(spec.label, spec.color);
      game.hud.showBanner(spec.label, 900);
    }

    // Prevent page scroll during gameplay
    if (game.state === 'PLAYING' && ['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
      e.preventDefault();
    }
  });
  window.addEventListener('keyup', e => game.setKey(e.code, false));

  // ── Mouse ─────────────────────────────────────────────────────────────────
  // Aim tracking on window so it keeps working even when cursor hovers over HUD elements.
  window.addEventListener('mousemove', e => {
    game.setMouse(e.clientX, e.clientY);
    // Graph-mode hover only needs canvas-local events (handled below).
  });

  // Graph-specific interactions stay canvas-bound.
  canvas.addEventListener('mousemove', e => {
    renderer.onMouseMove(e, game.state, canvas);
  });

  canvas.addEventListener('mousedown', e => {
    renderer.onMouseDown(e, game.state);
    if (game.state === 'PLAYING' && e.button === 0) game.setFiring(true);
  });

  window.addEventListener('mouseup', e => {
    renderer.onMouseUp(e, game.state);
    if (e.button === 0) game.setFiring(false);
  });

  canvas.addEventListener('dblclick',   e => renderer.onDblClick(e, game.state));
  canvas.addEventListener('mouseleave', () => { renderer.clearHover(); });

  // ── Touch ─────────────────────────────────────────────────────────────────
  canvas.addEventListener('touchstart', e => renderer.onTouchStart(e, game.state), { passive: true });
  canvas.addEventListener('touchmove',  e => renderer.onTouchMove(e, game.state),  { passive: true });
  canvas.addEventListener('touchend',   e => renderer.onTouchEnd(e, game.state));

  // ── Resize ────────────────────────────────────────────────────────────────
  window.addEventListener('resize', () => {
    resize();
    renderer.updateDimensions(W, H);
    if (game.state === 'EXPLORE') renderer.sim.alpha(0.2).restart();
  });

  // ── Tooltip (explore mode only) ───────────────────────────────────────────
  const nodeLossLog = document.getElementById('node-loss-log');
  const tooltip   = document.getElementById('tooltip');
  const ttLabel   = document.getElementById('tt-label');
  const ttDesc    = document.getElementById('tt-desc');
  const ttType    = document.getElementById('tt-type');
  const ttHint    = document.getElementById('tt-hint');

  canvas.addEventListener('mousemove', e => {
    if (game.state !== 'EXPLORE') { tooltip.style.display = 'none'; return; }
    const hovered = renderer.getHoveredNode();
    if (hovered) {
      tooltip.style.display = 'block';
      ttType.textContent  = hovered.type;
      ttLabel.textContent = hovered.label;
      ttDesc.textContent  = hovered.description || '';
      if (ttHint) ttHint.textContent = hovered.url ? '→ click to open' : '';
      const tx = e.clientX + 16;
      const ty = e.clientY - 10;
      tooltip.style.left = Math.min(tx, W - 280) + 'px';
      tooltip.style.top  = ty + 'px';
    } else {
      tooltip.style.display = 'none';
    }
  });
  canvas.addEventListener('mouseleave', () => { tooltip.style.display = 'none'; });

  // ── Animation loop ────────────────────────────────────────────────────────
  let lastTs    = 0;
  let fadeStart = null;
  let fadeOpacity = 0;

  function loop(ts) {
    if (fadeStart === null) fadeStart = ts;
    fadeOpacity = Math.min(1, (ts - fadeStart) / 700);

    const dt = Math.min(ts - lastTs, 32); // cap at ~30fps equivalent to avoid spiral-of-death
    lastTs = ts;

    // Tick simulation (self-disables during game)
    if (game.state === 'EXPLORE' && renderer.sim.running) {
      renderer.tick(game.state);
    }

    // Draw graph layer (background + stars + nodes + links)
    renderer.draw(ctx, W, H, {
      fade:        fadeOpacity,
      gameMode:    game.state,
      activeNodes: game.activeNodes,
      activeLinks: game.activeLinks,
      nodeHp:      game.nodeHp,
      nodeFlash:   game.nodeFlash,
      nodeMaxHp:   game.nodeMaxHp,
    });

    // Draw game entities on top
    if (game.state !== 'EXPLORE') {
      game.update(dt);
      game.draw(ctx);
    }

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}
