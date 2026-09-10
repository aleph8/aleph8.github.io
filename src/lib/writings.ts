import { getCollection, type CollectionEntry } from 'astro:content';

export type Writing = CollectionEntry<'posts'>;
export type WritingType = Writing['data']['type'];
export type RelationType = Writing['data']['relations'][number]['type'];
export type Locale = 'es' | 'en';

export interface Concept {
  key: string;
  es?: Writing;
  en?: Writing;
}

export interface ConceptEdge {
  source: string;
  target: string;
  type: RelationType;
  date: Date;
}

export interface WritingGraph {
  concepts: Map<string, Concept>;
  edges: ConceptEdge[];
}

export interface ResolvedRelation {
  type: RelationType;
  direction: 'outgoing' | 'incoming';
  writing: Writing;
  fallbackLocale: boolean;
  date: Date;
}

const inverseLabels: Record<RelationType, [string, string]> = {
  includes: ['Incluye ↓', 'Forma parte de ↑'],
  partOf: ['Forma parte de ↑', 'Incluye ↓'],
  expands: ['Expande', 'Expandido por'],
  synthesizes: ['Sintetiza', 'Sintetizado en'],
  reconsiders: ['Reconsidera', 'Reconsiderado en'],
  responds: ['Responde a', 'Respondido por'],
  investigates: ['Investiga', 'Investigada en'],
  tension: ['En tensión con', 'En tensión con'],
  related: ['Relacionado con', 'Relacionado con'],
};

const inverseLabelsEn: Record<RelationType, [string, string]> = {
  includes: ['Includes ↓', 'Part of ↑'],
  partOf: ['Part of ↑', 'Includes ↓'],
  expands: ['Expands', 'Expanded by'],
  synthesizes: ['Synthesizes', 'Synthesized in'],
  reconsiders: ['Reconsiders', 'Reconsidered in'],
  responds: ['Responds to', 'Answered by'],
  investigates: ['Investigates', 'Investigated in'],
  tension: ['In tension with', 'In tension with'],
  related: ['Related to', 'Related to'],
};

export function localeOf(writing: Writing): Locale {
  return writing.id.startsWith('en/') ? 'en' : 'es';
}

export function cleanSlug(id: string): string {
  return id.split('/').slice(1).join('/').replace(/\.mdx?$/, '');
}

export function conceptKey(writing: Writing): string {
  return writing.data.translationKey || cleanSlug(writing.id);
}

export function writingUrl(writing: Writing): string {
  const locale = localeOf(writing);
  const slug = cleanSlug(writing.id);
  if (writing.data.type === 'microessay') {
    return locale === 'es' ? `/microensayos/${slug}` : `/en/microessays/${slug}`;
  }
  if (writing.data.type === 'question') {
    return locale === 'es' ? `/preguntas/${slug}` : `/en/questions/${slug}`;
  }
  return locale === 'es' ? `/blog/${slug}` : `/en/blog/${slug}`;
}

export function relationLabel(type: RelationType, direction: 'outgoing' | 'incoming', locale: Locale): string {
  const labels = locale === 'es' ? inverseLabels : inverseLabelsEn;
  return labels[type][direction === 'outgoing' ? 0 : 1];
}

export function plainText(markdown: string): string {
  return markdown
    .replace(/^---[\s\S]*?---\s*/u, '')
    .replace(/```[\s\S]*?```/gu, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/gu, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/gu, '$1')
    .replace(/<[^>]+>/gu, ' ')
    .replace(/[#>*_`~\-|]/gu, ' ')
    .replace(/\s+/gu, ' ')
    .trim();
}

export function excerptFor(writing: Writing, limit = 180): string {
  if (writing.data.description) return writing.data.description;
  const text = plainText(writing.body || '');
  if (text.length <= limit) return text;
  return `${text.slice(0, limit).replace(/\s+\S*$/u, '')}…`;
}

export function readingMinutes(writing: Writing): number {
  const words = plainText(writing.body || '').split(/\s+/u).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

function canonicalEntry(concept: Concept): Writing {
  return concept.es || concept.en!;
}

function hierarchyPair(edge: ConceptEdge): [string, string] | null {
  if (edge.type === 'includes') return [edge.source, edge.target];
  if (edge.type === 'partOf') return [edge.target, edge.source];
  return null;
}

function validateHierarchyCycles(concepts: Map<string, Concept>, edges: ConceptEdge[]) {
  const children = new Map<string, string[]>();
  for (const edge of edges) {
    const pair = hierarchyPair(edge);
    if (!pair) continue;
    children.set(pair[0], [...(children.get(pair[0]) || []), pair[1]]);
  }
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const visit = (key: string) => {
    if (visiting.has(key)) throw new Error(`Hierarchical relation cycle detected at "${key}".`);
    if (visited.has(key)) return;
    visiting.add(key);
    for (const child of children.get(key) || []) visit(child);
    visiting.delete(key);
    visited.add(key);
  };
  for (const key of concepts.keys()) visit(key);
}

export async function loadWritingGraph(showDrafts = false): Promise<WritingGraph> {
  const writings = await getCollection('posts', ({ data }) => showDrafts || !data.draft);
  const concepts = new Map<string, Concept>();

  for (const writing of writings) {
    const key = conceptKey(writing);
    const locale = localeOf(writing);
    const concept = concepts.get(key) || { key };
    if (concept[locale]) throw new Error(`Duplicate writing key "${key}" for locale "${locale}".`);
    concept[locale] = writing;
    concepts.set(key, concept);
  }

  const edges: ConceptEdge[] = [];
  const seen = new Set<string>();
  for (const concept of concepts.values()) {
    const source = canonicalEntry(concept);
    for (const relation of source.data.relations) {
      if (!concepts.has(relation.target)) {
        throw new Error(`Writing "${concept.key}" references missing target "${relation.target}".`);
      }
      if (relation.target === concept.key) {
        throw new Error(`Writing "${concept.key}" cannot relate to itself.`);
      }
      if (relation.type === 'investigates' && canonicalEntry(concepts.get(relation.target)!).data.type !== 'question') {
        throw new Error(`Relation "investigates" from "${concept.key}" must target a question.`);
      }
      const identity = `${concept.key}:${relation.type}:${relation.target}`;
      if (seen.has(identity)) throw new Error(`Duplicate relation "${identity}".`);
      seen.add(identity);
      edges.push({
        source: concept.key,
        target: relation.target,
        type: relation.type,
        date: relation.date || source.data.pubDate,
      });
    }
  }
  validateHierarchyCycles(concepts, edges);
  return { concepts, edges };
}

export function localizedWriting(concept: Concept, locale: Locale): { writing: Writing; fallbackLocale: boolean } {
  const writing = concept[locale] || concept.es || concept.en!;
  return { writing, fallbackLocale: localeOf(writing) !== locale };
}

export function relationsFor(writing: Writing, graph: WritingGraph): ResolvedRelation[] {
  const key = conceptKey(writing);
  const locale = localeOf(writing);
  const relations: ResolvedRelation[] = [];
  for (const edge of graph.edges) {
    if (edge.source !== key && edge.target !== key) continue;
    const direction = edge.source === key ? 'outgoing' : 'incoming';
    const otherKey = direction === 'outgoing' ? edge.target : edge.source;
    const other = graph.concepts.get(otherKey);
    if (!other) continue;
    const localized = localizedWriting(other, locale);
    relations.push({ ...localized, type: edge.type, direction, date: edge.date });
  }
  return relations.sort((a, b) => b.date.valueOf() - a.date.valueOf());
}

export function questionStatus(key: string, graph: WritingGraph): 'open' | 'in-progress' | 'answered' {
  const incoming = graph.edges.filter(edge => edge.target === key);
  if (incoming.some(edge => edge.type === 'responds')) return 'answered';
  if (incoming.some(edge => edge.type === 'investigates')) return 'in-progress';
  return 'open';
}

export async function localizedWritings(locale: Locale, type?: WritingType, showDrafts = false): Promise<Writing[]> {
  const writings = await getCollection('posts', ({ data }) => showDrafts || !data.draft);
  return writings
    .filter(writing => localeOf(writing) === locale && (!type || writing.data.type === type))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}
