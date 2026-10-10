import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";

export async function analyzeStories(stories, period) {
  if (!process.env.OPENAI_API_KEY) throw new Error("Missing OPENAI_API_KEY GitHub secret.");
  if (!stories.length) return { stories: [], theme: "A quiet week in operations", concept: { name: "Operational visibility", definition: "The ability to see what is happening across a process or supply chain.", branches: ["Signals", "Bottlenecks", "Decisions", "Feedback"] }, editorial: "No sufficiently relevant stories were found in the configured feeds for this reporting period." };
  const prompt = `You are an accurate editorial analyst and Operations Management instructor for first-year MBA students in India. Analyze only the supplied RSS metadata and excerpts. Never invent facts, figures, quotes, causal claims, or article details. Treat excerpts as incomplete when appropriate. Distinguish supported facts from your interpretation. Do not reproduce article text. Reporting period: ${period.start} to ${period.end}. Return valid JSON only with keys: theme (string), editorial (max 70 words), stories (array of at most 8 objects with title, source, publishedAt, url, region ("India" or "International" or "Other"), summary (max 55 words), operationalIssue (max 35 words), concept, conceptExplanation (max 35 words), tradeoff (max 25 words), lesson (max 30 words), discussionQuestion, evidenceNote), concept (object with name, definition, causes array of 3-5 short strings, consequences array of 3-5 short strings, interventions array of 3-5 short strings, newsConnection (max 40 words), takeaway (max 25 words)). Keep URLs and titles exactly as supplied. Only select stories with a real operations connection. If fewer stories qualify, return fewer. Source data follows as JSON: ${JSON.stringify(stories.slice(0, 35))}`;
  const response = await client.chat.completions.create({
    model: MODEL,
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: "Return only valid JSON. Never fabricate facts or sources. If evidence is incomplete, say so." },
      { role: "user", content: prompt }
    ]
  });
  const result = JSON.parse(response.choices[0]?.message?.content || "{}");
  const validStories = (result.stories || []).filter(s => typeof s.url === "string" && /^https?:\/\//i.test(s.url) && stories.some(raw => raw.url === s.url)).slice(0, 8);
  return { ...result, stories: validStories };
}
