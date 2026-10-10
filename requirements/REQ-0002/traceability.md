# 追踪矩阵

| 验收标准 | 实现位置 | 验证方式 | 结果 |
| --- | --- | --- | --- |
| AC-001 | 全部受控 `.md` 文件 | Markdown 清单与英文残留扫描 | PASS |
| AC-002 | 全部受控 `.md` 文件 | 命令、路径和状态值人工复核 | PASS |
| AC-003 | `AGENTS.md`、`CLAUDE.md`、`harness/PROCESS.md` | Agent 指令审阅 | PASS |
| AC-004 | `harness/templates/`、`harness/scripts/harness.mjs` | 生成 REQ-0002 PR Package | PASS |
| AC-005 | `harness/scripts/harness.mjs`、Harness 测试 | 需求校验与 `npm test` | PASS |
| AC-006 | 项目门禁 | `npm run harness:verify -- REQ-0002` | PASS |

