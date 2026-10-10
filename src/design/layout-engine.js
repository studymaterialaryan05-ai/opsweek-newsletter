export function planLayouts(storyCount = 0) {
  const count = Math.max(0, Number(storyCount) || 0);
  return [
    { page: 1, name: "The Brief", purpose: "Lead story and quick-scan news", stories: Math.min(4, count), visual: "hero-process" },
    { page: 2, name: "Inside the Operation", purpose: "Operations implications and trade-offs", stories: Math.min(4, Math.max(0, count - 1)), visual: "decision-flow" },
    { page: 3, name: "The Mind Map", purpose: "One concept, its drivers, effects, and interventions", stories: 0, visual: "concept-map" },
    { page: 4, name: "The Lighter Side", purpose: "Original operations cartoons and discussion", stories: 0, visual: "editorial-comics" }
  ];
}

export function assertFourPagePlan(plan) {
  if (!Array.isArray(plan) || plan.length !== 4 || plan.some((page, index) => page.page !== index + 1)) {
    throw new Error("Design engine must produce exactly four ordered A4 pages.");
  }
  return plan;
}
