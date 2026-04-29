import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('posts');
  return rss({
    title: 'Alejandro García Peláez Blog',
    description: 'AI Researcher, Developer, and Creator of things.',
    site: context.site,
    items: posts.map((post) => {
      const isSpanish = post.id.startsWith('es/');
      const cleanSlug = post.id.split('/').slice(1).join('/').replace(/\.mdx?$/, '');
      const link = isSpanish ? `/blog/${cleanSlug}/` : `/en/blog/${cleanSlug}/`;
      
      return {
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: post.data.description,
        link,
      };
    }),
  });
}
