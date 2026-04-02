import ToolStaticPage, { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("indexability-checker");

export default function IndexabilityCheckerPage() {
  return <ToolStaticPage slug="indexability-checker" />;
}
