import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const SOURCE = 'https://github.com/xXFengXx/Starter-Codex/issues/7';

// harness.mjs 以自身位置推导仓库根目录，写入需求目录的用例必须在副本中运行。
function sandbox(t) {
  const dir = mkdtempSync(join(tmpdir(), 'starter-harness-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  cpSync(join(root, 'harness'), join(dir, 'harness'), { recursive: true });
  return {
    dir,
    run: (...args) => spawnSync(process.execPath, [join(dir, 'harness/scripts/harness.mjs'), ...args], { cwd: dir, encoding: 'utf8' }),
    file: (id, name) => join(dir, 'requirements', id, name),
  };
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function setState(box, id, value) {
  const path = box.file(id, 'state.json');
  writeFileSync(path, JSON.stringify({ ...readJson(path), state: value }));
}

function fillContract(box, id) {
  const contract = readFileSync(box.file(id, 'contract.md'), 'utf8')
    .replace('title: 替换为简洁标题', 'title: 示例需求')
    .replace('owner: unassigned', 'owner: tester');
  writeFileSync(box.file(id, 'contract.md'), contract);
}

test('new copies the template, records the source, and starts in intake', (t) => {
  const box = sandbox(t);
  const result = box.run('new', 'REQ-0042', `${SOURCE}\n  extra words`, 'harness-agent');
  assert.equal(result.status, 0, result.stderr);

  const contract = readFileSync(box.file('REQ-0042', 'contract.md'), 'utf8');
  assert.match(contract, /^requirementId: REQ-0042$/m);
  assert.match(contract, new RegExp(`^source: ${SOURCE} extra words\\r?$`, 'm'));
  for (const name of ['plan.md', 'traceability.md', 'handoff.md', 'verification.md', 'review-feedback.md']) {
    assert.ok(existsSync(box.file('REQ-0042', name)), name);
    assert.doesNotMatch(readFileSync(box.file('REQ-0042', name), 'utf8'), /REQ-0000/);
  }

  const state = readJson(box.file('REQ-0042', 'state.json'));
  assert.equal(state.requirementId, 'REQ-0042');
  assert.equal(state.state, 'intake');
  assert.equal(state.history.length, 1);
  assert.equal(state.history[0].actor, 'harness-agent');
  assert.notEqual(state.history[0].at, '1970-01-01T00:00:00.000Z');
});

test('new defaults the actor to maintainer', (t) => {
  const box = sandbox(t);
  assert.equal(box.run('new', 'REQ-0042', 'docs/request.md').status, 0);
  assert.equal(readJson(box.file('REQ-0042', 'state.json')).history[0].actor, 'maintainer');
});

test('new fails closed on a bad ID, an existing directory, or a missing source', (t) => {
  const box = sandbox(t);
  const badId = box.run('new', 'feature-one', SOURCE);
  assert.notEqual(badId.status, 0);
  assert.match(badId.stderr, /Requirement ID must match/);
  assert.ok(!existsSync(join(box.dir, 'requirements', 'feature-one')));

  const noSource = box.run('new', 'REQ-0042', '   ');
  assert.notEqual(noSource.status, 0);
  assert.match(noSource.stderr, /requires a source/);
  assert.ok(!existsSync(join(box.dir, 'requirements', 'REQ-0042')));

  assert.equal(box.run('new', 'REQ-0042', SOURCE).status, 0);
  const before = readFileSync(box.file('REQ-0042', 'state.json'), 'utf8');
  const duplicate = box.run('new', 'REQ-0042', 'another-source');
  assert.notEqual(duplicate.status, 0);
  assert.match(duplicate.stderr, /already exists/);
  assert.equal(readFileSync(box.file('REQ-0042', 'state.json'), 'utf8'), before);
});

test('reserved automation actors cannot approve or complete', (t) => {
  const box = sandbox(t);
  assert.equal(box.run('new', 'REQ-0042', SOURCE).status, 0);
  for (const [current, target, actor] of [['planned', 'approved', 'Codex'], ['planned', 'approved', 'HARNESS-AGENT'], ['review-ready', 'completed', 'codex']]) {
    setState(box, 'REQ-0042', current);
    const before = readFileSync(box.file('REQ-0042', 'state.json'), 'utf8');
    const result = box.run('transition', 'REQ-0042', target, actor);
    assert.notEqual(result.status, 0, `${actor} -> ${target}`);
    assert.match(result.stderr, /reserved for automation/);
    assert.equal(readFileSync(box.file('REQ-0042', 'state.json'), 'utf8'), before);
  }
});

test('maintainers can still approve, and automation can still plan', (t) => {
  const box = sandbox(t);
  assert.equal(box.run('new', 'REQ-0042', SOURCE).status, 0);
  fillContract(box, 'REQ-0042');
  for (const [target, actor] of [['clarified', 'Codex'], ['planned', 'harness-agent'], ['approved', 'xXFengXx']]) {
    const result = box.run('transition', 'REQ-0042', target, actor);
    assert.equal(result.status, 0, `${actor} -> ${target}: ${result.stderr}`);
  }
  const last = readJson(box.file('REQ-0042', 'state.json')).history.at(-1);
  assert.equal(last.to, 'approved');
  assert.equal(last.actor, 'xXFengXx');
});
