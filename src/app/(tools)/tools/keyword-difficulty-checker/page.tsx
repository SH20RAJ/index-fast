import KeywordDifficultyCheckerPageContent from "@/components/tools/keyword-difficulty-checker/keyword-difficulty-checker-page";
import { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("keyword-difficulty-checker");

export default function KeywordDifficultyCheckerPage() {
  return <KeywordDifficultyCheckerPageContent />;
}
