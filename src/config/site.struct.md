# 博客自定义结构

```mermaid
flowchart TB
    subgraph 你只改这些
        MD["content/blog/*.md<br/>文章内容"]
        SITE["config/site.ts<br/>站名、导航、文案"]
        THEME["styles/theme.css<br/>颜色、字体、布局变量"]
        CUSTOM["styles/custom.css<br/>任意 CSS 覆盖"]
        PAGES["pages/*.astro<br/>页面结构"]
        COMP["components/*.astro<br/>页头页脚等"]
        LAYOUT["layouts/BlogPost.astro<br/>文章页模板"]
    end

    subgraph 构建时自动生成
        BUILD["npm run build"]
        DIST["dist/ 静态站"]
    end

    MD --> BUILD
    SITE --> BUILD
    THEME --> BUILD
    CUSTOM --> BUILD
    PAGES --> BUILD
    COMP --> BUILD
    LAYOUT --> BUILD
    BUILD --> DIST
    DIST --> CF["Cloudflare Pages"]
```

## 自定义程度

| 目标 | 改哪里 |
|------|--------|
| 换配色 / 字体 | `theme.css` |
| 改站名、菜单、首页文案 | `config/site.ts` |
| 横向分类（标签） | 文章 `tags: [...]` → `/tags/` |
| 有顺序的系列 | 文章 `series` + `seriesOrder` → `/series/` |
| 首页长什么样 | `pages/index.astro`（可整页重写） |
| 文章列表样式 | `pages/blog/index.astro` + `PostCard.astro` |
| 单篇文章版式 | `layouts/BlogPost.astro` |
| 写文章 | `content/blog/{文件夹}/*.md` |
| 完全自己的 CSS | `custom.css` |
