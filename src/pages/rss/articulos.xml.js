import { writingFeed } from '../../lib/feeds';

export async function GET(context) {
  return writingFeed({
    title: 'Artículos de Alejandro García Peláez',
    description: 'Proyectos, experimentos y aprendizajes.',
    site: context.site,
    locale: 'es',
    types: ['article'],
  });
}
