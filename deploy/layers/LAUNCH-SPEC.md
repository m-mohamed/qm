# SW Capital QM launch specification

Status: launched and live-verified on 2026-08-28

Operating identity: SW Capital

Domain and access authority: MNFST Labs

Runtime: the stock QM AWS contract, with a private fork for organization layers and upstream-candidate fixes

## 1. Outcome

MNFST Labs runs one private QM fork and three isolated QM deployments. The deployments do not share product data, credentials, connectors, databases, or execution environments.

| Workspace   | Product boundary                                                           | Public URL                       | QM org     |
| ----------- | -------------------------------------------------------------------------- | -------------------------------- | ---------- |
| Manifest QM | Builds Manifest, the development system whose current project is Avaza VRI | <https://manifest.mnfstlabs.dev> | `manifest` |
| Pro Limo QM | Builds Pro Limo                                                            | <https://prolimo.mnfstlabs.dev>  | `prolimo`  |
| PlateOps QM | Builds PlateOps                                                            | <https://plateops.mnfstlabs.dev> | `plateops` |

The SW Capital launcher at <https://qm.mnfstlabs.dev> is the main entry point. SW Capital is the venture studio for the three products. The launcher routes to each workspace and does not hold product data or QM credentials.

Manifest, Pro Limo, and PlateOps are the three product workspaces. Avaza VRI is the current project inside Manifest. Avaza OS is not part of this QM workspace map.

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

The launcher has its own private, versioned S3 bucket and CloudFront origin access control. It is not a fourth QM tenant. Its ocean scene vendors the byte-preserved WGSL files from the MIT-licensed vgpu FFT ocean surface example, revision `8ca322aa1cf0bc25aff3d38389d48090bf065c6baf14bea858fd9b8e4bceea96`, and compiles them with `vgpu@0.3.1`. The launcher adds three procedural terrain meshes as a depth-tested draw in the same HDR scene, so the water and islands share one camera, depth buffer, sun direction, fog, and tone map. The terrain treatment adapts the public MIT-licensed ThreeUI Landscape pattern at commit `326580429881c2abe7893bee53c62cbb31b6ee49`: rough vertex-coloured geometry with sparse field detail, rebuilt specifically for the SW Capital islands. The renderer has no cross-origin frame or runtime CDN dependency. Browsers without WebGPU receive the official `fft-ocean-surface.hero.png` image and CSS island fallback. The surface supports light and dark interface appearances and keeps a restrictive Content Security Policy without `unsafe-inline`.

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
| Manifest  | `d0a58d3d-f2a1-4243-a0e0-7ea757a429af` | `manifest-qm-core-predeploy-d0a58d3d-f2a1-4243-a0e0-7ea757a429af` |
| Pro Limo  | `cc629ca6-e42d-48a9-bf57-9c1764a1ddf7` | `prolimo-qm-core-predeploy-cc629ca6-e42d-48a9-bf57-9c1764a1ddf7`  |
| PlateOps  | `79b52403-c80e-42b1-9d87-2ceb258278d0` | `plateops-qm-core-predeploy-79b52403-c80e-42b1-9d87-2ceb258278d0` |

## 6. Connectors and workspace data

Slack, Linear, GitHub, and other product connectors are configured inside the matching workspace. Never reuse a product credential across all three deployments merely because one person owns it.

At launch, Slack bot tokens are intentionally unset. The web, admin, portal, email sign-in, Codex subscription, AWS execution, and launcher paths are live. Add Slack and Linear separately to each workspace when their exact workspace or team targets and credentials are available. After adding a connector, run the workspace's credential check and a real connector action before calling it complete.

The three product layers intentionally contain no scaffold example skills or tools. Add only product-specific capabilities. Keep generic capabilities in core only when they make sense for every QM user.

## 7. Recovery and decommissioning

Every `qm up` creates an RDS snapshot before mutation. Use `qm rollback` for a previous workload manifest. Restore RDS from the snapshot named in the deployment receipt when data recovery is required, then repoint the stack only after validating the restored database.

Terraform state is stored in the encrypted, versioned bucket `mnfst-qm-terraform-state-017719539381` under separate keys for the launcher and each workspace.

The retired Buzz runtime is gone. Retain these recovery artifacts until a separate deletion decision:

- RDS snapshot `self-buzz-final-20260827`;
- Valkey snapshot `self-buzz-cache-final-20260827`;
- versioned media bucket `self-buzz-production-buzzmediabucketbucket-kraokwtr`.

Do not treat retained recovery artifacts as active Buzz resources.

## 8. Cofounder onboarding

The onboarding email must contain the launcher, all three direct URLs, the exact sign-in address, and the same-browser one-time-link rule. Access is complete only after the address is verified in both the allowlist and `org_admin` grants for every workspace.

For a new cofounder or operator:

1. Add the lowercased email to `AUTH_ALLOWED_EMAILS` and `ADMIN_GRANTS` in all intended workspaces.
2. Push secrets and run `qm check --live` for each changed workspace.
3. Send the launcher and direct links.
4. Have the operator sign in and confirm `/admin` access in each workspace.
5. Configure product-specific connectors only in the matching workspace.
