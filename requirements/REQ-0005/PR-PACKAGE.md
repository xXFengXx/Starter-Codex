# REQ-0005：强化 Harness 门禁与证据可信性

# 背景与原因

详见 [Requirement Contract](./contract.md)。

# 变更内容

已执行获批计划。变更路径：

```text
GLOSSARY.md
docs/adr/0002-github-issue-autonomous-delivery.md
harness/PROCESS.md
harness/dependency-baseline.md
harness/lib/evidence.mjs
harness/policy.json
harness/schemas/approval.schema.json
harness/schemas/pr-evidence.schema.json
harness/scripts/harness.mjs
harness/templates/exception.md
harness/tests/evidence.test.mjs
harness/tests/harness.test.mjs
package.json
requirements/REQ-0005/approval.json
requirements/REQ-0005/contract.md
requirements/REQ-0005/handoff.md
requirements/REQ-0005/plan.md
requirements/REQ-0005/review-feedback.md
requirements/REQ-0005/scope.json
requirements/REQ-0005/state.json
requirements/REQ-0005/traceability.md
requirements/REQ-0005/verification.md
```

# 需求追踪

| 验收标准 | 实现位置 | 验证方式 | 结果 |
| --- | --- | --- | --- |
| AC-001 | `harness/scripts/harness.mjs`、`harness/tests/harness.test.mjs` | 干净工作树 base...HEAD diff 测试 | PASS |
| AC-002 | `harness/lib/evidence.mjs`、`harness/policy.json`、`approval.json` | 审批身份与快照哈希测试 | PASS |
| AC-003 | `harness/scripts/harness.mjs`、`harness/policy.json` | 各强制门禁与依赖基线检查 | PASS |
| AC-004 | `harness/templates/exception.md`、`harness/lib/evidence.mjs` | 无效、过期与未授权例外测试 | PASS |
| AC-005 | `harness/scripts/harness.mjs`、`harness/schemas/pr-evidence.schema.json` | 合并、接受和缺失证据规则测试 | PASS |
| AC-006 | `harness/scripts/harness.mjs`、`.harness/runtime/` | 默认分支隔离 worktree 门禁 | PASS |
| AC-007 | `harness/tests/evidence.test.mjs`、`harness/tests/harness.test.mjs` | `npm test` | PASS（11/11） |
| AC-008 | `harness/PROCESS.md`、`GLOSSARY.md`、`docs/adr/`、`harness/policy.json` | doctor、文档审阅、全局门禁 | PASS |



# 验证

需求：REQ-0005
生成时间：2026-10-12T11:09:38.716Z
总体结果：PASS

| 门禁 | 命令 | 结果 | 耗时 |
| --- | --- | --- | --- |
| 默认分支基线 | `isolated base check/test/build` | PASS | 19086 ms |
| 类型检查 | `npm run check` | PASS | 4195 ms |
| 测试 | `npm test` | PASS | 1880 ms |
| 构建 | `npm run build` | PASS | 3435 ms |
| 范围检查 | `harness scope audit` | PASS | 431 ms |
| 敏感信息检查 | `harness sensitive-data audit` | PASS | 468 ms |
| 依赖审计 | `npm audit --json` | PASS | 4213 ms |
| 例外记录检查 | `harness exception audit` | PASS | 1 ms |

## 失败详情

无。


# 审阅指南

1. 阅读 `contract.md` 和 `plan.md`；
2. 审阅 Harness 策略与可执行状态约束；
3. 对照每条追踪记录检查验证证据。

# 风险与回退

风险等级：**high**。回退本需求提交即可恢复之前的工作流。

# 已知缺口与例外

没有已批准的门禁例外。

# 交付管控证据

- [需求契约](./contract.md)
- [实施计划](./plan.md)
- [追踪矩阵](./traceability.md)
- [验证证据](./verification.md)
- [审阅反馈](./review-feedback.md)
- [依赖审计基线](../../harness/dependency-baseline.md)
