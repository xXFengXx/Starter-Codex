# 需求交付 Harness

本文定义软件需求从接收到形成可审计 PR 的统一领域语言。

## 术语

**Harness（交付管控系统）**：
管控需求解释、实施、验证和审阅呈现方式的项目级系统。
_避免使用_：提示词集合、Agent 指令

**Requirement Contract（需求契约）**：
对需求的规范化、可审阅表述，包含目标、范围、非目标、验收标准、约束、风险和验证预期。
_避免使用_：需求文件、工单副本

**Requirement ID（需求标识）**：
将一个需求的生命周期、决策、证据、实施分支和 PR Package 关联起来的唯一身份。
_避免使用_：分支名、工单号

**Source Issue（来源 Issue）**：
由受信任仓库成员在 GitHub 创建、作为一个需求原始来源的 Issue；它与一个 Requirement ID 和一个实现 PR 一一对应。
_避免使用_：需求契约、执行指令

**Authorized Approver（授权审批者）**：
有权代表项目批准需求进入实施阶段的仓库维护者。
_避免使用_：Issue 提交者、Agent

**Implementation Approval Signal（实施批准信号）**：
授权审批者在 GitHub 为 Source Issue 添加 `codex-approved` 标签所形成的、允许对应需求开始实施的可审计信号。
_避免使用_：自动批准、Issue 创建

**Approval Snapshot（批准快照）**：
Implementation Approval Signal 生效时，对 Source Issue、澄清答复、需求契约和计划形成的不可变身份；实施范围必须与该身份一致。
_避免使用_：Issue 当前内容、最新评论

**Revision Signal（修订信号）**：
授权审批者在 Delivery PR 上添加 `codex-revise` 标签所形成的、允许自动化根据未解决审阅意见重新进入实施阶段的可审计信号。
_避免使用_：普通评论、自动返工

**Intake Signal（接收信号）**：
授权审批者在符合结构化要求的 Source Issue 上添加 `codex-intake` 标签所形成的、允许 Harness 创建需求契约和 Delivery PR 的可审计信号。
_避免使用_：Issue 创建、实施批准

**Automation Identity（自动化身份）**：
代表 Autonomous Delivery Run 访问 OpenAI 和 GitHub 的非个人服务身份，其权限和有效期受具体工作流约束。
_避免使用_：维护者账号、个人访问令牌

**Harness Run（Harness 运行实例）**：
Harness 针对单个 Requirement ID 的一次隔离执行。
_避免使用_：Agent 会话、聊天

**Autonomous Delivery Run（自动交付运行）**：
由 GitHub Actions 触发、通过非交互式 Codex CLI 执行的后台交付过程；它受 Harness 管控且不依赖 Codex 桌面应用。
_避免使用_：无人监管、桌面会话

**Gate（门禁）**：
工作进入下一阶段前必须满足指定证据和批准条件的检查点。
_避免使用_：建议、提醒

**Exception Record（例外记录）**：
对未满足门禁、相关影响及补偿验证所作的显式批准且有期限的记录。
_避免使用_：跳过、豁免评论

**Verification Evidence（验证证据）**：
证明某条验收标准或质量条件已满足的可复现证据。
_避免使用_：Agent 声明、完成说明

**PR Package（PR 交付包）**：
将需求映射到实现、验证证据、风险、回退方案和已知缺口的标准化审阅材料。
_避免使用_：PR 摘要、变更日志

**Delivery PR（交付 PR）**：
与一个 Source Issue 和一个 Requirement ID 一一对应的 Pull Request；它从需求文档 Draft 开始，在实施和验证通过后进入可审阅状态，但不会自动合并。
_避免使用_：自动合并、需求 PR 与实现 PR

**Done（完成）**：
每条验收标准都有验证证据、全部强制门禁通过、不存在无关修改，且剩余缺口均已明确时的状态。
_避免使用_：已实现、代码完成
