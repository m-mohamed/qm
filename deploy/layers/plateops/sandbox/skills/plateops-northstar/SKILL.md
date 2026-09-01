---
name: plateops-northstar
description: Operate PlateOps across Slack, Linear, GitHub, and the deployed product. Use for intake triage, company orientation, product planning, founder-approved engineering, review, release reporting, or onboarding.
---

# PlateOps Northstar

Treat the deployment's `NORTHSTAR.md` as the operating contract when it is
available. If the file is unavailable, follow the equivalent rules below and
say that the deployment copy of the contract could not be verified.

## Source-of-truth boundaries

- Slack contains conversation and source context.
- Linear contains durable work, priority, ownership, approval, and status.
- GitHub contains code, review, checks, and release evidence.

Never claim that a Slack message by itself authorizes engineering work. Never
use one teammate's personal Codex or connector identity on behalf of another.

## Begin every substantial task

1. Identify the requesting person and the account identity used for the turn.
2. Name the exact Slack thread, Linear issue or project, GitHub repository and
   branch, and environment in scope. Mark anything not verified as unknown.
3. Refresh current Linear, GitHub, deployment, and pull request state before
   planning. Do not rely on an old chat summary when live evidence is available.
4. Confirm that engineering work has a founder-approved Linear issue. If not,
   help capture or refine the request in Product & Operations Triage and stop
   before code or infrastructure mutation.
5. Read the target repository's `AGENTS.md` and governing product, security,
   test, and deployment documentation before editing.

## Intake behavior

For a non-technical request, produce a structured intake draft with:

- affected user and problem;
- desired outcome;
- evidence and original Slack thread;
- impact and urgency;
- missing questions;
- recommended owner and next state.

Do not promise delivery, choose a technical solution, or move the item into an
Engineering cycle without a founder decision.

## Founder-approved execution

For approved work, restate the outcome, scope, acceptance criteria, risks, and
verification plan. Use a feature branch and pull request. Link implementation,
tests, review, deployment, and browser evidence back to Linear. Report the
result in plain language to the synced Slack thread after verification.

Preserve least-privilege connector access, secret hygiene, tenant and data
boundaries, reversible deployments, and a human review point for consequential
changes. Full sandbox capability is not permission to widen scope.

## Orientation output

When asked to get up to speed, return a concise operating brief covering:

- current PlateOps Linear teams, project, milestone, active issues, and owners;
- canonical repositories, latest default-branch commits, open pull requests,
  checks, environments, and deployment topology;
- current Slack intake and decision channels;
- integration health for Slack, Linear, GitHub, and the deployed application;
- unresolved product or repository boundaries;
- the highest-leverage founder decisions and contribution opportunities tied
  to live evidence.

Do not invent a PlateOps repository or product architecture before a canonical
repository exists and has been inspected.
