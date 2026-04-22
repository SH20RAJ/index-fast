import KeywordDensityCheckerPageContent from "@/components/tools/keyword-density-checker/keyword-density-checker-page";
import { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("keyword-density-checker");

export default function KeywordDensityCheckerPage() {
  return <KeywordDensityCheckerPageContent />;
}
