const LENSES = [
  {
    match: /supply chain|supplier|sourcing|procurement|vendor/i,
    concept: "Supply Chain Resilience",
    issue: "Supplier availability, sourcing choices, and disruption risk can affect cost and continuity.",
    lesson: "Managers should balance purchase price with reliability, lead time, and the cost of disruption."
  },
  {
    match: /logistics|freight|shipping|port|railway|transport|delivery|last.mile|warehouse/i,
    concept: "Logistics and Flow",
    issue: "Movement, storage, and hand-offs determine how reliably products reach customers.",
    lesson: "Measure end-to-end delivery performance, not just the efficiency of one transport or storage step."
  },
  {
    match: /manufactur|factory|production|plant|steel|automotive|semiconductor|capacity/i,
    concept: "Capacity and Process Management",
    issue: "Production capacity, process reliability, and utilization influence output and operating cost.",
    lesson: "Managers should identify constraints before investing in more capacity or accelerating output."
  },
  {
    match: /retail|e-commerce|ecommerce|consumer|sales|demand|inventory|food processing|agriculture/i,
    concept: "Demand and Inventory Planning",
    issue: "Changes in demand must be translated into practical inventory, replenishment, and service decisions.",
    lesson: "Use demand signals alongside inventory and service-level data to avoid both shortages and excess stock."
  },
  {
    match: /energy|power|fuel|infrastructure|renewable/i,
    concept: "Operational Resilience",
    issue: "Infrastructure and energy availability can shape operating continuity, cost, and capacity.",
    lesson: "Plan for operational dependencies and build contingencies around critical resources."
  }
];

function pickLens(text) {
  return LENSES.find(lens => lens.match.test(text)) || {
    concept: "Operations Strategy",
    issue: "The development may affect how organizations plan resources, manage processes, or deliver value.",
    lesson: "Managers should assess the operational impact, the trade-offs involved, and the measures that indicate success."
  };
}

function cleanExcerpt(value = "") {
  return String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

export async function analyzeStories(stories, period) {
  // No external AI API is called. This deterministic mode is free to run and
  // intentionally uses only RSS titles, publisher metadata, and excerpts.
  const selected = stories.slice(0, 7).map((raw, index) => {
    const sourceText = cleanExcerpt(raw.excerpt);
    const title = cleanExcerpt(raw.title);
    const lens = pickLens(`${title} ${sourceText}`);
    const summary = sourceText
      ? (sourceText.length > 320 ? `${sourceText.slice(0, 317).replace(/\s+\S*$/, "")}…` : sourceText)
      : `The source reports: “${title}”. Read the linked article for the full context; the RSS metadata alone does not establish all details.`;
    return {
      title,
      source: raw.source || "Original publisher",
      publishedAt: raw.publishedAt,
      url: raw.url,
      region: /india|indian|rupee|₹|mumbai|delhi|gujarat/i.test(`${title} ${sourceText}`) ? "India" : "International",
      summary,
      operationalIssue: lens.issue,
      concept: lens.concept,
      conceptExplanation: `This story can be examined through ${lens.concept.toLowerCase()}; treat this as an analytical lens, not a claim that the article proves a specific operational cause.`,
      tradeoff: "Balance cost, speed, reliability, and customer impact rather than optimizing one metric alone.",
      lesson: lens.lesson,
      discussionQuestion: "Which operational metric would you track first, and what trade-off might it hide?",
      evidenceNote: sourceText ? "Summary is based on RSS metadata/excerpt; consult the publisher for complete context." : "Only the headline and publisher metadata were available; verify the full article before drawing conclusions."
    };
  });

  return {
    theme: "Resilience, execution, and operational trade-offs",
    editorial: `This edition covers ${period.start} to ${period.end}. Stories are selected from publisher RSS feeds and paired with practical Operations Management lenses using transparent templates. These lenses are prompts for analysis, not AI-verified conclusions.`,
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
      newsConnection: "Use the linked stories in this edition to ask how organizations protect flow, service, and cost performance under changing conditions.",
      takeaway: "Resilience is designed through visibility, contingency choices, and disciplined measurement."
    }
  };
}
