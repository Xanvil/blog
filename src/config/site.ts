/**
 * 博客总配置 —— 改这里即可自定义站点信息与结构（无需动框架代码）
 *
 * 外观颜色、字体 → src/styles/theme.css
 * 额外 CSS 覆盖   → src/styles/custom.css
 * 页面 HTML 结构  → src/pages/*.astro、src/components/*.astro
 * 文章正文        → src/content/blog/*.md
 */

export const site = {
	/** 站点名称（导航、首页标题、RSS） */
	title: 'Xanvil 的开发笔记',

	/** SEO 与首页副标题 */
	description: '记录代码与开发心得的个人博客',

	/** 正式域名，需与 astro.config.mjs 中 site 一致 */
	url: 'https://blog.xanvil.cc.cd',

	author: 'Xanvil',
	lang: 'zh-CN',

	/** 顶栏导航，可增删改 */
	nav: [
		{ href: '/', label: '首页' },
		{ href: '/blog', label: '文章' },
		{ href: '/tags', label: '分类' },
		{ href: '/series', label: '系列' },
		{ href: '/about', label: '关于' },
	],

	/** 标签 / 分类 */
	tags: {
		indexTitle: '文章分类',
		indexSubtitle: (count: number) => `共 ${count} 个标签`,
		tagSubtitle: (count: number) => `该分类下共 ${count} 篇`,
	},

	/** 文章系列（有阅读顺序的多篇文章） */
	series: {
		indexTitle: '文章系列',
		indexSubtitle: (count: number) => `共 ${count} 个系列`,
		seriesSubtitle: (count: number) => `建议按以下顺序阅读，共 ${count} 篇`,
	},

	/** 首页区块（改 false 可关闭对应模块） */
	home: {
		showHero: true,
		badge: 'Dev Blog',
		ctaLabel: '浏览全部文章',
		ctaHref: '/blog/',
		showRecentPosts: true,
		recentTitle: '最新文章',
		recentCount: 3,
	},

	/** 文章列表页 */
	blog: {
		title: '全部文章',
		subtitle: (count: number) => `共 ${count} 篇，按发布时间排序`,
		showDescription: true,
		showReadMore: true,
		readMoreLabel: '阅读全文 →',
		featureFirstPost: true,
		/** 按文件夹分组展示 */
		groupByFolder: true,
	},

	/** 文件夹显示名（键 = src/content/blog/ 下的目录名） */
	folders: {
		'astro-blog': 'Astro 博客',
		csharp: 'C#',
		git: 'Git',
		meta: '站点说明',
	} as Record<string, string>,

	/** 页脚 */
	footer: {
		copyright: (year: number, author: string) => `© ${year} ${author}`,
		links: [{ href: '/rss.xml', label: 'RSS' }],
	},

	/**
	 * Google Fonts 地址；留空字符串则使用 theme.css 中的系统字体
	 * 示例：https://fonts.googleapis.com/css2?family=...
	 */
	fontsUrl:
		'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Noto+Sans+SC:wght@400;500;700&display=swap',

	/** dark | light —— 影响 meta color-scheme */
	colorScheme: 'dark' as 'dark' | 'light',

	/** 页面布局：顶栏 + 左栏 + 中间 + 右栏 + 底栏 */
	layout: {
		showLeftAside: true,
		showRightAside: true,
		rightTagCount: 10,
		rightSeriesCount: 6,
	},
} as const;

export type SiteConfig = typeof site;
