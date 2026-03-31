import { google } from "googleapis";

/**
 * Google Search Console API Wrapper
 * Documentation: https://developers.google.com/search/apis/search-console-api
 */

export const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

/**
 * Lists all Search Console properties the user has access to.
 */
export async function listGscSites(refreshToken: string) {
  if (!refreshToken) {
    throw new Error("No refresh token provided for Google API");
  }

  oauth2Client.setCredentials({ refresh_token: refreshToken });

  const searchconsole = google.searchconsole({
    version: "v1",
    auth: oauth2Client,
  });

  try {
    const response = await searchconsole.sites.list({});
    return response.data.siteEntry || [];
  } catch (error: any) {
    console.error("Error listing GSC sites:", error);
    throw error;
  }
}

/**
 * Pings Google Search Console to notify of sitemap changes.
 * Note: This is a legacy sitemap ping. The standard way is via the Search Console sitemap interface.
 * https://www.google.com/ping?sitemap=URL
 */
export async function pingGoogleSitemap(sitemapUrl: string) {
  const url = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
  try {
    const response = await fetch(url);
    return { success: response.ok, status: response.status };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
