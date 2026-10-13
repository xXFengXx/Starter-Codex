# Harness Agent 接入检查

命令：`harness-agent doctor .`
生成时间：2026-10-13T09:52:17.1309013Z

```text
PASS .harness-agent.yaml matches schemaVersion 1
PASS manifest has no unfilled {{...}} placeholders
PASS instruction file exists: AGENTS.md
PASS instruction file exists: harness/PROCESS.md
PASS lifecycle roles map to distinct states
PASS paths.planWritable is scoped by {id}
PASS protected paths cover .harness-agent.yaml
PASS protected paths cover AGENTS.md
PASS protected paths cover harness/PROCESS.md
PASS setup[0] executable available: npm
PASS commands.create executable available: npm
PASS commands.validate executable available: npm
PASS commands.transition executable available: npm
PASS commands.verify executable available: npm
PASS commands.prBody executable available: npm
PASS git available
WARN gh not found on PATH; required by `harness-agent run` for reading Issues and opening PRs
WARN codex not found on PATH; required by `harness-agent run` for running coding sessions
PASS idFormat produces REQ-9001, which matches idPattern
PASS validate rejects a malformed Requirement ID
PASS create builds REQ-9001
PASS new requirement starts in intake
PASS history entries record target state and actor
PASS create records the Issue URL in contract.md#source
PASS create provides handoff.md
PASS transition refuses to skip straight to approval
PASS verify refuses to pass outside the verifying state
WARN reserved-actor rejection for approval was not exercised: reaching planned needs a filled contract; Harness Agent guards it after every session
RESULT conforms
```

