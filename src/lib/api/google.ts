/**
 * Google Search Console (GSC) / Sitemap Ping API
 */

export async function pingGoogleSitemap(sitemapUrl: string): Promise<{ success: boolean; status?: number; error?: string }> {
  const url = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      // Use a browser-like user agent to avoid potential blocks
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; IndexFast/1.0; +https://indexfast.co)",
      },
    });
    
    return { 
      success: response.ok, 
      status: response.status 
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { 
      success: false, 
      error: message 
    };
  }
}
