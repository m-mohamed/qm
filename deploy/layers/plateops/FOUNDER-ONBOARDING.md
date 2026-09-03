# PlateOps founder and engineer onboarding

This runbook is for Mohamed and Abdullah. PlateOps AI is the company-facing
name; QM is the underlying platform name used in engineering and deployment
work.

## Identities and connected access

- Sign in to <https://plateops.mnfstlabs.dev> with your own account. Mohamed's
  current deployment account uses `mohamed@mnfstlabs.com`; each additional
  operator must use their own approved identity.
- From **Keychain**, connect your own Codex subscription and your own Slack,
  Linear, and GitHub accounts. Never copy, share, grant, or reuse another
  operator's credential.
- Mohamed's GitHub identity is `m-mohamed`. Abdullah's is `gmrrww`; his PlateOps
  organization and team invitation remains pending until he accepts it.
- Runtime credentials stay actor-bound in QM Keychain. Cloudflare production
  credentials stay in the protected GitHub `production` environment and are
  never given directly to the coding agent.

The live keychain currently reports Slack, Linear, and GitHub connected with
zero items needing attention. The exercised runtime abilities are:

- Slack list, read, search, and originating-thread write-back;
- Linear read, issue and relation update, comment, and evidence write-back;
- GitHub repository, issue, pull-request, workflow, and deployment access; and
- protected-main GitHub Actions delivery to the PlateOps Cloudflare account.

Slack channel administration, Linear workspace-role administration, GitHub
organization administration, secret administration, and direct Cloudflare
deployment are not routine agent capabilities. Their absence does not block
accepted engineering work.

## Company operating surfaces

- Slack captures signals and discussion. Use `#product-triage` for intake,
  `#proj-m1-affiliation` for Module 1 coordination, `#team-engineering` for the
  private execution room, and `#releases` only for verified shipped outcomes.
- Linear is the durable source of truth for accepted scope, one accountable
  human owner, priority, native blockers, acceptance evidence, and shipping
  state. Engineering uses `Verifying`, not a human-review queue.
- QM executes a complete, accepted, human-owned Linear ENG work order with a
  bounded retry limit of three and durable evidence expectations.
- GitHub owns code, branches, pull requests, deterministic checks, and merge
  lineage. A green exact commit may merge when the issue's action policy allows.
- Protected `main` starts the Cloudflare production workflow automatically.
  QM observes that delivery and writes terminal evidence to Linear first and
  then the originating Slack thread.

Slack prose never silently changes scope. A request becomes executable only
when its exact Linear revision contains the complete work-order contract.

## Speed-first delivery loop

1. Capture the original signal in Slack and preserve its thread.
2. Record accepted work in Linear with one human owner, observable outcome,
   bounded scope, acceptance scenarios, evidence requirements, native blockers,
   repository, base reference, environment, source thread, retry limit, and
   machine-checkable action policy.
3. Dispatch the immutable accepted revision through QM without another Founder,
   PR-review, or production-approval ceremony.
4. Use a feature branch and pull request. Run the exact deterministic checks
   required by protected `main`.
5. Merge the exact green commit when policy allows. Do not substitute a human
   review queue for machine evidence.
6. Let protected `main` run the complete production workflow: identity and
   lineage enforcement, fresh verification, rollback capture, deploy, smoke,
   and retained evidence.
7. Write the terminal evidence to Linear first, then the originating Slack
   thread, and publish a concise `#releases` note only after runtime proof.

A stopped run records its attempt, reason, available evidence, and requested
decision instead of disappearing into chat.

## Human judgment boundary

Escalate only when the next step needs product acceptance, new or ambiguous
scope, money, permissions, public exposure, destructive action, irreversible
data action, protected customer data, failed evidence, or exhausted retries.
Routine planning, implementation, pull-request creation, deterministic
verification, exact-green merge, and protected-main delivery do not wait in a
standing human queue.

## What to tell the coding agent

> Work through my own PlateOps AI account and my own Codex, Slack, Linear, and
> GitHub identities. Read `NORTHSTAR.md`, the PlateOps Northstar skill, and the
> target repository's `AGENTS.md`. Refresh the exact Slack thread, accepted
> Linear issue revision, repository, branch, pull request, checks, deployment,
> and environment before acting. Execute complete, unblocked work without a
> separate Founder, PR-review, or production-approval queue. Keep one human
> accountable owner, a maximum of three attempts, deterministic exact-commit
> verification, protected-main production, and immutable evidence. Escalate
> only the recorded product or material-risk decisions. Never invent scope,
> acceptance, identity, checks, deployment, or evidence. Write terminal
> evidence to Linear first and then the originating Slack thread, and preserve
> reusable improvements in tests, repository guidance, runbooks, or skills.

PlateOps product AI and the engineering cockpit are separate systems. The
product's Module 1 inference path is Pi through Cloudflare AI Gateway and
OpenRouter to GLM-5.3 Flash. PlateOps AI/QM uses a swappable coding-runtime
adapter, currently Codex with each operator's private subscription. Never copy
product inference credentials into QM or ship the QM runtime inside PlateOps.

## Checkout and deployment

The PlateOps deployment layer is this directory. From a checkout of the private
QM repository, install the pinned dependencies and run:

```bash
npm ci
npm exec qm -- status
npm exec qm -- check --live
```

Read `AGENTS.md`, `deployment.md`, `qm.config.jsonc`, and `NORTHSTAR.md` before
editing or deploying. Secret values belong only in the ignored `.env` file or
encrypted administration surfaces.

This AWS deployment uses the private source-build release path. Do not use a
packaged path that resolves placeholder registry images. Verify the current
source-build manifest and rollback target before release.

## Acceptance checklist

Onboarding is complete only when an operator can independently:

- sign in and see only their own actor-bound Codex and connector credentials;
- read accepted work from Linear and its originating Slack thread;
- dispatch a complete, unblocked work-order revision without another approval
  ceremony;
- create a branch and pull request, observe required deterministic checks, and
  perform a policy-authorized exact-green merge;
- observe the automatic protected-main production run and runtime health;
- trace the Linear issue, accepted revision, QM run and attempts, pull request,
  exact commit, checks, Cloudflare evidence, Linear terminal update, and Slack
  outcome; and
- fail closed with an explicit reason when identity, permissions, evidence, or
  a material human decision is missing.

The first live end-to-end access probe must exercise each item above and re-read
the result from its authoritative system. Declared connector scopes alone are
not sufficient proof.
