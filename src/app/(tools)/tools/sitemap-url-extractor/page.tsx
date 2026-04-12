import SitemapExtractorPageContent from "@/components/tools/sitemap-extractor/sitemap-extractor-page";
import { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("sitemap-url-extractor");

export default function SitemapUrlExtractorPage() {
  return <SitemapExtractorPageContent />;
}
