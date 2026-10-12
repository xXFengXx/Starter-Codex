import { createHash } from 'node:crypto';

export function contentHash(parts) {
  const hash = createHash('sha256');
  for (const [name, content] of parts) hash.update(`${name}\0${content.length}\0${content}\0`);
  return `sha256:${hash.digest('hex')}`;
}

export function validateApprovalEvidence(evidence, { requirementId, snapshotHash, authorizedApprovers }) {
  const errors = [];
  if (!evidence || typeof evidence !== 'object') return ['approval evidence must be an object'];
  if (evidence.requirementId !== requirementId) errors.push('approval requirementId does not match');
  if (!authorizedApprovers.includes(evidence.approver)) errors.push('approval approver is not authorized');
  if (!['github', 'local-confirmation'].includes(evidence.source)) errors.push('approval source is not trusted');
  if (evidence.snapshotHash !== snapshotHash) errors.push('approval snapshot does not match current contract and plan');
  if (!Number.isFinite(Date.parse(evidence.approvedAt))) errors.push('approval approvedAt must be an ISO date-time');
  return errors;
}

export function parseExceptionRecord(markdown, now = new Date()) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return { valid: false, errors: ['exception requires frontmatter'] };
  const meta = Object.fromEntries(match[1].split(/\r?\n/).filter(Boolean).map((line) => {
    const index = line.indexOf(':');
    return index < 1 ? [line, ''] : [line.slice(0, index).trim(), line.slice(index + 1).trim()];
  }));
  const errors = [];
  for (const key of ['gate', 'approver', 'approvedAt', 'expiresAt']) if (!meta[key]) errors.push(`exception missing ${key}`);
  const normalized = markdown.replace(/\r\n/g, '\n');
  for (const heading of ['例外原因', '影响', '补偿验证']) {
    const section = normalized.split(`\n# ${heading}\n`)[1]?.split('\n# ')[0]?.trim();
    if (!section || /说明|replace|todo/i.test(section)) errors.push(`exception section ${heading} is unresolved`);
  }
  const expiry = Date.parse(meta.expiresAt ?? '');
  if (!Number.isFinite(expiry)) errors.push('exception expiresAt must be an ISO date-time');
  else if (expiry <= now.getTime()) errors.push('exception is expired');
  if (!Number.isFinite(Date.parse(meta.approvedAt ?? ''))) errors.push('exception approvedAt must be an ISO date-time');
  return { valid: errors.length === 0, errors, meta };
}

export function sensitiveFindings(patch) {
  const rules = [
    ['private key', /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/i],
    ['GitHub token', /gh[opsu]_[A-Za-z0-9]{30,}/],
    ['OpenAI key', /sk-[A-Za-z0-9_-]{20,}/],
    ['assigned secret', /^\+[^+].*(?:api[_-]?key|secret|token|password)\s*[:=]\s*['\"][^'\"\s]{8,}['\"]/im],
  ];
  return rules.filter(([, pattern]) => pattern.test(patch)).map(([label]) => label);
}

export function auditSummary(auditJson) {
  const vulnerabilities = auditJson?.metadata?.vulnerabilities ?? {};
  return Object.fromEntries(['info', 'low', 'moderate', 'high', 'critical'].map((level) => [level, Number(vulnerabilities[level] ?? 0)]));
}

export function auditWithinBaseline(actual, baseline) {
  return ['info', 'low', 'moderate', 'high', 'critical'].every((level) => (actual[level] ?? 0) <= (baseline[level] ?? 0));
}

export function validatePrEvidence(evidence, authorizedApprovers) {
  const errors = [];
  if (!evidence || typeof evidence !== 'object') return ['PR evidence must be an object'];
  if (!evidence.url || !/^https:\/\/github\.com\//.test(evidence.url)) errors.push('PR evidence requires a GitHub URL');
  if (!Number.isFinite(Date.parse(evidence.recordedAt))) errors.push('PR evidence recordedAt must be an ISO date-time');
  if (evidence.status === 'accepted' && !authorizedApprovers.includes(evidence.acceptedBy)) errors.push('PR acceptance is not from an authorized approver');
  else if (evidence.status !== 'accepted' && evidence.status !== 'merged') errors.push('PR status must be merged or accepted');
  return errors;
}
