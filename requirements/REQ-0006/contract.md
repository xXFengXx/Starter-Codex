---
requirementId: REQ-0006
title: 添加项目 README
risk: low
owner: xXFengXx
source: https://github.com/xXFengXx/Starter-Codex/issues/9
---

# 目标

在仓库根目录提供 `README.md`，让首次访问仓库的用户能够了解项目用途、当前能力，并依据文档完成本地安装、启动和基础验证。

# 范围

- 新增仓库根目录 `README.md`。
- 说明这是一个基于 Electron、React 和 TypeScript 的个人知识库应用，以及文档索引、基于资料的问答等核心能力。
- 提供与仓库现有脚本一致的环境要求、依赖安装、应用启动和质量检查命令。
- 简要说明主要目录，帮助陌生用户浏览仓库。
- 如实说明 `feature_list.json` 中与使用体验直接相关的现有限制，避免把部分实现或缺失功能表述为已完成。

# 非目标

- 不修改产品代码、构建配置、依赖、Harness 流程或现有功能状态。
- 不补齐文档导入、对话历史、反馈、状态重置、日志或自动化产品测试等功能缺口。
- 不加入未经验证的安装包下载、发布、部署、截图、徽章或许可证声明。
- 不撰写完整的架构设计或贡献者手册。

# 约束

- README 中的命令必须来自仓库现有 `package.json` 或初始化脚本，不得虚构命令。
- 环境要求必须反映 `.nvmrc` 所指定的 Node.js 22。
- Windows 与类 Unix 环境的初始化方式应在相关处明确区分；通用复现流程可以使用跨平台的 npm 命令。
- 文档内容应以简体中文为主，命令、文件名和技术名称保持原文。
- 本需求仅允许新增或修改根目录 `README.md`；需求档案更新不计入产品变更范围。

# 验收标准

- **AC-001**: 仓库根目录存在 `README.md`，其中清楚说明项目是基于 Electron、React 和 TypeScript 的个人知识库，并概述文档、索引和基于资料问答等当前能力。
- **AC-002**: README 明确列出 Node.js 22 环境要求，并给出可复制的 `npm ci` 依赖安装步骤。
- **AC-003**: README 给出使用 `npm run dev` 启动应用的复现步骤，并说明该命令会构建主进程、preload、渲染进程后启动 Electron。
- **AC-004**: README 列出 `npm run check`、`npm test` 和 `npm run build` 三项基础质量检查命令，且命令与 `package.json` 一致。
- **AC-005**: README 提供简洁的仓库结构导航，至少覆盖 `src/`、`data/sample-documents/`、`docs/`、`harness/` 和 `requirements/`。
- **AC-006**: README 如实披露至少“文档导入 UI 尚未接线”和“当前没有产品自动化测试”两项基线限制，不将部分或缺失能力描述为完整可用。

# 风险

- 风险等级为 `low`：变更仅新增文档，可通过单文件回退。
- 主要风险是文档与实际脚本或功能状态不一致；通过逐项对照 `package.json`、`.nvmrc`、`scripts/dev.js` 和 `feature_list.json` 缓解。
- README 可能随功能演进过时；使用明确的“当前状态”措辞，并避免记录不稳定或未经验证的细节。

# 验证预期

- 人工检查 README 的项目描述、复现步骤、目录导航与限制说明是否覆盖 AC-001 至 AC-006。
- 对照 `.nvmrc`、`package.json`、`scripts/dev.js` 和 `feature_list.json` 核实所有技术陈述与命令。
- 实施后运行 `npm run check`、`npm test`、`npm run build`，并在 Harness 生命周期的 `verifying` 阶段运行 `npm run harness:verify -- REQ-0006`。
