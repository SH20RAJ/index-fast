import type { MetadataRoute } from "next";
import { getPublicSitePaths } from "@/lib/public-site-paths";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://indexfast.co";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paths = await getPublicSitePaths();
  const now = new Date();

  return paths.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/tools" ? 0.9 : 0.8,
  }));
}