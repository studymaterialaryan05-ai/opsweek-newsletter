export function getReportingPeriod(now = new Date()) {
  const indiaNow = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const fmt = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;

  // A manual dry run should test against recent feed items, since RSS feeds
  // generally do not retain enough history to populate an older full week.
  if (process.env.DRY_RUN === "true") {
    const end = new Date(indiaNow);
    end.setHours(0, 0, 0, 0);
    end.setDate(end.getDate() - 1);
    const start = new Date(end);
    start.setDate(start.getDate() - 6);
    return { start: fmt(start), end: fmt(end), editionDate: fmt(indiaNow) };
  }

  const day = indiaNow.getDay();
  const daysSinceMonday = (day + 6) % 7;
  const currentMonday = new Date(indiaNow);
  currentMonday.setDate(indiaNow.getDate() - daysSinceMonday);
  currentMonday.setHours(0, 0, 0, 0);
  const start = new Date(currentMonday);
  start.setDate(start.getDate() - 7);
  const end = new Date(currentMonday);
  end.setDate(end.getDate() - 1);
  return { start: fmt(start), end: fmt(end), editionDate: fmt(indiaNow) };
}
