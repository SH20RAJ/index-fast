#!/usr/bin/env node

/**
 * Submit all sitemap URLs to IndexNow.
 *
 * Usage:
 *   node scripts/submit-indexnow-all.mjs
 *   INDEXNOW_KEY=... SITE_URL=https://indexfast.co node scripts/submit-indexnow-all.mjs
 */

const DEFAULT_SITE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://indexfast.co";
const DEFAULT_KEY = process.env.INDEXNOW_KEY || "74c28309a177441488a4ea77d823c277";
const BATCH_SIZE = 1000;

function chunk(items, size) {
  const out = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  return out;
}

function extractLocs(xml) {
  const locs = [];
  const regex = /<loc>([\s\S]*?)<\/loc>/gi;
  let match = regex.exec(xml);
  while (match) {
    const value = String(match[1] || "").trim();
    if (value) locs.push(value);
    match = regex.exec(xml);
  }
  return locs;
}

function looksLikeSitemapIndex(xml) {
  return /<sitemapindex[\s>]/i.test(xml);
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "indexfast-indexnow-script/1.0",
      Accept: "application/xml,text/xml,*/*",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }

  return response.text();
}

async function collectUrlsFromSitemap(startSitemapUrl) {
  const visited = new Set();
  const queue = [startSitemapUrl];
  const urlSet = new Set();

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || visited.has(current)) continue;
    visited.add(current);

    const xml = await fetchText(current);
    const locs = extractLocs(xml);

    if (looksLikeSitemapIndex(xml)) {
      for (const sitemapUrl of locs) {
        if (!visited.has(sitemapUrl)) {
          queue.push(sitemapUrl);
        }
      }
      continue;
    }

    for (const loc of locs) {
      try {
        const parsed = new URL(loc);
        if (parsed.protocol === "http:" || parsed.protocol === "https:") {
          urlSet.add(parsed.toString());
        }
      } catch {
        // Ignore invalid loc entries
      }
    }
  }

  return Array.from(urlSet);
}

async function submitBatch({ host, key, keyLocation, urlList }) {
  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({ host, key, keyLocation, urlList }),
  });

  if (!response.ok) {
    const text = await response.text();
    return { success: false, status: response.status, error: text || response.statusText };
  }

  return { success: true, status: response.status };
}

async function main() {
  const siteUrl = DEFAULT_SITE_URL.replace(/\/$/, "");
  const key = DEFAULT_KEY;

  if (!key) {
    throw new Error("Missing IndexNow key. Set INDEXNOW_KEY.");
  }

  const parsedSite = new URL(siteUrl);
  const host = parsedSite.host;
  const sitemapUrl = `${siteUrl}/sitemap.xml`;
  const keyLocation = `${siteUrl}/${key}.txt`;

  console.log(`Site: ${siteUrl}`);
  console.log(`Sitemap: ${sitemapUrl}`);
  console.log(`Key location: ${keyLocation}`);

  const allUrls = await collectUrlsFromSitemap(sitemapUrl);
  if (allUrls.length === 0) {
    throw new Error("No URLs found in sitemap.");
  }

  console.log(`Discovered ${allUrls.length} URL(s).`);

  const batches = chunk(allUrls, BATCH_SIZE);
  let successBatches = 0;
  let failedBatches = 0;

  for (let i = 0; i < batches.length; i += 1) {
    const batchNo = i + 1;
    const batch = batches[i];

    console.log(`Submitting batch ${batchNo}/${batches.length} (${batch.length} URLs)...`);
    const result = await submitBatch({ host, key, keyLocation, urlList: batch });

    if (result.success) {
      successBatches += 1;
      console.log(`Batch ${batchNo} success (status ${result.status}).`);
    } else {
      failedBatches += 1;
      console.error(`Batch ${batchNo} failed (status ${result.status ?? "n/a"}): ${result.error}`);
    }
  }

  console.log("---");
  console.log(`Done. Success batches: ${successBatches}, Failed batches: ${failedBatches}`);

  if (failedBatches > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("IndexNow submission failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
