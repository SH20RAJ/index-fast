import { getAllBlogPosts } from "@/lib/blog-catalog";
import { EXTERNAL_RESOURCE_CATEGORIES, SEO_TOOLS } from "@/lib/tools-catalog";
import { SEO_TOOL_SECTIONS } from "@/lib/seo-tool-links";

export async function getPublicSitePaths(): Promise<string[]> {
  const staticPaths = [
    "/",
    "/how-it-works",
    "/docs",
    "/contact",
    "/privacy",
    "/status",
    "/terms",
    "/pricing",
    "/blog",
    "/tools",
    "/indexnow",
  ];

  const blogPosts = await getAllBlogPosts();
  const blogPaths = blogPosts.map((post) => `/blog/${post.slug}`);
  const toolPaths = SEO_TOOLS.map((tool) => `/tools/${tool.slug}`);
  const resourcePaths = EXTERNAL_RESOURCE_CATEGORIES.map(
    (category) => `/tools/resources/${category.id}`
  );
  const seoToolPaths = ["/tools/seotools", ...SEO_TOOL_SECTIONS.map((section) => `/tools/seotools/${section.id}`)];

  return Array.from(new Set([...staticPaths, ...blogPaths, ...toolPaths, ...resourcePaths, ...seoToolPaths]));
}
