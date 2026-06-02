# 博客页面布局

```mermaid
flowchart TB
    subgraph page["整页 .page"]
        H["顶栏 site-header<br/>Logo + 移动端导航"]
        subgraph body["主体 page-body（三栏）"]
            L["左栏 aside-left<br/>站点导航、浏览入口"]
            M["中间 page-content<br/>页面正文"]
            R["右栏 aside-right<br/>简介、分类、系列"]
        end
        F["底栏 site-footer"]
    end

    H --> body --> F
```

窄屏（&lt; 1100px）时只显示顶栏 + 中间 + 底栏，左右栏隐藏，导航移到顶栏。

## 开关

在 `config/site.ts` 的 `layout` 中：

| 配置 | 说明 |
|------|------|
| `showLeftAside` | 是否显示左栏 |
| `showRightAside` | 是否显示右栏 |
| `rightTagCount` | 右栏显示几个分类 |
| `rightSeriesCount` | 右栏显示几个系列 |

宽度在 `styles/theme.css`：`--shell-max`、`--aside-left-width`、`--aside-right-width`。
