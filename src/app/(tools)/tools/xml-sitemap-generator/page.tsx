import ToolStaticPage, { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("xml-sitemap-generator");

export default function XmlSitemapGeneratorPage() {
  return <ToolStaticPage slug="xml-sitemap-generator" />;
}
