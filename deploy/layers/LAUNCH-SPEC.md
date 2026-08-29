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

Founder identity map:

| Founder         | QM and personal subscription email | GitHub identity |
| --------------- | ---------------------------------- | --------------- |
| Mohamed Mohamed | `mohamed@mnfstlabs.com`             | `m-mohamed`     |
| Abdullah Yahya  | `abdullah@mnfstlabs.com`            | `gmrrww`        |

Email identity controls QM sign-in and ownership of each personal Codex credential. GitHub identity controls source access. Do not substitute one identity type for the other or share one founder's Codex auth file with the other founder.

Agent model access uses the signed-in member's own ChatGPT subscription through Codex external ChatGPT auth. No `OPENAI_API_KEY` is present or required. Each durable refresh credential remains encrypted in its owner's keychain. Core resolves `service=codex` for the live actor, creates a separate Codex app-server runtime for that actor, and never falls back to another member's credential. Codex app-server receives only the current access token over its external-auth RPC and requests a central refresh after an unauthorized response. Child homes and MicroVMs never receive the refresh token.

Each member authenticates Codex once on a trusted local computer. In each workspace, the member opens **Keychain**, selects **Connect Codex subscription**, and chooses `~/.codex/auth.json`. On macOS, use Command-Shift-G in the file picker to enter the hidden path. The signed-in session binds the upload to that member; the UI cannot name another owner. The server accepts only a bounded ChatGPT Codex auth file with an access token, refresh token, and account claim. It never displays or logs the credential contents. Never paste this file into chat or email, and never commit it.

Repeat this action in Manifest, Pro Limo, and PlateOps. The repetition is intentional because the deployments and personal keychains are isolated. `deploy/layers/launcher/bootstrap-codex-subscription.mjs` remains an administrator bootstrap and recovery tool. It is not the normal cofounder onboarding path.

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

Latest accepted deployments:

| Workspace | Deployment ID                            | Pre-deploy snapshot                                                 | Core / web task definitions |
| --------- | ---------------------------------------- | ------------------------------------------------------------------- | --------------------------- |
| Manifest  | `dd4470aa-436c-4a1a-a2a3-2649b17197c2` | `manifest-qm-core-predeploy-dd4470aa-436c-4a1a-a2a3-2649b17197c2`   | `8` / `4`                   |
| Pro Limo  | `caae2b92-235b-4d3a-9406-30c32904e61d` | `prolimo-qm-core-predeploy-caae2b92-235b-4d3a-9406-30c32904e61d`    | `7` / `4`                   |
| PlateOps  | `f72d13e6-9754-42bf-938b-9e2906e10235` | `plateops-qm-core-predeploy-f72d13e6-9754-42bf-938b-9e2906e10235`   | `6` / `4`                   |

All three accepted core tasks use image digest `sha256:e8be345cbd003a32b8a1f2c710a75d567f5a1de44ae8aaabad22e6f7084d044b`. All three accepted web tasks use image digest `sha256:eb03eb6bf75546e2d9247adc3de010c619cc00c3c72dabcbe8578c16e0ff0666`. Every core task sets `CODEX_AUTH_SERVICE=codex`; none injects a shared `CODEX_AUTH_CREDENTIAL`.

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

## 8. Cofounder product onboarding

Amazon SES production access is enabled for the workload account. Recipient verification is not required. Keep `qm@mnfstlabs.dev` as the verified sender, and preserve bounce and complaint suppression. The onboarding email must contain the launcher, all three direct URLs, the exact sign-in address, and the same-browser one-time-link rule.

For a new cofounder or operator:

1. Add the lowercased email to `AUTH_ALLOWED_EMAILS` and `ADMIN_GRANTS` in all intended workspaces.
2. Push secrets and run `qm check --live` for each changed workspace.
3. Send the launcher and direct links.
4. Have the operator sign in and confirm `/admin` access in each workspace.
5. Have the operator run `codex login` with their own ChatGPT account.
6. In each workspace, open **Keychain**, select **Connect Codex subscription**, and choose the operator's local `~/.codex/auth.json` file.
7. Confirm that each Keychain page reports the personal subscription ready.
8. In each workspace, create a new chat with GPT-5.6 Luna and Auto effort. Send `Reply with exactly: Hi bro.` and verify the response.
9. Configure product-specific connectors only in the matching workspace.

Product access is complete only after the address is in the allowlist and `org_admin` grants for every intended workspace, sign-in succeeds, and that member's own ChatGPT subscription is ready in each personal keychain. Never upload one founder's auth file for another founder.

## 9. Cofounder engineering onboarding

Engineering access covers the SW Capital launcher, its three product deployments, and the product source repositories.

- Control repository: `https://github.com/corvus-inc-hub/qm-private`
- Maintained branch: `launch/three-product-qm`
- Launcher source: `deploy/layers/launcher`
- Product layers: `deploy/layers/manifest`, `deploy/layers/prolimo`, and `deploy/layers/plateops`
- AWS access portal: `https://mnfstlabs.awsapps.com/start`
- AWS workload account: `017719539381`
- Required AWS permission set: `AdministratorAccess`

Mohamed's GitHub account is `m-mohamed`. It is an active maintainer of `mnfst-founders` and has effective `admin` access to `corvus-inc-hub/qm-private`.

Abdullah Yahya's existing AWS Identity Center user `JT` is in the `Admins` group. That group has the 12-hour `AdministratorAccess` permission set on the workload account. Do not create IAM users, access keys, or copied credentials for this access. His existing GitHub account is `gmrrww`. It is already a direct `corvus-inc-hub` member, belongs to `mnfst-founders`, and has effective `admin` access to `corvus-inc-hub/qm-private`. Do not create or invite a second GitHub identity for him.

Both GitHub accounts are active organization owners in `corvus-inc-hub` and `Voiya-RnD`. Both have effective `admin` access to every existing repository in this operating inventory:

| Operating area              | Repository                                      | State    |
| --------------------------- | ----------------------------------------------- | -------- |
| SW Capital control system   | `corvus-inc-hub/qm-private`                     | Active   |
| Manifest                    | `corvus-inc-hub/mnfst-os`                       | Active   |
| Manifest executor           | `corvus-inc-hub/executor`                       | Active   |
| Avaza OS                    | `Voiya-RnD/avaza-os`                            | Active   |
| Avaza VRI                   | `Voiya-RnD/avaza-vri`                           | Active   |
| Avaza agent support         | `Voiya-RnD/avaza-agents`                        | Active   |
| Prolimo Embed               | `corvus-inc-hub/prolimo-embeddable`             | Active   |
| PlateOps                    | No repository yet                               | Planned  |

Create the future PlateOps repository under the chosen company organization with both founders retaining organization-owner access. Do not create a placeholder repository until the product source boundary and repository name are chosen.

On a trusted engineering computer:

1. Install Node.js 24, Docker Desktop with Buildx, the AWS CLI, and the GitHub CLI.
2. Run `gh auth login` as `gmrrww`, then clone `corvus-inc-hub/qm-private`.
3. Switch to `launch/three-product-qm` and read this specification plus the `AGENTS.md` file in the target layer.
4. Configure the local `mnfst-workload-admin` AWS SSO profile against the MNFST Labs access portal and workload account. Run `aws sso login --profile mnfst-workload-admin`.
5. Keep every `.env` file, Codex auth file, and generated deployment credential out of Git, chat, and email.
6. Run focused tests, the target layer's static check, and its live check before deployment.
7. Deploy sequentially in the fixed order Manifest, Pro Limo, PlateOps. Never run source builds concurrently.
8. Require the RDS snapshot, stable ECS services, private live-session canary, and two-way directory match before accepting a workspace.

Merge upstream QM updates into a dedicated sync branch. Do not rebase or force-push the maintained branch. Keep organization behavior in `deploy/layers/`, and upstream only generic fixes after checking that the outgoing diff contains no MNFST identifier or secret.
