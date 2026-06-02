---
title: '将 Astro 博客部署到 Cloudflare Pages'
description: 'Git 集成、构建配置与环境变量说明'
pubDate: 2026-06-01
tags: ['Astro', 'Cloudflare', '部署']
series: 'Astro 博客实战'
seriesOrder: 2
---

本站托管在 [Cloudflare Pages](https://pages.cloudflare.com/)，域名是 `blog.xanvil.cc.cd`。

## 构建配置

| 配置项 | 值 |
| ------ | -- |
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Production branch | `master` |
| `NODE_VERSION` | `22` |

## 发布流程

```bash
# 编辑 src/content/blog/ 下对应文件夹中的 .md 后
git add .
git commit -m "add: 新文章"
git push
```

推送后 Cloudflare 会自动安装依赖、执行 `npm run build`，并把 `dist/` 发布到全球 CDN。

## `site` 配置

`astro.config.mjs` 中的 `site` 需与线上域名一致，用于生成 sitemap 与 RSS 的绝对链接：

```javascript
export default defineConfig({
  site: 'https://blog.xanvil.cc.cd',
  integrations: [sitemap()],
});
```
