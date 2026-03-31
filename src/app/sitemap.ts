import type { MetadataRoute } from "next";
import { SEO_TOOLS } from "@/lib/tools-catalog";
import { BLOG_POSTS } from "@/lib/blog-catalog";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://indexfast.net";

const paths = [
  "/",
  "/contact",
  "/privacy",
  "/status",
  "/blog",
  ...BLOG_POSTS.map((post) => `/blog/${post.slug}`),
  "/tools",
  ...SEO_TOOLS.map((tool) => `/tools/${tool.slug}`),
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