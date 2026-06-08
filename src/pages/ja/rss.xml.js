import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { parsePostId, postUrl } from '../../i18n/utils';
import { ui } from '../../i18n/ui';

const LANG = 'ja';

export async function GET(context) {
  const posts = (await getCollection('blog', ({ data }) => !data.draft))
    .map((post) => ({ post, meta: parsePostId(post.id) }))
    .filter(({ meta }) => meta.lang === LANG)
    .sort((a, b) => b.post.data.pubDate.valueOf() - a.post.data.pubDate.valueOf());

  return rss({
    title: ui[LANG]['site.title'],
    description: ui[LANG]['site.tagline'],
    site: context.site,
    items: posts.map(({ post, meta }) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: postUrl(LANG, meta.slug),
    })),
  });
}
