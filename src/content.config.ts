import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Posts live under src/content/blog/<locale>/<slug>.mdx
// e.g. src/content/blog/en/hello-world.mdx  ->  /blog/hello-world
//      src/content/blog/ja/hello-world.mdx  ->  /ja/blog/hello-world
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      heroImage: image().optional(),
      tags: z.array(z.string()).default([]),
      author: z.string().default('Kawa Code'),
      draft: z.boolean().default(false),
    }),
});

export const collections = { blog };
