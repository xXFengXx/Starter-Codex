# 追踪矩阵

| 验收标准 | 实现位置 | 验证方式 | 结果 |
| --- | --- | --- | --- |
| AC-001 | `harness/README.md` | 对照 `AGENTS.md` 与 `harness/PROCESS.md` 人工审阅 | PASS |
| AC-002 | `harness/README.md` | 检查 Mermaid 时序图的参与者、主路径和返工分支 | PASS |
| AC-003 | `harness/README.md` | 对照 Harness 文件树及脚本读写行为逐项核查 | PASS |
| AC-004 | `harness/README.md` | 对照 `package.json` 与 `harness/scripts/harness.mjs` 核查命令 | PASS |
| AC-005 | `harness/README.md` | 对照状态机、CI、模板和运行时实现人工审阅 | PASS |
| AC-006 | 全仓库 | `npm run harness:verify -- REQ-0004` | PASS |

