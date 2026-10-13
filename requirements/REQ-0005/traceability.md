# 追踪矩阵

| 验收标准 | 实现位置 | 验证方式 | 结果 |
| --- | --- | --- | --- |
| AC-001 | `harness/scripts/harness.mjs`、`package.json` | `npm test`（`requirement-new.test.mjs`） | 待处理 |
| AC-002 | `harness/scripts/harness.mjs` | `npm test`（`requirement-new.test.mjs`） | 待处理 |
| AC-003 | `.harness-agent.yaml` | `harness-agent doctor .` | 待处理 |
| AC-004 | `harness/PROCESS.md`、`AGENTS.md`、`harness/README.md` | 对照实现人工审阅 | 待处理 |
| AC-005 | `harness/tests/requirement-new.test.mjs` | `npm test` | 待处理 |
| AC-006 | 全仓库 | `npm run harness:verify -- REQ-0005` | 待处理 |
