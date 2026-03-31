import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://indexfast.net";

const paths = [
  "/",
  "/contact",
  "/privacy",
  "/status",
  "/tools",
  "/tools/indexability-checker",
  "/tools/sitemap-health-checker",
  "/tools/robots-txt-tester",
  "/tools/indexnow-key-validator",
  "/tools/bing-batch-request-builder",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return paths.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/tools" ? 0.9 : 0.8,
  }));
}