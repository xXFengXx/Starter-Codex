# 追踪矩阵

| 验收标准 | 实现位置 | 验证方式 | 结果 |
| --- | --- | --- | --- |
| AC-001 | `AGENTS.md`、`harness/PROCESS.md` | 契约校验和文档审阅 | PASS |
| AC-002 | `AGENTS.md`、`CLAUDE.md` | Harness 单元测试和文档审阅 | PASS |
| AC-003 | `harness/scripts/harness.mjs`、`harness/schemas/state.schema.json` | `npm test`；非法转换冒烟测试 | PASS |
| AC-004 | `package.json`、`harness/scripts/harness.mjs`、初始化脚本 | 环境诊断、重置和基准冒烟测试 | PASS |
| AC-005 | GitHub Actions、`.nvmrc`、`package-lock.json` | 本地等价 CI 命令及工作流审阅 | PASS |
| AC-006 | `feature_list.json`、`quality-document.md` | JSON 解析和基线审阅 | PASS |
| AC-007 | `requirements/REQ-0001/`、设计访谈记录 | 需求校验 | PASS |
| AC-008 | PR 模板和生成的 `PR-PACKAGE.md` | PR Package 生成命令 | PASS |

