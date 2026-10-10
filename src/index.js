import { getReportingPeriod } from "./utils/dates.js";
import { collectNews } from "./news/collect.js";
import { analyzeStories } from "./ai/analyze.js";
import { writeNewsletter } from "./newsletter/render.js";
import { fetchEditorialPhotos } from "./design/unsplash.js";
import { sendNewsletter } from "./email/send.js";

async function main() {
  const period = getReportingPeriod();
  console.log(`OpsWeek run for ${period.start} through ${period.end}`);
  const collected = await collectNews(period);
  console.log(`Feeds checked: ${collected.feedsChecked}; relevant articles collected: ${collected.stories.length}; feed errors: ${collected.errors.length}`);
  if (collected.stories.length === 0) {
    throw new Error("No credible operations stories found in the configured RSS feeds. Check feeds or expand source configuration. No newsletter email will be sent.");
  }
  const analysis = await analyzeStories(collected.stories, period);
  if (!analysis.stories?.length) throw new Error("AI returned no source-validated operations stories. No email will be sent.");
  const visualAssets = await fetchEditorialPhotos(analysis);
  const output = await writeNewsletter(analysis, period, visualAssets);
  console.log(`Newsletter rendered: ${output.htmlPath}; PDF pages validated: ${output.pages}`);
  const delivery = await sendNewsletter({ period, pdfPath: output.pdfPath, html: output.html, stories: analysis.stories });
  console.log(JSON.stringify({ period, feedsChecked: collected.feedsChecked, articlesCollected: collected.stories.length, selectedStories: analysis.stories.length, pdfPages: output.pages, delivery: delivery.status }, null, 2));
}
main().catch(error => { console.error("OpsWeek failed:", error.stack || error.message); process.exitCode = 1; });
