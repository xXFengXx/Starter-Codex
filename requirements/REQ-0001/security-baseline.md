# Dependency Security Baseline

Captured: 2026-10-09

`npm audit` reports 7 known findings after removing the unused Vitest dependency:

- 5 moderate
- 2 high
- 0 critical

The remaining findings flow through Electron 33 and uuid 9 dependency paths. The available automatic remedies require major-version upgrades, so they are not force-applied inside this medium-risk Harness requirement. They must be handled as separately planned, high-risk upgrade requirements with Electron runtime regression testing.

