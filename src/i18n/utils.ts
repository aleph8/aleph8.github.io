import en from './locales/en.json';
import es from './locales/es.json';

export const locales = ['en', 'es'] as const;
export const defaultLocale = 'en';

export const translations = {
  en,
  es,
};

export function useTranslations(lang: keyof typeof translations) {
  return function t(key: keyof typeof en) {
    return translations[lang][key] || en[key] || key;
  };
}

export function getRelativePath(path: string, lang: string) {
  const parts = path.split('/').filter(Boolean);
  if (locales.includes(parts[0] as any)) {
    parts.shift();
  }
  const base = parts.join('/');
  if (lang === defaultLocale) return `/${base}`;
  return `/${lang}/${base}`;
}
