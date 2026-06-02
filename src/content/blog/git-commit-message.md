---
title: '写好 Git 提交说明'
description: '用简短、可读的 commit message 维护项目历史'
pubDate: 2026-05-25
---

清晰的提交说明能帮助未来的自己（和协作者）快速理解每次改动的目的。

## 推荐格式

```
<type>: <简短描述>

（可选）补充说明：为什么改、影响范围
```

常见 `type`：

| type | 用途 |
| ---- | ---- |
| `add` | 新功能、新文章 |
| `fix` | 修复 bug |
| `update` | 改进已有功能 |
| `refactor` | 重构，不改变行为 |
| `docs` | 仅文档 |

## 示例

```text
add: Cloudflare Pages 部署说明文章

fix: 文章列表日期显示为中文格式

update: 将 site 改为 blog.xanvil.cc.cd
```

## 避免

- `fix bug`、`update` 这类过于笼统的描述
- 一次提交混入多个不相关的改动

一条提交对应一个逻辑变更，历史会干净很多。
