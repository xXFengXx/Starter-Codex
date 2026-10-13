# 追踪矩阵

| 验收标准 | 实现位置 | 验证方式 | 结果 |
| --- | --- | --- | --- |
| AC-001 | `harness/scripts/harness.mjs`（`newRequirement`）、`package.json` | `npm test`（`requirement-new.test.mjs` 前三个用例） | PASS |
| AC-002 | `harness/scripts/harness.mjs`（`transition`） | `npm test`（`requirement-new.test.mjs` 后两个用例） | PASS |
| AC-003 | `.harness-agent.yaml` | `harness-agent doctor .` 以 `RESULT conforms` 结尾，见 `verification-harness-agent.md` | PASS |
| AC-004 | `harness/PROCESS.md`、`AGENTS.md`、`harness/README.md` | 对照 `harness.mjs`、`package.json` 与 `.harness-agent.yaml` 人工审阅 | PASS |
| AC-005 | `harness/tests/requirement-new.test.mjs` | `npm test` | PASS |
| AC-006 | 全仓库 | `npm run harness:verify -- REQ-0005` | PASS |
