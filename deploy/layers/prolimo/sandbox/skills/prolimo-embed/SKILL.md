---
name: pro-limo-embed
description: Work on the Pro Limo Embed product, its private GitHub repository, Convex backend, Vercel application, and provider integrations. Use for product orientation, planning, implementation, review, deployment, or operations involving Pro Limo.
---

# Pro Limo Embed

Treat `corvus-inc-hub/prolimo-embeddable` as the canonical repository and `main`
as the integration branch. The production application is
`https://pro-limo-embed.vercel.app`.

## Begin every substantial task

1. Fetch current repository metadata, `main`, open pull requests, and recent
   commits. Never infer the current state from an old conversation.
2. Read the repository `AGENTS.md` before acting. For Convex work, also read
   `convex/_generated/ai/guidelines.md` completely before editing.
3. Read the smallest current product set that governs the request:
   `README.md`, `CONTEXT.md`, `GOALS.md`, `PLAN.md`, `TASKS.md`, and the relevant
   spec or runbook under `docs/`.
4. State the exact repository, branch or pull request, environment, and evidence
   being used. Distinguish verified state from assumptions.

## Product boundary

Pro Limo Embed is a multi-tenant booking and operations product for private
chauffeur companies. Use the repository's domain language: Operator, Operator
Staff, Customer, Passenger, Chauffeur, Booking, Installation, Embedded
Experience, Hosted Experience, and Operator Panel. Do not describe it as a
marketplace or generic ride-hailing app.

The current stack is Next.js, React, TypeScript, Convex, Better Auth, Vercel,
pnpm, Vitest, Stripe, Resend, Twilio, and Google Maps. Provider rails are
fail-closed unless their documented production gates are satisfied.

## Working rules

- Use a feature branch and pull request for product changes. Do not push
  directly to `main` unless the user explicitly requests it.
- Preserve tenant isolation, server-owned authorization, append-only history,
  idempotency, and durable booking truth.
- Never expose or copy provider secrets into chat, files, issues, commits, or
  command output. Use the user's linked account or personal Keychain entry.
- Treat `pnpm check` as the repository gate: lint, typecheck, tests, and build.
  Run narrower checks while iterating, then the complete gate before handoff.
- Logic tests do not replace product acceptance. For meaningful customer or
  operator changes, follow `docs/operations/chrome-proof.md` and record the
  exact commit, environment, browser actions, and observed result.
- Never enable Stripe, production SMS, or production email merely because
  credentials exist. Apply the documented merchant, compliance, sender,
  webhook, legal, and canary gates first.
- Use a disposable Convex development deployment for proof work. Inventory the
  target before any reset, import, reseed, or production mutation.

## Orientation output

When asked to get up to speed, return a concise operating brief covering:

- latest `main` commit and active pull requests;
- frontend routes and embedded/hosted customer surfaces;
- Convex schema, functions, auth, and tenant boundary;
- Vercel and Convex development/preview/production topology;
- Stripe, Resend, Twilio, and Google Maps readiness, including explicit gates;
- repository checks, browser-proof requirements, and deployment runbooks;
- highest-leverage contribution opportunities tied to current goals and open
  work, with evidence links or file paths.

Do not produce a generic architecture summary when live repository evidence is
available.
