# REQ-0005：接入 Harness Agent

# 背景与原因

详见 [Requirement Contract](./contract.md)。

# 变更内容

已执行获批计划。变更路径：

```text
AGENTS.md
harness/PROCESS.md
harness/README.md
harness/scripts/harness.mjs
package.json
requirements/REQ-0005/handoff.md
requirements/REQ-0005/state.json
requirements/REQ-0005/traceability.md
requirements/REQ-0005/verification.md
.harness-agent.yaml
harness/tests/requirement-new.test.mjs
requirements/REQ-0005/verification-harness-agent.md
```

# 需求追踪

| 验收标准 | 实现位置 | 验证方式 | 结果 |
| --- | --- | --- | --- |
| AC-001 | `harness/scripts/harness.mjs`（`newRequirement`）、`package.json` | `npm test`（`requirement-new.test.mjs` 前三个用例） | PASS |
| AC-002 | `harness/scripts/harness.mjs`（`transition`） | `npm test`（`requirement-new.test.mjs` 后两个用例） | PASS |
| AC-003 | `.harness-agent.yaml` | `harness-agent doctor .` 以 `RESULT conforms` 结尾，见 `verification-harness-agent.md` | PASS |
| AC-004 | `harness/PROCESS.md`、`AGENTS.md`、`harness/README.md` | 对照 `harness.mjs`、`package.json` 与 `.harness-agent.yaml` 人工审阅 | PASS |
| AC-005 | `harness/tests/requirement-new.test.mjs` | `npm test` | PASS |
| AC-006 | 全仓库 | `npm run harness:verify -- REQ-0005` | PASS |


# 验证

需求：REQ-0005
生成时间：2026-10-13T10:02:27.003Z
总体结果：PASS

| 门禁 | 命令 | 结果 | 耗时 |
| --- | --- | --- | --- |
| 类型检查 | `npm run check` | PASS | 5438 ms |
| 测试 | `npm test` | PASS | 9398 ms |
| 构建 | `npm run build` | PASS | 5573 ms |

## 失败详情

无。


# 审阅指南

1. 阅读 `contract.md` 和 `plan.md`；
2. 审阅 Harness 策略与可执行状态约束；
3. 对照每条追踪记录检查验证证据。

# 风险与回退

风险等级：**high**。回退本需求提交即可恢复之前的工作流。

# 已知缺口与例外

没有已批准的门禁例外。未解决事项以 Requirement Contract 和审阅反馈中的记录为准。

# 交付管控证据

- [需求契约](./contract.md)
- [实施计划](./plan.md)
- [追踪矩阵](./traceability.md)
- [验证证据](./verification.md)
- [审阅反馈](./review-feedback.md)
