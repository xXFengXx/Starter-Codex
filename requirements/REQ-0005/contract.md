---
requirementId: REQ-0005
title: 强化 Harness 门禁与证据可信性
risk: high
owner: xXFengXx
source: design-interview-2026-10-12
---

# 目标

使 Harness 的实际校验能力与其文档承诺一致，在开放后台 Codex 自动写代码之前，确保批准、变更范围、验证、例外与完成状态都具有可复现、不可伪造的证据。

# 范围

- 使用目标基线与需求分支之间的 Git diff 生成范围证据，而非依赖工作树状态。
- 将授权审批者及 Approval Snapshot 作为可验证证据纳入状态转换。
- 实际执行并记录范围、敏感信息、依赖审计以及现有 `check`、`test`、`build` 门禁。
- 校验 Exception Record 的批准者、影响、补偿验证与到期条件，并呈现在 PR Package 中。
- 在进入 `completed` 前核验 Delivery PR 已合并或被授权审批者明确接受。
- 在干净、隔离的状态下建立并验证默认分支基线，防止新需求扩大既有缺口。
- 为新增门禁补充自动化测试、文档、领域术语和架构决策记录。

# 非目标

- 不实现 GitHub Issue 监听、Codex CLI 调用或自动创建远程 PR。
- 不配置 OpenAI OIDC、GitHub App 或生产仓库凭据。
- 不自动修复依赖漏洞或既有基线失败。
- 不改变“人工批准后才能实施、人工合并后才能完成”的治理原则。

# 约束

- 保持现有生命周期顺序，不得跳过 `approved` 或 `verifying`。
- 所有测试数据必须位于 `.harness/runtime/`，不得访问真实 Electron `userData`。
- 不能静默降低通用门禁；例外必须显式、获批且有期限。
- 不提交运行日志、依赖目录、构建产物、密钥或用户数据。
- 本需求完成并合并前，REQ-0006 不得启用自动产品代码修改。

# 验收标准

- **AC-001**: PR Package 的变更范围来自明确基线与 HEAD 的提交差异；工作树干净时仍能列出本需求的真实变更路径。
- **AC-002**: 进入 `approved` 的状态证据可绑定授权审批者和被批准内容的不可变身份，不能仅依靠任意自由文本 actor 声明。
- **AC-003**: `harness:verify` 实际执行并记录 `check`、`test`、`build`、范围检查、敏感信息检查和依赖审计，任何强制项失败都会阻止 `review-ready`。
- **AC-004**: Exception Record 会被结构化校验并包含影响、补偿验证、批准人和到期条件；无效或过期例外不能放行门禁。
- **AC-005**: 进入 `completed` 前必须存在可验证的 PR 合并证据或授权审批者明确接受证据；仅存在 PR Package 不足以完成需求。
- **AC-006**: 默认分支基线在干净隔离环境中验证；基线失败会阻塞需求且不会被归因或顺手修复到当前需求。
- **AC-007**: Harness 自动化测试覆盖成功、失败、伪造批准、过期例外、干净工作树 diff 和缺失 PR 接受证据等关键路径。
- **AC-008**: `AGENTS.md`、`harness/PROCESS.md`、领域词汇和 ADR 与实际门禁保持一致，且 `npm run harness:doctor` 能发现关键配置缺失。

# 风险

- 门禁实现变化可能阻塞已有需求；通过兼容性测试、清晰迁移说明和既有基线记录缓解。
- Git/GitHub 证据解析错误可能误判范围或完成状态；使用固定样例仓库与伪造事件测试缓解。
- 依赖与敏感信息扫描可能产生误报；只允许通过有期限的 Exception Record 处理。

# 验证预期

- `npm run harness:doctor`
- `npm run requirement:validate -- REQ-0005`
- `npm run check`
- `npm test`
- `npm run build`
- 针对 AC-001 至 AC-007 的隔离自动化测试和失败场景证据。
- 人工审阅 ADR、权限边界、迁移影响与回退方案。

