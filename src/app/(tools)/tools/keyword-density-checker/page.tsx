import ToolStaticPage, { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("keyword-density-checker");

export default function KeywordDensityCheckerPage() {
  return <ToolStaticPage slug="keyword-density-checker" />;
}
