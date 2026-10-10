# REQ-0001：建立标准化需求交付 Harness

# 背景与原因

详见 [Requirement Contract](./contract.md)。

# 变更内容

建立由 Git 跟踪、工具无关的需求交付 Harness，包含统一指令、状态机、模板、验证命令、CI、PR Package 和当前质量基线。

# 需求追踪

详见 [追踪矩阵](./traceability.md)，AC-001 至 AC-008 均为 PASS。

# 验证

TypeScript、Harness 测试和生产构建全部通过，详见 [验证证据](./verification.md)。

# 审阅指南

1. 阅读 `contract.md` 和 `plan.md`；
2. 审阅 Harness 策略与可执行状态约束；
3. 对照每条追踪记录检查验证证据。

# 风险与回退

风险等级：**medium**。回退本需求提交即可恢复旧工作流。

# 已知缺口与例外

没有已批准的门禁例外。`feature_list.json` 中的产品缺口仍需独立需求处理。依赖基线还存在 7 项审计问题（5 项 moderate、2 项 high），修复需要单独审阅大版本升级。

# 交付管控证据

- [需求契约](./contract.md)
- [实施计划](./plan.md)
- [追踪矩阵](./traceability.md)
- [验证证据](./verification.md)
- [审阅反馈](./review-feedback.md)
- [安全基线](./security-baseline.md)
