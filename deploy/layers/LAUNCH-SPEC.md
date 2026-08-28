# MNFST QM launch specification

Status: launched and live-verified on 2026-08-27

Owner: MNFST Labs

Runtime: the stock QM AWS contract, with a private fork for organization layers and upstream-candidate fixes

## 1. Outcome

MNFST Labs runs one private QM fork and three isolated QM deployments. The deployments do not share product data, credentials, connectors, databases, or execution environments.

| Workspace   | Product boundary                                     | Public URL                       | QM org     |
| ----------- | ---------------------------------------------------- | -------------------------------- | ---------- |
| Manifest QM | Builds Manifest, the government RFP software product | <https://manifest.mnfstlabs.dev> | `manifest` |
| Pro Limo QM | Builds Pro Limo                                      | <https://prolimo.mnfstlabs.dev>  | `prolimo`  |
| PlateOps QM | Builds PlateOps                                      | <https://plateops.mnfstlabs.dev> | `plateops` |

The launcher at <https://qm.mnfstlabs.dev> is the main entry point. It contains one card for each workspace and does not hold product data or QM credentials.

## 2. Architecture contract

Each workspace owns a separate AWS deployment created from QM's AWS Terraform contract:

- ECS cluster and five services: core, web UI, admin, portal, and built-in auth broker;
- RDS PostgreSQL database;
- ECR repositories and task definitions;
- CloudFront distribution and CloudFront-restricted ALB origin;
- Route 53 A and AAAA records under `mnfstlabs.dev`;
- Secrets Manager prefix;
- private object storage;
- Lambda MicroVM image, execution role, and per-run agent computer;
- Terraform state key in the encrypted, versioned state bucket.

The launcher has its own private, versioned S3 bucket and CloudFront origin access control. It is not a fourth QM tenant.

The deployments use `HARNESS=codex` and `HARNESS_SECURITY_POSTURE=dangerous`. This grants the QM agent full execution authority inside its workspace's execution boundary. It does not grant one product access to another product's secrets or data.

## 3. Identity and model authentication

The public front door is QM's built-in portal and email sign-in broker. AWS SES sends one-time links from `QM <qm@mnfstlabs.dev>`. A link is single use, expires after 15 minutes, and must be opened in the browser that started sign-in.

The launch administrators are:

- `mohamed@mnfstlabs.com:org_admin`
- `abdullah@mnfstlabs.com:org_admin`

Both addresses must remain in `AUTH_ALLOWED_EMAILS` and `ADMIN_GRANTS` in all three AWS secret namespaces.

Agent model access uses Mohamed's ChatGPT subscription through Codex external ChatGPT auth. No `OPENAI_API_KEY` is present or required. The durable refresh credential remains encrypted in each QM keychain. Codex app-server receives only the current access token over its external-auth RPC and requests a central refresh after an unauthorized response. Child homes and MicroVMs never receive the refresh token.

The same deterministic credential ID can appear in all three configurations because each credential is stored in a different database and encrypted keychain.

## 4. Repository and upstream strategy

Use one private fork, `corvus-inc-hub/qm-private`, with these remotes:

- `origin`: the private MNFST fork;
- `upstream`: `yc-software/qm`.

Organization material belongs under `deploy/layers/`. Never create three QM source forks. The three deployment layers share the maintained core while preserving separate runtime tenants.

Sync upstream by merge, never by rebase or force push:

1. Fetch `upstream/main`.
2. Create `sync-upstream-YYYY-MM-DD` from private `main`.
3. Merge `upstream/main`.
4. Resolve core conflicts deliberately. Move organization-only behavior into a layer.
5. Run root type checks, lint, focused tests, all three static checks, and all three plans.
6. Open a private-fork pull request.
7. After review, deploy workspaces sequentially. Require a database snapshot and `qm check --live` for each.

Generic fixes belong upstream. Create the upstream branch directly from `upstream/main`, copy only the generic commits, and verify that no file under an organization layer and no MNFST name, domain, account, email, or infrastructure identifier enters the outgoing diff.

The current fork incorporates the draft upstream subscription-auth work plus local corrections required by the shipped Codex and AWS runtime. Track those corrections as upstream candidates so the private core returns to a small delta when upstream accepts them.

## 5. Deployment and acceptance gate

Run deployment commands from the target layer. Until the core fixes are released upstream, build from this checkout:

```bash
AWS_PROFILE=mnfst-workload-admin AWS_REGION=us-east-1 \
  node node_modules/@yc-software/qm/dist/bin/qm.js up --build-from=../../.. --yes

AWS_PROFILE=mnfst-workload-admin AWS_REGION=us-east-1 \
  node node_modules/@yc-software/qm/dist/bin/qm.js check --live
```

Deploy in this order: Manifest, Pro Limo, PlateOps. Do not run source builds concurrently because Docker credential-helper logins can collide on the operator machine.

A workspace is accepted only when all of these are true:

- ECS reports the new release stable;
- the pre-deploy RDS snapshot is `available`;
- `qm check --live` passes;
- the private canary completes a real subscription-backed Codex turn;
- the transcript persists, the session is archived, and the error log is clean;
- the PostgreSQL safety and index checks pass;
- live AWS state matches the deployment directory in both directions;
- the public sign-in form loads through CloudFront;
- the launcher links to the correct public URL.

Latest accepted deployments at launch:

| Workspace | Deployment ID                          | Pre-deploy snapshot                                               |
| --------- | -------------------------------------- | ----------------------------------------------------------------- |
| Manifest  | `204f9a39-eda0-4511-a218-a2cbbea3decd` | `manifest-qm-core-predeploy-204f9a39-eda0-4511-a218-a2cbbea3decd` |
| Pro Limo  | `1b26b3cb-77d8-4eff-a243-725208260e36` | `prolimo-qm-core-predeploy-1b26b3cb-77d8-4eff-a243-725208260e36`  |
| PlateOps  | `aafe4b51-a914-4bdb-a685-063110c067ad` | `plateops-qm-core-predeploy-aafe4b51-a914-4bdb-a685-063110c067ad` |

## 6. Connectors and workspace data

Slack, Linear, GitHub, and other product connectors are configured inside the matching workspace. Never reuse a product credential across all three deployments merely because one person owns it.

At launch, Slack bot tokens are intentionally unset. The web, admin, portal, email sign-in, Codex subscription, AWS execution, and launcher paths are live. Add Slack and Linear separately to each workspace when their exact workspace or team targets and credentials are available. After adding a connector, run the workspace's credential check and a real connector action before calling it complete.

The example `greet` skill and `example-tool` are scaffold fixtures. Replace them with product-specific skills and tools. Keep generic capabilities in core only when they make sense for every QM user.

## 7. Executor boundary

QM already owns the launch execution path: Codex plans and reasons, while QM provisions disposable Lambda MicroVM agent computers and applies the workspace's tools, skills, credentials, network policy, and audit trail.

`executioner.sh` is therefore not a second control plane and is not required to run these deployments. If MNFST adopts it later, integrate it behind one of QM's explicit boundaries:

- a product-layer tool invoked from a MicroVM; or
- a sandbox/deploy-provider adapter with its own least-privilege workspace role.

It must not hold a shared credential set for all three products, bypass QM's keychain, or merge the three audit and data domains. QM remains the system of record for sessions, approvals, credentials, agent runs, and deployment evidence.

## 8. Recovery and decommissioning

Every `qm up` creates an RDS snapshot before mutation. Use `qm rollback` for a previous workload manifest. Restore RDS from the snapshot named in the deployment receipt when data recovery is required, then repoint the stack only after validating the restored database.

Terraform state is stored in the encrypted, versioned bucket `mnfst-qm-terraform-state-017719539381` under separate keys for the launcher and each workspace.

The retired Buzz runtime is gone. Retain these recovery artifacts until a separate deletion decision:

- RDS snapshot `self-buzz-final-20260827`;
- Valkey snapshot `self-buzz-cache-final-20260827`;
- versioned media bucket `self-buzz-production-buzzmediabucketbucket-kraokwtr`.

Do not treat retained recovery artifacts as active Buzz resources.

## 9. Cofounder onboarding

The onboarding email must contain the launcher, all three direct URLs, the exact sign-in address, and the same-browser one-time-link rule. Access is complete only after the address is verified in both the allowlist and `org_admin` grants for every workspace.

For a new cofounder or operator:

1. Add the lowercased email to `AUTH_ALLOWED_EMAILS` and `ADMIN_GRANTS` in all intended workspaces.
2. Push secrets and run `qm check --live` for each changed workspace.
3. Send the launcher and direct links.
4. Have the operator sign in and confirm `/admin` access in each workspace.
5. Configure product-specific connectors only in the matching workspace.
