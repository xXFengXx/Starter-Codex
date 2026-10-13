# AGENTS.md — 需求交付 Harness

本仓库使用强制的“需求到 PR”Harness。本规则适用于 Codex、Cursor 及其他所有编码 Agent。

## 唯一事实来源

1. 修改代码前完整阅读 `harness/PROCESS.md`。
2. 每次只处理 `requirements/<Requirement ID>/` 下的一个需求目录。
3. 将 `contract.md`、`state.json` 和 `traceability.md` 视为权威状态。
4. 只有具备可复现验证证据时才能声明完成。
5. 门禁失败时必须停止推进；获得批准后使用 `harness/templates/exception.md` 记录例外。

`CLAUDE.md` 只是适配入口，不是第二套规则。发生冲突时，以本文件和 `harness/PROCESS.md` 为准。

## 启动步骤

运行：

```powershell
npm ci
npm run harness:doctor
npm run requirement:validate -- <Requirement ID>
```

开始实施前，需求必须处于 `approved` 状态。使用 `requirement/<Requirement ID>-<short-name>` 格式的独立分支；并行需求使用独立 worktree。

## 强制工作流

1. 接收：用 `npm run requirement:new -- <Requirement ID> <source>` 建档，再将原始请求规范化为 `contract.md`。
2. 澄清：解决全部歧义；使用 `AC-001`、`AC-002` 等编号标识验收标准。
3. 计划：创建 `plan.md`，并在 `traceability.md` 中映射每条验收标准。
4. 批准：修改产品代码前取得人工批准。`approved` 与 `completed` 只能以人的身份推进，`Codex` 与 `harness-agent` 会被拒绝；经 GitHub Issue 进入的需求按 `harness/PROCESS.md` 的「批准者」一节批准。
5. 实施：修改保持在批准范围内，并持续更新交接记录。
6. 验证：在干净、隔离的测试状态下运行 `npm run harness:verify -- <Requirement ID>`。
7. 审阅：运行 `npm run harness:pr -- <Requirement ID>`，检查生成的 PR Package。
8. 完成：只有全部门禁通过且 PR 已合并或被明确接受后，才能标记完成。

状态转换必须使用：

```powershell
npm run requirement:transition -- <Requirement ID> <next-state> <actor> "optional note"
```

## 质量门禁

每个需求都必须通过：

- Requirement Contract 校验；
- 验收标准追踪校验；
- `npm run check`；
- `npm test`；
- `npm run build`；
- 范围与敏感信息审查；
- PR Package 生成；
- 依赖审计结果审阅与记录。升级应作为具有相应风险等级的需求处理，不得静默强制修复。

风险专用检查只能增加门禁，不能削弱通用门禁。可以记录既有基线缺口，但新需求不得静默扩大缺口。

## 项目约定

- TypeScript 使用严格模式。
- 仅使用命名导出。
- IPC 通道统一定义在 `src/shared/types.ts`。
- Service 通过构造函数注入 `PersistenceService`。
- 自动化测试必须使用 `.harness/runtime/`，不得读写真实 Electron `userData`。
- 不提交 `.harness/runtime/`、生成的命令日志、依赖目录、构建产物、密钥或用户数据。

## 交接

未完成会话结束前，更新 `requirements/<Requirement ID>/handoff.md`，记录当前状态、已完成工作、决策、失败命令和精确的下一步。聊天记录不作为项目状态。
