# Implementation Plan

## Approach

Use Git-tracked Markdown for human review, JSON for lifecycle state, and a dependency-free Node CLI for enforcement. Keep agent adapters small and make local and CI checks call the same commands.

## Steps

- [x] Establish shared vocabulary and record the architectural decision.
- [x] Create canonical instructions and thin tool adapters.
- [x] Add templates, lifecycle schema, and executable validation.
- [x] Add isolated runtime reset, verification, benchmark, and PR generation commands.
- [x] Add CI, environment pins, feature baseline, and PR template.
- [x] Install dependencies and execute every mandatory gate.
- [x] Generate and review the PR Package.

## Validation plan

- Validate REQ-0001 and run the Harness unit tests.
- Run TypeScript checks, the test suite, and production build through `harness:verify`.
- Exercise invalid input and transition behavior.
- Generate the PR Package and inspect its acceptance-criteria mapping.

## Rollback

Revert the Harness requirement commit. Product runtime code and persisted user data are not migrated by this requirement.

