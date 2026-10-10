import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const cli = resolve(root, 'harness/scripts/harness.mjs');

function run(...args) {
  return spawnSync(process.execPath, [cli, ...args], { cwd: root, encoding: 'utf8' });
}

test('doctor confirms the checked-in Harness environment', () => {
  const result = run('doctor');
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /PASS environment/);
});

test('the active Requirement Contract is valid', () => {
  const result = run('validate', 'REQ-0001');
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /acceptance criteria are valid/);
});

test('invalid Requirement IDs fail closed', () => {
  const result = run('validate', 'feature-one');
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Requirement ID must match/);
});

test('PR generator source expands changed files without Git warnings', () => {
  const source = readFileSync(cli, 'utf8');
  assert.match(source, /--untracked-files=all/);
  assert.match(source, /execFileSync\('git', \['status'/);
  assert.match(source, /line\.slice\(3\)/);
});

