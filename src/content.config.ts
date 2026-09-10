import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const authors = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/authors' }),
  schema: ({ image }) => z.object({
    name: z.string(),
    bio: z.string().optional(),
    avatar: image().optional(),
    socials: z.object({
      twitter: z.string().url().optional(),
      github: z.string().url().optional(),
      linkedin: z.string().url().optional(),
    }).optional(),
  }),
});

const tags = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/tags' }),
  schema: z.object({
    name: z.string(),
    description: z.string().optional(),
  }),
});

const branches = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/branches' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    parentBranch: z.string().nullable().optional(),
    translations: z.object({
      en: z.object({
        title: z.string(),
        description: z.string().optional(),
      }).optional(),
    }).optional(),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    type: z.enum(['article', 'microessay', 'question']).default('article'),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: reference('authors').optional(),
    tags: z.array(reference('tags')).default([]),
    image: image().optional(),
    translationKey: z.string().optional(),
    draft: z.boolean().default(false),
    project: z.string().nullable().optional(),
    branch: reference('branches').nullable().optional(),
    relations: z.array(z.object({
      type: z.enum([
        'includes',
        'partOf',
        'expands',
        'synthesizes',
        'reconsiders',
        'responds',
        'investigates',
        'tension',
        'related',
      ]),
      target: z.string().min(1),
      date: z.coerce.date().optional(),
    })).default([]),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string().optional(),
    order: z.number().optional(),
    sidebar_label: z.string().optional(),
    tech: z.string().optional(),
    image: image().optional(),
    translationKey: z.string().optional(),
  }),
});

export const collections = { authors, branches, tags, posts, projects };
