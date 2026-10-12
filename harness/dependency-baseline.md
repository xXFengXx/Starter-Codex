# 依赖审计基线

记录时间：2026-10-12

`npm audit --json` 在 REQ-0005 实施前报告 7 个既有漏洞：5 个 moderate、2 个 high、0 个 critical。主要受影响包为直接依赖 `electron`、`uuid` 及 Electron 的传递依赖 `@electron/get`、`extract-zip`、`global-agent`、`roarr`、`sprintf-js`。

当前自动修复建议要求 Electron 与 UUID 的主版本升级，超出 REQ-0005 的批准范围，因此本需求只将各严重级别数量记录为不得扩大的基线，不执行 `npm audit fix --force`。依赖升级必须作为独立高风险需求评估兼容性、Electron 安全公告和回归测试。
