import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const categories = ['Early Career', 'Leadership', 'Sales', 'Workplace Skills'] as const;

const insights = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/insights' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(170),
    pubDate: z.coerce.date(),
    category: z.enum(categories),
    cta: z.string().default('/contact/'),
    draft: z.boolean().default(false),
  }),
});

export const collections = { insights };
