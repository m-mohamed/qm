# PlateOps Northstar operating system

PlateOps uses connected factory layers with one unambiguous source of truth for
each kind of work. One fact has one canonical home; other surfaces link back to
it instead of maintaining a competing copy:

- Slack owns conversation, intake, feedback, decisions in progress, and the
  originating thread.
- Linear owns scope, the accountable human, priority, dependencies, acceptance
  evidence, and shipping state. A request is not committed work until those
  facts exist on one exact Linear issue.
- GitHub owns code, branches, review, checks, and release evidence. It links to
  Linear rather than becoming a second product backlog.

PlateOps AI is the high-trust engineering cockpit used by the two
founder-engineers. It
does not turn ambient Slack conversation into code, spend a founder's personal
Codex subscription for another teammate, replace the human owner of work, or
treat a non-technical request as product approval.

## Software-factory boundary

PlateOps is one composable delivery system, not a collection of loosely
connected tools:

| Layer                               | Owner                                  | Contract                                                                                                                                                                                                                                           |
| ----------------------------------- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Organization interface              | Slack                                  | Whole-team conversation, intake, feedback, and the source thread. Slack never authorizes code by itself.                                                                                                                                           |
| Canonical intent and control record | Linear                                 | The normalized work order: human owner, priority, scope, acceptance, blockers, approval, and shipping state.                                                                                                                                       |
| Orchestration and control plane     | PlateOps AI/QM                         | Validates an approved work order, provisions the scoped environment, dispatches the harness, enforces policy and retry limits, records attempts, and returns evidence. QM does not own product priority or silently broaden scope.                 |
| Coding runtime                      | QM coding-runtime adapter              | The current deployment uses Codex so each founder can use their own subscription. Pi, OpenCode, and other supported runtimes remain swappable behind QM's interface; no workflow may depend on one model or provider.                              |
| Development environment             | Founder-owned environment and worktree | A reproducible checkout with the requesting founder's identity and scoped secret references, currently provisioned as a founder-scoped QM sandbox. Environments are replaceable; credentials are actor-bound and never copied into the work order. |
| Code and product runtime            | GitHub and Cloudflare                  | GitHub owns commits, pull requests, review, and checks. Cloudflare owns PlateOps previews, deployments, runtime telemetry, and trace identifiers. The QM control plane itself remains on its configured AWS deployment.                            |
| Verification                        | Acceptance scenarios and evidence      | Tests, independent review, preview or deployment proof, telemetry, and bounded repair loops determine whether work is complete. Generated code volume is not the success measure.                                                                  |

The whole-team loop is `Slack -> Linear`. The two-engineer delivery loop is
`Linear -> QM -> GitHub/Cloudflare -> Linear -> originating Slack thread`.
Aim for a useful bounded automation loop, not autonomy theater: the factory
should complete routine execution and verification while escalating decisions
that require product judgment or new authority.

### Typed QM work order

QM begins execution from an immutable snapshot of one approved Engineering
issue. The control record uses this logical schema; secret values never appear
in it:

```yaml
work_order:
  linear_issue_id: ENG-000
  project: M1 — Management & Affiliation MVP
  milestone: 1 — Develop: MVP ready
  human_owner: person@plateops.ai
  approval:
    approved_by: founder@plateops.ai
    approved_at: 2026-09-03T00:00:00Z
  outcome: observable user or operator capability
  acceptance_scenarios:
    - given / when / then behavior and boundary condition
  evidence_required:
    - tests
    - preview_or_recording
    - relevant_security_or_data_checks
  constraints:
    in_scope: []
    out_of_scope: []
    hard_blockers: []
  targets:
    repository: owner/repo
    base_ref: main
    environment: local | preview | staging | production
  context:
    linear_documents: []
    decisions: []
    source_slack_thread: https://...
  policy:
    may_open_pr: true
    may_merge: false
    may_deploy_preview: true
    may_deploy_production: false
    retry_limit: 3
```

The schema is derived from native Linear fields and links; teammates do not fill
out YAML manually. One QM run represents one immutable revision of that work
order and has a stable run ID with one or more bounded attempt IDs. Before every
attempt, QM re-reads the issue and compares its revision, assignee, approval,
blockers, scope, and acceptance against the snapshot. A material change
invalidates the snapshot and requires a new founder approval. Replaying the same
approved revision resumes or links to its existing run instead of duplicating
execution.

### Run states and stop conditions

Use these factory states independently of Linear's human-facing workflow. Do
not add every QM substate to Linear's status list.

| State               | Meaning                                                               | Exit                                                 |
| ------------------- | --------------------------------------------------------------------- | ---------------------------------------------------- |
| `awaiting_approval` | A candidate issue exists but the founder gate is absent.              | Founder approves or returns it.                      |
| `ready`             | The work order is complete and start blockers are clear.              | QM dispatches an attempt.                            |
| `planning`          | The runtime resolves context and proposes execution and verification. | The plan is accepted by policy or escalated.         |
| `executing`         | The runtime edits and runs the scoped work.                           | The change reaches verification or a stop condition. |
| `verifying`         | Required tests, scenarios, security checks, and preview evidence run. | Evidence passes or returns to execution.             |
| `human_review`      | A reviewable PR, trace, evidence, and remaining risk are ready.       | A human requests changes, merges, or rejects.        |
| `delivery_pending`  | An approved change waits for an allowed delivery gate.                | A human authorizes delivery or cancels.              |
| `observing`         | Preview, staging, or production behavior is checked.                  | Acceptance holds or a regression is recorded.        |
| `completed`         | Acceptance evidence is linked and the source loop is closed.          | Terminal.                                            |
| `escalated`         | Human judgment or access is required.                                 | A human resolves and resumes or stops.               |
| `stopped`           | Work was canceled, superseded, unsafe, or exhausted.                  | Terminal with a reason.                              |

A corrected work order may create a new attempt under the same run; it must not
erase a previous attempt or its evidence.

QM stops and asks a founder when:

- requested behavior is materially ambiguous or acceptance conflicts;
- an unapproved scope expansion is required;
- a hard blocker or external decision is unresolved;
- credentials, permissions, or protected data are unavailable;
- the retry limit is reached or the same failure repeats;
- a security, privacy, payment, tenancy, or migration invariant may be violated;
- the change would merge, deploy to production, alter permissions, or perform
  another gated action; or
- required evidence cannot be generated independently of the implementation
  path.

Optimize for a useful 95% loop. A typed, predictable escalation is successful
factory behavior, not failed autonomy.

### Evidence written back to Linear

QM writes concise, structured evidence to the exact issue instead of dumping a
chat transcript or raw logs:

- QM run URL or trace ID and attempt IDs;
- plan or plan summary;
- branch, pull-request URL, and commit SHA;
- checks run and their exact results;
- preview or deployment URL and Cloudflare deployment or trace ID when
  applicable;
- acceptance-scenario results;
- remaining risk, unverified assumptions, and the human decision requested; and
- terminal state and stop reason when not successful.

Only meaningful state changes are posted. The originating Slack thread receives
a channel-safe plain-language status and Linear link, not duplicated control
state, credentials, private customer data, raw logs, or internal reasoning.

### Knowledge retained between runs

The factory becomes better by preserving reusable structure in its canonical
home:

| Learned artifact                  | Durable home                                        |
| --------------------------------- | --------------------------------------------------- |
| Product decision and rationale    | Linear project document or decision issue           |
| Acceptance scenario or regression | Repository test or evaluation suite                 |
| Architecture rule                 | Repository guidance or architecture decision record |
| Repeated tool sequence            | QM coding-runtime skill or runbook                  |
| Environment setup                 | Provisioning script and documented manifest         |
| Failure class and escalation rule | QM policy or runbook plus structured run result     |
| User or production signal         | Linked Linear evidence with source and denominator  |
| Deployment or runtime proof       | Cloudflare telemetry linked from Linear             |

After every completed or failed run, ask whether a discovered rule belongs in a
test, ADR, `AGENTS.md`, runbook, or shared skill. Preserve only reviewed,
generalizable knowledge; do not promote one-off chat context into permanent
instructions.

### Module 1 adoption now

No new QM deployment component is required to begin this flow. The existing AWS
deployment already provides the control plane, Slack and web surfaces,
founder-scoped sandboxes, audit history, and actor-bound Codex credentials. For
Module 1, founders dispatch from the exact approved Linear issue and use the
schema and write-back contract above. Do not invent a hidden Linear automation
or claim that QM natively consumes issue events that have not been integrated.

A future Linear webhook adapter may automate dispatch only after it implements
signature validation, the typed schema, idempotency, revision checks, scoped
identity, bounded retries, and channel-safe callbacks. Keep it outside core so
upstream QM updates and alternate coding runtimes remain easy to adopt. The
current `HARNESS=codex` setting is intentional because PlateOps uses actor-bound
Codex subscriptions. Product Pi and GLM-5.3 Flash are a separate customer
inference runtime and do not become QM's engineering authority.

## People and access

- Mohamed (`m-mohamed`) and Abdullah (`gmrrww`) are the only two engineers and
  the only engineering execution approvers and QM operators.
- Both founders are owners of the PlateOps GitHub organization, admins in
  Linear, and administrators of the PlateOps AI deployment.
- Each founder links their own Codex subscription and personal connector
  identities. Credentials and usage are never shared between founders.
- The broader product, operations, and sales team participates through Slack
  and Product & Operations in Linear. They can contribute context, own product
  work and product decisions, and follow progress without production or
  repository administration. PlateOps has five co-founders; a non-engineer
  founder's product authority does not automatically grant QM execution access.
- Every committed Linear issue retains exactly one accountable human assignee.
  An agent may execute or contribute evidence, but it never becomes the
  accountable owner.

## Slack structure

Use lowercase names and the standard prefixes below. Every channel has a topic,
a description that says what belongs there, and an owner.

| Channel                                | Visibility                 | Purpose                                                                                                         |
| -------------------------------------- | -------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `#announcements`                       | Public, posting restricted | Company-wide decisions and operating changes.                                                                   |
| `#help-plateops`                       | Public                     | Searchable questions and answers.                                                                               |
| `#p-m1-management-and-affiliation-mvp` | Public                     | Cross-functional Module 1 coordination, decisions, demos, and weekly health synced to the exact Linear project. |
| `#p-northstar`                         | Public                     | Initiative-level North Star visibility; Module 1 execution stays in its M1 project channel.                     |
| `#research-market`                     | Public                     | Customer, competitor, ecosystem, and validation research whose durable artifacts live elsewhere.                |
| `#releases`                            | Public                     | Verified human-readable shipping notes linked to Linear and GitHub evidence.                                    |
| `#social`                              | Public                     | Culture, wins, and off-topic conversation that does not create product commitments.                             |
| `#team-engineering`                    | Private                    | The two engineers' planning, QM execution, review, infrastructure, and operational safety.                      |
| `#team-product-ops`                    | Public                     | Company-wide product and operations coordination; new potential work routes to `#triage-product`.               |
| `#triage-product`                      | Public                     | The single structured intake front door for bugs, requests, customer evidence, and operating friction.          |

Use threads for discussion. On the current Linear Free plan, use the Linear
message action or `/linear` to promote a message from `#triage-product` into
Linear. Linear Asks is a future option only if the workspace moves to a plan
that includes it. Do not create a Linear issue for every message. Keep
`#announcements` low-volume and archive project channels when their associated
Linear project is complete. Do not add separate sales, PM, design, AI,
frontend, backend, Cloudflare, or TanStack channels at the current team size.

Non-technical teammates use the Linear message action or `/linear` for intake.
Founder-engineers use PlateOps AI in `#team-engineering` for orientation,
planning, implementation, review, and verification. This separation lets the
whole team contribute context without charging work to a founder's personal
Codex subscription or authorizing code changes.

A casual Slack message, mention, emoji, or agent response is never approval to
code. The originating Slack thread stays the communication record; the exact
Linear issue is the execution contract. Status callbacks to shared channels
contain a plain-language outcome and links to canonical evidence, never secrets,
credentials, private customer data, raw logs, or internal chain-of-thought.

Use the shared action markers consistently: `FYI —`,
`ASK — <owner> — <date>`, `DECISION —`, `BLOCKED — <owner> — <date>`,
`INCIDENT — <severity> —`, and `SHIPPED —`. A reaction acknowledges a message;
it never changes Linear state or grants execution authority.

## Linear structure

Start with two teams. More teams are added only when a group has a genuinely
different workflow, cadence, and owner.

### Product & Operations (`OPS`)

This is the front door for the company. Enable Triage. The shared workflow is:

`Triage -> Backlog -> Todo -> In Progress -> Done`

Canceled and Duplicate remain terminal states. Triage means uncommitted input,
not low-priority engineering work. Product & Operations does not use cycles.
Commit accepted work through a human owner and due date; intake remains in
Triage until it is accepted.

### Engineering (`ENG`)

This is the founder-controlled execution queue. Its workflow is:

`Backlog -> Todo -> In Progress -> In Review -> Done`

Canceled and Duplicate remain terminal states. Use the Engineering cycle
defined by the current canonical Linear operating model. QM reads the active
cycle from Linear and does not define its duration or boundary. Only work that
satisfies the Definition of Ready and records explicit founder approval enters
Todo or a cycle. Pull request activity may move issues through In Progress and
In Review, but only verified completion moves them to Done.

### Module 1 project and milestones

The current delivery hierarchy is:

- Initiative: `PlateOps MVP — 2026 Launch`
- Shared project: `M1 — Management & Affiliation MVP`
- Teams: Engineering and Product & Operations
- Project lead: Mohamed
- Target: October 31, 2026

The project has three evidence gates, not technology phases:

1. `1 — Develop: MVP ready` — September 30, 2026
2. `2 — Validate: real-user evidence` — October 15, 2026
3. `3 — Migrate: Quarry cutover` — October 31, 2026

The product-authoritative Module 1 blueprint retains 45 issues and uses 49 true
start-blocker relationships with maximum fan-in two. Its initial unblocked
frontier is blueprint rows 01, 02, and 38. After rows 01 and 02 clear, the first
Engineering pull is rows 03–05 only: architecture, dashboard baseline, and
tenant boundary. The remaining project backlog is not a cycle commitment.

Milestones express release evidence. Engineering cycles express capacity;
Product & Operations commitments use owners and due dates.
Organization, Team, Facility, Coach, and Athlete/Member Ops remain vertical
capability slices in this one project, not extra projects or teams.

Create the project views `M1 · Now`, `M1 · Release blockers`, `M1 · Intake`, and
`M1 · Validation evidence`. The project lead posts a concise Linear project update
before the weekly whole-team review; the synced
`#p-m1-management-and-affiliation-mvp` channel carries that update and
discussion without becoming a second board.

The entire PlateOps team holds one shared weekly operating review covering
engineering, product, and operations. The meeting reviews the Linear project
update, progress and evidence from the prior period, active blockers and
decisions, customer or operating input, and the next commitments. The canonical
Linear operating document owns the current cycle and meeting schedule; QM must
read it rather than hard-code a competing cadence. Product & Operations
participates through its owned work and due dates without being forced into
cycles.

Instrument the complete work-order, run, evidence, and source-thread loop on
rows 03–05 before expanding agent concurrency. Each must begin from an approved
Linear issue, remain traceable across the applicable systems, show retries and
escalations explicitly, stop at human merge and production-delivery gates, and
capture at least one durable harness or verification improvement across the
first pull.

### Templates

`Product request` collects requester, affected user, problem or desired
outcome, evidence, impact, urgency, and the source Slack thread.

`Bug report` collects environment, expected behavior, actual behavior,
reproduction steps, evidence, impact, and reporter.

`Engineering work order` collects outcome, approved scope, acceptance criteria,
systems involved, security or data risks, verification plan, approving
engineering founder, accountable human assignee, source issue, and source Slack
thread.

Use Linear priorities, estimates, milestones, cycles, and native blockers for
their intended facts. Keep only this compact label taxonomy for Module 1:

- Type: `Feature`, `Spike`, `Chore`, `Docs`
- Domain: `Identity & Affiliation`, `Organization Ops`, `Athlete/Member Ops`,
  `Team Ops`, `Coach Ops`, `Facility Ops`
- Risk: `concern:security`, `concern:payments`, `concern:ai`

Do not use phase labels such as `Domain/Validation` or `Domain/Migration`,
low-signal concern labels, or workflow-readiness labels. Readiness is a set of
verified facts plus explicit engineering-founder approval, not a label. Remove
redundant labels from Module 1 issues only. Do not delete workspace labels
globally until unrelated projects have been audited.

### Definition of Ready and execution contract

An Engineering issue is ready only when it has one accountable human assignee,
a current priority, the correct project and milestone, explicit acceptance
evidence, a verification plan, native blockers, a bounded non-goal, the source
request or Slack thread, and explicit approval recorded by Mohamed or Abdullah.

Before execution, PlateOps AI refreshes and restates the exact Linear issue URL
or identifier, initiative, project, milestone, team, state, human assignee,
priority, estimate, native blockers, acceptance evidence, non-goals, source
Slack thread, target repository, branch, and environment. Unknown or conflicting
facts stop mutation and return to the human owner for resolution.

A ready issue is a narrow, vertical, user-demonstrable slice. Use estimates
`1`, `2`, `3`, `5`, or `8`. Split an eight-point issue when it is pulled only if
one reviewer cannot understand and verify it in one review session. It has one
outcome and only real dependencies represented with native blockers. Broad
layer work such as “build the API” or “finish the database” must be split before
approval.

### Incident boundary

An active security, availability, data-integrity, payment, or calendar incident
is not ordinary Module 1 backlog. Coordinate the live response in a restricted
engineering incident thread, create a dedicated incident record with a human
incident owner, and publish only channel-safe status. Any follow-up product work
enters the normal OPS-to-ENG gate after containment; the incident itself is not
quietly converted into a feature ticket.

## Promotion and execution contract

1. A teammate raises context in Slack.
2. A founder or teammate uses the Linear Slack action or `/linear` to promote it
   into Product & Operations Triage with the original thread linked. If the
   workspace later enables Linear Asks, it can provide the synchronized intake
   path without changing the approval contract.
3. The responsible product owner or co-founder reviews the problem, asks for
   missing evidence, and decides to decline, defer, investigate, or approve the
   product direction.
4. Approved engineering work moves to the Engineering team, uses the
   `Engineering work order` template, retains Mohamed or Abdullah as its human
   assignee, satisfies the Definition of Ready, and records explicit execution
   approval from Mohamed or Abdullah.
5. PlateOps AI starts from that exact Linear issue, verifies the complete
   execution contract, refreshes live GitHub and environment context, and
   proposes a bounded execution plan.
6. Work happens on a feature branch and pull request. The Linear issue key is
   present in the branch or pull request so GitHub automation can track state.
7. Tests, browser proof when relevant, and deployment verification are linked
   before the issue reaches Done.
8. A human-readable result is posted to the synced Slack thread and, for a
   release, to `#releases`.

## Runtime boundary

PlateOps contains two separate AI systems that must never be conflated:

- The PlateOps product inference stack is the Module 1 customer capability:
  server-only Pi packages through Cloudflare AI Gateway and OpenRouter to
  `z-ai/glm-5.3-flash`, bounded by product permissions, explicit approval, and
  audit. It is designed and validated by Module 1 issues 23 and 24.
- PlateOps AI/QM is the founders' coding and operations cockpit. It runs the QM
  coding-agent harness with each founder's private Codex subscription and its
  own configured model. It does not ship inside the PlateOps product, determine
  the product inference architecture, or provide product runtime credentials.

## GitHub organization contract

The target organization slug is `plateops-ai`. The organization starts empty
until the product's canonical repository boundary and name are confirmed.

- `m-mohamed` and `gmrrww` are organization owners.
- Require two-factor authentication.
- Default repository permission is write for organization members.
- Use a `Founders` team with admin access and a `Developers` team with write
  access when repositories are created.
- Protect the default branch, require pull requests and passing checks, and
  prevent force pushes or branch deletion.
- Install GitHub apps repository-by-repository. PlateOps AI, Linear, CI, and a
  deployment provider receive only the permissions and repositories they need.

## Onboarding contract

Every teammate receives a short walkthrough covering:

1. Where to talk: Slack channels and threads.
2. When to create work: use `#triage-product` and the Product request flow.
3. Where status lives: Linear, not a Slack promise or direct message.
4. How decisions happen: founders approve engineering work in Linear.
5. How to follow up: stay in the synced Slack thread and watch the issue state.
6. What PlateOps AI can do: help founders orient, plan, execute, review, and
   report, but never silently authorize work or borrow another person's Codex
   subscription.

Review this contract after the first month of real usage. Change it from
observed friction and measured outcomes, not from a desire to add process.
