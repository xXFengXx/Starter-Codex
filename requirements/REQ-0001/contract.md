---
requirementId: REQ-0001
title: Establish a standardized requirement delivery Harness
risk: medium
owner: xXFengXx
source: stakeholder design interview on 2026-10-09
---

# Goal

Make every requirement handled by Codex or Cursor follow one auditable path from intake to a consistent, low-friction PR Package.

# Scope

- Establish the instruction, tools, state, environment, and feedback subsystems.
- Normalize requirements into durable Requirement Contracts.
- Enforce lifecycle transitions and human approval gates.
- Provide deterministic local and CI verification commands.
- Generate a standardized PR Package with traceability and review guidance.
- Record the current product-quality baseline without disguising existing gaps.

# Non-goals

- Implement missing product features listed in `quality-document.md`.
- Automatically create a remote pull request before repository credentials and provider behavior are configured.
- Replace GitHub, Git, Codex, or Cursor with a proprietary orchestration service.

# Constraints

- Core workflow must be tool-independent and versioned in Git.
- Codex and Cursor adapters must use one canonical specification.
- Scripts must work on Windows and CI without requiring a database.
- Tests must never reset or write real Electron user data.
- TypeScript strict mode and existing project conventions remain in force.

# Acceptance criteria

- **AC-001**: A single authoritative workflow describes all five Harness subsystems and the mandatory requirement-to-PR lifecycle.
- **AC-002**: Codex and Cursor enter through thin repository instructions that reference the same canonical workflow.
- **AC-003**: A machine-checked Requirement Contract and lifecycle state reject missing artifacts, invalid IDs, and invalid transitions.
- **AC-004**: Repository commands provide environment diagnosis, isolated state reset, requirement validation, verification, benchmarking, and PR Package generation.
- **AC-005**: CI calls the same Harness gates used locally with pinned dependency and Node inputs.
- **AC-006**: The current product baseline is explicit, including missing tests and incomplete product features.
- **AC-007**: This requirement contains a complete plan, handoff, traceability matrix, verification evidence, and review-feedback record.
- **AC-008**: The generated PR Package maps motivation, changes, acceptance criteria, verification, review order, risks, rollback, and known gaps.

# Risks

- Workflow friction could encourage bypasses; concise commands and templates reduce the cost of compliance.
- Markdown parsing can be weaker than a dedicated schema library; the first version validates a deliberately small format and fails closed.
- Existing dependency installation problems may prevent initial gates; failures must remain visible in verification evidence.

# Verification expectations

- Automated tests exercise environment diagnosis, valid requirement validation, and fail-closed invalid IDs.
- `npm run check`, `npm test`, and `npm run build` pass from the pinned environment.
- The lifecycle command prevents skips and requires a requirement-specific branch for implementation.
- A generated `PR-PACKAGE.md` is reviewed against all acceptance criteria.

