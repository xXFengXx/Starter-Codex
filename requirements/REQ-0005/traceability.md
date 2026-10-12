# 追踪矩阵

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

