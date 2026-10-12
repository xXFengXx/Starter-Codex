---
requirementId: REQ-0004
title: 为需求交付 Harness 编写 README
risk: low
owner: 需求提出人
source: 用户于 2026-10-10 提出的直接需求
---

# 目标

为仓库内的需求交付 Harness 提供一份中文 README，使维护者和编码 Agent 能快速理解整体生命周期、命令调用链、关键文件职责以及验证与 PR Package 的生成方式。

# 范围

- 在 `harness/README.md` 中说明 Harness 的用途、权威来源和适用边界。
- 使用 Mermaid 时序图描述从接收需求、人工批准、实施、验证、审阅到完成的完整交互。
- 说明 `AGENTS.md`、`harness/PROCESS.md`、`package.json`、`harness/scripts/harness.mjs`、模板、状态 schema、需求目录、运行时目录和 CI 工作流分别承担的职责。
- 列出常用命令、状态转换规则、质量门禁、失败处理和典型操作顺序。
- README 内容必须与仓库当前实现一致，并通过链接指向相关文件，避免复制第二套权威规则。

# 非目标

- 不改变 Harness 脚本、状态机、质量门禁、模板或 CI 行为。
- 不修改产品功能或 `REQ-0003` 的交付内容。
- 不引入新的文档生成工具或运行时依赖。

# 约束

- `AGENTS.md` 与 `harness/PROCESS.md` 仍是规则的权威来源；README 只能解释和导航。
- 时序图使用 GitHub 可渲染的 Mermaid 语法。
- 文档中的命令、路径和状态必须从当前仓库文件核实，不得臆造。
- 变更必须位于 `requirement/REQ-0004-harness-readme` 独立分支，并遵循完整 Harness 生命周期。

# 验收标准

- **AC-001**: `harness/README.md` 清晰说明 Harness 的目标、权威规则来源、生命周期及人工批准边界。
- **AC-002**: README 包含可读的 Mermaid 时序图，覆盖需求建档、校验、状态转换、实施、隔离验证、PR Package、审阅反馈及完成。
- **AC-003**: README 逐项说明关键入口和文件/目录的职责，并解释它们在调用链中读写什么。
- **AC-004**: README 提供与 `package.json` 及 `harness/scripts/harness.mjs` 一致的命令参考和推荐操作顺序。
- **AC-005**: README 说明状态门禁、失败证据、例外、隔离运行时、CI 与 PR Package 的关系，不把 README 表述为新的权威规范。
- **AC-006**: `npm run check`、`npm test`、`npm run build` 以及 `npm run harness:verify -- REQ-0004` 全部通过。

# 风险

- 文档可能随实现演进而失真；通过引用权威文件、从脚本核对命令，并避免复制过细规则来降低风险。
- Mermaid 图可能因语法错误无法渲染；通过静态检查代码块结构和人工审阅节点关系缓解。

# 验证预期

- 对照 `package.json`、`harness/scripts/harness.mjs`、模板和 CI 配置进行静态核查。
- 检查 Mermaid 代码块存在且包含完整的成功路径和审阅返工路径。
- 执行 Requirement Contract、追踪及完整 Harness 门禁。

