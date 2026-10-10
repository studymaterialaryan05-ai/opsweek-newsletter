import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import { createArtDirection } from "../design/art-direction.js";
import { planLayouts, assertFourPagePlan } from "../design/layout-engine.js";
import { heroIllustration, decisionFlowIllustration, conceptMapIllustration, cartoonIllustration } from "../design/visual-assets.js";
import { photoAttribution } from "../design/unsplash.js";

const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
const arr = values => (Array.isArray(values) ? values : []).map(esc);
const shortDate = value => { const d = new Date(value); return Number.isNaN(d.getTime()) ? esc(value) : d.toLocaleDateString("en-IN", {day:"numeric",month:"short",year:"numeric",timeZone:"Asia/Kolkata"}); };

export function renderNewsletter(data, period, visualAssets = {}) {
  const stories = data.stories || [];
  const artDirection = createArtDirection({ editionDate: period.editionDate });
  const layoutPlan = assertFourPagePlan(planLayouts(stories.length));
  const lead = stories[0];
  const photos = Array.isArray(visualAssets.photos) ? visualAssets.photos : [];
  const photoFigure = (photo, className = "editorial-photo") => photo ? `<figure class="${className}"><img src="${esc(photo.imageUrl)}" alt="${esc(photo.alt)}" loading="eager"><figcaption>${photoAttribution(photo)}</figcaption></figure>` : "";
  const pageOne = stories.slice(0, 4);
  const pageTwo = stories.slice(4, 7);
  const storyCard = s => `<article class="story"><div class="kicker">${esc(s.region)} · ${esc(s.concept)}</div><h3>${esc(s.title)}</h3><p class="summary">${esc(s.summary)}</p><p><b>Operations lens:</b> ${esc(s.operationalIssue)}</p><p><b>Mechanisms to investigate:</b> ${(s.mechanisms || []).slice(0,2).map(esc).join(" ")}</p><p><b>Metrics to watch:</b> ${(s.metricsToWatch || []).slice(0,3).map(esc).join(" · ")}</p><p><b>Manager actions:</b> ${(s.managerActions || []).slice(0,2).map(esc).join(" ")}</p><p class="muted"><b>Evidence:</b> ${esc(s.evidenceNote || "")}</p><p class="lesson"><b>Manager's takeaway:</b> ${esc(s.lesson)}</p><p class="source"><a href="${esc(s.url)}">${esc(s.source)} · ${shortDate(s.publishedAt)} · Read source ↗</a></p></article>`;
  const concept = data.concept || {};
  const branches = [
    ["CAUSES", concept.causes],["CONSEQUENCES", concept.consequences],["INTERVENTIONS", concept.interventions]
  ];
  const mind = branches.map(([label, items]) => `<div class="mind-branch"><h3>${label}</h3><ul>${arr(items).map(i=>`<li>${i}</li>`).join("")}</ul></div>`).join("");
  const cartoons = [
    ["FORECASTING","The forecast said a surge was coming. The warehouse is now fully stocked for a demand spike that exists only in the spreadsheet.","Lesson: forecasts are inputs to decisions, not facts."],
    ["BOTTLENECKS","Every department hit its target. The customer is still waiting because the slowest step never changed.","Lesson: optimize the whole flow, not every silo."],
    ["PROCUREMENT","We saved 5% on the unit price. Then paid 20% more for urgent freight.","Lesson: purchase price is not total cost."]
  ];
  const comicKinds = ["forecasting", "bottleneck", "procurement"];
  const comic = cartoons.map((c, i)=>`<article class="comic"><div class="comic-scene">${cartoonIllustration(comicKinds[i])}</div><div class="comic-tag">${esc(c[0])}</div><p>${esc(c[1])}</p><small>${esc(c[2])}</small></article>`).join("");
  const heroVisual = heroIllustration(data.theme || "Operations in motion");
  const coverPhoto = photoFigure(photos[0], "cover-photo") || heroVisual;
  const analysisPhoto = photoFigure(photos[1], "analysis-photo");
  const decisionVisual = decisionFlowIllustration();
  const conceptVisual = conceptMapIllustration(concept);
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="opsweek-design-engine" content="${esc(artDirection.name)}"><meta name="opsweek-page-plan" content="${esc(layoutPlan.map(page => page.name).join(" | "))}"><title>OpsWeek · ${esc(period.editionDate)}</title><style>
@page{size:A4;margin:0}
:root{--ink:#14251f;--paper:#fbfaf5;--lime:#d8f36b;--lime-dark:#a6c93f;--muted:#66756d;--line:#dce3da;--orange:#ef8b55;--blue:#b9dbe0;--card:#fff}
*{box-sizing:border-box}
html,body{margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;color:var(--ink)}
body{background:#dce2d9}
.page{width:210mm;height:297mm;overflow:hidden;background:var(--paper);padding:11mm 13mm 13mm;page-break-after:always;position:relative;isolation:isolate}
.page:last-child{page-break-after:auto}
.page:before{content:"";position:absolute;z-index:-1;top:0;right:0;width:43mm;height:43mm;background:var(--lime);border-radius:0 0 0 100%;opacity:.55}
.page:nth-of-type(2):before{background:var(--blue)}
.page:nth-of-type(3):before{background:var(--orange)}
.page:nth-of-type(4):before{background:var(--lime)}
.topline{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #bdc8bd;padding-bottom:3mm;font-size:7pt;letter-spacing:1.15px;font-weight:800;text-transform:uppercase}
.brand{font-size:32pt;font-weight:900;letter-spacing:-2.5px;margin:5mm 0 0;line-height:.95}
.brand span{font-weight:400}
.dek{font-size:8pt;color:#52645a;letter-spacing:1.4px;margin-top:2mm;font-weight:700}
.headline{font-family:Georgia,serif;font-size:29pt;line-height:.98;letter-spacing:-1.1px;margin:6mm 0 4mm;max-width:165mm}
.leadbox{background:var(--lime);padding:5mm 5.5mm;margin:3mm 0 5mm;position:relative;border-radius:1.5mm}
.leadbox:after{content:"01";position:absolute;right:5mm;top:3mm;font-size:26pt;line-height:1;font-weight:900;letter-spacing:-2px;opacity:.16}
.leadbox h2{font-family:Georgia,serif;font-size:18pt;line-height:1.03;letter-spacing:-.35px;margin:2mm 16mm 2mm 0;max-width:145mm}
.kicker{font-size:6.6pt;text-transform:uppercase;letter-spacing:1.15px;font-weight:800;color:#38533d}
.leadbox p,.story p{font-size:7.7pt;line-height:1.3;margin:1.6mm 0}
.leadbox a,.source a{color:#263d2d;text-decoration:none;font-weight:700}
.story-grid{display:grid;grid-template-columns:1fr 1fr;gap:3.2mm}
.story{border:1px solid var(--line);border-top:2.3px solid var(--ink);padding:3mm;background:var(--card);break-inside:avoid;position:relative;border-radius:1mm}
.story:nth-child(3n+2){border-top-color:var(--orange)}
.story:nth-child(3n){border-top-color:#8da9b2}
.story h3{font-family:Georgia,serif;font-size:11.4pt;line-height:1.06;letter-spacing:-.25px;margin:1.6mm 0 1.8mm}
.story .summary{font-size:7.4pt;color:#46564d}
.story p b{font-size:7pt}
.story .lesson{font-size:7.2pt;background:#f0f4e8;border-left:2px solid var(--lime-dark);padding:1.6mm 2mm}
.story .source{font-size:6.2pt;margin-top:2mm;color:var(--muted)}
.pagefoot{position:absolute;bottom:6mm;left:13mm;right:13mm;border-top:1px solid #cbd4ca;padding-top:1.8mm;display:flex;justify-content:space-between;align-items:center;font-size:6.2pt;color:#68756d}
.page-title{font-family:Georgia,serif;font-size:27pt;line-height:.98;letter-spacing:-.9px;margin:7mm 0 2.5mm;max-width:160mm}
.intro{font-size:8pt;color:#596a60;line-height:1.35;max-width:165mm;margin:0}
.concept-band{background:var(--ink);color:var(--paper);padding:4.5mm 5mm;margin:4mm 0;position:relative;border-radius:1.5mm;overflow:hidden}
.concept-band:after{content:"OPS";position:absolute;right:3mm;bottom:-7mm;font-size:47pt;font-weight:900;letter-spacing:-4px;color:#fff;opacity:.06}
.concept-band .kicker{color:var(--lime)}
.concept-band h2{font-family:Georgia,serif;font-size:20pt;line-height:1;margin:1.5mm 0}
.concept-band p{font-size:8pt;line-height:1.32;max-width:150mm;margin:1.5mm 0 0}
.analysis-grid{display:grid;grid-template-columns:1fr 1fr;gap:3mm}
.analysis-grid .story{padding:2.7mm}
.analysis-grid .story h3{font-size:11pt;margin:1.3mm 0}
.analysis-grid .story p{font-size:7.15pt;line-height:1.26;margin:1.2mm 0}
.analysis-grid .story .source{font-size:6pt}\n.story .muted{font-size:5.7pt;line-height:1.15}
.mind-center{background:var(--ink);color:white;text-align:center;padding:5mm 7mm;border-radius:2mm;margin:5mm auto 4mm;width:72%;position:relative}
.mind-center:after{content:"";position:absolute;left:50%;bottom:-5mm;width:1px;height:5mm;background:var(--lime-dark)}
.mind-center .kicker{color:var(--lime)}
.mind-center h2{font-family:Georgia,serif;font-size:22pt;line-height:1;margin:1.5mm 0}
.mind-center p{font-size:7.5pt;line-height:1.3;margin:1.5mm 0 0}
.mind-branches{display:grid;grid-template-columns:repeat(3,1fr);gap:3mm;position:relative}
.mind-branch{border:1px solid #cdd8ca;border-radius:2mm;padding:3.3mm;background:#fff;position:relative;min-height:57mm}
.mind-branch:before{content:"";position:absolute;top:-4mm;left:50%;height:4mm;width:1px;background:#9baa93}
.mind-branch:nth-child(1){border-top:3px solid var(--orange)}
.mind-branch:nth-child(2){border-top:3px solid #88b8c1}
.mind-branch:nth-child(3){border-top:3px solid var(--lime-dark)}
.mind-branch h3{font-size:7pt;letter-spacing:1px;color:#38533d;margin:0 0 2mm}
.mind-branch ul{padding-left:3.5mm;margin:1.5mm 0}
.mind-branch li{font-size:7.2pt;line-height:1.3;margin-bottom:1.8mm}
.news-connection{background:#edf3df;border-left:3px solid var(--lime-dark);padding:3.5mm;margin-top:4mm;font-size:7.7pt;line-height:1.35}
.comic-grid{display:grid;grid-template-columns:1fr 1fr;gap:3.5mm}
.comic{border:1px solid #d5ddd2;background:#fff;padding:2.8mm;break-inside:avoid;border-radius:1.5mm}
.comic:nth-child(3){grid-column:1 / -1;display:grid;grid-template-columns:.8fr 1.2fr;column-gap:3mm;align-items:start}
.comic-scene{height:31mm;background:#edf2e7;position:relative;overflow:hidden;border-bottom:1px solid #d1d8cc;border-radius:1mm}
.comic:nth-child(3) .comic-scene{height:24mm;grid-row:1 / span 3}
.comic-sun{position:absolute;width:15mm;height:15mm;background:var(--lime);border-radius:50%;top:2mm;right:4mm}
.comic-box{position:absolute;width:21mm;height:15mm;border:2px solid #445440;bottom:0;left:10mm;background:#d4b68a}
.comic-person{position:absolute;bottom:0;left:36mm;font-size:16pt;line-height:1.1;color:#253d2b;text-align:center}
.comic-speech{position:absolute;left:2mm;top:2mm;max-width:58%;background:white;border:1px solid #7c8879;border-radius:2mm;padding:1.7mm;font-size:6.2pt;line-height:1.2}
.comic-tag{font-size:6.4pt;font-weight:800;letter-spacing:1px;margin-top:2mm;color:#47603d}
.comic p{font-family:Georgia,serif;font-size:9pt;line-height:1.18;margin:1mm 0 1.5mm}
.comic small{font-size:6.8pt;line-height:1.25;color:#58645b;display:block}
.takeaway{background:var(--ink);color:#f8f8f3;padding:4mm 4.5mm;margin-top:4mm;border-radius:1.5mm;position:relative}
.takeaway .kicker{color:var(--lime)}
.takeaway h2{font-family:Georgia,serif;font-size:16pt;line-height:1.02;margin:1.5mm 0}
.takeaway p{font-size:7.7pt;line-height:1.3;margin:1mm 0 0;max-width:165mm}
.quiz{border:1px solid #bdcbb8;background:#fff;padding:3mm;margin-top:3mm;border-radius:1mm}
.quiz b{font-size:6.7pt;letter-spacing:.7px}
.quiz p{font-size:7.5pt;line-height:1.28;margin:1.4mm 0}
.muted{color:#667067;font-size:6.2pt;line-height:1.25}
.editorial-photo{margin:0;position:relative;overflow:hidden;background:#e5e9df}
.editorial-photo img{display:block;width:100%;height:100%;object-fit:cover}
.editorial-photo figcaption{font-size:6pt;line-height:1.2;color:#58665b;background:#f0f2e9;padding:1.5mm 2mm}
.editorial-photo figcaption a{color:#38533d;font-weight:700;text-decoration:none}
.cover-photo{height:48mm;margin:3mm 0 2mm;border-radius:1.5mm}
.cover-photo img{object-position:center 48%}
.analysis-photo{height:38mm;margin:3mm 0;border-radius:1.5mm}
.page3-space{margin-top:4mm}.hero-illustration{display:block;width:100%;height:27mm;margin:3mm 0 2mm}.decision-flow{display:block;width:100%;height:22mm;margin:2mm 0 0}.concept-map-visual{display:block;width:100%;height:52mm;margin:5mm 0 4mm}.cartoon-art{display:block;width:100%;height:31mm}.comic:nth-child(3) .cartoon-art{height:24mm}
@media print{html,body{width:210mm;background:white}.page{margin:0;box-shadow:none;break-after:page}.page:last-child{break-after:auto}}
</style></head><body>
<section class="page"><div class="topline"><span>OPS<span style="font-weight:400">WEEK</span> / THE BUSINESS OPERATIONS BRIEF</span><span>EDITION · ${esc(period.editionDate)}</span></div><div class="brand">OPS<span>WEEK</span></div><div class="dek">REAL BUSINESS. OPERATIONAL THINKING. EVERY MONDAY.</div><h1 class="headline">${esc(data.theme || "The week through an operations lens")}</h1>${coverPhoto}<div class="leadbox"><div class="kicker">THE WEEK IN CONTEXT · ${esc(period.start)} TO ${esc(period.end)}</div><h2>${esc(lead?.title || "A quieter week for operations")}</h2><p>${esc(data.editorial || lead?.summary || "This edition connects business events to practical Operations Management lessons.")}</p>${lead ? `<p><a href="${esc(lead.url)}">Source: ${esc(lead.source)} ↗</a></p>` : ""}</div><div class="story-grid">${pageOne.slice(1).map(storyCard).join("") || '<p>Not enough verified stories were available for this reporting period. The editorial workflow will not invent news to fill space.</p>'}</div><div class="pagefoot"><span>News summaries are original. Facts and claims should be checked against linked sources.</span><span>01 / THE BRIEF</span></div></section>
<section class="page"><div class="topline"><span>OPS<span style="font-weight:400">WEEK</span> / ANALYSIS</span><span>INSIDE THE OPERATION</span></div><h1 class="page-title">The decision behind<br>the headline.</h1><p class="intro">Operations is where strategy meets the real world: time, capacity, people, suppliers, quality, and cost. Here is how this week's events connect to management concepts.</p><div class="concept-band"><div class="kicker">THIS WEEK'S LEARNING THEME</div><h2>${esc(concept.name || "Operational visibility")}</h2><p>${esc(concept.definition || "The ability to understand what is happening across a process and use that information to make better decisions.")}</p>${decisionVisual}</div>${analysisPhoto}<div class="analysis-grid">${pageOne.slice(1,3).concat(pageTwo).slice(0,4).map(storyCard).join("") || "<p>No case studies passed the evidence checks for this edition.</p>"}</div><div class="pagefoot"><span>Look for the trade-off, not just the outcome.</span><span>02 / ANALYSIS</span></div></section>
<section class="page"><div class="topline"><span>OPS<span style="font-weight:400">WEEK</span> / LEARN VISUALLY</span><span>CONCEPT MAP</span></div><h1 class="page-title">One concept.<br>Connected thinking.</h1><p class="intro">Use this map to move from definition to causes, consequences, and possible interventions.</p>${conceptVisual}<div class="news-connection"><b>NEWS CONNECTION</b><br>${esc(concept.newsConnection || "Use one of this week's stories to identify the operational problem, the evidence available, and the trade-off faced by the manager.")}<br><br><b>TAKEAWAY:</b> ${esc(concept.takeaway || "Measure the process before trying to optimize it.")}</div><p class="muted page3-space">Concept maps simplify complex systems for learning. Actual management decisions require case-specific evidence.</p><div class="pagefoot"><span>Connect the concept to a real business decision.</span><span>03 / MIND MAP</span></div></section>
<section class="page"><div class="topline"><span>OPS<span style="font-weight:400">WEEK</span> / THE LIGHTER SIDE</span><span>LEARN IT. REMEMBER IT.</span></div><h1 class="page-title">Operations is serious.<br>Managers are human.</h1><p class="intro">Three familiar moments from the world of processes, planning, and procurement.</p><div class="comic-grid">${comic}</div><div class="takeaway"><div class="kicker">THE WEEKLY TAKEAWAY</div><h2>Fix the system, not just the symptom.</h2><p>Before asking people to work harder, examine the process, constraints, incentives, information, and feedback loops shaping their decisions.</p></div><div class="quiz"><b>THE 30-SECOND OPS QUIZ</b><p>A warehouse has excess stock of slow-moving products but keeps running out of its bestsellers. Which topic would you investigate first?</p><p><b>A.</b> Inventory classification and demand forecasting &nbsp; <b>B.</b> Office seating &nbsp; <b>C.</b> Logo design</p><p class="muted">Answer: A. Investigate demand patterns, replenishment rules, lead times, and inventory segmentation.</p></div><p class="muted" style="margin-top:4mm">Cartoons in this edition are original illustrative scenarios, not claims about specific companies.</p><div class="pagefoot"><span>Keep asking: what is the process telling us?</span><span>04 / THE LIGHTER SIDE</span></div></section>
</body></html>`;
}

export async function writeNewsletter(data, period, visualAssets = {}) {
  const dateDir = path.join("newsletters", period.editionDate);
  await fs.mkdir(dateDir, { recursive: true });
  const html = renderNewsletter(data, period, visualAssets);
  const htmlPath = path.join(dateDir, "index.html");
  const pdfPath = path.join(dateDir, "newsletter.pdf");
  await fs.writeFile(htmlPath, html, "utf8");
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1200, height: 1600 } });
    await page.setContent(html, { waitUntil: "networkidle" });
    await page.pdf({ path: pdfPath, format: "A4", printBackground: true, preferCSSPageSize: true });
  } finally {
    await browser.close();
  }
  const pdfBytes = await fs.readFile(pdfPath);
  const pages = (pdfBytes.toString("latin1").match(/\/Type\s*\/Page\b/g) || []).length;
  if (pages !== 4) throw new Error(`PDF validation failed: expected 4 pages, detected ${pages}. Review content or rendering. The edition was not sent.`);
  return { htmlPath, pdfPath, pages, html };
}
