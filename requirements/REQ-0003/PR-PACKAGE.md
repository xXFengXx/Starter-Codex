# REQ-0003：支持导入受限大小的 TXT 与 Markdown 文件

# 背景与原因

详见 [Requirement Contract](./contract.md)。

# 变更内容

已执行获批计划。变更路径：

```text
package.json
scripts/dev.js
src/main/ipc-handlers.ts
src/main/main.ts
src/preload/preload.ts
src/renderer/App.tsx
src/renderer/types.d.ts
src/services/document-service.ts
src/services/persistence-service.ts
src/shared/types.ts
harness/tests/import.test.mjs
harness/tests/preload-bridge.cjs
requirements/REQ-0003/contract.md
requirements/REQ-0003/handoff.md
requirements/REQ-0003/plan.md
requirements/REQ-0003/review-feedback.md
requirements/REQ-0003/state.json
requirements/REQ-0003/traceability.md
requirements/REQ-0003/verification.md
vite.preload.config.ts
```

# 需求追踪

| 验收标准 | 实现位置 | 验证方式 | 结果 |
| --- | --- | --- | --- |
| AC-001 | `src/main/ipc-handlers.ts`、`src/preload/preload.ts`、`src/renderer/App.tsx`、`vite.preload.config.ts` | sandbox preload 桥接、原生文件选择器过滤与取消场景测试 | PASS |
| AC-002 | `src/services/document-service.ts`、`src/renderer/App.tsx` | `.txt` 合法文件导入与列表刷新测试 | PASS |
| AC-003 | `src/services/document-service.ts`、`src/renderer/App.tsx` | `.md` 合法文件导入与列表刷新测试 | PASS |
| AC-004 | `src/services/document-service.ts`、`src/main/ipc-handlers.ts` | 大小写扩展名与直接 IPC 非法类型测试 | PASS |
| AC-005 | `src/services/document-service.ts` | `10,485,760` 与 `10,485,761` 字节边界测试 | PASS |
| AC-006 | `src/services/document-service.ts`、`src/services/persistence-service.ts`、`src/renderer/App.tsx` | 不存在、不可读及写入失败后的错误与残留检查 | PASS |
| AC-007 | `harness/tests/import.test.mjs`、`harness/tests/preload-bridge.cjs` | 导入功能与 sandbox preload 自动化测试套件 | PASS（10 项全套测试通过） |
| AC-008 | 全仓库 | `npm run check && npm test && npm run build && npm run harness:verify -- REQ-0003` | PASS |


# 验证

需求：REQ-0003
生成时间：2026-10-10T12:35:35.752Z
总体结果：PASS

| 门禁 | 命令 | 结果 | 耗时 |
| --- | --- | --- | --- |
| 类型检查 | `npm run check` | PASS | 2981 ms |
| 测试 | `npm test` | PASS | 3236 ms |
| 构建 | `npm run build` | PASS | 3266 ms |

## 失败详情

无。

## 缺陷回归证据

- `node --test --test-name-pattern "sandboxed Electron preload" harness/tests/import.test.mjs`：修复前 FAIL，输出 `knowledgeBase: undefined`；修复后 PASS，桥接对象及 `documents` API 均存在。
- preload 通过 `vite.preload.config.ts` 打包为单文件，Electron sandbox 保持启用。

## 范围与敏感信息审查

- `git diff --check`：PASS。
- 变更范围包含 REQ-0003 需求证据、导入流程、preload 构建配置及对应测试；未发现构建产物、运行时数据、密钥或用户数据进入变更集。
- 用户批准 Electron/esbuild 安装脚本后产生的 `allowScripts` 配置予以保留；未擅自处理工作区中的其他用户文件或目录。

## 依赖审计

- `npm audit --json`：此前已审阅，报告 7 个既有漏洞（5 个中危、2 个高危），涉及 `electron`、`uuid` 及其传递依赖；本次未改变依赖版本或锁文件。
- 可用修复要求 Electron 与 UUID 主版本升级，超出本需求范围并需要独立风险评估；未执行 `npm audit fix --force`。


# 审阅指南

1. 阅读 `contract.md` 和 `plan.md`；
2. 审阅 Harness 策略与可执行状态约束；
3. 对照每条追踪记录检查验证证据。

# 风险与回退

风险等级：**medium**。回退本需求提交即可恢复之前的工作流。

# 已知缺口与例外

没有已批准的门禁例外。未解决事项以 Requirement Contract 和审阅反馈中的记录为准。

# 交付管控证据

- [需求契约](./contract.md)
- [实施计划](./plan.md)
- [追踪矩阵](./traceability.md)
- [验证证据](./verification.md)
- [审阅反馈](./review-feedback.md)
