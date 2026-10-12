# 审阅反馈

| 来源 | 发现 | 决定 | 后续动作 | 状态 |
| --- | --- | --- | --- | --- |
| 本地审阅 | 非法扩展名已在 Service 测试覆盖，但 AC-004 要求直接 IPC 绕过界面过滤也有明确证据。 | 接受 | 通过已注册的 `IMPORT_DOCUMENT` 处理器导入 `.pdf` 并断言拒绝。 | 已解决 |
| 用户运行反馈 | Electron 默认 sandbox 下，编译后的 preload 因依赖本地 `../shared/types` 模块而未暴露 `window.knowledgeBase`，点击 Import 报 `Cannot read properties of undefined (reading 'documents')`。 | 接受 | 将 preload 打包为单文件并增加隐藏 Electron 窗口回归测试，保留 sandbox。 | 已解决 |
