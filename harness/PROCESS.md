# 需求交付流程

Harness 管控单个需求从接收到形成可审计 PR 的全过程，由五个协作子系统组成。

## 1. 指令

`AGENTS.md` 是 Agent 入口；本文定义权威工作流。工具专用文件只能引用本文，不得复制或覆盖规则。

## 2. 工具

所有 Agent 与 CI 调用相同的 `npm` 命令。`harness/scripts/harness.mjs` 负责校验契约和状态、约束状态转换、执行门禁并生成 PR Package。

## 3. 状态

每次 Harness Run 位于 `requirements/<Requirement ID>/`。`state.json` 保存机器可读的生命周期状态，周边 Markdown 保存可审阅的契约和证据。聊天记录不是状态。

## 4. 环境

提交到仓库的锁文件固定依赖。自动化测试和基准使用 `.harness/runtime/`，可以安全重置且不会接触开发者数据。

## 5. 反馈

本地检查、CI、基准、审阅反馈、失败尝试和合并后经验都会回流为需求证据。失败是需要保留的信息，不是需要隐藏的结果。

## 生命周期

```text
intake -> clarified -> planned -> approved -> implementing -> verifying -> review-ready -> completed
```

`blocked` 可返回 `blockedFrom` 记录的状态；`cancelled` 和 `completed` 是终态。任何转换不得跳过 `approved` 或 `verifying`。审阅反馈可以让 `review-ready` 返回 `implementing`，修改后必须重新经过 `verifying`。

## 门禁策略

| 进入状态 | 必需证据 |
| --- | --- |
| clarified | 完整 Requirement Contract 和已编号验收标准 |
| planned | 实施计划和完整追踪行 |
| approved | 状态历史中记录人工批准者 |
| implementing | 已批准状态和独立需求分支 |
| verifying | 已更新实现追踪信息 |
| review-ready | 最新验证摘要显示全部强制命令通过 |
| completed | PR 已接受或合并；已知缺口和例外均已明确 |

有效例外必须记录影响、补偿验证、批准人和到期条件，并始终出现在 PR Package 中。

## 批准者

`approved` 和 `completed` 只能由人推进。`Codex` 与 `harness-agent` 是保留的自动化身份（不区分大小写），`requirement:transition` 拒绝它们推进到这两个状态。

需求经 GitHub Issue 进入时：

- `contract.md` 的 `source` 是该 Issue 的完整 URL；
- 批准来自对仓库有写权限的维护者在该 Issue 下的 `/approve <Requirement ID>` 评论，`approved` 的 actor 是该维护者的 GitHub 登录名；
- 批准只对评论之前最后一次推送的计划有效，计划再变更须重新批准；
- Draft PR 合并或被明确接受后，由维护者推进到 `completed`。

## 风险等级

- `low`：局部、可逆的行为或文档变更；
- `medium`：用户可见行为、IPC、持久化访问或多模块变更；
- `high`：安全、权限、迁移、持久化格式、破坏性行为或跨进程契约。

风险只改变验证深度，不改变通用门禁。

## 命令

```powershell
npm run harness:doctor
npm run requirement:new -- REQ-0001 <source> [actor]
npm run requirement:validate -- REQ-0001
npm run requirement:status -- REQ-0001
npm run requirement:transition -- REQ-0001 implementing maintainer "Approved implementation begins"
npm run harness:reset
npm run harness:verify -- REQ-0001
npm run harness:pr -- REQ-0001
npm run harness:benchmark
```

## 新增需求

使用 `npm run requirement:new -- <Requirement ID> <source> [actor]` 建档：它把 `harness/templates/requirement/` 复制到 `requirements/<Requirement ID>/`，填入 ID 与来源，状态为 `intake`。随后替换其余占位内容并执行校验。合并后保留该目录，作为长期决策与证据链。

