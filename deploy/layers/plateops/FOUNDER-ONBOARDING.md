# PlateOps founder and engineer onboarding

This runbook is for Mohamed and Abdullah. PlateOps AI is the company-facing
name; QM is the underlying platform name used only in engineering and deployment
work.

## Accounts and identity

- Sign in to <https://plateops.mnfstlabs.dev> with your own PlateOps Slack
  identity: Mohamed uses `mohamed@plateops.ai`; Abdullah uses
  `abdullah@plateops.ai`. Open the one-time link in the same browser profile.
- From **Admin -> Keychain**, connect your own Codex subscription by uploading
  the `~/.codex/auth.json` created by `codex login` on your computer. Never copy,
  share, grant, or reuse the other founder's credential.
- Connect your own Slack and Linear identities from the same keychain after the
  organization OAuth clients are configured. Connector actions are attributed
  to the founder who connected that account.
- Mohamed's GitHub identity is `m-mohamed`; Abdullah's is `gmrrww`. The PlateOps
  GitHub organization is intentionally outside this deployment setup and remains
  founder-owned work.

## Company operating surfaces

- Slack is the conversation and source-context layer. Use threads and keep the
  original customer, support, product, or operating evidence attached.
- Linear is the durable source of truth for priority, ownership, approval, and
  status. Product and Operations Triage is the front door; Engineering is the
  founder-controlled execution queue.
- GitHub is the code, review, checks, and release-evidence layer. Do not start
  engineering work from an ambient Slack request.

The current delivery hierarchy is the `PlateOps MVP — 2026 Launch` initiative,
the shared `M1 — Management & Affiliation MVP` project, and its Develop,
Validate, and Migrate milestones. Linear is canonical for that hierarchy and
for every issue's human owner, priority, dependencies, acceptance evidence, and
shipping state.

The whole team holds one weekly review of engineering, product, and operations.
Engineering uses the active cycle defined in Linear; Product & Operations uses
human owners and due dates rather than cycles. The Linear project update is
prepared before the meeting and drives the shared review. Read the current
schedule from the canonical Linear operating document rather than copying it
into QM onboarding.

The full channel, team, milestone, template, and promotion contract lives in
[`NORTHSTAR.md`](./NORTHSTAR.md).

## Founder approval flow

1. A teammate raises context in Slack, normally in `#triage-product`.
2. Promote the message through Linear's Slack action or `/linear` into Product
   & Operations Triage and preserve the Slack thread link.
3. A founder reviews the evidence and explicitly declines, defers, investigates,
   or approves the request.
4. Approved engineering work is represented by an Engineering issue using the
   `Engineering work order` template. It must identify the approving product
   owner and approving engineering founder, retain Mohamed or Abdullah as its
   accountable assignee, include acceptance evidence and a verification plan,
   and link the source issue and Slack thread.
5. Mohamed or Abdullah records explicit engineering execution approval only
   when the issue is a narrow vertical slice and satisfies the Definition of
   Ready. Readiness is verified from the issue's facts, not a workflow label.
6. PlateOps AI derives one immutable work-order revision from the exact issue,
   records a stable QM run ID and bounded attempt IDs, and verifies the project,
   milestone, team, state, assignee, priority, estimate, blockers, acceptance
   evidence, non-goals, source thread, repository, base reference, environment,
   retry limit, and allowed action gates before planning or execution.
7. Link the QM run or trace, plan, branch, pull request, commit, exact checks,
   acceptance results, preview or Cloudflare delivery evidence, remaining risk,
   and requested human decision back to Linear. Summarize the terminal outcome
   in the originating Slack thread.
8. A founder still approves merge and any production deployment. A stopped run
   writes its terminal state and reason rather than disappearing into chat.

## What to tell your Codex agent

Use this as the opening instruction when working on PlateOps:

> Work through my own PlateOps AI account and my own Codex, Slack, Linear, and
> GitHub identities. Read `NORTHSTAR.md`, the PlateOps Northstar skill, and every
> target repository's `AGENTS.md` before changing anything. Refresh the current
> Slack thread, Linear issue or project, GitHub repository and branch, pull
> request, deployment, and environment state. Treat Slack as context, Linear as
> the approval and status system, and GitHub as the execution and review system.
> Do not mutate code or infrastructure unless the exact Engineering issue is a
> narrow vertical slice, retains Mohamed or Abdullah as its human assignee,
> records explicit founder approval, and defines its current priority, project,
> milestone, acceptance evidence, verification plan, native blockers, non-goals,
> and source request. Treat missing or conflicting context as a stop condition.
> Treat that issue revision as one typed work order and record stable QM run and
> attempt IDs. Return the plan, implementation, pull request, commit, exact test
> and acceptance results, preview or deployment trace, remaining risk, and any
> requested human decision to Linear. Stop at human merge and production-delivery
> gates, and summarize a channel-safe terminal outcome in the originating Slack
> thread. Preserve reusable lessons in tests, ADRs, repository guidance,
> runbooks, skills, or structured failure policy—not in a transcript dump.

PlateOps product AI and the engineering cockpit are separate systems. The
product's Module 1 inference path is Pi through Cloudflare AI Gateway and
OpenRouter to GLM-5.3 Flash. PlateOps AI/QM uses a swappable coding-runtime
adapter, currently Codex with each founder's private subscription. Never copy
product inference credentials into QM, describe QM's coding runtime as the
product model, or ship the QM runtime inside the PlateOps product.

## Engineer checkout and deployment

The PlateOps deployment layer is this directory. From a checkout of the private
QM repository, install the pinned dependencies and run deployment commands from
this directory:

```bash
npm ci
npm exec qm -- status
npm exec qm -- check --live
```

Read `AGENTS.md`, `deployment.md`, `qm.config.jsonc`, and `NORTHSTAR.md` before
editing or deploying. Secret values belong only in the ignored `.env` file or
the encrypted Admin surfaces; never put them in commits, Slack, Linear, email,
or agent prompts.

This AWS deployment uses the private source-build release path. Do not apply the
plain packaged `qm plan`/`qm up` path when it resolves placeholder registry
images. Verify the source-build procedure and the current deployment manifest
before any release.

## Acceptance checklist

Onboarding is complete only when the founder can independently:

- sign in to PlateOps AI;
- see their own Codex credential and their own Slack and Linear connections;
- receive a real Luna response without using the other founder's subscription;
- promote a Slack intake item into Linear Triage;
- approve an Engineering issue using the required template;
- leave a founder-engineer as the accountable assignee and record explicit
  approval only after the Definition of Ready is satisfied;
- ask PlateOps AI to orient from that issue without beginning unapproved work;
- trace the issue, immutable work order, QM run and attempts, branch or pull
  request, verification and Cloudflare evidence, human delivery decision, and
  Slack outcome back to the same approved request.

The production path was verified with GPT-5.6 Luna: a Slack intake created
`OPS-5` in Product & Operations Triage, founder approval created linked
`ENG-1` in Engineering, and the engineering issue remained unstarted with no
code changes.
