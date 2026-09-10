import { writingFeed } from '../lib/feeds';

export async function GET(context) {
  return writingFeed({
    title: 'Alejandro García Peláez Blog',
    description: 'AI Researcher, Developer, and Creator of things.',
    site: context.site,
    types: ['article', 'microessay'],
  });
}
