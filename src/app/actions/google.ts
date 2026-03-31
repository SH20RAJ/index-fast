"use server";

import { listSearchConsoleSites } from "@/lib/google";
import { db } from "@/db";

interface GscSiteResponse {
  sites?: { url: string; isAdded: boolean }[];
  error?: string;
}

export async function fetchGscSites(accessToken: string): Promise<GscSiteResponse> {
  try {
    const gscSites = await listSearchConsoleSites(accessToken);
    
    // Fetch existing sites to filter them out
    const existingSites = await db.query.sites.findMany({
      columns: { url: true }
    });
    
    const existingUrls = new Set(existingSites.map(s => s.url.replace(/\/$/, "")));
    
    return {
      sites: gscSites
        .filter(site => site.siteUrl) // Ensure siteUrl exists
        .map(site => {
          const url = (site.siteUrl as string).replace(/\/$/, "");
          return {
            url,
            isAdded: existingUrls.has(url)
          };
        })
    };
  } catch (error: unknown) {
    console.error("GSC Fetch Error:", error);
    return { 
      error: error instanceof Error ? error.message : "Failed to fetch sites from Google Search Console." 
    };
  }
}
