# 追踪矩阵

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
