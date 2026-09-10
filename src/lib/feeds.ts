import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { excerptFor, localeOf, writingUrl, type Locale, type WritingType } from './writings';

interface FeedOptions {
  site: URL;
  title: string;
  description: string;
  locale?: Locale;
  types: WritingType[];
}

export async function writingFeed({ site, title, description, locale, types }: FeedOptions) {
  const writings = await getCollection('posts', ({ data }) => !data.draft && types.includes(data.type));
  const items = writings
    .filter(writing => !locale || localeOf(writing) === locale)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
    .map(writing => ({
      title: writing.data.title,
      pubDate: writing.data.pubDate,
      description: excerptFor(writing),
      link: `${writingUrl(writing)}/`,
    }));

  return rss({ title, description, site, items });
}
