import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dirs = await fs.readdir(path.join(root, "newsletters"), { withFileTypes: true }).catch(() => []);
const editions = [];
for (const entry of dirs) {
  if (!entry.isDirectory() || !/^\d{4}-\d{2}-\d{2}$/.test(entry.name)) continue;
  try {
    await fs.access(path.join(root, "newsletters", entry.name, "index.html"));
    editions.push({ date: entry.name, title: `OpsWeek edition · ${entry.name}`, html: `newsletters/${entry.name}/index.html`, pdf: `newsletters/${entry.name}/newsletter.pdf` });
  } catch {}
}
editions.sort((a,b) => b.date.localeCompare(a.date));
await fs.writeFile(path.join(root, "archive.json"), JSON.stringify({ editions }, null, 2));
console.log(`Archive updated with ${editions.length} edition(s).`);
