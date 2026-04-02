import ToolStaticPage, { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("twitter-card-generator");

export default function TwitterCardGeneratorPage() {
  return <ToolStaticPage slug="twitter-card-generator" />;
}
