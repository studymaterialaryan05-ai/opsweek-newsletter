export function getReportingPeriod(now = new Date()) {
  const indiaNow = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const day = indiaNow.getDay();
  const daysSinceMonday = (day + 6) % 7;
  const currentMonday = new Date(indiaNow);
  currentMonday.setDate(indiaNow.getDate() - daysSinceMonday);
  currentMonday.setHours(0, 0, 0, 0);
  const start = new Date(currentMonday);
  start.setDate(start.getDate() - 7);
  const end = new Date(currentMonday);
  end.setDate(end.getDate() - 1);
  const fmt = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  return { start: fmt(start), end: fmt(end), editionDate: fmt(indiaNow) };
}
