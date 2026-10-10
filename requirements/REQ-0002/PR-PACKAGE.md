# REQ-0002：将项目内全部 Markdown 文档中文化

# 背景与原因

详见 [Requirement Contract](./contract.md)。

# 变更内容

已执行获批计划。变更路径：

```text
.github/pull_request_template.md
AGENTS.md
CLAUDE.md
GLOSSARY.md
data/sample-documents/design-notes.md
data/sample-documents/retrieval-plan.md
docs/adr/0001-git-tracked-requirement-harness.md
harness/PROCESS.md
harness/scripts/harness.mjs
harness/templates/PULL_REQUEST.md
harness/templates/exception.md
harness/templates/requirement/contract.md
harness/templates/requirement/handoff.md
harness/templates/requirement/plan.md
harness/templates/requirement/review-feedback.md
harness/templates/requirement/traceability.md
harness/templates/requirement/verification.md
quality-document.md
requirements/REQ-0001/contract.md
requirements/REQ-0001/design-interview.md
requirements/REQ-0001/handoff.md
requirements/REQ-0001/plan.md
requirements/REQ-0001/review-feedback.md
requirements/REQ-0001/security-baseline.md
requirements/REQ-0001/traceability.md
requirements/REQ-0001/verification.md
version.md
requirements/REQ-0002/contract.md
requirements/REQ-0002/handoff.md
requirements/REQ-0002/plan.md
requirements/REQ-0002/review-feedback.md
requirements/REQ-0002/state.json
requirements/REQ-0002/traceability.md
requirements/REQ-0002/verification.md
```

# 需求追踪

| 验收标准 | 实现位置 | 验证方式 | 结果 |
| --- | --- | --- | --- |
| AC-001 | 全部受控 `.md` 文件 | Markdown 清单与英文残留扫描 | PASS |
| AC-002 | 全部受控 `.md` 文件 | 命令、路径和状态值人工复核 | PASS |
| AC-003 | `AGENTS.md`、`CLAUDE.md`、`harness/PROCESS.md` | Agent 指令审阅 | PASS |
| AC-004 | `harness/templates/`、`harness/scripts/harness.mjs` | 生成 REQ-0002 PR Package | PASS |
| AC-005 | `harness/scripts/harness.mjs`、Harness 测试 | 需求校验与 `npm test` | PASS |
| AC-006 | 项目门禁 | `npm run harness:verify -- REQ-0002` | PASS |



# 验证

需求：REQ-0002
生成时间：2026-10-10T05:30:57.533Z
总体结果：PASS

| 门禁 | 命令 | 结果 | 耗时 |
| --- | --- | --- | --- |
| 类型检查 | `npm run check` | PASS | 2565 ms |
| 测试 | `npm test` | PASS | 854 ms |
| 构建 | `npm run build` | PASS | 3668 ms |

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
