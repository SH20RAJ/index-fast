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

export async function getSearchAnalytics(
  accessToken: string, 
  siteUrl: string, 
  options: {
    daysBack?: number,
    startDate?: string,
    endDate?: string,
    dimensions?: string[],
    rowLimit?: number,
    type?: 'web' | 'image' | 'video' | 'news' | 'discover' | 'googleNews',
    aggregationType?: 'auto' | 'byNewsShowcasePanel' | 'byProperty' | 'byPage',
    dataState?: 'all' | 'final',
    filters?: Array<{
      dimension: 'query' | 'page' | 'country' | 'device' | 'searchAppearance',
      operator: 'equals' | 'contains' | 'notEquals' | 'notContains' | 'includingRegex' | 'excludingRegex',
      expression: string
    }>
  } = {}
) {
  const searchconsole = createSearchConsoleClient(accessToken);
  
  let start = options.startDate;
  let end = options.endDate;

  if (!start || !end) {
    const endDateObj = new Date();
    const startDateObj = new Date();
    startDateObj.setDate(endDateObj.getDate() - (options.daysBack || 28));
    start = startDateObj.toISOString().split('T')[0];
    end = endDateObj.toISOString().split('T')[0];
  }
  
  try {
    const response = await searchconsole.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate: start,
        endDate: end,
        dimensions: options.dimensions || ['date'],
        rowLimit: options.rowLimit || 1000,
        type: options.type || 'web',
        aggregationType: options.aggregationType || 'auto',
        dataState: options.dataState || 'final',
        dimensionFilterGroups: options.filters ? [{
          filters: options.filters.map(f => ({
            dimension: f.dimension,
            operator: f.operator,
            expression: f.expression
          }))
        }] : undefined
      }
    });
    
    return response.data.rows || [];
  } catch (error) {
    console.error("Error querying GSC analytics:", error);
    throw error;
  }
}

/**
 * Run a Quick Wins analysis to find high-impression queries ranking on page 2 (position 11-20).
 */
export async function runQuickWinsAnalysis(accessToken: string, siteUrl: string) {
  const data = await getSearchAnalytics(accessToken, siteUrl, {
    daysBack: 28,
    dimensions: ['query'],
    rowLimit: 5000,
  });

  // Filter for position between 10 and 20 (page 2) and significant impressions
  const quickWins = data
    .filter(row => {
      const pos = row.position || 0;
      const impressions = row.impressions || 0;
      return pos > 10 && pos <= 20 && impressions > 100;
    })
    .sort((a, b) => (b.impressions || 0) - (a.impressions || 0))
    .slice(0, 10);

  return quickWins;
}

/**
 * Inspects a URL in Search Console.
 */
export async function inspectUrl(accessToken: string, url: string, siteUrl: string) {
  const searchconsole = createSearchConsoleClient(accessToken);

  try {
    const response = await searchconsole.urlInspection.index.inspect({
      requestBody: {
        inspectionUrl: url,
        siteUrl: siteUrl,
      },
    });
    return response.data.inspectionResult;
  } catch (error) {
    console.error("Error inspecting URL:", error);
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
