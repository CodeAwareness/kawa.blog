import { getCollection } from 'astro:content';
import { OGImageRoute } from 'astro-og-canvas';
import { parsePostId } from '../../i18n/utils';
import { ui } from '../../i18n/ui';

// Build-time generated Open Graph images (no client JS). Each route resolves to
// a branded PNG:
//   posts -> /og/<lang>/<slug>.png   (e.g. /og/en/welcome-to-kawa-code.png)
//   homes -> /og/home/<lang>.png
const entries = await getCollection('blog');

type OgPage = { title: string; description: string };

const pages: Record<string, OgPage> = {
  'home/en': { title: ui.en['home.heading'], description: ui.en['home.intro'] },
  'home/ja': { title: ui.ja['home.heading'], description: ui.ja['home.intro'] },
};
for (const entry of entries) {
  // Key by the entry id ("en/slug") so the URL mirrors the post URL.
  const { lang, slug } = parsePostId(entry.id);
  pages[`${lang}/${slug}`] = {
    title: entry.data.title,
    description: entry.data.description,
  };
}

export const { getStaticPaths, GET } = await OGImageRoute({
  param: 'route',
  pages,
  getImageOptions: (_path, page) => ({
    title: page.title,
    description: page.description,
    bgGradient: [
      [11, 15, 20],
      [18, 24, 33],
    ],
    border: { color: [46, 155, 214], width: 10, side: 'inline-start' }, // brand --blue-light #2E9BD6
    padding: 70,
    font: {
      title: {
        color: [230, 237, 243],
        size: 62,
        lineHeight: 1.1,
        weight: 'Bold',
        families: ['Inter', 'IBM Plex Sans JP'],
      },
      description: {
        color: [154, 167, 180],
        size: 30,
        lineHeight: 1.4,
        families: ['Inter', 'IBM Plex Sans JP'],
      },
    },
    // Inter covers Latin; IBM Plex Sans JP (static weights, predictable family
    // name) covers Japanese. CanvasKit only falls back across families named in
    // the list above, so the names must match what these files register as.
    fonts: [
      'https://api.fontsource.org/v1/fonts/inter/latin-400-normal.ttf',
      'https://api.fontsource.org/v1/fonts/inter/latin-700-normal.ttf',
      'https://api.fontsource.org/v1/fonts/ibm-plex-sans-jp/japanese-400-normal.ttf',
      'https://api.fontsource.org/v1/fonts/ibm-plex-sans-jp/japanese-700-normal.ttf',
    ],
  }),
});
