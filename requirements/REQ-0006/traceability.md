# 追踪矩阵

| 验收标准 | 实现位置 | 验证方式 | 结果 |
| --- | --- | --- | --- |
| AC-001 | 根目录 `README.md`“项目简介”和“当前能力” | 对照 `package.json` 描述、技术依赖与 `src/` 结构人工检查 | 已实施并完成自查；待 Harness Agent 最终验证 |
| AC-002 | 根目录 `README.md`“环境要求”和“安装与运行” | 对照 `.nvmrc` 与锁文件人工检查 | 已实施并完成自查；待 Harness Agent 最终验证 |
| AC-003 | 根目录 `README.md`“安装与运行” | 对照 `package.json` 的 `dev` 脚本与 `scripts/dev.js` 人工检查 | 已实施并完成自查；待 Harness Agent 最终验证 |
| AC-004 | 根目录 `README.md`“质量检查” | 对照 `package.json` scripts，并执行三个命令 | 已实施；`check`、`test`、`build` 自查通过，待 Harness Agent 最终验证 |
| AC-005 | 根目录 `README.md`“仓库结构” | 检查所列目录存在且描述与内容相符 | 已实施并完成自查；待 Harness Agent 最终验证 |
| AC-006 | 根目录 `README.md`“当前限制” | 对照 `feature_list.json` 的状态与证据人工检查 | 已实施并完成自查；待 Harness Agent 最终验证 |
