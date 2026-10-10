import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { performance } from 'node:perf_hooks';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const REQUIREMENTS = join(ROOT, 'requirements');
const RUNTIME = join(ROOT, '.harness', 'runtime');
const states = ['intake', 'clarified', 'planned', 'approved', 'implementing', 'verifying', 'review-ready', 'completed', 'blocked', 'cancelled'];
const forward = {
  intake: 'clarified', clarified: 'planned', planned: 'approved', approved: 'implementing',
  implementing: 'verifying', verifying: 'review-ready', 'review-ready': 'completed',
};

function fail(message) {
  throw new Error(message);
}

function requirementDir(id) {
  if (!/^REQ-\d{4,}$/.test(id ?? '')) fail('Requirement ID must match REQ-0001.');
  const dir = join(REQUIREMENTS, id);
  if (!existsSync(dir)) fail(`Requirement directory not found: requirements/${id}`);
  return dir;
}

function read(path) {
  return readFileSync(path, 'utf8');
}

function readState(id) {
  const state = JSON.parse(read(join(requirementDir(id), 'state.json')));
  if (state.requirementId !== id) fail('state.json requirementId does not match its directory.');
  if (!states.includes(state.state)) fail(`Unknown lifecycle state: ${state.state}`);
  if (!['low', 'medium', 'high'].includes(state.risk)) fail(`Unknown risk: ${state.risk}`);
  if (!Array.isArray(state.history) || state.history.length === 0) fail('state history must not be empty.');
  return state;
}

function frontmatter(markdown) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) fail('contract.md requires YAML frontmatter.');
  return Object.fromEntries(match[1].split(/\r?\n/).filter(Boolean).map((line) => {
    const index = line.indexOf(':');
    if (index < 1) fail(`Invalid frontmatter line: ${line}`);
    return [line.slice(0, index).trim(), line.slice(index + 1).trim()];
  }));
}

function acceptanceCriteria(markdown) {
  return [...new Set(markdown.match(/AC-\d{3}/g) ?? [])];
}

function validate(id, { quiet = false } = {}) {
  const dir = requirementDir(id);
  const required = ['contract.md', 'plan.md', 'state.json', 'traceability.md', 'verification.md', 'handoff.md', 'review-feedback.md'];
  const errors = [];
  for (const name of required) if (!existsSync(join(dir, name))) errors.push(`Missing ${name}`);
  if (errors.length) fail(errors.join('\n'));

  const contract = read(join(dir, 'contract.md'));
  const meta = frontmatter(contract);
  const state = readState(id);
  for (const key of ['requirementId', 'title', 'risk', 'owner', 'source']) {
    if (!meta[key] || /replace|unassigned|link-or-path/i.test(meta[key])) errors.push(`contract.md has unresolved ${key}`);
  }
  if (meta.requirementId !== id) errors.push('contract.md requirementId does not match its directory.');
  if (meta.risk !== state.risk) errors.push('Risk differs between contract.md and state.json.');
  for (const [heading, legacyHeading] of [['目标', 'Goal'], ['范围', 'Scope'], ['非目标', 'Non-goals'], ['约束', 'Constraints'], ['验收标准', 'Acceptance criteria'], ['风险', 'Risks'], ['验证预期', 'Verification expectations']]) {
    if (!new RegExp(`^# (${heading}|${legacyHeading})$`, 'mi').test(contract)) errors.push(`Missing contract section: ${heading}`);
  }
  const criteria = acceptanceCriteria(contract);
  if (criteria.length === 0) errors.push('At least one numbered acceptance criterion is required.');
  const traceability = read(join(dir, 'traceability.md'));
  for (const criterion of criteria) if (!traceability.includes(`| ${criterion} |`)) errors.push(`Traceability row missing for ${criterion}`);
  if (['review-ready', 'completed'].includes(state.state)) {
    if (/\|\s*(pending|待处理)\s*\|/i.test(traceability)) errors.push('Traceability still contains pending results.');
    if (!/^(Overall: PASS|总体结果：PASS)$/mi.test(read(join(dir, 'verification.md')))) errors.push('Latest verification is not PASS.');
  }
  if (errors.length) fail(errors.join('\n'));
  if (!quiet) console.log(`PASS ${id}: contract, state, and ${criteria.length} acceptance criteria are valid.`);
  return { criteria, meta, state };
}

function transition(id, next, actor, note = '') {
  if (!actor) fail('Transition requires --actor <name>.');
  if (!states.includes(next)) fail(`Unknown target state: ${next}`);
  const dir = requirementDir(id);
  const state = readState(id);
  let allowed = next === 'blocked' || next === 'cancelled' || forward[state.state] === next;
  if (state.state === 'blocked' && next === state.blockedFrom) allowed = true;
  if (state.state === 'review-ready' && next === 'implementing') allowed = true;
  if (!allowed) fail(`Invalid transition: ${state.state} -> ${next}`);
  if (['clarified', 'planned', 'approved', 'implementing', 'verifying', 'review-ready', 'completed'].includes(next)) validate(id, { quiet: true });
  if (next === 'implementing') {
    const branch = execFileSync('git', ['branch', '--show-current'], { cwd: ROOT, encoding: 'utf8' }).trim();
    if (!branch.includes(id)) fail(`Branch '${branch}' does not contain ${id}.`);
  }
  if (next === 'review-ready' && !/^(Overall: PASS|总体结果：PASS)$/mi.test(read(join(dir, 'verification.md')))) fail('Verification must PASS before review-ready.');
  if (next === 'completed' && !existsSync(join(dir, 'PR-PACKAGE.md'))) fail('PR-PACKAGE.md is required before completion.');
  const now = new Date().toISOString();
  const previous = state.state;
  if (next === 'blocked') state.blockedFrom = previous;
  if (state.state === 'blocked' && next !== 'blocked') delete state.blockedFrom;
  state.state = next;
  state.updatedAt = now;
  state.history.push({ from: previous, to: next, actor, at: now, ...(note ? { note } : {}) });
  writeFileSync(join(dir, 'state.json'), `${JSON.stringify(state, null, 2)}\n`);
  console.log(`PASS ${id}: ${previous} -> ${next}`);
}

function runGate(label, command, args) {
  const started = performance.now();
  const result = spawnSync(command, args, { cwd: ROOT, encoding: 'utf8', shell: process.platform === 'win32' });
  return {
    label, command: [command, ...args].join(' '), status: result.status === 0 ? 'PASS' : 'FAIL',
    durationMs: Math.round(performance.now() - started), output: `${result.stdout ?? ''}${result.stderr ?? ''}`.trim(),
  };
}

function verify(id) {
  const { state } = validate(id, { quiet: true });
  if (state.state !== 'verifying') fail(`Verification requires state 'verifying', found '${state.state}'.`);
  resetRuntime();
  const results = [
    runGate('类型检查', 'npm', ['run', 'check']),
    runGate('测试', 'npm', ['test']),
    runGate('构建', 'npm', ['run', 'build']),
  ];
  const overall = results.every((result) => result.status === 'PASS') ? 'PASS' : 'FAIL';
  const lines = ['# 验证证据', '', `需求：${id}`, `生成时间：${new Date().toISOString()}`, `总体结果：${overall}`, '', '| 门禁 | 命令 | 结果 | 耗时 |', '| --- | --- | --- | --- |'];
  for (const result of results) lines.push(`| ${result.label} | \`${result.command}\` | ${result.status} | ${result.durationMs} ms |`);
  lines.push('', '## 失败详情', '');
  const failures = results.filter((result) => result.status === 'FAIL');
  if (!failures.length) lines.push('无。');
  for (const result of failures) lines.push(`### ${result.label}`, '', '```text', result.output.slice(-6000), '```', '');
  writeFileSync(join(requirementDir(id), 'verification.md'), `${lines.join('\n')}\n`);
  console.log(`${overall} ${id}: verification evidence written.`);
  if (overall === 'FAIL') process.exitCode = 1;
}

function generatePr(id) {
  const { meta, state } = validate(id, { quiet: true });
  if (!['verifying', 'review-ready'].includes(state.state)) fail('PR Package may only be generated during verifying or review-ready.');
  const dir = requirementDir(id);
  const statusOutput = execFileSync('git', ['status', '--short', '--untracked-files=all'], { cwd: ROOT, encoding: 'utf8' });
  const changed = statusOutput
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => line.slice(3))
    .filter((path) => !path.endsWith('PR-PACKAGE.md'))
    .join('\n') || 'No branch diff detected.';
  const securityEvidence = existsSync(join(dir, 'security-baseline.md')) ? '- [安全基线](./security-baseline.md)\n' : '';
  const content = `# ${id}：${meta.title}\n\n# 背景与原因\n\n详见 [Requirement Contract](./contract.md)。\n\n# 变更内容\n\n已执行获批计划。变更路径：\n\n\`\`\`text\n${changed}\n\`\`\`\n\n# 需求追踪\n\n${read(join(dir, 'traceability.md')).replace(/^# (Traceability|追踪矩阵)\s*/i, '')}\n\n# 验证\n\n${read(join(dir, 'verification.md')).replace(/^# (Verification Evidence|验证证据)\s*/i, '')}\n\n# 审阅指南\n\n1. 阅读 \`contract.md\` 和 \`plan.md\`；\n2. 审阅 Harness 策略与可执行状态约束；\n3. 对照每条追踪记录检查验证证据。\n\n# 风险与回退\n\n风险等级：**${state.risk}**。回退本需求提交即可恢复之前的工作流。\n\n# 已知缺口与例外\n\n没有已批准的门禁例外。未解决事项以 Requirement Contract 和审阅反馈中的记录为准。\n\n# 交付管控证据\n\n- [需求契约](./contract.md)\n- [实施计划](./plan.md)\n- [追踪矩阵](./traceability.md)\n- [验证证据](./verification.md)\n- [审阅反馈](./review-feedback.md)\n${securityEvidence}`;
  writeFileSync(join(dir, 'PR-PACKAGE.md'), content);
  console.log(`PASS ${id}: PR-PACKAGE.md generated.`);
}

function resetRuntime() {
  const safe = resolve(RUNTIME);
  if (!safe.startsWith(resolve(ROOT, '.harness') + '\\') && !safe.startsWith(resolve(ROOT, '.harness') + '/')) fail('Refusing to reset outside .harness.');
  rmSync(safe, { recursive: true, force: true });
  mkdirSync(join(safe, 'app-data'), { recursive: true });
  writeFileSync(join(safe, 'README.txt'), 'Disposable Harness runtime data. Safe to reset.\n');
  console.log('PASS isolated Harness runtime reset.');
}

function doctor() {
  const required = ['AGENTS.md', 'CLAUDE.md', 'harness/PROCESS.md', 'package.json', '.nvmrc'];
  for (const path of required) if (!existsSync(join(ROOT, path))) fail(`Missing ${path}`);
  const major = Number(process.versions.node.split('.')[0]);
  if (major < 22) fail(`Node 22+ required; found ${process.version}`);
  execFileSync('git', ['--version'], { cwd: ROOT, stdio: 'ignore' });
  console.log(`PASS environment: Node ${process.version}, Git available, Harness files present.`);
}

function benchmark() {
  const ids = existsSync(REQUIREMENTS) ? readdirSync(REQUIREMENTS).filter((name) => /^REQ-\d{4,}$/.test(name)) : [];
  const started = performance.now();
  for (let round = 0; round < 20; round += 1) for (const id of ids) validate(id, { quiet: true });
  const duration = Math.round((performance.now() - started) * 100) / 100;
  console.log(JSON.stringify({ benchmark: 'requirement-validation', requirements: ids.length, iterations: 20, durationMs: duration }));
}

function ci() {
  doctor();
  const ids = readdirSync(REQUIREMENTS).filter((name) => /^REQ-\d{4,}$/.test(name));
  for (const id of ids) validate(id);
  for (const [label, command, args] of [['TypeScript', 'npm', ['run', 'check']], ['Tests', 'npm', ['test']], ['Build', 'npm', ['run', 'build']]]) {
    const result = runGate(label, command, args);
    console.log(`${result.status} ${label} (${result.durationMs} ms)`);
    if (result.status === 'FAIL') fail(result.output);
  }
}

const [command, id, target, ...rest] = process.argv.slice(2);
try {
  if (command === 'doctor') doctor();
  else if (command === 'validate') validate(id);
  else if (command === 'status') console.log(JSON.stringify(readState(id), null, 2));
  else if (command === 'transition') {
    transition(id, target, rest[0] ?? '', rest.slice(1).join(' '));
  } else if (command === 'reset') resetRuntime();
  else if (command === 'verify') verify(id);
  else if (command === 'pr') generatePr(id);
  else if (command === 'benchmark') benchmark();
  else if (command === 'ci') ci();
  else fail('Usage: harness.mjs <doctor|validate|status|transition|reset|verify|pr|benchmark|ci>');
} catch (error) {
  console.error(`FAIL ${error.message}`);
  process.exitCode = 1;
}

