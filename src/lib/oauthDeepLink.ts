/**
 * Parse custom-scheme OAuth return URLs, e.g.
 * com.widecity.wcplanner://oauth/google-calendar?tab=settings&gcal=connected&group=...
 */
export function parseOAuthReturnUrl(url: string): {
  tab: string | null;
  gcal: string | null;
  group: string | null;
} {
  try {
    const q = url.includes("?") ? url.slice(url.indexOf("?") + 1) : "";
    const params = new URLSearchParams(q);
    return {
      tab: params.get("tab"),
      gcal: params.get("gcal"),
      group: params.get("group"),
    };
  } catch {
    return { tab: null, gcal: null, group: null };
  }
}

export const GCAL_OAUTH_EVENT = "widecity:gcal-oauth";
