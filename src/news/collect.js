import Parser from "rss-parser";

const parser = new Parser({ timeout: 20000 });
const DEFAULT_FEEDS = [
  "https://feeds.bbci.co.uk/news/business/rss.xml",
  "https://www.business-standard.com/rss/industry-101.rss",
  "https://economictimes.indiatimes.com/rssfeeds/13352306.cms",
  "https://www.thehindubusinessline.com/feeder/default.rss",
  "https://cfo.economictimes.indiatimes.com/rss/strategy-operations"
];

const OPS_TERMS = /supply chain|logistics|warehouse|inventory|manufactur|production|procurement|supplier|factory|capacity|quality control|forecast|distribution|fulfilment|fulfillment|operations|automation|robotics|port|freight|last.mile|bottleneck|lean management|process improvement|retail operations|cold chain|plant shutdown|delivery delay|production line|lead time|resilience|industry|industrial|business|company|companies|trade|export|import|infrastructure|steel|automotive|semiconductor|energy|transport|railway|shipping|e-commerce|ecommerce|food processing|agriculture|sourcing|vendor|plant|manufacturing/i;

export async function collectNews({ start, end } = {}) {
  const feedUrls = (process.env.RSS_FEEDS || DEFAULT_FEEDS.join(",")).split(",").map(s => s.trim()).filter(Boolean);
  const found = [];
  const errors = [];
  for (const feedUrl of feedUrls) {
    try {
      const feed = await parser.parseURL(feedUrl);
      let feedMatches = 0;
      for (const item of feed.items || []) {
        const url = item.link;
        const published = item.isoDate || item.pubDate;
        if (!url || !item.title || !published) continue;
        const date = new Date(published);
        if (Number.isNaN(date.getTime())) continue;
        const day = date.toISOString().slice(0, 10);
        if ((start && day < start) || (end && day > end)) continue;
        const text = `${item.title} ${item.contentSnippet || ""} ${item.content || ""}`;
        if (!OPS_TERMS.test(text)) continue;
        feedMatches++;
        found.push({
          title: item.title.trim(),
          url,
          publishedAt: date.toISOString(),
          source: feed.title || new URL(feedUrl).hostname,
          excerpt: (item.contentSnippet || item.content || "").replace(/<[^>]*>/g, " ").slice(0, 1400)
        });
      }
      console.log(`RSS feed checked: ${feedUrl}; matching stories in reporting window: ${feedMatches}`);
    } catch (error) {
      errors.push({ feed: feedUrl, error: error.message });
      console.warn(`RSS feed unavailable: ${feedUrl}: ${error.message}`);
    }
  }
  const unique = [...new Map(found.map(item => [item.url.split("#")[0].replace(/\/$/, ""), item])).values()];
  unique.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  return { stories: unique, errors, feedsChecked: feedUrls.length };
}
