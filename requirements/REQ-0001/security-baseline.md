# 依赖安全基线

记录日期：2026-10-09

移除未使用的 Vitest 后，`npm audit` 报告 7 项已知问题：

- 5 项 moderate；
- 2 项 high；
- 0 项 critical。

剩余问题来自 Electron 33 和 uuid 9 的依赖路径。自动修复需要大版本升级，因此不在本次 medium 风险 Harness 需求中强制执行。后续必须建立独立的 high 风险升级需求，并执行 Electron 运行时回归测试。

