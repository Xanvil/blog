import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>;

export async function getSortedPosts(): Promise<BlogPost[]> {
	return (await getCollection('blog')).sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
	);
}

/** 标签 URL 片段（与 getStaticPaths 的 params.tag 一致） */
export function tagToSlug(tag: string): string {
	return tag.trim();
}

export function slugToTag(slug: string): string {
	return slug;
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
