// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

const SITE = 'https://movingalwaysforward.com';
const EXCLUDE = /\/404\/?$/;

export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  prefetch: false,
  devToolbar: { enabled: false },
  integrations: [
    react(),
    sitemap({
      filter: (page) => !EXCLUDE.test(page),
      serialize(item) {
        const u = item.url;
        const hub = /\/(early-career-coaching|executive-business-coaching|corporate-training|group-programs|career-steppingstones)\/$/.test(u);
        item.priority = u === `${SITE}/` ? 1.0 : hub ? 0.9 : /\/privacy\/$/.test(u) ? 0.3 : 0.8;
        item.changefreq = /** @type {any} */ (/\/insights\//.test(u) ? 'weekly' : 'monthly');
        return item;
      },
    }),
  ],
  image: { responsiveStyles: false },
  vite: { build: { assetsInlineLimit: 2048, modulePreload: false } },
});
