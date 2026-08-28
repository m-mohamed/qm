import type { Keychain } from "../credentials/keychain.ts";
import { NonRetryableTurnError } from "../core/turn-error.ts";
import { personKey } from "../directory/person.ts";
import { createCodexHarness, type CodexHarnessOptions } from "./codex-harness.ts";
import { keychainOwnerCodexAuthStore } from "./codex-auth-store.ts";
import type { Harness } from "./harness.ts";

export interface PerUserCodexHarnessOptions extends Omit<CodexHarnessOptions, "authStore"> {
  keychain: Keychain;
  service: string;
  createHarness?: (options: CodexHarnessOptions) => Harness;
}

export function createPerUserCodexHarness(options: PerUserCodexHarnessOptions): Harness {
  const { keychain, service, createHarness = createCodexHarness, ...codexOptions } = options;
  const harnesses = new Map<string, Promise<Harness>>();
  let closed = false;

  const forActor = async (actorId: string | undefined): Promise<Harness> => {
    if (!actorId?.trim()) throw new NonRetryableTurnError("Codex requires an authenticated actor");
    if (closed) throw new Error("Codex harness is closed");
    const key = personKey(actorId);
    let pending = harnesses.get(key);
    if (!pending) {
      const authStore = keychainOwnerCodexAuthStore({ keychain, ownerId: actorId, service });
      pending = authStore.load().then((auth) => {
        if (!auth) {
          throw new NonRetryableTurnError(
            "Connect your ChatGPT subscription in Keychain before using Codex. This workspace will not use another member's subscription.",
          );
        }
        return createHarness({ ...codexOptions, authStore });
      });
      harnesses.set(key, pending);
      void pending.catch(() => {
        if (harnesses.get(key) === pending) harnesses.delete(key);
      });
    }
    return pending;
  };

  const modelForActor = async (actorId: string | undefined): Promise<Harness["models"] | undefined> =>
    actorId?.trim() ? (await forActor(actorId)).models : undefined;

  return {
    profile: {
      id: "codex",
      controlTransport: "json-rpc",
      toolTransport: "dynamic",
      transcriptFormat: "responses-api",
      capabilities: new Set(["abort", "steer", "images", "provider-sessions"]),
    },
    tools: { name: (name) => name },
    models: {
      async oneShotForActor(systemPrompt, prompt, actorId) {
        return (await modelForActor(actorId))?.oneShot?.(systemPrompt, prompt);
      },
      async screenSecurity(input) {
        return (await modelForActor(input.actorId))?.screenSecurity?.(input);
      },
      async generateTitle(transcript, actorId) {
        return (await modelForActor(actorId))?.generateTitle?.(transcript, actorId);
      },
      async summarizeApproval(command, reason, purpose, actorId) {
        return (await modelForActor(actorId))?.summarizeApproval?.(command, reason, purpose, actorId);
      },
    },
    turns: {
      async runTurn(input) {
        return (await forActor(input.actorId)).turns.runTurn(input);
      },
      async resetSession(sessionId) {
        await Promise.all(
          [...harnesses.values()].map(async (pending) => (await pending).turns.resetSession?.(sessionId)),
        );
      },
      async close() {
        closed = true;
        const settled = await Promise.allSettled(harnesses.values());
        await Promise.all(
          settled.flatMap((entry) =>
            entry.status === "fulfilled" && entry.value.turns.close ? [entry.value.turns.close()] : [],
          ),
        );
        harnesses.clear();
      },
    },
  };
}
