#!/usr/bin/env node
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const [, , type, ...titleParts] = process.argv;
const allowed = new Set(['article', 'microessay', 'question']);
const title = titleParts.join(' ').trim();

if (!allowed.has(type) || !title) {
  console.error('Usage: node scripts/create-writing.mjs <article|microessay|question> "Title"');
  process.exit(1);
}

const slug = title
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

if (!slug) {
  console.error('The title must contain at least one letter or number.');
  process.exit(1);
}

const directory = resolve('src/content/posts/es');
const destination = resolve(directory, `${slug}.md`);
if (existsSync(destination)) {
  console.error(`Writing already exists: ${destination}`);
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const source = `---\ntitle: ${JSON.stringify(title)}\ntype: ${type}\npubDate: ${today}\ntranslationKey: ${slug}\ndraft: true\n---\n\n`;
mkdirSync(directory, { recursive: true });
writeFileSync(destination, source, { flag: 'wx' });
console.log(destination);
