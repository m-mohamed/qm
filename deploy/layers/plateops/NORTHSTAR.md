# PlateOps Northstar operating system

PlateOps uses three connected layers with one unambiguous source of truth for
each kind of work:

- Slack is where the whole company communicates, asks questions, reports
  problems, and shares customer or operational context.
- Linear is the durable company work system. A request is not committed work
  until it has a Linear issue with an owner, priority, and next state.
- GitHub is the controlled engineering execution system. Code starts only from
  founder-approved Linear work and lands through a reviewed pull request.

PlateOps AI is the founder-engineering interface across those layers. It does
not turn ambient Slack conversation into code, spend a founder's personal Codex
subscription for another teammate, or treat a non-technical request as product
approval.

## People and access

- Mohamed (`m-mohamed`) and Abdullah (`gmrrww`) are the two founder-engineers.
- Both founders are owners of the PlateOps GitHub organization, admins in
  Linear, and administrators of the PlateOps AI deployment.
- Each founder links their own Codex subscription and personal connector
  identities. Credentials and usage are never shared between founders.
- The broader team participates through Slack and the Product & Operations
  surface in Linear. They can submit context and follow progress without being
  granted production or repository administration by default.

## Slack structure

Use lowercase names and the standard prefixes below. Every channel has a topic,
a description that says what belongs there, and an owner.

| Channel             | Visibility                 | Purpose                                                                                              |
| ------------------- | -------------------------- | ---------------------------------------------------------------------------------------------------- |
| `#announcements`    | Public, posting restricted | Company-wide decisions, operating changes, and releases.                                             |
| `#team-product-ops` | Public                     | Product, customer, support, and operating discussion for the non-technical team.                     |
| `#triage-product`   | Public                     | Structured product feedback, bugs, and requests that may become Linear work.                         |
| `#help-plateops`    | Public                     | Questions whose answers should become searchable company knowledge.                                  |
| `#proj-northstar`   | Public                     | The current company-building project and its Linear milestone updates.                               |
| `#team-engineering` | Private                    | Founder engineering decisions, implementation, infrastructure, incidents, and PlateOps AI execution. |
| `#releases`         | Public                     | Human-readable shipping notes linked to completed Linear projects and GitHub pull requests.          |

Use threads for discussion. Use a ticket reaction or Linear Asks to promote a
message from `#triage-product` into Linear. Do not create a Linear issue for
every message. Keep `#announcements` low-volume and archive project channels
when their associated Linear project is complete.

Non-technical teammates use Linear Asks or the Linear message action for
intake. Founder-engineers use PlateOps AI in `#team-engineering` for
orientation, planning, implementation, review, and verification. This
separation lets the whole team contribute context without charging work to a
founder's personal Codex subscription or authorizing code changes.

## Linear structure

Start with two teams. More teams are added only when a group has a genuinely
different workflow, cadence, and owner.

### Product & Operations (`OPS`)

This is the front door for the company. Enable Triage. The shared workflow is:

`Triage -> Backlog -> Todo -> In Progress -> Done`

Canceled and Duplicate remain terminal states. Triage means uncommitted input,
not low-priority engineering work. Do not enable cycles for this team.

### Engineering (`ENG`)

This is the founder-controlled execution queue. Its workflow is:

`Backlog -> Todo -> In Progress -> In Review -> Done`

Canceled and Duplicate remain terminal states. Enable two-week cycles starting
Monday. Only founder-approved issues enter Todo or a cycle. Pull request
activity may move issues through In Progress and In Review, but only verified
completion moves them to Done.

### Company project and milestones

Create one cross-team project named `PlateOps Northstar` and attach it to both
teams. Its first milestones are lifecycle checkpoints, not invented dates:

1. Operating foundation
2. Product truth and workflow specification
3. Internal alpha
4. Design-partner beta
5. Production readiness
6. Public launch
7. Post-launch learning

Each milestone has a short exit criterion. If a milestone becomes an
independently managed body of work, convert it to its own Linear project.

### Templates

`Product request` collects requester, affected user, problem or desired
outcome, evidence, impact, urgency, and the source Slack thread.

`Bug report` collects environment, expected behavior, actual behavior,
reproduction steps, evidence, impact, and reporter.

`Founder-approved engineering task` collects outcome, approved scope,
acceptance criteria, systems involved, security or data risks, verification
plan, approving founder, source issue, and source Slack thread.

Use Linear priorities for urgency. Keep labels categorical and few:
`bug`, `feature`, `customer`, `operations`, `decision`, `source:slack`, and
`founder-approved`. Do not duplicate priority or status as labels.

## Promotion and execution contract

1. A teammate raises context in Slack.
2. Linear Asks or a founder promotes it into Product & Operations Triage with
   the original thread linked and synchronized.
3. A founder reviews the problem, asks for missing evidence, and decides to
   decline, defer, investigate, or approve.
4. Approved engineering work moves to the Engineering team, uses the
   `Founder-approved engineering task` template, and is assigned to a founder.
5. PlateOps AI starts from that Linear issue, refreshes live GitHub and
   environment context, and proposes an execution plan.
6. Work happens on a feature branch and pull request. The Linear issue key is
   present in the branch or pull request so GitHub automation can track state.
7. Tests, browser proof when relevant, and deployment verification are linked
   before the issue reaches Done.
8. A human-readable result is posted to the synced Slack thread and, for a
   release, to `#releases`.

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
