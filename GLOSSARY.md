# Requirement Delivery Harness

This context defines the shared language for governing a software requirement from intake through an auditable pull request.

## Language

**Harness**:
The project-level system that governs how a requirement is interpreted, implemented, verified, and presented for review.
_Avoid_: Prompt collection, agent instructions

**Requirement Contract**:
The normalized, reviewable statement of a requirement, including its goal, scope, exclusions, acceptance criteria, constraints, risks, and verification expectations.
_Avoid_: Requirement file, ticket copy

**Requirement ID**:
The unique identity that ties one requirement to its lifecycle, decisions, evidence, implementation branch, and PR Package.
_Avoid_: Branch name, ticket number

**Harness Run**:
One isolated execution of the Harness for a single Requirement ID.
_Avoid_: Agent session, chat

**Gate**:
A mandatory checkpoint whose stated evidence and approval conditions must be satisfied before work advances to the next stage.
_Avoid_: Suggestion, reminder

**Exception Record**:
An explicitly approved, time-bounded account of a Gate that was not satisfied, its impact, and the compensating verification required.
_Avoid_: Skip, waiver comment

**Verification Evidence**:
Reproducible proof that an acceptance criterion or quality condition has been satisfied.
_Avoid_: Agent claim, completion note

**PR Package**:
The standardized review artifact that maps the requirement to its implementation, verification evidence, risks, rollback approach, and known gaps.
_Avoid_: PR summary, change log

**Done**:
The state in which every acceptance criterion is supported by verification evidence, all required quality gates pass, unrelated changes are absent, and remaining gaps are explicit.
_Avoid_: Implemented, code complete
