import "./support/auto-fake-sprites.ts";
import assert from "node:assert/strict";
import test from "node:test";
import { buildApp } from "../src/wiring.ts";
import { testConfig } from "./support/test-config.ts";

for (const retry of [false, true]) {
  test(`queued run identifiers stay in volatile context${retry ? " across a retry" : ""}`, async (t) => {
    const built = buildApp(testConfig({ workers: 1 }));
    built.runtime.start();
    t.after(() => built.runtime.stop());
    const queued = await built.app.turn({
      surface: "web",
      actor: { externalId: "internal:run-prompt-proof" },
      conversation: { kind: "dm", threadRef: `run-prompt-proof:${retry}` },
      text: retry ? "!work-then-boom" : "hello",
      async: true,
    });
    assert.equal(queued.status, "queued");
    assert.ok(queued.runId);
    const run = await built.runs.waitFor(queued.runId);
    assert.equal(run.status, "done");
    assert.ok(run.result?.sessionId);
    const requests = await built.sessions.listLlmRequests(run.result.sessionId);
    assert.equal(requests.length, retry ? 2 : 1);
    requests.forEach((request, index) => {
      const envelope = request.promptEnvelope as { system: string; messages: unknown };
      assert.doesNotMatch(envelope.system, /QM run ID:|QM attempt ID:/);
      assert.match(JSON.stringify(envelope.messages), new RegExp(`QM run ID: ${queued.runId}`));
      assert.match(JSON.stringify(envelope.messages), new RegExp(`QM attempt ID: ${queued.runId}:${index + 1}`));
    });
  });
}
