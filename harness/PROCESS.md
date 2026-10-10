# Requirement Delivery Process

The Harness governs one requirement from intake through an auditable PR. It has five cooperating subsystems.

## 1. Instructions

`AGENTS.md` is the agent entry point. This document defines the canonical workflow. Tool-specific files may point here but must not copy or override it.

## 2. Tools

All agents and CI invoke the same `npm` commands. `harness/scripts/harness.mjs` validates contracts and states, enforces transitions, runs gates, and generates PR Packages.

## 3. State

Each Harness Run lives at `requirements/<Requirement ID>/`. `state.json` is machine-readable lifecycle state; the surrounding Markdown files are reviewable contracts and evidence. Chat transcripts are not state.

## 4. Environment

The checked-in lockfile pins dependencies. Automated tests and benchmarks use `.harness/runtime/`, which can be safely reset without touching developer data.

## 5. Feedback

Local checks, CI, benchmarks, review feedback, failed attempts, and post-merge learning feed back into requirement evidence. A failure is information to preserve, not a result to hide.

## Lifecycle

```text
intake -> clarified -> planned -> approved -> implementing -> verifying -> review-ready -> completed
```

`blocked` may return to the state stored in `blockedFrom`. `cancelled` and `completed` are terminal. No transition may skip `approved` or `verifying`.
Review feedback may move `review-ready` back to `implementing`; the change must pass through `verifying` again before returning to review.

## Gate policy

| Entering state | Required evidence |
| --- | --- |
| clarified | Complete Requirement Contract with numbered acceptance criteria |
| planned | Implementation plan and complete traceability rows |
| approved | Human approver recorded in state history |
| implementing | Approved state and isolated requirement branch |
| verifying | Implementation traceability updated |
| review-ready | Latest verification summary passes all mandatory commands |
| completed | PR accepted or merged; known gaps and exceptions explicit |

An exception is valid only when its impact, compensating verification, approver, and expiry condition are recorded. Exceptions always appear in the PR Package.

## Risk levels

- `low`: localized, reversible behavior or documentation.
- `medium`: user-visible behavior, IPC, persistence access, or multiple modules.
- `high`: security, permissions, migrations, persistence formats, destructive behavior, or cross-process contracts.

Risk changes verification depth, never the universal gates.

## Commands

```powershell
npm run harness:doctor
npm run requirement:validate -- REQ-0001
npm run requirement:status -- REQ-0001
npm run requirement:transition -- REQ-0001 implementing maintainer "Approved implementation begins"
npm run harness:reset
npm run harness:verify -- REQ-0001
npm run harness:pr -- REQ-0001
npm run harness:benchmark
```

## Adding a requirement

Copy `harness/templates/requirement/` to `requirements/<Requirement ID>/`, replace every placeholder, then validate it. Preserve the directory after merge: it is the durable decision and evidence trail.

