import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	// 支持子目录：src/content/blog/astro-blog/01-intro.md
	loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),
	schema: () =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			tags: z.array(z.string()).default([]),
			/** 系列名称，同一系列的文章填相同值 */
			series: z.string().optional(),
			/** 系列内顺序，数字越小越靠前 */
			seriesOrder: z.number().optional(),
		}),
});

export const collections = { blog };
