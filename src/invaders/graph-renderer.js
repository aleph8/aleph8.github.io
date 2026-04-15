/**
 * graph-renderer.js
 * Extracted from graph.astro. Owns the force simulation, star field,
 * node/link drawing, and hover/drag interaction.
 *
 * Usage:
 *   const renderer = createGraphRenderer(data, W, H);
 *   renderer.prewarm(280);
 *   // in loop:
 *   renderer.tick(gameMode);
 *   renderer.draw(ctx, W, H, drawOpts);
 */

export function createGraphRenderer(data, W, H) {

  // ── Node appearance ──────────────────────────────────────────────────────
  const nodeConfig = {
    post:    { r: 9,  color: getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim() || '#667eea', glow: getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim() || '#667eea' },
    doc:     { r: 6,  color: '#a5b4fc', glow: '#a5b4fc' },
    project: { r: 14, color: '#ffffff', glow: '#ffffff' },
    tag:     { r: 4,  color: '#3d3d3d', glow: null, stroke: '#666' },
  };

  // ── Star field ───────────────────────────────────────────────────────────
  const stars = Array.from({ length: 180 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 1.2 + 0.2,
    a: Math.random() * 0.5 + 0.1,
  }));

  // ── Build node + link arrays ──────────────────────────────────────────────
  const nodeMap = {};
  const total   = data.nodes.length;
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  const nodes = data.nodes.map((n, i) => {
    const radius = 80 + Math.sqrt(i / total) * Math.min(W, H) * 0.38;
    const angle  = i * goldenAngle;
    const obj    = {
      ...n,
      x: W / 2 + Math.cos(angle) * radius,
      y: H / 2 + Math.sin(angle) * radius,
      vx: 0, vy: 0,
      pinned: false,
    };
    nodeMap[n.id] = obj;
    return obj;
  });

  const links = data.links
    .map(l => ({ source: nodeMap[l.source], target: nodeMap[l.target] }))
    .filter(l => l.source && l.target);

  // Build adjacency set for hover highlight
  const adjacency = {};
  for (const l of links) {
    (adjacency[l.source.id] = adjacency[l.source.id] || new Set()).add(l.target.id);
    (adjacency[l.target.id] = adjacency[l.target.id] || new Set()).add(l.source.id);
  }

  // ── Force simulation ─────────────────────────────────────────────────────
  const sim = {
    _alpha:    1,
    alphaDecay: 0.018,
    running:   true,
    alpha(v)   { this._alpha = v; return this; },
    restart()  { this.running = true; return this; },
  };

  function tick(gameMode = 'EXPLORE') {
    if (gameMode !== 'EXPLORE') return; // freeze during game

    const a = sim._alpha;
    if (a < 0.001) { sim.running = false; return; }
    sim._alpha *= (1 - sim.alphaDecay);

    const cx = W / 2, cy = H / 2;

    for (const n of nodes) {
      n.vx += (cx - n.x) * 0.04 * 0.03;
      n.vy += (cy - n.y) * 0.04 * 0.03;
    }

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = b.x - a.x, dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        if (dist < 60) {
          const force = (60 - dist) / dist * 0.5;
          a.vx -= dx * force; a.vy -= dy * force;
          b.vx += dx * force; b.vy += dy * force;
        }
      }
    }

    for (const l of links) {
      const dx = l.target.x - l.source.x;
      const dy = l.target.y - l.source.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const f = (dist - 100) / dist * 0.06;
      l.source.vx += dx * f; l.source.vy += dy * f;
      l.target.vx -= dx * f; l.target.vy -= dy * f;
    }

    for (const n of nodes) {
      if (n === dragging || n.pinned) continue;
      n.vx *= 0.75; n.vy *= 0.75;
      n.x  += n.vx; n.y  += n.vy;
      n.x = Math.max(30, Math.min(W - 30, n.x));
      n.y = Math.max(30, Math.min(H - 30, n.y));
    }
  }

  function prewarm(ticks) {
    for (let i = 0; i < ticks; i++) tick('EXPLORE');
    sim._alpha  = 0.08;
    sim.running = true;
  }

  // ── Interaction state ─────────────────────────────────────────────────────
  let hoveredNode = null;
  let dragging    = null;
  let dragOffX    = 0, dragOffY = 0;
  let _dragStart  = null;
  let _touchStart = null;

  function getNodeAt(mx, my) {
    for (const n of nodes) {
      const cfg = nodeConfig[n.type] || nodeConfig.tag;
      const dx = n.x - mx, dy = n.y - my;
      if (dx * dx + dy * dy < (cfg.r + 8) * (cfg.r + 8)) return n;
    }
    return null;
  }

  function onMouseMove(e, gameMode, canvas) {
    if (gameMode !== 'EXPLORE') { hoveredNode = null; return; }
    if (dragging) {
      dragging.x = e.clientX + dragOffX;
      dragging.y = e.clientY + dragOffY;
      canvas.style.cursor = 'grabbing';
      return;
    }
    hoveredNode = getNodeAt(e.clientX, e.clientY);
    canvas.style.cursor = hoveredNode ? (hoveredNode.url ? 'pointer' : 'grab') : 'default';
  }

  function onMouseDown(e, gameMode) {
    if (gameMode !== 'EXPLORE') return;
    _dragStart = { x: e.clientX, y: e.clientY };
    const n = getNodeAt(e.clientX, e.clientY);
    if (n) {
      dragging = n;
      dragOffX = n.x - e.clientX;
      dragOffY = n.y - e.clientY;
      sim.running = true;
      sim._alpha  = 0.05;
    }
  }

  function onMouseUp(e, gameMode) {
    if (gameMode !== 'EXPLORE' || !dragging) return;
    const dx = e.clientX - (_dragStart?.x ?? e.clientX);
    const dy = e.clientY - (_dragStart?.y ?? e.clientY);
    if (dx * dx + dy * dy > 16) {
      dragging.pinned = true;
      dragging.vx = 0;
      dragging.vy = 0;
    } else if (dragging.url) {
      window.location.href = dragging.url;
    }
    dragging = null;
  }

  function onDblClick(e, gameMode) {
    if (gameMode !== 'EXPLORE') return;
    const n = getNodeAt(e.clientX, e.clientY);
    if (n?.pinned) {
      n.pinned    = false;
      sim._alpha  = 0.05;
      sim.running = true;
    }
  }

  function onTouchStart(e, gameMode) {
    if (gameMode !== 'EXPLORE') return;
    const t = e.touches[0];
    _touchStart = { x: t.clientX, y: t.clientY };
    const n = getNodeAt(t.clientX, t.clientY);
    if (n) {
      dragging = n;
      dragOffX = n.x - t.clientX;
      dragOffY = n.y - t.clientY;
    }
  }

  function onTouchMove(e, gameMode) {
    if (gameMode !== 'EXPLORE' || !dragging) return;
    const t = e.touches[0];
    dragging.x = t.clientX + dragOffX;
    dragging.y = t.clientY + dragOffY;
  }

  function onTouchEnd(e, gameMode) {
    if (gameMode !== 'EXPLORE' || !dragging) return;
    const t = e.changedTouches[0];
    const moved = _touchStart && (
      (t.clientX - _touchStart.x) ** 2 + (t.clientY - _touchStart.y) ** 2 > 16
    );
    if (moved) {
      dragging.pinned = true;
      dragging.vx = 0;
      dragging.vy = 0;
    } else if (dragging.url) {
      window.location.href = dragging.url;
    }
    dragging = null;
  }

  // ── Draw ──────────────────────────────────────────────────────────────────
  /**
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} W
   * @param {number} H
   * @param {Object} opts
   * @param {number}   opts.fade          - global opacity 0..1
   * @param {string}   opts.gameMode      - 'EXPLORE'|'PLAYING'|'GAME_OVER'|'VICTORY'
   * @param {Array}    opts.activeNodes   - live nodes during game (null = all)
   * @param {Array}    opts.activeLinks   - live links during game (null = all)
   * @param {Map}      opts.nodeHp        - node id → current HP
   * @param {Map}      opts.nodeFlash     - node id → flash timer ms
   * @param {Map}      opts.nodeMaxHp     - node id → max HP
   */
  function draw(ctx, W, H, opts = {}) {
    const {
      fade       = 1,
      gameMode   = 'EXPLORE',
      activeNodes = null,
      activeLinks = null,
      nodeHp      = null,
      nodeFlash   = null,
      nodeMaxHp   = null,
    } = opts;

    const inGame    = gameMode !== 'EXPLORE';
    const drawNodes = inGame && activeNodes ? activeNodes : nodes;
    const drawLinks = inGame && activeLinks ? activeLinks : links;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.globalAlpha = fade;

    // Stars
    for (const s of stars) {
      ctx.beginPath();
      ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${s.a})`;
      ctx.fill();
    }

    // Links
    const hovered   = inGame ? null : hoveredNode;
    for (const l of drawLinks) {
      if (!l.source || !l.target) continue;
      const isHighlighted = hovered && (l.source === hovered || l.target === hovered);
      const isFaded       = hovered && !isHighlighted;
      ctx.beginPath();
      ctx.moveTo(l.source.x, l.source.y);
      ctx.lineTo(l.target.x, l.target.y);
      ctx.strokeStyle = inGame
        ? 'rgba(255,255,255,0.04)'
        : isFaded
          ? 'rgba(255,255,255,0.02)'
          : isHighlighted
            ? 'rgba(102,126,234,0.5)'
            : 'rgba(255,255,255,0.06)';
      ctx.lineWidth = isHighlighted ? 1.5 : 0.8;
      ctx.stroke();
    }

    // Nodes
    const neighbors = hovered ? adjacency[hovered.id] : null;

    for (const n of drawNodes) {
      const cfg       = nodeConfig[n.type] || nodeConfig.tag;
      const isSelf    = n === hovered;
      const isNeighbor = neighbors && neighbors.has(n.id);
      const isFaded   = hovered && !isSelf && !isNeighbor;
      const r         = isSelf ? cfg.r * 1.4 : cfg.r;

      ctx.save();
      ctx.globalAlpha = isFaded ? 0.15 : 1;

      // Damage tint during game
      let nodeColor = cfg.color;
      if (inGame && nodeHp && nodeMaxHp) {
        const hp     = nodeHp.get(n.id) ?? 0;
        const maxHp  = nodeMaxHp.get(n.id) ?? 1;
        const ratio  = hp / maxHp;          // 1 = full health, 0 = dead
        if (ratio < 1) {
          nodeColor = lerpColor(cfg.color, '#ff4444', 1 - ratio);
        }
        if (nodeFlash && nodeFlash.get(n.id) > 0) {
          nodeColor = '#ffffff';
        }
      }

      if (cfg.glow) {
        ctx.shadowColor = nodeColor;
        ctx.shadowBlur  = isSelf ? 20 : 8;
      }

      ctx.beginPath();
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      ctx.fillStyle = nodeColor;
      ctx.fill();

      if (cfg.stroke) {
        ctx.strokeStyle = cfg.stroke;
        ctx.lineWidth   = 1;
        ctx.stroke();
      }

      ctx.shadowBlur = 0;

      // Pin ring
      if (n.pinned && !isFaded && !inGame) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, r + 4, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,255,255,0.18)';
        ctx.lineWidth   = 1;
        ctx.stroke();
      }

      // Node labels
      if (isSelf || n.type === 'project') {
        ctx.font      = `${n.type === 'project' ? 500 : 400} 13px 'JetBrains Mono', monospace`;
        ctx.fillStyle = isSelf ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.7)';
        ctx.textAlign = 'center';
        const label   = n.label.length > 28 ? n.label.slice(0, 26) + '…' : n.label;
        ctx.fillText(label, n.x, n.y + r + 14);
      }

      ctx.restore();
    }

    ctx.restore(); // end global fade
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  function lerpColor(hex1, hex2, t) {
    const p = (h) => parseInt(h.slice(1), 16);
    const c1 = p(hex1), c2 = p(hex2);
    const r = Math.round(((c1 >> 16) & 0xff) * (1 - t) + ((c2 >> 16) & 0xff) * t);
    const g = Math.round(((c1 >>  8) & 0xff) * (1 - t) + ((c2 >>  8) & 0xff) * t);
    const b = Math.round(((c1      ) & 0xff) * (1 - t) + ((c2      ) & 0xff) * t);
    return `rgb(${r},${g},${b})`;
  }

  function updateDimensions(newW, newH) {
    W = newW; H = newH;
  }

  return {
    nodes,
    links,
    adjacency,
    nodeConfig,
    sim,
    tick,
    draw,
    prewarm,
    getNodeAt,
    updateDimensions,
    getHoveredNode: () => hoveredNode,
    clearHover:     () => { hoveredNode = null; },
    // Interaction handlers (pass gameMode so they self-disable during game)
    onMouseMove,
    onMouseDown,
    onMouseUp,
    onDblClick,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
}
