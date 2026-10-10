import test from "node:test";
import assert from "node:assert/strict";
import { getReportingPeriod } from "../src/utils/dates.js";

test("reporting period covers the previous Monday through Sunday", () => {
  const period = getReportingPeriod(new Date("2026-10-12T03:00:00.000Z"));
  assert.equal(period.start, "2026-10-05");
  assert.equal(period.end, "2026-10-11");
  assert.equal(period.editionDate, "2026-10-12");
});

test("reporting period on a Sunday still points to the previous completed week", () => {
  const period = getReportingPeriod(new Date("2026-10-11T12:00:00.000Z"));
  assert.equal(period.start, "2026-09-28");
  assert.equal(period.end, "2026-10-04");
});
