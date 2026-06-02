---
title: '技术博客 Markdown 写作备忘'
description: '常用语法与排版习惯'
pubDate: 2026-05-20
---

本站文章放在 `src/content/blog/`，每篇一个 `.md` 文件。

## Frontmatter 模板

```yaml
---
title: '文章标题'
description: '一句话摘要，用于 SEO'
pubDate: 2026-06-02
updatedDate: 2026-06-03   # 可选
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
