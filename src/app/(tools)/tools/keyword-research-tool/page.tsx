import ToolStaticPage, { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("keyword-research-tool");

export default function KeywordResearchToolPage() {
  return <ToolStaticPage slug="keyword-research-tool" />;
}
