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

test('PR generator uses the committed branch diff instead of only working-tree status', () => {
  const source = readFileSync(cli, 'utf8');
  assert.match(source, /merge-base/);
  assert.match(source, /diff', '--name-only'/);
  assert.doesNotMatch(source, /git', \['status'/);
});

test('completion requires verifiable PR evidence', () => {
  const source = readFileSync(cli, 'utf8');
  assert.match(source, /pr-evidence\.json is required before completion/);
  assert.match(source, /validatePrEvidence/);
});

test('sensitive-data audit includes untracked file contents', () => {
  const source = readFileSync(cli, 'utf8');
  assert.match(source, /ls-files', '--others', '--exclude-standard/);
  assert.match(source, /read\(join\(ROOT, pathName\)\)/);
});

