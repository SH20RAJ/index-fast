import SitemapHealthCheckerPageContent from "@/components/tools/sitemap-health-checker/sitemap-health-checker-page";
import { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("sitemap-health-checker");

export default function SitemapHealthCheckerPage() {
  return <SitemapHealthCheckerPageContent />;
}
