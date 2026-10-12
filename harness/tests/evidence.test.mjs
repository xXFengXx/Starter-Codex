import assert from 'node:assert/strict';
import test from 'node:test';
import { auditSummary, auditWithinBaseline, contentHash, parseExceptionRecord, sensitiveFindings, validateApprovalEvidence, validatePrEvidence } from '../lib/evidence.mjs';

test('approval evidence binds an authorized approver to an immutable snapshot', () => {
  const snapshotHash = contentHash([['contract.md', 'goal'], ['plan.md', 'steps']]);
  const valid = { requirementId: 'REQ-0005', approver: 'xXFengXx', source: 'local-confirmation', approvedAt: '2026-10-12T08:00:00.000Z', snapshotHash };
  assert.deepEqual(validateApprovalEvidence(valid, { requirementId: 'REQ-0005', snapshotHash, authorizedApprovers: ['xXFengXx'] }), []);
  assert.match(validateApprovalEvidence({ ...valid, approver: 'Codex' }, { requirementId: 'REQ-0005', snapshotHash, authorizedApprovers: ['xXFengXx'] }).join('\n'), /not authorized/);
  assert.match(validateApprovalEvidence({ ...valid, snapshotHash: 'sha256:forged' }, { requirementId: 'REQ-0005', snapshotHash, authorizedApprovers: ['xXFengXx'] }).join('\n'), /does not match/);
});

test('exception records fail closed when expired or unresolved', () => {
  const record = `---\ngate: dependency-audit\napprover: xXFengXx\napprovedAt: 2026-10-01T00:00:00.000Z\nexpiresAt: 2026-10-10T00:00:00.000Z\n---\n\n# 例外原因\n临时上游缺陷。\n\n# 影响\n仅影响开发依赖。\n\n# 补偿验证\n锁定版本并运行完整测试。\n`;
  assert.match(parseExceptionRecord(record, new Date('2026-10-12T00:00:00.000Z')).errors.join('\n'), /expired/);
});

test('sensitive patch scanner catches credentials but ignores prose about tokens', () => {
  assert.deepEqual(sensitiveFindings('+ Documentation discusses API tokens.'), []);
  const credential = ['sk', 'thisisafakebutlongcredential'].join('-');
  const assignment = `+ api_${'key'} = "${credential}"`;
  assert.deepEqual(sensitiveFindings(assignment), ['OpenAI key', 'assigned secret']);
});

test('dependency audit may retain but never expand an approved baseline', () => {
  const actual = auditSummary({ metadata: { vulnerabilities: { moderate: 5, high: 2 } } });
  assert.equal(auditWithinBaseline(actual, { info: 0, low: 0, moderate: 5, high: 2, critical: 0 }), true);
  assert.equal(auditWithinBaseline({ ...actual, critical: 1 }, { info: 0, low: 0, moderate: 5, high: 2, critical: 0 }), false);
});

test('PR evidence requires merge or acceptance by an authorized approver', () => {
  const base = { url: 'https://github.com/xXFengXx/Starter-Codex/pull/1', recordedAt: '2026-10-12T08:00:00.000Z' };
  assert.deepEqual(validatePrEvidence({ ...base, status: 'merged' }, ['xXFengXx']), []);
  assert.match(validatePrEvidence({ ...base, status: 'accepted', acceptedBy: 'Codex' }, ['xXFengXx']).join('\n'), /not from an authorized/);
});
