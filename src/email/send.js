import fs from "node:fs/promises";
import { Resend } from "resend";

export async function sendNewsletter({ period, pdfPath, html, stories = [] }) {
  const dryRun = process.env.DRY_RUN !== "false";
  const testMode = process.env.TEST_EMAIL_MODE === "true";
  const to = testMode ? process.env.TEST_EMAIL_TO : process.env.EMAIL_TO;
  const from = process.env.EMAIL_FROM;
  if (dryRun) {
    console.log("DRY RUN: no email sent. Set DRY_RUN=false to enable delivery after testing.");
    return { status: "dry-run", recipientConfigured: Boolean(to) };
  }
  if (!process.env.RESEND_API_KEY || !to || !from) throw new Error("Email is not configured. Set RESEND_API_KEY, EMAIL_FROM, and EMAIL_TO in GitHub Actions secrets.");
  const periodKey = `${period.start}_${period.end}`;
  const statePath = ".delivery-state.json";
  let state = {};
  try { state = JSON.parse(await fs.readFile(statePath, "utf8")); } catch {}
  if (state[periodKey] === "accepted") throw new Error(`A newsletter for ${periodKey} was already accepted by the email provider. Refusing duplicate delivery.`);
  const resend = new Resend(process.env.RESEND_API_KEY);
  const featured = stories.slice(0, 3).map(s => `<li><a href="${s.url}">${escapeHtml(s.title)}</a> <span>· ${escapeHtml(s.concept || "Operations")}</span></li>`).join("");
  const attachment = await fs.readFile(pdfPath);
  const result = await resend.emails.send({
    from,
    to: to.split(",").map(s => s.trim()).filter(Boolean),
    subject: `OpsWeek | Business Operations Brief | ${period.editionDate}`,
    html: `<!doctype html><html><body style="margin:0;background:#f5f6f1;font-family:Arial,sans-serif;color:#17211d"><div style="max-width:640px;margin:0 auto;padding:24px"><div style="font-size:26px;font-weight:900;letter-spacing:-2px">OPS<span style="font-weight:400">WEEK</span></div><p style="font-size:11px;letter-spacing:1px">THE BUSINESS OPERATIONS BRIEF</p><h1 style="font-size:34px;line-height:1.05">Business happens. Operations explain why.</h1><p>This week's edition connects real business news to Operations Management concepts for MBA students.</p><h2>Three stories to start with</h2><ul>${featured || "<li>See the attached newsletter for this week's learning brief.</li>"}</ul><p>Inside: news analysis, an operations concept mind map, and original business cartoons.</p><p><a href="${process.env.PUBLIC_SITE_URL || ""}/newsletters/${period.editionDate}/">Read the HTML edition</a></p><p style="font-size:12px;color:#59655c">Reporting period: ${period.start} to ${period.end}. Sources are linked in the edition. To stop receiving these emails, contact the newsletter administrator to be removed from the recipient list.</p></div></body></html>`,
    attachments: [{ filename: `opsweek-${period.editionDate}.pdf`, content: attachment }]
  });
  if (result.error) throw new Error(`Email provider error: ${result.error.message}`);
  state[periodKey] = "accepted";
  await fs.writeFile(statePath, JSON.stringify(state, null, 2));
  console.log("Email accepted by provider. Provider message ID:", result.data?.id || "not returned");
  return { status: "accepted", id: result.data?.id };
}
function escapeHtml(value) { return String(value ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c])); }
