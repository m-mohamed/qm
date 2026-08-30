import assert from "node:assert/strict";
import test from "node:test";
import type { Keychain, KeychainCredentialMeta } from "../src/credentials/keychain.ts";
import { codexOAuthJwtAccountId } from "../src/harness/codex-auth-file.ts";
import type { CodexHarnessOptions } from "../src/harness/codex-harness.ts";
import type { Harness, HarnessTurnInput } from "../src/harness/harness.ts";
import { createPerUserCodexHarness } from "../src/harness/per-user-codex-harness.ts";

function token(accountId: string): string {
  const enc = (value: unknown) => Buffer.from(JSON.stringify(value)).toString("base64url");
  return `${enc({ alg: "RS256" })}.${enc({ iss: "https://auth.openai.com", exp: 4_000_000_000, "https://api.openai.com/auth": { chatgpt_account_id: accountId } })}.sig`;
}

function auth(accountId: string): Record<string, unknown> {
  return {
    auth_mode: "chatgpt",
    tokens: { access_token: token(accountId), refresh_token: `refresh-${accountId}`, id_token: token(accountId) },
  };
}

function keychain(accounts: Record<string, string>): Keychain {
  const metadata = Object.entries(accounts).map(([ownerId, accountId]) => ({
    id: `credential-${accountId}`,
    ownerId,
    service: "codex",
    kind: "file",
    fingerprint: accountId,
    createdAt: 1,
    updatedAt: 1,
  })) as KeychainCredentialMeta[];
  return {
    async listByOwner(ownerId: string) {
      return metadata.filter((entry) => entry.ownerId.toLowerCase() === ownerId.toLowerCase());
    },
    async materializeOwnFiles(ownerId: string) {
      const entry = metadata.find((candidate) => candidate.ownerId.toLowerCase() === ownerId.toLowerCase());
      if (!entry) return [];
      return [
        {
          credentialId: entry.id,
          ownerId: entry.ownerId,
          service: entry.service,
          files: [
            {
              path: ".codex/auth.json",
              contentBase64: Buffer.from(JSON.stringify(auth(accounts[entry.ownerId]!))).toString("base64"),
            },
          ],
        },
      ];
    },
  } as unknown as Keychain;
}

function turn(actorId: string, sessionId: string): HarnessTurnInput {
  return {
    actorId,
    session: { id: sessionId } as HarnessTurnInput["session"],
    input: "hi",
    systemPrompt: "system",
    history: [],
    tools: {} as HarnessTurnInput["tools"],
    scopeLabel: `personal:${actorId}` as HarnessTurnInput["scopeLabel"],
    orgScopeId: "org:test" as HarnessTurnInput["orgScopeId"],
    emit: async (entry) =>
      ({ ...entry, sessionId, seq: 1, createdAt: 1 }) as Awaited<ReturnType<HarnessTurnInput["emit"]>>,
    recordModelCall: () => {},
  };
}

test("per-user Codex harness pins every turn to its actor's ChatGPT account and runtime", async () => {
  const created: Array<{ accountId: string; closed: number }> = [];
  const createHarness = (options: CodexHarnessOptions): Harness => {
    const state = { accountId: "", closed: 0 };
    created.push(state);
    const accountId = async () => codexOAuthJwtAccountId(await options.authStore!.load()) ?? "";
    return {
      profile: {
        id: "codex",
        controlTransport: "json-rpc",
        toolTransport: "dynamic",
        transcriptFormat: "responses-api",
        capabilities: new Set(),
      },
      tools: { name: (name) => name },
      models: {
        async oneShot() {
          return accountId();
        },
        async generateTitle() {
          return accountId();
        },
      },
      turns: {
        async runTurn() {
          state.accountId = await accountId();
          return { reply: state.accountId };
        },
        async close() {
          state.closed += 1;
        },
      },
    };
  };
  const harness = createPerUserCodexHarness({
    keychain: keychain({ "mohamed@mnfstlabs.com": "mohamed-account", "abdullah@mnfstlabs.com": "abdullah-account" }),
    service: "codex",
    createHarness,
  });
  assert.equal((await harness.turns.runTurn(turn("mohamed@mnfstlabs.com", "m1"))).reply, "mohamed-account");
  assert.equal((await harness.turns.runTurn(turn("abdullah@mnfstlabs.com", "a1"))).reply, "abdullah-account");
  assert.equal((await harness.turns.runTurn(turn("MOHAMED@mnfstlabs.com", "m2"))).reply, "mohamed-account");
  assert.equal(
    await harness.models.oneShotForActor?.("system", "prompt", "abdullah@mnfstlabs.com"),
    "abdullah-account",
  );
  assert.equal(await harness.models.generateTitle?.("transcript", "mohamed@mnfstlabs.com"), "mohamed-account");
  assert.equal(harness.models.oneShot, undefined);
  assert.equal(created.length, 2);
  await harness.turns.close?.();
  assert.deepEqual(
    created.map((entry) => entry.closed),
    [1, 1],
  );
});

test("per-user Codex harness fails closed when the actor has no personal subscription", async () => {
  let created = 0;
  const harness = createPerUserCodexHarness({
    keychain: keychain({ "mohamed@mnfstlabs.com": "mohamed-account" }),
    service: "codex",
    createHarness: () => {
      created += 1;
      throw new Error("must not create a runtime");
    },
  });
  await assert.rejects(
    harness.turns.runTurn(turn("abdullah@mnfstlabs.com", "a1")),
    /connect your ChatGPT subscription/i,
  );
  assert.equal(created, 0);
});
