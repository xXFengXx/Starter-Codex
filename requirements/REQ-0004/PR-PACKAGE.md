# REQ-0004：为需求交付 Harness 编写 README

# 背景与原因

详见 [Requirement Contract](./contract.md)。

# 变更内容

已执行获批计划。变更路径：

```text
harness/README.md
requirements/REQ-0004/contract.md
requirements/REQ-0004/handoff.md
requirements/REQ-0004/plan.md
requirements/REQ-0004/review-feedback.md
requirements/REQ-0004/security-baseline.md
requirements/REQ-0004/state.json
requirements/REQ-0004/traceability.md
requirements/REQ-0004/verification.md
```

# 需求追踪

| 验收标准 | 实现位置 | 验证方式 | 结果 |
| --- | --- | --- | --- |
| AC-001 | `harness/README.md` | 对照 `AGENTS.md` 与 `harness/PROCESS.md` 人工审阅 | PASS |
| AC-002 | `harness/README.md` | 检查 Mermaid 时序图的参与者、主路径和返工分支 | PASS |
| AC-003 | `harness/README.md` | 对照 Harness 文件树及脚本读写行为逐项核查 | PASS |
| AC-004 | `harness/README.md` | 对照 `package.json` 与 `harness/scripts/harness.mjs` 核查命令 | PASS |
| AC-005 | `harness/README.md` | 对照状态机、CI、模板和运行时实现人工审阅 | PASS |
| AC-006 | 全仓库 | `npm run harness:verify -- REQ-0004` | PASS |



# 验证

需求：REQ-0004
生成时间：2026-10-12T03:42:13.537Z
总体结果：PASS

| 门禁 | 命令 | 结果 | 耗时 |
| --- | --- | --- | --- |
| 类型检查 | `npm run check` | PASS | 2819 ms |
| 测试 | `npm test` | PASS | 993 ms |
| 构建 | `npm run build` | PASS | 2654 ms |

## 失败详情

无。


# 审阅指南

1. 阅读 `contract.md` 和 `plan.md`；
2. 审阅 Harness 策略与可执行状态约束；
3. 对照每条追踪记录检查验证证据。

# 风险与回退

风险等级：**low**。回退本需求提交即可恢复之前的工作流。

# 已知缺口与例外

没有已批准的门禁例外。未解决事项以 Requirement Contract 和审阅反馈中的记录为准。

# 交付管控证据

- [需求契约](./contract.md)
- [实施计划](./plan.md)
- [追踪矩阵](./traceability.md)
- [验证证据](./verification.md)
- [审阅反馈](./review-feedback.md)
- [安全基线](./security-baseline.md)
