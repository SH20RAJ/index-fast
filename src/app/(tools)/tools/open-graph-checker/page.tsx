import ToolStaticPage, { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("open-graph-checker");

export default function OpenGraphCheckerPage() {
  return <ToolStaticPage slug="open-graph-checker" />;
}
