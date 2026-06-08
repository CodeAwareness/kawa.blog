import { ui, defaultLang, type Lang, type UIKey } from './ui';

/** Read the active language from a URL pathname (e.g. /ja/blog -> 'ja'). */
export function getLangFromUrl(url: URL): Lang {
  const [, maybeLang] = url.pathname.split('/');
  if (maybeLang in ui) return maybeLang as Lang;
  return defaultLang;
}

/** Returns a `t('some.key')` translator bound to the given language. */
export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

/**
 * Build a locale-aware path. The default locale (en) has no prefix;
 * other locales are prefixed with their code.
 *   localizedPath('/blog', 'en') -> '/blog'
 *   localizedPath('/blog', 'ja') -> '/ja/blog'
 */
export function localizedPath(path: string, lang: Lang): string {
  const clean = '/' + path.replace(/^\/+/, '');
  if (lang === defaultLang) return clean;
  return `/${lang}${clean === '/' ? '' : clean}`;
}

/** Split a content entry id like 'ja/hello-world' into locale + slug. */
export function parsePostId(id: string): { lang: Lang; slug: string } {
  const [maybeLang, ...rest] = id.split('/');
  if (maybeLang in ui && rest.length > 0) {
    return { lang: maybeLang as Lang, slug: rest.join('/') };
  }
  return { lang: defaultLang, slug: id };
}

/** Public URL for a post given its locale + slug (posts live at the site root). */
export function postUrl(lang: Lang, slug: string): string {
  return localizedPath(`/${slug}`, lang);
}
