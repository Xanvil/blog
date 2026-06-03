---
title: 'AutoCAD插件加载'
description: 'AutoCAD加载C#插件，注册命令'
pubDate: 2026-06-02
tags: ['cad', 'C#']
series: 'AutoCAD的C#插件学习'
seriesOrder: 1
---

## 注册命令

AutoCAD .NET API 通过 `[CommandMethod]` 特性（Attribute）将 C# 方法注册为 AutoCAD 命令。当 DLL 被加载后，AutoCAD 通过**反射**扫描程序集中的所有 `CommandMethod`，自动完成命令注册。

### 基本语法

```csharp
using Autodesk.AutoCAD.Runtime;
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.EditorInput;

public class MyCommands
{
    [CommandMethod("MyGroup", "Hello", CommandFlags.Modal)]
    public void HelloWorld()
    {
        Document doc = Application.DocumentManager.MdiActiveDocument;
        Editor ed = doc.Editor;
        ed.WriteMessage("\nHello, AutoCAD!");
    }
}
```

- **组名**（`MyGroup`）：逻辑分组标识，多个命令可共享同一组名
- **命令名**（`Hello`）：用户在命令行输入的名称，**不区分大小写**
- **方法**：必须是 `public`，可以是实例方法或静态方法

### CommandFlags 常用标志

| 标志 | 含义 |
|------|------|
| `Modal` | 默认，独占模式执行 |
| `Session` | 可在无文档时执行（应用程序级别），否则必须有活动文档 |
| `Transparent` | 可在其他命令运行中嵌套调用（命令行输入 `'CommandName`） |
| `UsePickSet` | 使用当前选择集（配合 `Editor.SelectImplied()`） |
| `Redraw` | 命令结束后自动重绘视图 |
| `NoMultiple` | 不允许重复执行（禁止 `MULTIPLE` 前缀调用） |
| `NoHistory` | 不记录到命令历史列表 |
| `NoUndoMarker` | 不在 Undo 栈中标记（适用于查询类命令） |

标志可组合使用：

```csharp
[CommandMethod("MyGroup", "MyCmd", CommandFlags.Modal | CommandFlags.UsePickSet)]
```

### 本地化命令

如果需要在多语言环境下使用，可提供本地化 ID：

```csharp
[CommandMethod("MyGroup", "LocalHello", "GlobalHello", CommandFlags.Modal)]
public void HelloWorld() { /* ... */ }
```

- `LocalHello`：本地化名称（CUI 中可被翻译）
- `GlobalHello`：全局名称（所有语言版本通用）

### 带参数的命令

```csharp
// 用户输入: MyCmd 42 "some text"
[CommandMethod("MyGroup", "MyCmd", CommandFlags.Modal)]
public void MyCommand()
{
    Document doc = Application.DocumentManager.MdiActiveDocument;
    Editor ed = doc.Editor;

    var intResult = ed.GetInteger("\n请输入一个整数: ");
    if (intResult.Status != PromptStatus.OK) return;

    var strResult = ed.GetString("\n请输入文本: ");
    if (strResult.Status != PromptStatus.OK) return;

    ed.WriteMessage($"\n输入: {intResult.Value}, {strResult.StringResult}");
}
```

---

## 加载插件

AutoCAD 加载 C# 插件有**四种**方式，从简单到高级排列：

### 1. 手动加载 — NETLOAD

这是最基础的加载方式，适合开发调试阶段。

在 AutoCAD 命令行输入 `NETLOAD`，弹出文件选择对话框，选择编译好的 `.dll` 文件即可加载。

```
命令: NETLOAD
→ 选择 MyPlugin.dll → 程序集被加载
```

加载过程：
1. AutoCAD 将 DLL 载入当前 AppDomain（.NET Framework 时代）或 AssemblyLoadContext（.NET 8+）
2. 扫描程序集中的 `CommandMethod` 特性，注册所有发现的方法为可用命令
3. 如果存在 `IExtensionApplication` 实现，调用 `Initialize()` 方法

卸载（如果程序集支持）：

```
命令: NETUNLOAD
→ 选择已加载的 DLL → 调用 Terminate() → 卸载
```

> **局限**：每次启动 AutoCAD 都要重新手动加载，不适合分发给最终用户。

### 2. 生命周期 — IExtensionApplication

在 DLL 加载 / 卸载时执行初始化和清理逻辑。

```csharp
using Autodesk.AutoCAD.Runtime;

public class MyApp : IExtensionApplication
{
    public void Initialize()
    {
        // DLL 加载时执行：注册事件、添加菜单/面板、初始化数据库连接等
        Application.DocumentManager.DocumentCreated += OnDocumentCreated;
    }

    public void Terminate()
    {
        // DLL 卸载或 AutoCAD 退出时执行：清理资源、注销事件
        Application.DocumentManager.DocumentCreated -= OnDocumentCreated;
    }

    private void OnDocumentCreated(object sender, DocumentCollectionEventArgs e)
    {
        e.Document.Editor.WriteMessage("\n新文档已创建。");
    }
}
```

> **注意**：旧版本需要 `[ExtensionApplication]` 特性标记实现类，AutoCAD 2013+ 自动发现 `IExtensionApplication` 实现。

### 3. 按需加载 — 注册表法（Demand Loading）

> **适用版本**：AutoCAD 2024 及之前（.NET Framework 版本）。
> AutoCAD 2025+ 使用 .NET 8 不再推荐此方式，建议使用 Autoloader。

原理：在注册表中预设命令与 DLL 的映射关系。当用户首次输入某个命令时，AutoCAD 自动加载对应 DLL，无需手动 NETLOAD。

#### 注册表路径

```
HKEY_CURRENT_USER\Software\Autodesk\AutoCAD\R24.0\ACAD-{major}{minor}:{lcid}\Applications\MyApp
```

例如 AutoCAD 2021 中文版：

```
HKCU\Software\Autodesk\AutoCAD\R24.0\ACAD-4101:804\Applications\MyPlugin
```

#### 键值说明

| 键名 | 类型 | 说明 |
|------|------|------|
| `DESCRIPTION` | REG_SZ | 插件描述文字（可选） |
| `LOADER` | REG_SZ | DLL 的**完整路径**（必填） |
| `MANAGED` | REG_DWORD | 设为 `1` 表示托管（.NET）程序集（必填） |
| `LOADCTRLS` | REG_DWORD | 加载触发条件控制（必填） |
| `COMMANDS` | REG_SZ | 逗号分隔的命令列表，触发加载（如 `LOADCTRLS` 含 1 则必填） |

#### LOADCTRLS 标志位

| 值 | 含义 |
|----|------|
| `1` | 用户调用 `COMMANDS` 中列出的命令时加载（最常用） |
| `2` | AutoCAD 启动时自动加载 |
| `4` | 检测到代理对象时加载 |
| `8` | 用户调用透明命令时加载（2015+） |
| `16` | 收到 `kLoadRequest` 系统消息时加载 |

**常用组合**：
- `2` — 启动即加载（始终可用，无需触发）
- `3` (= 1+2) — 启动即加载 + 命令触发
- `13` (= 1+4+8) — 命令触发 + 代理对象 + 透明命令

#### 注册表示例（.reg 文件）

```reg
Windows Registry Editor Version 5.00

[HKEY_CURRENT_USER\Software\Autodesk\AutoCAD\R24.0\ACAD-4101:804\Applications\MyPlugin]
"DESCRIPTION"="我的 AutoCAD 插件"
"LOADER"="C:\\MyPlugins\\MyPlugin.dll"
"MANAGED"=dword:00000001
"LOADCTRLS"=dword:0000000d
"COMMANDS"="Hello,MyCmd"
```

导入后，用户在命令行输入 `Hello` 或 `MyCmd`，AutoCAD 自动加载 `MyPlugin.dll`。

### 4. 自动加载器 — PackageContents.xml（推荐）

> **适用版本**：AutoCAD 2013 及之后所有版本（包括 2025+）。
> 这是 Autodesk 官方推荐的插件分发方式。

#### 目录结构

```
MyPlugin.bundle/
├── PackageContents.xml    ← 插件清单（必需）
├── Contents/
│   ├── MyPlugin.dll       ← 主程序集
│   └── Newtonsoft.Json.dll ← 依赖程序集
└── Resources/
    └── icon.png           ← 图标（可选）
```

#### 安装路径

| 范围 | 路径 |
|------|------|
| 当前用户 | `%APPDATA%\Autodesk\ApplicationPlugins\MyPlugin.bundle` |
| 所有用户 | `C:\Program Files\Autodesk\ApplicationPlugins\MyPlugin.bundle` |

放入文件夹后，AutoCAD 启动时自动扫描并加载。

#### PackageContents.xml 示例

```xml
<?xml version="1.0" encoding="utf-8"?>
<ApplicationPackage
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:noNamespaceSchemaLocation="PackageContents.xsd"
    SchemaVersion="1.0"
    AppVersion="1.0.0"
    Author="YourName"
    Name="MyCADPlugin"
    Description="示例 AutoCAD 插件">

    <!-- 组件定义 -->
    <Components>
        <!-- 按需加载：触发指定命令时才加载 -->
        <ComponentEntry
            AppName="MyCommands"
            ModuleName="./Contents/MyPlugin.dll"
            LoadOnCommandInvocation="True"
            LoadOnAutoCADStartup="False">
            <Commands GroupName="MyGroup">
                <Command Local="Hello" Global="Hello" />
                <Command Local="MyCmd" Global="MyCmd" />
            </Commands>
        </ComponentEntry>
    </Components>

</ApplicationPackage>
```

#### 关键属性说明

| 属性 | 说明 |
|------|------|
| `LoadOnCommandInvocation="True"` | 用户调用命令时加载（推荐） |
| `LoadOnAutoCADStartup="True"` | AutoCAD 启动时立即加载 |
| `ModuleName` | DLL 相对路径（相对于 .bundle 根目录） |

> **实际开发建议**：即使开发调试阶段用 NETLOAD，发布时也应准备 PackageContents.xml，方便用户一键安装。

### 5. AutoCAD 2025+ 的变化

| 方面 | 2024 及之前 | 2025+ |
|------|-------------|-------|
| 运行时 | .NET Framework 4.8 | .NET 8.0 (CoreCLR) |
| 程序集隔离 | AppDomain | AssemblyLoadContext |
| 注册表按需加载 | ✅ 可用 | ❌ 不推荐，建议 Autoloader |
| PackageContents.xml | ✅ 可用 | ✅ **推荐方式** |
| 平台 | 仅 Windows | Windows + Mac（部分） |
| 项目格式 | 旧版 csproj | SDK 风格 csproj |

2025+ 创建项目时推荐的 csproj：

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net8.0-windows</TargetFramework>
    <PlatformTarget>x64</PlatformTarget>
    <EnableWindowsTargeting>true</EnableWindowsTargeting>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Autodesk.AutoCAD.Base" Version="25.0.*" />
  </ItemGroup>
</Project>
```

---

## 使用命令

### 命令行直接调用

DLL 加载后，直接在命令行输入命令名（不区分大小写）：

```
命令: hello
Hello, AutoCAD!

命令: MYCMD
→ 执行 MyCmd 命令
```

### 透明命令

标记了 `CommandFlags.Transparent` 的命令可在其他命令执行中嵌套调用，输入时加单引号 `'`：

```
命令: LINE
指定第一点: 'ZOOM
>> 指定窗口角点: ...
正在恢复执行 LINE 命令。
指定第一点:
```

### LISP 调用 .NET 命令

```lisp
;; 方式一：直接调用
(command "Hello")

;; 方式二：可作为透明命令
(command "LINE" PAUSE "'Zoom" PAUSE PAUSE "")

;; 方式三：自定义 LISP 包装
(defun c:MH ()
  (command "Hello")
  (princ)
)
```

### 脚本批处理

将命令写入 `.scr` 脚本文件实现批量执行：

```
; myscript.scr
Hello
MyCmd
QSAVE
```

```
命令: SCRIPT
→ 选择 myscript.scr → 依次执行
```

---

## 调试配置

### Visual Studio 附加进程

1. 编译 DLL（Debug 模式，x64）
2. 启动 AutoCAD，`NETLOAD` 加载 DLL
3. Visual Studio → 调试 → 附加到进程 → 选择 `acad.exe`
4. 在代码中设置断点，AutoCAD 中执行命令即可命中

> 也可以配置项目属性 → 调试 → 启动外部程序 → 指向 `acad.exe`，按 F5 直接启动调试。

### 常见问题

| 问题 | 原因 | 解决 |
|------|------|------|
| `eInvalidInput` | 通常是没有活动文档时调用需文档的命令 | 加 `CommandFlags.Session` 或先打开文档 |
| `eNullObjectId` | 在事务外访问数据库对象 | 将操作包裹在 `using (Transaction tr = ...)` 中 |
| 命令未知 | DLL 未加载或命令名拼写错误 | 检查 NETLOAD 状态，确认命令名大小写 |
| DLL 加载失败 | 依赖程序集缺失或平台不匹配 | 确保所有依赖在 DLL 同目录，编译为 **x64** |
| `BadImageFormatException` | .NET Framework 版本不匹配 | 检查目标框架是否与 AutoCAD 版本对应 |

### 版本对照速查

| AutoCAD | 内部版本 | .NET 版本 | 注册表短名 |
|---------|---------|-----------|-----------|
| 2021 | R24.0 | .NET Framework 4.8 | R24.0 |
| 2022 | R24.1 | .NET Framework 4.8 | R24.1 |
| 2023 | R24.2 | .NET Framework 4.8 | R24.2 |
| 2024 | R24.3 | .NET Framework 4.8 | R24.3 |
| 2025 | R25.0 | .NET 8.0 | R25.0 |
| 2026 | R25.1 | .NET 8.0 | R25.1 |

---

## 参考

- [Autodesk AutoCAD .NET API 官方文档](https://help.autodesk.com/view/OARX/2025/ENU/)
- [Kean Walmsley — Through the Interface 博客](https://www.keanw.com/)（AutoCAD API 权威来源）
- [AutoCAD DevBlog — Demand Loading](https://adndevblog.typepad.com/autocad/)
