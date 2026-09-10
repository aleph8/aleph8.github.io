import { writingFeed } from '../../lib/feeds';

export async function GET(context) {
  return writingFeed({
    title: 'Reflexiones de Alejandro García Peláez',
    description: 'Ideas, preguntas y argumentos en desarrollo.',
    site: context.site,
    locale: 'es',
    types: ['microessay'],
  });
}
