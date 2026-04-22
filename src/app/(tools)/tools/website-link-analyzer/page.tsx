import WebsiteLinkAnalyzerPageContent from "@/components/tools/website-link-analyzer/website-link-analyzer-page";
import { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("website-link-analyzer");

export default function WebsiteLinkAnalyzerPage() {
  return <WebsiteLinkAnalyzerPageContent />;
}
