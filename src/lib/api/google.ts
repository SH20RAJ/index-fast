import "server-only";
import { google } from "googleapis";
import { GSC_READONLY_SCOPE } from "@/lib/google/constants";

/**
 * Google Search Console API Wrapper
 * Documentation: https://developers.google.com/search/apis/search-console-api
 */

export function createGoogleOAuthClient(redirectUri?: string) {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUri ?? process.env.GOOGLE_REDIRECT_URI
  );
}

export type GscSiteEntry = {
  siteUrl: string;
  permissionLevel: string;
};

function createSearchConsoleClient(accessToken: string) {
  if (!accessToken) {
    throw new Error("No access token provided for Google API");
  }

  const oauth2Client = createGoogleOAuthClient();
  oauth2Client.setCredentials({ access_token: accessToken });

  return google.searchconsole({
    version: "v1",
    auth: oauth2Client,
  });
}

/**
 * Lists all Search Console properties the user has access to.
 */
export async function listSearchConsoleSites(accessToken: string): Promise<GscSiteEntry[]> {
  const searchconsole = createSearchConsoleClient(accessToken);

  try {
    const response = await searchconsole.sites.list({});
    return (response.data.siteEntry ?? [])
      .filter((site): site is { siteUrl: string; permissionLevel?: string | null } => Boolean(site.siteUrl))
      .map((site) => ({
        siteUrl: site.siteUrl,
        permissionLevel: site.permissionLevel ?? "siteUnverifiedUser",
      }));
  } catch (error: unknown) {
    console.error("Error listing GSC sites:", error);
    throw error;
  }
}

/**
 * List sitemap endpoints discovered in Search Console for a specific property.
 */
export async function listSearchConsoleSitemaps(accessToken: string, siteUrl: string): Promise<string[]> {
  const searchconsole = createSearchConsoleClient(accessToken);

  try {
    const response = await searchconsole.sitemaps.list({ siteUrl });
    return (response.data.sitemap ?? [])
      .map((entry) => entry.path ?? "")
      .filter((path) => path.length > 0);
  } catch {
    // Some properties can fail here (permissions/property type). We treat this as no discovered sitemaps.
    return [];
  }
}

export async function getSearchAnalytics(accessToken: string, siteUrl: string, daysBack: number = 28) {
  const searchconsole = createSearchConsoleClient(accessToken);
  
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - daysBack);
  
  try {
    const response = await searchconsole.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        dimensions: ['date'],
      }
    });
    
    return response.data.rows || [];
  } catch (error) {
    console.error("Error querying GSC analytics:", error);
    throw error;
  }
}

/**
 * Pings Google Search Console to notify of sitemap changes.
 * Note: This is legacy but still functional.
 * https://www.google.com/ping?sitemap=URL
 */
export async function pingGoogleSitemap(sitemapUrl: string) {
  const url = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
  try {
    const response = await fetch(url);
    return { success: response.ok, status: response.status };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: message };
  }
}
