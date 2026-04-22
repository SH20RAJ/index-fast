import KeywordResearchToolPageContent from "@/components/tools/keyword-research-tool/keyword-research-tool-page";
import { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("keyword-research-tool");

export default function KeywordResearchToolPage() {
  return <KeywordResearchToolPageContent />;
}
