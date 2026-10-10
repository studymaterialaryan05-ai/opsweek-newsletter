import test from "node:test";
import assert from "node:assert/strict";
import { createArtDirection } from "../src/design/art-direction.js";
import { planLayouts, assertFourPagePlan } from "../src/design/layout-engine.js";
import { heroIllustration, decisionFlowIllustration, conceptMapIllustration, cartoonIllustration } from "../src/design/visual-assets.js";
import { photoAttribution } from "../src/design/unsplash.js";

test("art direction defines the OpsWeek visual system", () => {
  const direction = createArtDirection({ editionDate: "2026-10-11" });
  assert.equal(direction.name, "OpsWeek Visual Studio");
  assert.ok(direction.palette.ink);
  assert.ok(direction.principles.length >= 4);
});

test("layout engine always plans exactly four ordered pages", () => {
  const plan = assertFourPagePlan(planLayouts(7));
  assert.equal(plan.length, 4);
  assert.deepEqual(plan.map(page => page.page), [1, 2, 3, 4]);
  assert.throws(() => assertFourPagePlan(plan.slice(0, 3)), /exactly four/);
});

test("visual assets return accessible, self-contained SVG", () => {
  const assets = [
    heroIllustration("Flow & resilience"),
    decisionFlowIllustration(),
    conceptMapIllustration({ name: "Resilience", causes: ["Supplier risk"], consequences: ["Delays"], interventions: ["Plan ahead"] }),
    cartoonIllustration("forecasting"),
    cartoonIllustration("bottleneck"),
    cartoonIllustration("procurement")
  ];
  for (const svg of assets) {
    assert.match(svg, /^<svg/);
    assert.match(svg, /role="img"/);
    assert.match(svg, /<\/svg>$/);
  }
  assert.match(assets[0], /Flow &amp; resilience/);
  assert.match(assets[3], /FORECASTING/);
});

\ntest("Unsplash attribution includes photographer and referral links", () => {
  const attribution = photoAttribution({
    photographer: "Example Photographer",
    photographerUrl: "https://unsplash.com/@example",
    unsplashUrl: "https://unsplash.com/"
  });
  assert.match(attribution, /Example Photographer/);
  assert.match(attribution, /utm_source=opsweek_newsletter/);
  assert.match(attribution, /utm_medium=referral/);
});
