---
title: '技术博客 Markdown 写作备忘'
description: '常用语法与排版习惯'
pubDate: 2026-05-20
tags: ['Markdown', '博客']
---

本站文章放在 `src/content/blog/` 下，**按文件夹分组**，URL 会反映目录结构。

## 目录示例

```text
src/content/blog/
├── astro-blog/          → /blog/astro-blog/...
│   ├── 01-hello-astro.md
│   └── 02-cloudflare-deploy.md
├── csharp/
│   └── discard-pattern.md
└── git/
    └── commit-message.md
```

文件夹名会出现在地址中：`/blog/astro-blog/01-hello-astro/`。

## Frontmatter 模板

```yaml
---
title: '文章标题'
description: '一句话摘要，用于 SEO'
pubDate: 2026-06-02
updatedDate: 2026-06-03   # 可选
tags: ['标签一', '标签二']   # 可选，横向主题分类
series: '系列名称'           # 可选，有阅读顺序的系列
seriesOrder: 1              # 可选，系列内第几篇
---
```

## 代码块

指定语言即可获得高亮：

````markdown
```powershell
npm run dev
```
````

行内代码用反引号：`npm run build`。

## 链接与图片

```markdown
[Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
![示意图](/favicon.svg)
```

静态资源放在 `public/`，引用时以 `/` 开头。

## 写作习惯

1. 标题用 `##` 分段，避免跳级（不要从 `#` 直接到 `###`）
2. 代码块尽量短，配合文字说明意图
3. `description` 写清楚，有利于分享预览与搜索
