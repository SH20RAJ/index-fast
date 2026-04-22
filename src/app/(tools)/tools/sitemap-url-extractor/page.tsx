import SitemapUrlExtractorPageContent from "@/components/tools/sitemap-url-extractor/sitemap-url-extractor-page";
import { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("sitemap-url-extractor");

export default function SitemapUrlExtractorPage() {
  return <SitemapUrlExtractorPageContent />;
}
