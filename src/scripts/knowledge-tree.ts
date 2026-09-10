interface KnowledgeNode {
  id: string;
  title: string;
  type: 'article' | 'microessay' | 'question';
  url: string;
  date: string;
  updated?: string;
  description: string;
  branch?: string;
  status?: 'open' | 'in-progress' | 'answered';
}

type RelationType = 'includes' | 'partOf' | 'expands' | 'synthesizes' | 'reconsiders' | 'responds' | 'investigates' | 'tension' | 'related';
type TreeLinkType = RelationType | 'branch';
interface KnowledgeLink { source: string; target: string; type: RelationType; date: string }
interface KnowledgeBranch { id: string; title: string; description?: string; parentBranch?: string | null }
interface KnowledgeData { nodes: KnowledgeNode[]; links: KnowledgeLink[]; branches: KnowledgeBranch[] }
interface TreeNode { id: string; title: string; type: KnowledgeNode['type'] | 'branch'; date: string; branchId?: string; publication?: KnowledgeNode; count?: number }
interface TreeLink { source: string; target: string; type: TreeLinkType; date: string; original?: KnowledgeLink }
interface Point { x: number; y: number }
interface ViewState { x: number; y: number; scale: number }
interface PinchState { distance: number; scale: number; worldX: number; worldY: number }

const source = document.querySelector<HTMLScriptElement>('#graph-data');
const stage = document.querySelector<HTMLElement>('#map-stage');
const world = document.querySelector<HTMLElement>('#map-world');
const nodeLayer = document.querySelector<HTMLElement>('#map-nodes');
const linkLayer = document.querySelector<SVGSVGElement>('#map-links');
const rootBranches = document.querySelector<SVGGElement>('#map-root-branches');
const primaryBranches = document.querySelector<SVGGElement>('#map-primary-branches');
const secondaryLinks = document.querySelector<SVGGElement>('#map-secondary-links');
const rootMarker = document.querySelector<HTMLElement>('#map-root');
if (!source || !stage || !world || !nodeLayer || !linkLayer || !rootBranches || !primaryBranches || !secondaryLinks || !rootMarker) {
  throw new Error('Knowledge tree shell is incomplete.');
}

const data = JSON.parse(source.textContent || '{"nodes":[],"links":[],"branches":[]}') as KnowledgeData;
const search = document.querySelector<HTMLInputElement>('#map-search')!;
const month = document.querySelector<HTMLInputElement>('#map-month')!;
const monthOutput = document.querySelector<HTMLOutputElement>('#map-month-output')!;
const empty = document.querySelector<HTMLElement>('#map-empty')!;
const detail = document.querySelector<HTMLElement>('#map-detail')!;
const resetFocus = document.querySelector<HTMLButtonElement>('#map-reset-focus')!;
const countOutput = document.querySelector<HTMLElement>('#map-count')!;
const playButton = document.querySelector<HTMLButtonElement>('#map-play')!;
const locale = document.documentElement.lang === 'en' ? 'en' : 'es';
const typeNames = locale === 'en'
  ? { article: 'Article', microessay: 'Reflection', question: 'Question' }
  : { article: 'Artículo', microessay: 'Reflexión', question: 'Pregunta' };
const statusNames = locale === 'en'
  ? { open: 'open', 'in-progress': 'under investigation', answered: 'answered' }
  : { open: 'abierta', 'in-progress': 'en investigación', answered: 'respondida' };
const relationNames: Record<RelationType, string> = locale === 'en' ? {
  includes: 'includes', partOf: 'part of', expands: 'expands', synthesizes: 'synthesizes',
  reconsiders: 'reconsiders', responds: 'responds', investigates: 'investigates', tension: 'in tension', related: 'related',
} : {
  includes: 'incluye', partOf: 'forma parte de', expands: 'expande', synthesizes: 'sintetiza',
  reconsiders: 'reconsidera', responds: 'responde', investigates: 'investiga', tension: 'en tensión', related: 'relacionada',
};
const ui = locale === 'en' ? {
  publication: 'publication', publications: 'publications', branch: 'branch', branches: 'branches',
  treeLink: 'Branch', play: 'Watch it grow', pause: 'Pause growth',
} : {
  publication: 'publicación', publications: 'publicaciones', branch: 'rama', branches: 'ramas',
  treeLink: 'Rama', play: 'Ver cómo creció', pause: 'Pausar crecimiento',
};
const hierarchicalRelations = new Set<RelationType>(['includes', 'partOf', 'expands', 'synthesizes', 'reconsiders', 'responds', 'investigates']);
const branchesById = new Map(data.branches.map(branch => [branch.id, branch]));
const expandedBranches = new Set(data.branches.filter(branch => !branch.parentBranch).map(branch => branch.id));
let focus = new URLSearchParams(location.search).get('focus');
let playTimer = 0;
let view: ViewState = { x: 0, y: 0, scale: 1 };
let worldSize = { width: 1, height: 1 };
let drag: { pointerId: number; x: number; y: number; originX: number; originY: number } | null = null;
let pinch: PinchState | null = null;
let mobileAnchor: string | null = null;
let visiblePositions = new Map<string, Point>();
let visibleRoot: Point = { x: 0, y: 0 };
const activePointers = new Map<number, Point>();

function monthIndex(value: string | Date) {
  const date = typeof value === 'string' ? new Date(value) : value;
  return date.getUTCFullYear() * 12 + date.getUTCMonth();
}

function monthLabel(index: number) {
  const date = new Date(Date.UTC(Math.floor(index / 12), index % 12, 1));
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);
}

function neighborhood(id: string, depth = 2) {
  const found = new Map<string, number>([[id, 0]]);
  let frontier = [id];
  for (let level = 1; level <= depth; level += 1) {
    const next: string[] = [];
    for (const link of data.links) {
      if (frontier.includes(link.source) && !found.has(link.target)) { found.set(link.target, level); next.push(link.target); }
      if (frontier.includes(link.target) && !found.has(link.source)) { found.set(link.source, level); next.push(link.source); }
    }
    frontier = next;
  }
  return found;
}

function growthDirection(link: TreeLink): [string, string] {
  if (link.type === 'branch') return [link.source, link.target];
  if (link.type === 'includes') return [link.source, link.target];
  if (link.type === 'partOf') return [link.target, link.source];
  return [link.target, link.source];
}

function createsCycle(child: string, parent: string, parents: Map<string, string>) {
  let cursor: string | undefined = parent;
  while (cursor) {
    if (cursor === child) return true;
    cursor = parents.get(cursor);
  }
  return false;
}

function primaryTree(nodes: TreeNode[], links: TreeLink[]) {
  const ids = new Set(nodes.map(node => node.id));
  const parents = new Map<string, string>();
  const primary = new Set<TreeLink>();
  const priority: Record<TreeLinkType, number> = {
    investigates: 0, responds: 0, includes: 1, partOf: 1, expands: 2, synthesizes: 2,
    reconsiders: 2, branch: 8, tension: 9, related: 9,
  };
  const candidates = links
    .filter(link => link.type === 'branch' || hierarchicalRelations.has(link.type))
    .sort((a, b) => priority[a.type] - priority[b.type] || Date.parse(a.date) - Date.parse(b.date));
  for (const link of candidates) {
    const [parent, child] = growthDirection(link);
    if (!ids.has(parent) || !ids.has(child) || parents.has(child) || createsCycle(child, parent, parents)) continue;
    parents.set(child, parent); primary.add(link);
  }
  const children = new Map<string, string[]>();
  for (const [child, parent] of parents) children.set(parent, [...(children.get(parent) || []), child]);
  const nodesById = new Map(nodes.map(node => [node.id, node]));
  const compareNodes = (a: string, b: string) => {
    const first = nodesById.get(a); const second = nodesById.get(b);
    return Date.parse(first?.date || '') - Date.parse(second?.date || '') || (first?.title || '').localeCompare(second?.title || '', locale);
  };
  for (const siblings of children.values()) siblings.sort(compareNodes);
  const roots = nodes.filter(node => !parents.has(node.id)).sort((a, b) => compareNodes(a.id, b.id)).map(node => node.id);
  return { parents, children, roots, primary };
}

function layoutTree(nodes: TreeNode[], links: TreeLink[]) {
  const tree = primaryTree(nodes, links);
  const leafCounts = new Map<string, number>();
  const depths = new Map<string, number>();
  const countLeaves = (id: string): number => {
    const descendants = tree.children.get(id) || [];
    const count = descendants.length ? descendants.reduce((sum, child) => sum + countLeaves(child), 0) : 1;
    leafCounts.set(id, count); return count;
  };
  tree.roots.forEach(countLeaves);
  let maxDepth = 1;
  const setDepth = (id: string, depth: number) => {
    depths.set(id, depth); maxDepth = Math.max(maxDepth, depth);
    (tree.children.get(id) || []).forEach(child => setDepth(child, depth + 1));
  };
  tree.roots.forEach(root => setDepth(root, 1));
  const totalLeaves = Math.max(1, tree.roots.reduce((sum, root) => sum + (leafCounts.get(root) || 1), 0));
  const stageBounds = stage.getBoundingClientRect();
  const width = Math.max(stageBounds.width, totalLeaves * 230 + 180, 760);
  const height = Math.max(stageBounds.height, (maxDepth + 1) * 165 + 150, 560);
  const positions = new Map<string, Point>();
  const marginX = 115;
  const availableWidth = width - marginX * 2;
  let leafCursor = 0;
  const levelGap = Math.min(190, (height - 180) / (maxDepth + .35));
  const baseY = height - 68;
  const place = (id: string): number => {
    const descendants = tree.children.get(id) || [];
    let x: number;
    if (!descendants.length) {
      x = marginX + ((leafCursor + .5) / totalLeaves) * availableWidth; leafCursor += 1;
    } else {
      const childPositions = descendants.map(place);
      x = childPositions.reduce((sum, value) => sum + value, 0) / childPositions.length;
    }
    positions.set(id, { x, y: baseY - (depths.get(id) || 1) * levelGap });
    return x;
  };
  tree.roots.forEach(place);
  return { ...tree, positions, width, height, root: { x: width / 2, y: baseY }, maxDepth, depths };
}

function branchPath(start: Point, end: Point) {
  const bend = Math.max(34, Math.abs(start.y - end.y) * .52);
  return `M ${start.x} ${start.y} C ${start.x} ${start.y - bend}, ${end.x} ${end.y + bend}, ${end.x} ${end.y}`;
}

function threadPath(start: Point, end: Point) {
  const lift = Math.min(90, Math.max(32, Math.abs(end.x - start.x) * .18));
  return `M ${start.x} ${start.y} Q ${(start.x + end.x) / 2} ${Math.min(start.y, end.y) - lift}, ${end.x} ${end.y}`;
}

function svgPath(group: SVGGElement, pathData: string, className: string, label?: string) {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', pathData); path.setAttribute('class', className);
  if (label) {
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = label; path.append(title);
  }
  group.append(path);
}

function applyView() { world.style.transform = `translate(${view.x}px, ${view.y}px) scale(${view.scale})`; }

function compactViewport() { return matchMedia('(max-width: 760px)').matches; }

function fitView(anchorId?: string | null) {
  const bounds = stage.getBoundingClientRect();
  const fittedScale = Math.min(1, (bounds.width - 28) / worldSize.width, (bounds.height - 28) / worldSize.height);
  if (compactViewport()) {
    const scale = Math.max(.84, fittedScale);
    const anchor = (anchorId && visiblePositions.get(anchorId)) || visibleRoot;
    const targetY = anchorId ? bounds.height * .58 : bounds.height - 52;
    view = { scale, x: bounds.width / 2 - anchor.x * scale, y: targetY - anchor.y * scale };
  } else {
    view = { scale: fittedScale, x: (bounds.width - worldSize.width * fittedScale) / 2, y: (bounds.height - worldSize.height * fittedScale) / 2 };
  }
  applyView();
}

function zoomAt(nextScale: number, clientX?: number, clientY?: number) {
  const bounds = stage.getBoundingClientRect();
  const x = (clientX ?? bounds.left + bounds.width / 2) - bounds.left;
  const y = (clientY ?? bounds.top + bounds.height / 2) - bounds.top;
  const scale = Math.max(.45, Math.min(2.5, nextScale));
  const worldX = (x - view.x) / view.scale; const worldY = (y - view.y) / view.scale;
  view = { scale, x: x - worldX * scale, y: y - worldY * scale }; applyView();
}

function showDetail(node: KnowledgeNode) {
  const connections = data.links.filter(link => link.source === node.id || link.target === node.id);
  detail.hidden = false;
  document.querySelector('#map-detail-kind')!.textContent = `${typeNames[node.type]}${node.status ? ` · ${statusNames[node.status]}` : ''}`;
  document.querySelector('#map-detail-title')!.textContent = node.title;
  document.querySelector('#map-detail-description')!.textContent = node.description;
  document.querySelector('#map-detail-date')!.textContent = new Date(node.date).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
  document.querySelector('#map-detail-links')!.textContent = String(connections.length);
  const relations = document.querySelector<HTMLElement>('#map-detail-relations')!;
  relations.replaceChildren(...connections.map(link => {
    const chip = document.createElement('span'); chip.textContent = relationNames[link.type]; return chip;
  }));
  (document.querySelector('#map-detail-open') as HTMLAnchorElement).href = node.url;
}

const branchNodeId = (id: string) => `branch:${id}`;

function branchLineage(id?: string) {
  const lineage: string[] = [];
  let cursor = id;
  while (cursor && branchesById.has(cursor)) {
    lineage.push(cursor);
    cursor = branchesById.get(cursor)?.parentBranch || undefined;
  }
  return lineage;
}

function publicationBelongsTo(node: KnowledgeNode, branchId: string) {
  return branchLineage(node.branch).includes(branchId);
}

function render({ preserveView = false }: { preserveView?: boolean } = {}) {
  const query = search.value.trim().toLocaleLowerCase(locale);
  const enabled = new Set([...document.querySelectorAll<HTMLInputElement>('[data-type]:checked')].map(input => input.dataset.type));
  const cutoff = Number(month.value);
  monthOutput.value = monthLabel(cutoff);
  month.setAttribute('aria-valuetext', monthOutput.value);
  const neighborDepth = focus ? neighborhood(focus) : null;
  const eligibleNodes = data.nodes.filter(node => enabled.has(node.type) && monthIndex(node.date) <= cutoff);
  const directMatches = new Set(eligibleNodes.filter(node => !query || `${node.title} ${node.description}`.toLocaleLowerCase(locale).includes(query)).map(node => node.id));
  const matchingBranches = new Set(data.branches.filter(branch => query && `${branch.title} ${branch.description || ''}`.toLocaleLowerCase(locale).includes(query)).map(branch => branch.id));
  const branchMatches = eligibleNodes.filter(node => [...matchingBranches].some(branchId => publicationBelongsTo(node, branchId))).map(node => node.id);
  const matches = new Set([...directMatches, ...branchMatches]);
  const searchContext = query ? new Set([...matches].flatMap(id => [...neighborhood(id, 1).keys()])) : null;
  let nodes = eligibleNodes.filter(node => !searchContext || searchContext.has(node.id));
  if (neighborDepth) nodes = nodes.filter(node => neighborDepth.has(node.id));
  if (focus && !nodes.some(node => node.id === focus)) {
    focus = null;
    detail.hidden = true;
    history.replaceState(null, '', location.pathname);
  }
  const nodesToReveal = nodes.filter(node => query || node.id === focus);
  for (const node of nodesToReveal) branchLineage(node.branch).forEach(branchId => expandedBranches.add(branchId));

  const activeBranchIds = new Set(nodes.flatMap(node => branchLineage(node.branch)));
  const branchIsVisible = (id: string): boolean => {
    const parent = branchesById.get(id)?.parentBranch;
    return !parent || (activeBranchIds.has(parent) && expandedBranches.has(parent) && branchIsVisible(parent));
  };
  const visibleBranches = data.branches.filter(branch => activeBranchIds.has(branch.id) && branchIsVisible(branch.id));
  const visibleBranchIds = new Set(visibleBranches.map(branch => branch.id));
  const visiblePublications = nodes.filter(node => !node.branch || (visibleBranchIds.has(node.branch) && expandedBranches.has(node.branch)));
  const visiblePublicationIds = new Set(visiblePublications.map(node => node.id));
  const treeNodes: TreeNode[] = [
    ...visibleBranches.map(branch => ({
      id: branchNodeId(branch.id), title: branch.title, type: 'branch' as const, date: '', branchId: branch.id,
      count: nodes.filter(node => publicationBelongsTo(node, branch.id)).length,
    })),
    ...visiblePublications.map(node => ({ id: node.id, title: node.title, type: node.type, date: node.date, publication: node })),
  ];
  const visibleRelations = data.links.filter(link => visiblePublicationIds.has(link.source) && visiblePublicationIds.has(link.target) && monthIndex(link.date) <= cutoff);
  const treeLinks: TreeLink[] = [
    ...visibleBranches.flatMap(branch => branch.parentBranch && visibleBranchIds.has(branch.parentBranch)
      ? [{ source: branchNodeId(branch.parentBranch), target: branchNodeId(branch.id), type: 'branch' as const, date: '' }]
      : []),
    ...visiblePublications.flatMap(node => node.branch && visibleBranchIds.has(node.branch)
      ? [{ source: branchNodeId(node.branch), target: node.id, type: 'branch' as const, date: node.date }]
      : []),
    ...visibleRelations.map(link => ({ ...link, original: link })),
  ];
  const layout = layoutTree(treeNodes, treeLinks);
  worldSize = { width: layout.width, height: layout.height };
  visiblePositions = layout.positions;
  visibleRoot = layout.root;
  world.style.width = `${layout.width}px`; world.style.height = `${layout.height}px`;
  linkLayer.setAttribute('viewBox', `0 0 ${layout.width} ${layout.height}`);
  rootMarker.style.left = `${layout.root.x}px`; rootMarker.style.top = `${layout.root.y}px`;
  nodeLayer.replaceChildren(); rootBranches.replaceChildren(); primaryBranches.replaceChildren(); secondaryLinks.replaceChildren();
  layout.roots.forEach((rootId, index) => {
    const end = layout.positions.get(rootId); if (!end) return;
    const rootTop = { x: layout.root.x, y: layout.root.y - 11 };
    svgPath(rootBranches, branchPath(rootTop, end), '');
    const last = rootBranches.lastElementChild as SVGPathElement | null;
    last?.style.setProperty('stroke-width', `${Math.max(2.5, 7 - index * .35)}`);
  });
  for (const link of treeLinks) {
    const [parent, child] = growthDirection(link);
    const start = layout.positions.get(parent); const end = layout.positions.get(child);
    if (!start || !end) continue;
    const muted = Boolean(focus && link.type !== 'branch' && parent !== focus && child !== focus);
    const label = link.type === 'branch' ? ui.treeLink : relationNames[link.type];
    if (layout.primary.has(link)) {
      svgPath(primaryBranches, branchPath(start, end), `${link.type === 'branch' ? 'taxonomy' : 'relation'}${muted ? ' muted' : ''}`, label);
      const branch = primaryBranches.lastElementChild as SVGPathElement | null;
      branch?.style.setProperty('stroke-width', String(Math.max(2, 5 - (layout.depths.get(child) || 1) * .55)));
    } else svgPath(secondaryLinks, threadPath(start, end), `${link.type}${muted ? ' muted' : ''}`, label);
  }
  for (const node of treeNodes) {
    const position = layout.positions.get(node.id)!;
    const button = document.createElement('button');
    button.type = 'button';
    button.style.left = `${position.x}px`; button.style.top = `${position.y}px`;
    if (node.type === 'branch') {
      const branchId = node.branchId!;
      const expanded = expandedBranches.has(branchId);
      const label = document.createElement('span'); label.textContent = node.title;
      const total = document.createElement('small'); total.textContent = `${node.count} ${node.count === 1 ? ui.publication : ui.publications} · ${expanded ? '−' : '+'}`;
      button.className = `branch-node ${expanded ? 'expanded' : 'collapsed'}${matchingBranches.has(branchId) ? ' match' : ''}`;
      button.replaceChildren(label, total);
      button.setAttribute('aria-expanded', String(expanded));
      button.setAttribute('aria-label', `${node.title}, ${total.textContent}`);
      button.addEventListener('click', () => {
        if (expanded) expandedBranches.delete(branchId); else expandedBranches.add(branchId);
        mobileAnchor = branchNodeId(branchId);
        render();
      });
    } else {
      const publication = node.publication!;
      const muted = Boolean(focus && publication.id !== focus && (neighborDepth?.get(publication.id) || 0) > 1);
      button.className = [publication.type, publication.id === focus && 'selected', muted && 'muted', query && matches.has(publication.id) && 'match'].filter(Boolean).join(' ');
      button.textContent = publication.title;
      button.setAttribute('aria-label', `${typeNames[publication.type]}: ${publication.title}`);
      button.addEventListener('click', () => {
        if (focus === publication.id) { location.href = publication.url; return; }
        focus = publication.id; history.replaceState(null, '', `${location.pathname}?focus=${encodeURIComponent(publication.id)}`);
        mobileAnchor = publication.id;
        showDetail(publication); render();
      });
    }
    nodeLayer.append(button);
  }
  empty.hidden = treeNodes.length > 0; rootMarker.hidden = treeNodes.length === 0;
  countOutput.textContent = `${nodes.length} ${nodes.length === 1 ? ui.publication : ui.publications} · ${activeBranchIds.size} ${activeBranchIds.size === 1 ? ui.branch : ui.branches}`;
  resetFocus.hidden = !focus; playButton.disabled = month.min === month.max;
  if (!preserveView) requestAnimationFrame(() => {
    const searchAnchor = query
      ? treeNodes.find(node => node.type === 'branch' ? matchingBranches.has(node.branchId!) : matches.has(node.id))?.id
      : null;
    fitView(mobileAnchor || searchAnchor);
    mobileAnchor = null;
  });
}

search.addEventListener('input', () => render());
document.querySelectorAll<HTMLInputElement>('[data-type]').forEach(input => input.addEventListener('change', () => render()));
month.addEventListener('input', () => render());
resetFocus.addEventListener('click', () => { focus = null; detail.hidden = true; history.replaceState(null, '', location.pathname); render(); });
document.querySelector('#map-close-detail')?.addEventListener('click', () => { detail.hidden = true; });
playButton.addEventListener('click', () => {
  if (playTimer) { window.clearInterval(playTimer); playTimer = 0; playButton.textContent = ui.play; return; }
  month.value = month.min; render(); playButton.textContent = ui.pause;
  playTimer = window.setInterval(() => {
    if (Number(month.value) >= Number(month.max)) { window.clearInterval(playTimer); playTimer = 0; playButton.textContent = ui.play; return; }
    month.value = String(Number(month.value) + 1); render();
  }, 650);
});
document.querySelector('#map-zoom-in')?.addEventListener('click', () => zoomAt(view.scale * 1.2));
document.querySelector('#map-zoom-out')?.addEventListener('click', () => zoomAt(view.scale / 1.2));
document.querySelector('#map-fit')?.addEventListener('click', () => fitView());
stage.addEventListener('wheel', event => { event.preventDefault(); zoomAt(view.scale * (event.deltaY < 0 ? 1.12 : .89), event.clientX, event.clientY); }, { passive: false });
stage.addEventListener('pointerdown', event => {
  if ((event.target as HTMLElement).closest('button, a, input')) return;
  activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  stage.setPointerCapture(event.pointerId);
  if (activePointers.size === 1) {
    drag = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, originX: view.x, originY: view.y };
    stage.classList.add('dragging');
  } else if (activePointers.size === 2) {
    const [first, second] = [...activePointers.values()];
    const bounds = stage.getBoundingClientRect();
    const midpoint = { x: (first.x + second.x) / 2 - bounds.left, y: (first.y + second.y) / 2 - bounds.top };
    pinch = {
      distance: Math.hypot(second.x - first.x, second.y - first.y),
      scale: view.scale,
      worldX: (midpoint.x - view.x) / view.scale,
      worldY: (midpoint.y - view.y) / view.scale,
    };
    drag = null;
  }
});
stage.addEventListener('pointermove', event => {
  if (!activePointers.has(event.pointerId)) return;
  activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  if (activePointers.size === 2 && pinch) {
    const [first, second] = [...activePointers.values()];
    const bounds = stage.getBoundingClientRect();
    const midpoint = { x: (first.x + second.x) / 2 - bounds.left, y: (first.y + second.y) / 2 - bounds.top };
    const distance = Math.max(1, Math.hypot(second.x - first.x, second.y - first.y));
    const scale = Math.max(.45, Math.min(2.5, pinch.scale * distance / Math.max(1, pinch.distance)));
    view = { scale, x: midpoint.x - pinch.worldX * scale, y: midpoint.y - pinch.worldY * scale };
    applyView();
  } else if (drag?.pointerId === event.pointerId) {
    view.x = drag.originX + event.clientX - drag.x; view.y = drag.originY + event.clientY - drag.y; applyView();
  }
});
const finishDrag = (event: PointerEvent) => {
  activePointers.delete(event.pointerId);
  pinch = null;
  if (activePointers.size === 1) {
    const [pointerId, point] = [...activePointers.entries()][0];
    drag = { pointerId, x: point.x, y: point.y, originX: view.x, originY: view.y };
  } else {
    drag = null;
    stage.classList.remove('dragging');
  }
};
stage.addEventListener('pointerup', finishDrag); stage.addEventListener('pointercancel', finishDrag);
window.addEventListener('keydown', event => {
  if (event.key !== 'Escape' || !focus) return;
  focus = null; detail.hidden = true; history.replaceState(null, '', location.pathname); render();
});
window.addEventListener('resize', () => render());
if (focus) { const node = data.nodes.find(candidate => candidate.id === focus); if (node) showDetail(node); else focus = null; }
render();
