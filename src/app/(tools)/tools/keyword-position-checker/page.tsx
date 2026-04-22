import KeywordPositionCheckerPageContent from "@/components/tools/keyword-position-checker/keyword-position-checker-page";
import { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("keyword-position-checker");

export default function KeywordPositionCheckerPage() {
  return <KeywordPositionCheckerPageContent />;
}
