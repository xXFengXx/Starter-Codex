# 实施计划

## 方案

在 `harness/README.md` 增加面向使用者的导航文档，以 `harness/PROCESS.md` 为权威规则链接，以实际脚本和配置为事实依据。文档采用“入口与原则—时序图—文件职责—命令—状态与门禁—操作示例”的结构，让读者既能获得整体视图，也能定位到具体实现。

## 步骤

- [x] 核对 Harness 脚本、npm scripts、模板、schema、CI 与需求目录结构。
- [x] 编写包含完整主路径和审阅返工路径的 Mermaid 时序图。
- [x] 编写关键文件职责和读写关系说明。
- [x] 编写命令参考、状态门禁、隔离运行时、失败及例外处理说明。
- [x] 静态核查链接、命令、路径和 Mermaid 结构，并更新追踪矩阵。
- [x] 运行完整 Harness 验证并生成 PR Package。

## 验证计划

- AC-001 至 AC-005：人工对照仓库实现审阅 `harness/README.md`，并使用文本搜索确认必要章节、链接、命令和 Mermaid 节点。
- AC-006：运行 `npm run harness:verify -- REQ-0004`，由 Harness 依次执行类型检查、测试和构建。

## 回退

删除新增的 `harness/README.md` 和 `requirements/REQ-0004/`，或回退本需求提交即可恢复原状；本需求不改变运行时代码和持久化数据。

