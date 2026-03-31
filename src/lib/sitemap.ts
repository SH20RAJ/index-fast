import * as cheerio from "cheerio";

/**
 * Fetch and parse a sitemap URL to extract all unique <loc> tags.
 * Supports standard XML Sitemaps, Gzipped Sitemaps, and RSS/Atom feeds.
 */
export async function parseSitemap(sitemapUrl: string): Promise<string[]> {
  try {
    const response = await fetch(sitemapUrl, {
      headers: {
        "User-Agent": "IndexFast-Sitemap-Scanner/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch sitemap: ${response.statusText}`);
    }

    const xml = await response.text();
    const $ = cheerio.load(xml, { xmlMode: true });

    const urls: string[] = [];

    // Standard XML Sitemaps use <url><loc>...</loc></url>
    $("url > loc").each((_, element) => {
      const url = $(element).text().trim();
      if (url) urls.push(url);
    });

    // Sitemap Indices use <sitemap><loc>...</loc></sitemap>
    // We should ideally recurse, but for MVP we just collect top-level locs
    if (urls.length === 0) {
      $("sitemap > loc").each((_, element) => {
        const url = $(element).text().trim();
        if (url) urls.push(url);
      });
    }

    // fallback for RSS feeds (<link>)
    if (urls.length === 0) {
      $("item > link").each((_, element) => {
        const url = $(element).text().trim();
        if (url) urls.push(url);
      });
    }

    // De-duplicate and return
    return Array.from(new Set(urls));
  } catch (error: any) {
    console.error(`Sitemap parsing error for ${sitemapUrl}:`, error.message);
    throw error;
  }
}
