import { BLOG_POSTS } from "@/lib/blog-catalog";
import { EXTERNAL_RESOURCE_CATEGORIES, SEO_TOOLS } from "@/lib/tools-catalog";

export function getPublicSitePaths(): string[] {
  const staticPaths = [
    "/",
    "/contact",
    "/privacy",
    "/status",
    "/terms",
    "/pricing",
    "/sign-in",
    "/sign-up",
    "/chat",
    "/blog",
    "/blogs",
    "/tools",
    "/indexnow",
  ];

  const blogPaths = BLOG_POSTS.map((post) => `/blog/${post.slug}`);
  const toolPaths = SEO_TOOLS.map((tool) => `/tools/${tool.slug}`);
  const resourcePaths = EXTERNAL_RESOURCE_CATEGORIES.map(
    (category) => `/tools/resources/${category.id}`
  );

  return Array.from(new Set([...staticPaths, ...blogPaths, ...toolPaths, ...resourcePaths]));
}
