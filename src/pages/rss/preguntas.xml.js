import { writingFeed } from '../../lib/feeds';

export async function GET(context) {
  return writingFeed({
    title: 'Preguntas de Alejandro García Peláez',
    description: 'Preguntas abiertas dentro del mapa de conocimiento.',
    site: context.site,
    locale: 'es',
    types: ['question'],
  });
}
