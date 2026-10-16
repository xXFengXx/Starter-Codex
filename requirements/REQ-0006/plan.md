# 实施计划

## 方案

仅在仓库根目录新增一份简体中文 `README.md`。README 以现有仓库文件为事实依据，按“项目简介—当前能力与限制—环境与复现—质量检查—目录结构”的顺序组织，使首次访问者可以先理解项目，再执行最短复现路径。文档不改变任何运行行为或依赖。

## 步骤

- [x] 对照 `package.json`、`.nvmrc`、`scripts/dev.js` 和 `feature_list.json` 复核项目描述、环境要求、命令及当前限制。
- [x] 在仓库根目录新增 `README.md`，说明项目定位、技术栈与当前核心能力（AC-001）。
- [x] 写入 Node.js 22、`npm ci` 和 `npm run dev` 的可复制复现步骤，并解释启动命令的可观察行为（AC-002、AC-003）。
- [x] 写入 `npm run check`、`npm test`、`npm run build` 三项质量检查命令（AC-004）。
- [x] 添加覆盖主要目录的仓库结构导航（AC-005）。
- [x] 添加当前限制章节，如实注明导入 UI 和产品自动化测试的基线状态（AC-006）。
- [x] 人工逐条检查验收标准，并更新 `traceability.md` 的实现位置与验证结果。
- [ ] 经批准进入实施与验证阶段后，运行通用门禁及 `npm run harness:verify -- REQ-0006`；检查依赖审计结果但不静默升级依赖。

## 验证计划

- AC-001：人工阅读 README 的标题、简介与能力清单，并与 `package.json` 描述和 `src/` 结构对照。
- AC-002：检查 Node.js 版本和安装命令分别与 `.nvmrc`、`package.json`/锁文件一致。
- AC-003：检查启动命令及说明与 `package.json` 的 `dev` 脚本和 `scripts/dev.js` 一致。
- AC-004：将 README 的质量命令逐项与 `package.json` scripts 对照，并在验证阶段执行。
- AC-005：确认 README 列出的每个目录实际存在，描述与其内容相符。
- AC-006：将限制说明与 `feature_list.json` 的对应状态和证据对照。
- 通用门禁：在干净、隔离状态运行 `npm run harness:verify -- REQ-0006`，记录 `check`、`test`、`build` 结果；另行审阅依赖审计输出、范围和敏感信息检查结果。

## 回退

删除本需求新增的根目录 `README.md` 即可回退产品变更；需求档案保留，用于审计决策和验证历史。
