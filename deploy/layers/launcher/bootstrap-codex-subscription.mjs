#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { CompactSign } from "jose";

const deployments = {
  manifest: { orgId: "manifest", url: "https://manifest.mnfstlabs.dev" },
  prolimo: { orgId: "prolimo", url: "https://prolimo.mnfstlabs.dev" },
  plateops: { orgId: "plateops", url: "https://plateops.mnfstlabs.dev" },
};

function parseEnv(raw) {
  const values = {};
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator < 1) continue;
    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    values[key] = value;
  }
  return values;
}

function signingKeyId(secret) {
  return createHash("sha256").update(secret).digest("base64url").slice(0, 8);
}

async function capabilityToken({ orgId, actorId, secret }) {
  const payload = new TextEncoder().encode(
    JSON.stringify({
      orgId,
      actorId,
      scopeId: `personal:${actorId}`,
      liveActor: true,
      exp: Date.now() + 10 * 60_000,
    }),
  );
  return new CompactSign(payload)
    .setProtectedHeader({ alg: "HS256", kid: signingKeyId(secret) })
    .sign(new TextEncoder().encode(secret));
}

async function responseJson(response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`HTTP ${response.status} returned a non-JSON response`);
  }
}

async function bootstrap(name, authBytes, actorId) {
  const deployment = deployments[name];
  if (!deployment) throw new Error(`unknown deployment: ${name}`);
  const layerDir = resolve(import.meta.dirname, "..", name);
  const env = parseEnv(await readFile(resolve(layerDir, ".env"), "utf8"));
  if (!env.CAPABILITY_SECRET) throw new Error(`${name}: CAPABILITY_SECRET is not configured`);
  const token = await capabilityToken({ orgId: deployment.orgId, actorId, secret: env.CAPABILITY_SECRET });
  const headers = {
    "content-type": "application/json",
    "x-agent-capability": token,
  };
  const createResponse = await fetch(`${deployment.url}/v1/keychain/credentials`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      service: "codex",
      files: [{ path: ".codex/auth.json", contentBase64: authBytes.toString("base64") }],
      accountLabel: "MNFST ChatGPT subscription",
      origin: "operator-bootstrap",
    }),
  });
  const created = await responseJson(createResponse);
  if (!createResponse.ok) throw new Error(`${name}: credential upload failed with HTTP ${createResponse.status}`);
  const credentialId = created.credential?.id;
  if (!credentialId || created.credential?.ownerId?.toLowerCase() !== actorId.toLowerCase())
    throw new Error(`${name}: uploaded credential was not bound to ${actorId}`);

  const listResponse = await fetch(`${deployment.url}/v1/keychain/credentials`, { headers });
  const listed = await responseJson(listResponse);
  if (!listResponse.ok) throw new Error(`${name}: credential verification failed with HTTP ${listResponse.status}`);
  const match = listed.credentials?.find((credential) => credential.id === credentialId);
  if (match?.service !== "codex" || match?.kind !== "file" || !match?.targets?.includes(".codex/auth.json")) {
    throw new Error(`${name}: stored credential metadata did not match the Codex file credential contract`);
  }
  console.log(`${name}: verified ${actorId}'s isolated Codex subscription credential ${match.id}`);
}

const actorId = process.env.QM_BOOTSTRAP_ACTOR ?? "mohamed@mnfstlabs.com";
const names = process.argv.slice(2);
const selected = names.length ? names : Object.keys(deployments);
const authPath = process.env.CODEX_AUTH_FILE ?? resolve(process.env.HOME, ".codex", "auth.json");
const authBytes = await readFile(authPath);
JSON.parse(authBytes.toString("utf8"));
for (const name of selected) await bootstrap(name, authBytes, actorId);
