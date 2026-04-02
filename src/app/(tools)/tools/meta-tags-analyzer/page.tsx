import ToolStaticPage, { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("meta-tags-analyzer");

export default function MetaTagsAnalyzerPage() {
  return <ToolStaticPage slug="meta-tags-analyzer" />;
}
