---
title: 'C# 弃元与模式匹配小技巧'
description: '用 _ 忽略不关心的值，让代码更简洁'
pubDate: 2026-05-28
---

在 C# 里，**弃元（discard）** 用 `_` 表示「这个值我不需要」。

## 解构时忽略字段

```csharp
var user = (Id: 1, Name: "Xanvil", Email: "a@b.c");
var (id, _, _) = user;  // 只关心 id
```

## switch 表达式

```csharp
string Describe(object? input) => input switch
{
    int n when n > 0 => $"正整数 {n}",
    int _            => "非正整数",
    string { Length: > 0 } => "非空字符串",
    _                => "其他类型",
};
```

## out 参数

```csharp
if (int.TryParse("42", out _))
{
    Console.WriteLine("解析成功");
}
```

> 弃元让意图更清晰：读者一眼就知道哪些返回值被故意忽略。
