// @ts-check

import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { site } from './src/config/site.ts';

export default defineConfig({
	site: site.url,
	integrations: [sitemap()],
});
