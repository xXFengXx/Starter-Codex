# AGENTS.md — Requirement Delivery Harness

This repository uses a mandatory requirement-to-PR harness. These rules apply to Codex, Cursor, and every other coding agent.

## Source of truth

1. Read `harness/PROCESS.md` before changing code.
2. Work from exactly one directory under `requirements/<Requirement ID>/`.
3. Treat `contract.md`, `state.json`, and `traceability.md` as authoritative.
4. Never claim completion without reproducible verification evidence.
5. Never bypass a failed gate. Record an approved exception using `harness/templates/exception.md`.

`CLAUDE.md` is an adapter, not a second set of rules. If instructions conflict, this file and `harness/PROCESS.md` win.

## Startup

Run:

```powershell
npm ci
npm run harness:doctor
npm run requirement:validate -- <Requirement ID>
```

Before implementation, the requirement must be in `approved` state. Use an isolated branch named `requirement/<Requirement ID>-<short-name>`; use a separate worktree when requirements run concurrently.

## Required workflow

1. Intake: normalize the source request into `contract.md`.
2. Clarify: resolve every ambiguity; number acceptance criteria `AC-001`, `AC-002`, etc.
3. Plan: create `plan.md` and map every acceptance criterion in `traceability.md`.
4. Approve: obtain human approval before changing product code.
5. Implement: keep changes inside the approved scope and update the handoff as work evolves.
6. Verify: run `npm run harness:verify -- <Requirement ID>` from clean, isolated test state.
7. Review: run `npm run harness:pr -- <Requirement ID>` and inspect the generated PR Package.
8. Complete: only after all gates pass and the PR is merged or explicitly accepted.

State changes must use:

```powershell
npm run requirement:transition -- <Requirement ID> <next-state> <actor> "optional note"
```

## Quality gates

Every requirement must pass:

- Requirement Contract validation.
- Acceptance-criteria traceability validation.
- `npm run check`.
- `npm test`.
- `npm run build`.
- Scope and secret review.
- PR Package generation.
- Dependency-audit findings reviewed and recorded; upgrades are risk-scoped requirements, not silent force-fixes.

Risk-specific checks in the contract are additive. Existing baseline gaps may be documented, but a new requirement may not silently worsen them.

## Project conventions

- TypeScript strict mode.
- Named exports only.
- IPC channels are defined in `src/shared/types.ts`.
- Services use constructor-injected `PersistenceService`.
- Automated tests must use `.harness/runtime/`; never use real Electron `userData`.
- Do not commit `.harness/runtime/`, generated command logs, dependencies, build output, secrets, or user data.

## Handoff

Before ending an unfinished session, update `requirements/<Requirement ID>/handoff.md` with current state, completed work, decisions, failing commands, and the exact next action. Do not use chat history as project state.
