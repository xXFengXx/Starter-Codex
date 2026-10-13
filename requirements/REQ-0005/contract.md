---
requirementId: REQ-0005
title: 接入 Harness Agent
risk: high
owner: xXFengXx
source: 用户于 2026-10-13 在对话中提出的直接需求
---

# 目标

让本仓库满足 Harness Agent 接入契约，使 `harness-agent run xXFengXx/Starter-Codex#<n>` 能从 GitHub Issue 出发，按本仓库现有的生命周期完成计划、批准、实施、验证并提交 Draft PR。现有 Harness 仍是唯一权威，本需求只补齐契约要求的缺口。

# 范围

- 新增确定性的建档命令 `npm run requirement:new -- <Requirement ID> <source> [actor]`，取代手工复制模板。
- `requirement:transition` 拒绝自动化身份 `Codex` 与 `harness-agent` 把需求推进到 `approved` 或 `completed`。
- 在仓库根目录新增接入清单 `.harness-agent.yaml`，把九个生命周期角色、命令、需求目录与路径边界映射到本仓库现有实现。
- 在 `harness/PROCESS.md`、`AGENTS.md` 与 `harness/README.md` 中写明：建档命令、保留的自动化身份，以及经 GitHub Issue 进入的需求如何批准。
- 为新增行为补充自动化测试。

# 非目标

- 不修改产品代码（`src/`）、构建配置或依赖。
- 不改变现有生命周期顺序、门禁内容或 PR Package 格式。
- 不修复 PR Package 在工作树干净时列不出变更路径的既有问题（`harness:pr` 依赖 `git status`）；该问题另立需求。
- 不配置 GitHub 标签、分支保护或任何凭据；不推送分支。
- 不迁移 REQ-0001 至 REQ-0004 的历史数据。

# 约束

- `AGENTS.md` 与 `harness/PROCESS.md` 仍是规则权威；清单只描述现有 Harness，不引入第二套规则。
- `harness/scripts/harness.mjs` 继续只依赖 Node 内置模块。
- 建档命令只能由参数和模板决定结果，不读取 Issue 正文。
- 测试不得在真实 `requirements/` 中留下文件；需要写入时使用临时目录中的仓库副本。
- 变更位于 `requirement/REQ-0005-harness-agent-onboarding` 独立分支，并遵循完整生命周期。

# 验收标准

- **AC-001**: `npm run requirement:new -- REQ-XXXX <source> [actor]` 把模板复制到 `requirements/REQ-XXXX/`，把所有 `REQ-0000` 替换为该 ID，把 `<source>` 压成单行写入 `contract.md` 的 `source:`，并把 `state.json` 设为 `intake`，历史首条记录的 actor 为给定值（缺省为 `maintainer`）、时间为当前时间。ID 格式非法、目录已存在或缺少 source 时以非 0 退出且不留下目录。
- **AC-002**: `requirement:transition` 在目标状态为 `approved` 或 `completed` 时拒绝 actor `Codex` 和 `harness-agent`（不区分大小写），以非 0 退出且不改写 `state.json`；其他转换与其他 actor 的行为不变。
- **AC-003**: 仓库根目录的 `.harness-agent.yaml` 通过 `harness-agent doctor .`，输出以 `RESULT conforms` 结尾；受保护路径覆盖清单自身、`AGENTS.md`、`CLAUDE.md`、`harness/**` 与 `.github/**`。
- **AC-004**: `harness/PROCESS.md` 写明建档命令、保留的自动化身份，以及 GitHub Issue 需求的批准规则：`source` 为 Issue 完整 URL；批准来自有写权限的维护者在该 Issue 下的 `/approve <Requirement ID>` 评论，`approved` 的 actor 为其 GitHub 登录名；批准只对评论前最后一次推送的计划有效。`AGENTS.md` 与 `harness/README.md` 的相关命令和说明与之一致。
- **AC-005**: `npm test` 覆盖 AC-001 的成功与三种失败情形，以及 AC-002 的拒绝与放行情形。
- **AC-006**: `npm run check`、`npm test`、`npm run build` 以及 `npm run harness:verify -- REQ-0005` 全部通过。

# 风险

- 保留身份检查若写错，可能阻止维护者正常批准；通过放行用例测试与不区分大小写的精确匹配缓解。
- 建档命令在 Windows 上经 `npm.cmd` 调用，参数含特殊字符时可能被 `cmd.exe` 解析；Harness Agent 只传入 Requirement ID、Issue URL 和固定 actor，测试覆盖含空格的 source。
- 清单与 Harness 实现日后可能漂移；`harness-agent doctor` 的试跑会暴露建档、转换与验证命令的不一致，作为验证证据保留。

# 验证预期

- `npm run harness:doctor`
- `npm run requirement:validate -- REQ-0005`
- `npm run check`、`npm test`、`npm run build`
- `npm run harness:verify -- REQ-0005`
- `harness-agent doctor .` 的完整输出记录到验证证据中。
