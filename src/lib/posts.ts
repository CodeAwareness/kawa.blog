import { getCollection } from 'astro:content';
import { parsePostId } from '../i18n/utils';
import type { Lang } from '../i18n/ui';

export type PostEntry = Awaited<ReturnType<typeof getCollection<'blog'>>>[number];
export interface LocalizedPost {
  post: PostEntry;
  meta: { lang: Lang; slug: string };
}

/**
 * Single source of truth for post listings: every published post in a given
 * language, newest first. Drafts are hidden in production builds.
 *
 * Posts are ordered by `pubDate` descending, so a new post appears at the top
 * of "Latest posts" automatically — just give it a later `pubDate` than the
 * posts it should sit above (use a full timestamp, e.g. 2026-06-07T14:00, if
 * two posts share a day and you need to control their order).
 */
export async function getPublishedPosts(lang: Lang): Promise<LocalizedPost[]> {
  const all = await getCollection('blog', ({ data }) =>
    import.meta.env.PROD ? !data.draft : true
  );

  return all
    .map((post) => ({ post, meta: parsePostId(post.id) }))
    .filter(({ meta }) => meta.lang === lang)
    .sort((a, b) => {
      const byDate = b.post.data.pubDate.valueOf() - a.post.data.pubDate.valueOf();
      if (byDate !== 0) return byDate;
      // Stable tie-break so same-date posts don't reorder between builds.
      return a.meta.slug.localeCompare(b.meta.slug);
    });
}
