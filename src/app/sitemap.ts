import type { MetadataRoute } from "next";
import { getPublicSitePaths } from "@/lib/public-site-paths";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.indexfast.co";
const paths = getPublicSitePaths();

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return paths.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/tools" ? 0.9 : 0.8,
  }));
}