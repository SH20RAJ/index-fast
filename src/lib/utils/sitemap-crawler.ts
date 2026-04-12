import * as cheerio from "cheerio";

export interface SitemapContent {
  url: string;
  isIndex: boolean;
  urls: string[];
  subSitemaps: string[];
}

/**
 * Fetches and parses a sitemap URL.
 * Handles both regular sitemaps and sitemap indexes.
 */
export async function crawlSitemap(sitemapUrl: string): Promise<SitemapContent> {
  try {
    const response = await fetch(sitemapUrl, {
      headers: {
        "User-Agent": "IndexFast-Sitemap-Bot/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch sitemap: ${response.statusText}`);
    }

    const xml = await response.text();
    const $ = cheerio.load(xml, { xmlMode: true });

    const urls: string[] = [];
    const subSitemaps: string[] = [];

    // Check for sitemap index
    const sitemapNodes = $("sitemap");
    const isIndex = sitemapNodes.length > 0;

    if (isIndex) {
      sitemapNodes.each((_, el) => {
        const loc = $(el).find("loc").text().trim();
        if (loc) subSitemaps.push(loc);
      });
    } else {
      $("url").each((_, el) => {
        const loc = $(el).find("loc").text().trim();
        if (loc) urls.push(loc);
      });
    }

    return {
      url: sitemapUrl,
      isIndex,
      urls,
      subSitemaps,
    };
  } catch (error) {
    console.error(`Error crawling sitemap ${sitemapUrl}:`, error);
    throw error;
  }
}
