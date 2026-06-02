import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>;

export async function getSortedPosts(): Promise<BlogPost[]> {
	return (await getCollection('blog')).sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
	);
}

export function postHref(post: BlogPost): string {
	return `/blog/${post.id}/`;
}

export function getPostFolder(post: BlogPost): string | null {
	const slash = post.id.indexOf('/');
	return slash === -1 ? null : post.id.slice(0, slash);
}

export function getPostsGroupedByFolder(posts: BlogPost[]): { folder: string; posts: BlogPost[] }[] {
	const groups = new Map<string, BlogPost[]>();

	for (const post of posts) {
		const folder = getPostFolder(post) ?? '_root';
		const list = groups.get(folder) ?? [];
		list.push(post);
		groups.set(folder, list);
	}

	const order = [...groups.keys()].sort((a, b) => {
		if (a === '_root') return 1;
		if (b === '_root') return -1;
		return a.localeCompare(b, 'zh-CN');
	});

	return order.map((folder) => ({
		folder,
		posts: groups.get(folder)!.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()),
	}));
}

export function tagToSlug(tag: string): string {
	return tag.trim();
}

export function slugToTag(slug: string): string {
	return slug;
}

export function seriesToSlug(series: string): string {
	return series.trim();
}

export function slugToSeries(slug: string): string {
	return slug;
}

export function sortSeriesPosts(posts: BlogPost[]): BlogPost[] {
	return [...posts].sort((a, b) => {
		const orderA = a.data.seriesOrder ?? Number.MAX_SAFE_INTEGER;
		const orderB = b.data.seriesOrder ?? Number.MAX_SAFE_INTEGER;
		if (orderA !== orderB) return orderA - orderB;
		return a.data.pubDate.valueOf() - b.data.pubDate.valueOf();
	});
}

export function getAllTags(posts: BlogPost[]): { name: string; slug: string; count: number }[] {
	const counts = new Map<string, number>();

	for (const post of posts) {
		for (const tag of post.data.tags ?? []) {
			counts.set(tag, (counts.get(tag) ?? 0) + 1);
		}
	}

	return [...counts.entries()]
		.map(([name, count]) => ({ name, slug: tagToSlug(name), count }))
		.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'zh-CN'));
}

export function getPostsByTag(posts: BlogPost[], slug: string): BlogPost[] {
	const tagName = slugToTag(slug);
	return posts.filter((post) => post.data.tags?.includes(tagName));
}

export function getAllSeries(
	posts: BlogPost[],
): { name: string; slug: string; count: number; posts: BlogPost[] }[] {
	const groups = new Map<string, BlogPost[]>();

	for (const post of posts) {
		if (!post.data.series) continue;
		const list = groups.get(post.data.series) ?? [];
		list.push(post);
		groups.set(post.data.series, list);
	}

	return [...groups.entries()]
		.map(([name, seriesPosts]) => ({
			name,
			slug: seriesToSlug(name),
			count: seriesPosts.length,
			posts: sortSeriesPosts(seriesPosts),
		}))
		.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
}

export function getPostsBySeries(posts: BlogPost[], slug: string): BlogPost[] {
	const seriesName = slugToSeries(slug);
	return sortSeriesPosts(posts.filter((post) => post.data.series === seriesName));
}

export function getSeriesNavigation(posts: BlogPost[], current: BlogPost) {
	const seriesName = current.data.series;
	if (!seriesName) return null;

	const seriesPosts = sortSeriesPosts(posts.filter((post) => post.data.series === seriesName));
	const index = seriesPosts.findIndex((post) => post.id === current.id);
	if (index === -1) return null;

	return {
		name: seriesName,
		slug: seriesToSlug(seriesName),
		index: index + 1,
		total: seriesPosts.length,
		prev: index > 0 ? seriesPosts[index - 1] : null,
		next: index < seriesPosts.length - 1 ? seriesPosts[index + 1] : null,
	};
}
