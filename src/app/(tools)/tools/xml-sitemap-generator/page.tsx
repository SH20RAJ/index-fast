import XmlSitemapGeneratorPageContent from "@/components/tools/xml-sitemap-generator/xml-sitemap-generator-page";
import { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("xml-sitemap-generator");

export default function XmlSitemapGeneratorPage() {
  return <XmlSitemapGeneratorPageContent />;
}
