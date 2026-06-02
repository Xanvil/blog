---
title: '用 Astro 搭建个人博客'
description: '一篇示例文章，展示 Markdown 写作与代码高亮'
pubDate: 2026-06-02
tags: ['Astro', '博客']
---

这是一篇示例文章。在 `src/content/blog/` 目录下新建 `.md` 文件即可添加文章。

## 代码示例

Astro 内置 Shiki，支持语法高亮：

```typescript
function greet(name: string): string {
  return `Hello, ${name}!`;
}

console.log(greet('Cloudflare'));
```

## 列表与引用

- 本地预览：`npm run dev`
- 构建站点：`npm run build`
- 发布：推送到 GitHub，Cloudflare Pages 自动部署到 [blog.xanvil.cc.cd](https://blog.xanvil.cc.cd/)

> 简单、快速、无评论——专注写作本身。

## 表格

| 命令 | 说明 |
| ---- | ---- |
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建静态站点 |
| `npm run preview` | 预览构建结果 |
