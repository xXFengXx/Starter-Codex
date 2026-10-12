---
status: accepted
---

# 由 GitHub Actions 调用 Codex CLI 完成受控自动交付

项目采用 GitHub Actions 作为 Source Issue 事件入口与薄编排层，在临时隔离 Runner 中调用非交互式 Codex CLI，并继续以仓库内 Harness 作为需求状态、验证证据和 PR 交付的唯一权威。低权限 intake 与高权限 implementation 分离；实施必须由授权维护者的 `codex-approved` 信号和不可变 Approval Snapshot 驱动，PR 最终合并仍由人完成。

## Considered Options

- 继续要求开发者打开 Codex 桌面应用：安全边界清晰，但无法满足无人值守需求。
- 首版直接使用 OpenAI Agents API 托管持久会话：具备托管 Harness 和恢复能力，但会同时引入新的运行时、回调与 GitHub 工具集成复杂度。
- GitHub Actions 调用 Codex CLI：复用当前 GitHub、Git、npm 和 Harness 工作流，首版集成路径最短，因此被采用。

## Consequences

- 必须先强化 Harness 的证据门禁，再开放自动产品代码修改。
- OpenAI 使用短期 OIDC 身份，GitHub 写操作使用受限 GitHub App，Issue 内容永远按不可信数据处理。
- 高风险或风险不确定的需求只生成合同和计划；所有自动实施结果必须经过完整门禁、独立只读 Codex审阅和人工合并。
- 架构保留未来迁移到 Agents API 的可能，但迁移不得改变 Requirement Contract、Harness Run 和 Delivery PR 的领域边界。
