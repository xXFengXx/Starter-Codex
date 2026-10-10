# REQ-0001: Establish a standardized requirement delivery Harness

# Why

See [Requirement Contract](./contract.md).

# What

Implemented the approved plan. Changed paths:

```text
AGENTS.md
package.json
src/renderer/App.tsx
src/renderer/components/ConversationHistory.tsx
src/renderer/components/DocumentDetail.tsx
src/renderer/components/DocumentList.tsx
src/renderer/components/ImportPanel.tsx
src/renderer/components/StatusBar.tsx
src/services/qa-service.ts
.env.example
.github/pull_request_template.md
.github/workflows/harness.yml
.gitignore
.nvmrc
CLAUDE.md
docs/adr/0001-git-tracked-requirement-harness.md
feature_list.json
harness/PROCESS.md
harness/schemas/state.schema.json
harness/scripts/harness.mjs
harness/templates/PULL_REQUEST.md
harness/templates/exception.md
harness/templates/requirement/contract.md
harness/templates/requirement/handoff.md
harness/templates/requirement/plan.md
harness/templates/requirement/review-feedback.md
harness/templates/requirement/state.json
harness/templates/requirement/traceability.md
harness/templates/requirement/verification.md
harness/tests/harness.test.mjs
package-lock.json
requirements/REQ-0001/contract.md
requirements/REQ-0001/design-interview.md
requirements/REQ-0001/handoff.md
requirements/REQ-0001/plan.md
requirements/REQ-0001/review-feedback.md
requirements/REQ-0001/security-baseline.md
requirements/REQ-0001/state.json
requirements/REQ-0001/traceability.md
requirements/REQ-0001/verification.md
scripts/init.ps1
scripts/init.sh
```

# Requirement traceability

| Acceptance criterion | Implementation | Verification | Result |
| --- | --- | --- | --- |
| AC-001 | `AGENTS.md`, `harness/PROCESS.md` | Contract validation and document review | PASS |
| AC-002 | `AGENTS.md`, `CLAUDE.md` | Harness unit test and document review | PASS |
| AC-003 | `harness/scripts/harness.mjs`, `harness/schemas/state.schema.json` | `npm test`; invalid transition smoke test | PASS |
| AC-004 | `package.json`, `harness/scripts/harness.mjs`, `scripts/init.ps1`, `scripts/init.sh` | `npm run harness:doctor`; reset/benchmark smoke tests | PASS |
| AC-005 | `.github/workflows/harness.yml`, `.nvmrc`, `package-lock.json` | Local equivalent `npm run harness:ci`; workflow review | PASS |
| AC-006 | `feature_list.json`, `quality-document.md` | JSON parse and baseline review | PASS |
| AC-007 | `requirements/REQ-0001/`, `requirements/REQ-0001/design-interview.md` | `npm run requirement:validate -- REQ-0001` | PASS |
| AC-008 | `harness/templates/PULL_REQUEST.md`, `.github/pull_request_template.md`, generated `PR-PACKAGE.md` | `npm run harness:pr -- REQ-0001` | PASS |



# Verification

Requirement: REQ-0001
Generated: 2026-10-10T05:12:31.305Z
Overall: PASS

| Gate | Command | Result | Duration |
| --- | --- | --- | --- |
| TypeScript | `npm run check` | PASS | 2610 ms |
| Tests | `npm test` | PASS | 867 ms |
| Build | `npm run build` | PASS | 5311 ms |

## Failure details

None.


# Review guide

1. Read `contract.md` and `plan.md`.
2. Review Harness policy and executable state enforcement.
3. Compare each traceability row with verification evidence.

# Risk and rollback

Risk: **medium**. Revert the requirement commit(s) to restore the previous workflow.

# Known gaps and exceptions

No approved gate exceptions. Product gaps listed in `feature_list.json` remain separate requirements. The dependency baseline has 7 audit findings (5 moderate, 2 high) in Electron/uuid dependency paths; resolving them requires separately reviewed major upgrades.

# Harness evidence

- [Contract](./contract.md)
- [Plan](./plan.md)
- [Traceability](./traceability.md)
- [Verification](./verification.md)
- [Review feedback](./review-feedback.md)
- [Security baseline](./security-baseline.md)
