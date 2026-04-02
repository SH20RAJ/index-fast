import ToolStaticPage, { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("website-link-analyzer");

export default function WebsiteLinkAnalyzerPage() {
  return <ToolStaticPage slug="website-link-analyzer" />;
}
