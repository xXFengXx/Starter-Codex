# Knowledge Base

Knowledge Base 是一个基于 Electron、React 和 TypeScript 的桌面个人知识库应用。它用于管理本地文档、为文档建立索引，并根据已收录的资料回答问题。

## 当前能力

- 展示和读取知识库中的文档。
- 为文档内容建立索引。
- 检索相关资料并生成基于资料的回答。
- 展示基础的对话历史。

## 环境要求

- Node.js 22（仓库的 `.nvmrc` 指定版本）。
- npm（随 Node.js 安装）。

在 Windows 上可安装 Node.js 22，或使用支持 Windows 的 Node.js 版本管理器；在 macOS、Linux 等类 Unix 系统上可使用对应平台的 Node.js 安装方式或版本管理器。开始前请确认当前 Node.js 主版本为 22。

## 安装与运行

在仓库根目录安装锁文件中固定的依赖：

```sh
npm ci
```

启动应用：

```sh
npm run dev
```

`npm run dev` 会依次构建 Electron 主进程和 preload、构建 React 渲染进程，然后启动 Electron。关闭 Electron 应用后，该命令结束。

仓库在 `data/sample-documents/` 中提供了示例资料，可用于浏览项目内容和了解预期的数据类型。

## 质量检查

```sh
npm run check
npm test
npm run build
```

- `npm run check`：检查主进程、preload 和渲染进程的 TypeScript 类型。
- `npm test`：运行当前的 Harness 测试。
- `npm run build`：构建主进程、preload 和渲染进程。

## 仓库结构

```text
src/                    Electron、React 应用和服务代码
data/sample-documents/  用于浏览和验证的示例文档
docs/                   架构决策等项目文档
harness/                需求交付流程、校验脚本与 Harness 测试
requirements/           各项需求的契约、计划、状态与验证证据
scripts/                本地开发辅助脚本
```

## 当前限制

本项目仍处于早期阶段，以下能力尚不完整：

- 文档导入 UI 尚未接线，界面中的导入操作当前不可用。
- 当前没有产品自动化测试；`npm test` 运行的是需求交付 Harness 的测试，并不覆盖完整的产品行为。
- 对话历史目前仅提供扁平列表，尚无增强交互。
- 回答反馈功能尚未实现。
- 持久化重置、结构化日志等能力仅部分实现，尚未提供完整的用户界面或覆盖。

