import MetaTagsAnalyzerPageContent from "@/components/tools/meta-tags-analyzer/meta-tags-analyzer-page";
import { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("meta-tags-analyzer");

export default function MetaTagsAnalyzerPage() {
  return <MetaTagsAnalyzerPageContent />;
}
