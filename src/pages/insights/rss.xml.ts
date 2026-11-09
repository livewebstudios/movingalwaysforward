import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { site } from '../../data/site';

export async function GET(context: APIContext) {
  const posts = (await getCollection('insights', ({ data }) => !data.draft)).sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
  return rss({
    title: 'Always Forward Insights',
    description: 'Plain-talk writing on early careers, leadership, sales and workplace skills from coach Joe Hliboki.',
    site: context.site ?? site.url,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.pubDate,
      link: `/insights/${p.id}/`,
      categories: [p.data.category],
      author: 'Joe Hliboki',
    })),
    customData: '<language>en-us</language>',
  });
}
