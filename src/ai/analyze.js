const LENSES = [
  {
    match: /supply chain|supplier|sourcing|procurement|vendor/i,
    concept: "Supply Chain Resilience",
    issue: "Supplier availability, sourcing choices, and disruption risk can affect cost and continuity.",
    lesson: "Balance purchase price with reliability, lead time, quality, and the total cost of disruption.",
    mechanisms: ["Supplier concentration can amplify the effect of a single disruption.", "Long or variable lead times make recovery and inventory planning harder.", "A cheaper source can become more expensive when defects, delays, or expediting are included."],
    metrics: ["Supplier on-time-in-full (OTIF)", "Supplier lead-time variability", "Defect rate and cost of poor quality", "Share of critical spend with the largest supplier"],
    actions: ["Map critical inputs and single points of failure.", "Compare suppliers on total cost, reliability, quality, and recovery time.", "Define trigger points for alternate sourcing and escalation."],
    tradeoff: "Lower purchase price versus resilience, quality, and continuity."
  },
  {
    match: /logistics|freight|shipping|port|railway|transport|delivery|last.mile|warehouse/i,
    concept: "Logistics and Flow",
    issue: "Movement, storage, and hand-offs determine how reliably products reach customers.",
    lesson: "Measure end-to-end delivery performance, not just the efficiency of one transport or storage step.",
    mechanisms: ["A delay at one node can propagate through downstream schedules.", "Batching may lower unit transport cost but increase waiting time and inventory.", "Poor visibility makes it harder to distinguish a local delay from a system-wide constraint."],
    metrics: ["On-time-in-full delivery", "End-to-end order cycle time", "Cost per shipment or tonne-kilometre", "Dwell time at critical nodes"],
    actions: ["Map the end-to-end journey and identify where time accumulates.", "Separate planned transit time from waiting and handling time.", "Compare service, cost, and variability before changing routes or shipment size."],
    tradeoff: "Lowest transport cost versus speed, reliability, and customer service."
  },
  {
    match: /manufactur|factory|production|plant|steel|automotive|semiconductor|capacity/i,
    concept: "Capacity and Process Management",
    issue: "Production capacity, process reliability, and utilization influence output and operating cost.",
    lesson: "Identify the binding constraint before investing in more capacity or accelerating output.",
    mechanisms: ["High utilization can reduce flexibility when demand or downtime varies.", "Output from non-constrained steps can create work-in-progress rather than more finished goods.", "Unplanned downtime can disrupt both production plans and downstream commitments."],
    metrics: ["Overall equipment effectiveness (OEE)", "Throughput at the constraint", "First-pass yield", "Changeover time and unplanned downtime"],
    actions: ["Trace the process from input to finished output.", "Check whether the bottleneck is capacity, quality, material availability, or scheduling.", "Test a targeted intervention and measure throughput, not activity alone."],
    tradeoff: "High utilization and low unit cost versus flexibility, quality, and reliable flow."
  },
  {
    match: /retail|e-commerce|ecommerce|consumer|sales|demand|inventory|food processing|agriculture/i,
    concept: "Demand and Inventory Planning",
    issue: "Changes in demand must be translated into practical inventory, replenishment, and service decisions.",
    lesson: "Use demand signals alongside inventory, lead time, and service-level data to avoid both shortages and excess stock.",
    mechanisms: ["Forecast error can create simultaneous overstock in slow movers and stockouts in fast movers.", "Long replenishment lead times require earlier decisions and stronger visibility.", "A single aggregate inventory target can hide differences in demand variability and product criticality."],
    metrics: ["Forecast bias and absolute error", "Stockout rate and fill rate", "Days of inventory by SKU", "Obsolescence and markdown cost"],
    actions: ["Segment products by demand pattern, value, and criticality.", "Compare forecast error with actual stockouts and excess stock.", "Review reorder points and safety stock against real lead-time variability."],
    tradeoff: "Inventory carrying cost versus availability, responsiveness, and lost sales."
  },
  {
    match: /energy|power|fuel|infrastructure|renewable/i,
    concept: "Operational Resilience",
    issue: "Infrastructure and energy availability can shape operating continuity, cost, and capacity.",
    lesson: "Plan for operational dependencies and build contingencies around critical resources.",
    mechanisms: ["A critical utility or infrastructure dependency can constrain otherwise available capacity.", "Price volatility affects both operating cost and planning assumptions.", "Backup capacity has a cost but may reduce expected disruption losses."],
    metrics: ["Energy cost per unit of output", "Unplanned interruption hours", "Share of energy from critical single sources", "Recovery time after disruption"],
    actions: ["Map critical dependencies and their recovery times.", "Stress-test operating plans against interruption and price scenarios.", "Compare the cost of mitigation with the impact of downtime."],
    tradeoff: "Lowest short-run operating cost versus continuity, flexibility, and exposure to volatility."
  }
];

function pickLens(text) {
  return LENSES.find(lens => lens.match.test(text)) || {
    concept: "Operations Strategy",
    issue: "The development may affect how organizations plan resources, manage processes, or deliver value.",
    lesson: "Assess operational impact, trade-offs, and the measures that indicate success.",
    mechanisms: ["The headline alone does not establish the mechanism or magnitude of the operational impact.", "The full source is needed to distinguish a confirmed operational change from an announced intention.", "Implications depend on the organization's process, demand, and constraints."],
    metrics: ["Service level or customer impact", "End-to-end cycle time", "Total cost to serve", "Quality or reliability"],
    actions: ["Verify the development and its timeline in the original report.", "Identify which process, resource, or customer outcome could be affected.", "Track an outcome metric and a counter-metric to avoid local optimization."],
    tradeoff: "Cost, speed, reliability, quality, and customer impact."
  };
}

function cleanExcerpt(value = "") {
  return String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function listFrom(items, max = 3) {
  return items.slice(0, max);
}

export async function analyzeStories(stories, period) {
  // Zero-cost transparent analysis: use only RSS headlines, publisher metadata,
  // and available excerpts. Operational mechanisms are analytical hypotheses,
  // not claims that the news article proves causation.
  const selected = stories.slice(0, 7).map(raw => {
    const sourceText = cleanExcerpt(raw.excerpt);
    const title = cleanExcerpt(raw.title);
    const lens = pickLens(`${title} ${sourceText}`);
    const summary = sourceText
      ? (sourceText.length > 520 ? `${sourceText.slice(0, 517).replace(/\s+\S*$/, "")}…` : sourceText)
      : `The source reports: “${title}”. The headline alone does not establish the full context or operational consequences.`;
    const evidenceLevel = sourceText.length >= 220 ? "Headline plus publisher excerpt" : "Headline and limited metadata";
    return {
      title,
      source: raw.source || "Original publisher",
      publishedAt: raw.publishedAt,
      url: raw.url,
      region: /india|indian|rupee|₹|mumbai|delhi|gujarat/i.test(`${title} ${sourceText}`) ? "India" : "International",
      summary,
      operationalIssue: lens.issue,
      concept: lens.concept,
      conceptExplanation: `${lens.concept} is a useful framework for examining this development. The specific mechanism and size of the impact should be verified against the full report.`,
      mechanisms: listFrom(lens.mechanisms),
      tradeoff: lens.tradeoff,
      metricsToWatch: listFrom(lens.metrics, 4),
      managerActions: listFrom(lens.actions),
      lesson: lens.lesson,
      discussionQuestion: `If you were responsible for this operation, which metric would you check first, and what counter-metric would stop you from improving one area at the expense of the whole system?`,
      evidenceLevel,
      evidenceNote: sourceText.length >= 220
        ? "Summary uses the available RSS excerpt. The operational mechanisms, metrics, and actions are analytical prompts, not verified causes or reported company decisions."
        : "Only limited RSS metadata was available. Read the linked source before drawing conclusions; analytical prompts are hypotheses, not reported facts."
    };
  });

  return {
    theme: "The operating decisions behind this week's headlines",
    editorial: `This edition covers ${period.start} to ${period.end}. Each story is examined through an Operations Management framework, with mechanisms to investigate, metrics to monitor, and managerial actions to consider. Because the free pipeline uses RSS metadata and excerpts rather than a generative research model, analysis distinguishes reported context from hypotheses and prompts for further investigation.`,
    stories: selected,
    concept: {
      name: "Operational Resilience",
      definition: "An organization's ability to sustain or restore critical operations when demand, supply, infrastructure, or processes are disrupted.",
      causes: [
        "Dependence on a small number of suppliers or routes",
        "Demand uncertainty and limited visibility",
        "Capacity constraints and process bottlenecks",
        "Insufficient contingency planning"
      ],
      consequences: [
        "Longer lead times and missed service targets",
        "Higher expediting and operating costs",
        "Production interruptions or stockouts",
        "Reduced customer trust"
      ],
      interventions: [
        "Map critical suppliers, routes, and process dependencies",
        "Track lead time, service level, and bottleneck utilization",
        "Define contingency plans for high-impact disruptions",
        "Review trade-offs using evidence and scenario planning"
      ],
      newsConnection: "For each linked story, separate the reported event from the operational mechanism you suspect. Then identify the data that would confirm or reject that hypothesis.",
      takeaway: "Good operations analysis does not stop at what happened. It asks how the process could transmit the impact, what evidence would prove it, and which intervention improves the whole system."
    }
  };
}
