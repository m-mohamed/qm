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

The full channel, team, milestone, template, and promotion contract lives in
[`NORTHSTAR.md`](./NORTHSTAR.md).

## Founder approval flow

1. A teammate raises context in Slack, normally in `#triage-product`.
2. Promote the message through Linear's Slack action or `/linear` into Product
   & Operations Triage and preserve the Slack thread link.
3. A founder reviews the evidence and explicitly declines, defers, investigates,
   or approves the request.
4. Approved engineering work is represented by an Engineering issue using the
   `Founder-approved engineering task` template. It must identify the approving
   founder, acceptance criteria, verification plan, and source issue/thread.
5. PlateOps AI may plan or execute only after refreshing live state and verifying
   that approval boundary.
6. Link the branch, pull request, checks, deployment proof, and human-readable
   result back to Linear and the originating Slack thread.

## What to tell your Codex agent

Use this as the opening instruction when working on PlateOps:

> Work through my own PlateOps AI account and my own Codex, Slack, Linear, and
> GitHub identities. Read `NORTHSTAR.md`, the PlateOps Northstar skill, and every
> target repository's `AGENTS.md` before changing anything. Refresh the current
> Slack thread, Linear issue or project, GitHub repository and branch, pull
> request, deployment, and environment state. Treat Slack as context, Linear as
> the approval and status system, and GitHub as the execution and review system.
> Do not mutate code or infrastructure unless the work is represented by a
> founder-approved Engineering issue with acceptance criteria and a verification
> plan. Return implementation, test, review, deployment, and browser evidence to
> Linear and summarize verified outcomes in the originating Slack thread.

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
- ask PlateOps AI to orient from that issue without beginning unapproved work;
- trace the resulting issue, branch or pull request, verification evidence, and
  Slack outcome back to the same approved request.

The production path was verified with GPT-5.6 Luna: a Slack intake created
`OPS-5` in Product & Operations Triage, founder approval created linked
`ENG-1` in Engineering with the `founder-approved` label, and the engineering
issue remained unstarted with no code changes.
