import ToolStaticPage, { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("open-graph-generator");

export default function OpenGraphGeneratorPage() {
  return <ToolStaticPage slug="open-graph-generator" />;
}
