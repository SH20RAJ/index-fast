import ToolStaticPage, { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("sitemap-health-checker");

export default function SitemapHealthCheckerPage() {
  return <ToolStaticPage slug="sitemap-health-checker" />;
}
