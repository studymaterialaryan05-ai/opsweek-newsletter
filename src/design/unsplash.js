const API = "https://api.unsplash.com/search/photos";
const APP_NAME = "opsweek_newsletter";

function safePhoto(photo) {
  if (!photo?.urls?.regular || !photo?.links?.html || !photo?.user?.name || !photo?.user?.links?.html) return null;
  return {
    id: photo.id,
    alt: photo.alt_description || photo.description || "Editorial photograph illustrating business operations",
    imageUrl: photo.urls.regular,
    photoUrl: photo.links.html,
    photographer: photo.user.name,
    photographerUrl: photo.user.links.html,
    unsplashUrl: "https://unsplash.com/",
    width: photo.width,
    height: photo.height
  };
}

export async function fetchEditorialPhotos(data = {}) {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    console.log("Unsplash disabled: UNSPLASH_ACCESS_KEY is not configured. Original vector visuals will be used.");
    return { provider: "fallback", photos: [], reason: "missing_access_key" };
  }

  const stories = Array.isArray(data.stories) ? data.stories : [];
  const text = stories.slice(0, 4).map(s => `${s.title || ""} ${s.concept || ""}`).join(" ");
  const query = /agriculture|farm|food|rural|milk|crop/i.test(text)
    ? "India agriculture farmers supply chain documentary photography"
    : /port|shipping|freight|logistics|warehouse|rail/i.test(text)
      ? "cargo port logistics warehouse supply chain documentary photography"
      : /factory|manufactur|steel|production|energy/i.test(text)
        ? "industrial manufacturing factory workers documentary photography"
        : "logistics supply chain warehouse workers industry documentary photography";

  const queries = [query, "container port freight transport operations"];
  const photos = [];
  for (const q of queries) {
    const url = new URL(API);
    url.searchParams.set("query", q);
    url.searchParams.set("per_page", "10");
    url.searchParams.set("orientation", "landscape");
    url.searchParams.set("content_filter", "high");
    try {
      const response = await fetch(url, {
        headers: { Authorization: `Client-ID ${accessKey}`, "Accept-Version": "v1" },
        signal: AbortSignal.timeout(12000)
      });
      if (!response.ok) {
        console.warn(`Unsplash search failed (${response.status}); using available visuals.`);
        continue;
      }
      const payload = await response.json();
      for (const item of payload.results || []) {
        const photo = safePhoto(item);
        if (photo && !photos.some(existing => existing.id === photo.id)) photos.push(photo);
      }
    } catch (error) {
      console.warn(`Unsplash search unavailable: ${error.message}`);
    }
  }
  console.log(`Unsplash editorial photos selected: ${photos.length} (queries: ${queries.length})`);
  return { provider: "unsplash", photos: photos.slice(0, 6), reason: photos.length ? "ok" : "no_results" };
}

export function photoAttribution(photo) {
  if (!photo) return "";
  const profile = new URL(photo.photographerUrl);
  profile.searchParams.set("utm_source", APP_NAME);
  profile.searchParams.set("utm_medium", "referral");
  const unsplash = new URL(photo.unsplashUrl);
  unsplash.searchParams.set("utm_source", APP_NAME);
  unsplash.searchParams.set("utm_medium", "referral");
  return `Photo by <a href="${profile.toString()}">${escapeHtml(photo.photographer)}</a> on <a href="${unsplash.toString()}">Unsplash</a>`;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
}
