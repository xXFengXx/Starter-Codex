# 实施计划

## 方案

在 `harness/scripts/harness.mjs` 中补两处行为：新增 `new` 子命令，复用现有模板目录完成建档；在 `transition` 中加入保留身份检查。保留身份写成脚本内常量 `RESERVED_ACTORS = ['codex', 'harness-agent']`，并在 `PROCESS.md` 中列出，避免新增配置文件。接入清单采用 Harness Agent 仓库 `ADAPT.md` 中的 Starter-Codex 示例，仅把建档命令的 actor 固定为 `harness-agent`。

测试沿用 `node --test`。需要写入需求目录的用例把 `harness/`、`package.json`、`AGENTS.md`、`CLAUDE.md`、`.nvmrc` 复制到临时目录后执行脚本，因为脚本以自身位置推导仓库根目录。

## 步骤

- [ ] `harness.mjs`：新增 `newRequirement(id, source, actor)` 与 `new` 分发；更新用法提示。
- [ ] `harness.mjs`：`transition` 在目标为 `approved` 或 `completed` 时拒绝保留身份。
- [ ] `package.json`：新增脚本 `requirement:new`。
- [ ] 新增 `harness/tests/requirement-new.test.mjs`，覆盖 AC-001 与 AC-002。
- [ ] 新增 `.harness-agent.yaml`。
- [ ] 更新 `harness/PROCESS.md` 的「新增需求」「批准者」相关章节，`AGENTS.md` 的启动步骤，`harness/README.md` 的命令表与操作示例。
- [ ] 运行 `harness-agent doctor .`，记录输出。
- [ ] 运行 `npm run harness:verify -- REQ-0005`，生成 PR Package。

## 验证计划

- AC-001、AC-002、AC-005：`npm test` 中的新用例。
- AC-003：`harness-agent doctor .`，输出以 `RESULT conforms` 结尾。
- AC-004：对照 `harness.mjs`、`package.json` 与 `.harness-agent.yaml` 人工审阅三份文档。
- AC-006：`npm run harness:verify -- REQ-0005`。

## 回退

回退本需求提交即可：恢复手工建档，取消保留身份检查，删除接入清单。已有需求目录与状态文件不受影响。
