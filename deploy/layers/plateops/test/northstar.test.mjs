import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const contract = readFileSync(new URL("../NORTHSTAR.md", import.meta.url), "utf8");
const skill = readFileSync(new URL("../sandbox/skills/plateops-northstar/SKILL.md", import.meta.url), "utf8");
const onboarding = readFileSync(new URL("../FOUNDER-ONBOARDING.md", import.meta.url), "utf8");

test("ready work dispatches without a founder approval queue", () => {
  for (const text of [contract, skill, onboarding]) {
    assert.match(text, /accepted, human-owned\s+Linear ENG work order/);
    assert.match(text, /machine-checkable action policy/);
    assert.match(text, /without[\s\S]{0,80}approval (?:ceremony|queue)/i);
    assert.match(text, /exact[- ]green (?:pull request|commit|merge)|green exact commit/i);
    assert.match(text, /protected-main (?:delivery workflow|deployment|production)/);
    assert.doesNotMatch(
      text,
      /founder gate|explicit founder approval|explicit approval recorded by|gated merge|approved engineering execution/i,
    );
  }
  assert.match(contract, /acceptance:\s+accepted_by:/);
  assert.doesNotMatch(contract, /approval:\s+approved_by:|exact approved Linear issue|approving engineering founder/);
  assert.match(contract, /may_merge: true/);
  assert.match(contract, /may_deploy_production_directly: false/);
  assert.match(contract, /production_path: automatic protected-main workflow/);
  assert.match(contract, /revision_sha256: immutable digest of the resolved action policy/);
  assert.match(
    contract,
    /implementation agent\s+cannot grant itself merge, production, public-exposure, permission, secret, or\s+destructive authority/,
  );
  assert.match(contract, /Rows 01, 02, 04, 21, 23, 34, and 38/);
  assert.match(contract, /47\s+genuine start-blocker relationships with maximum fan-in three/);
});

test("live operating names and delivery states stay canonical", () => {
  for (const name of [
    "#announcements",
    "#help-product",
    "#product-research",
    "#product-triage",
    "#proj-m1-affiliation",
    "#releases",
    "#social",
    "#team-engineering",
    "#team-product-operations",
  ]) {
    assert.match(contract, new RegExp(name));
  }

  assert.doesNotMatch(
    contract,
    /`#(?:p-northstar|p-m1-management-and-affiliation-mvp|triage-product|team-product-ops|research-market|help-plateops)`/,
  );
  assert.match(contract, /Backlog -> Todo -> In Progress -> Verifying -> Done/);
  assert.doesNotMatch(
    contract,
    /In Progress -> In Review|manual delivery action|may_deploy_production:\s*false|plateops-ai/,
  );
  assert.match(contract, /organization is `PlateOps`/);
  assert.match(contract, /`PlateOps\/plateops`/);
});

test("onboarding grants runtime access without broad administrator authority", () => {
  assert.match(onboarding, /Slack, Linear, and GitHub connected with\s+zero items needing attention/);
  assert.match(onboarding, /do not wait in a\s+standing human queue/);
  assert.match(
    onboarding,
    /Slack channel administration, Linear workspace-role administration, GitHub\s+organization administration/,
  );
  assert.match(onboarding, /Declared connector scopes alone are\s+not sufficient proof/);
  assert.doesNotMatch(
    onboarding,
    /Founder approval flow|founder still approves merge|Stop at human merge|founder approval created linked/,
  );
});
