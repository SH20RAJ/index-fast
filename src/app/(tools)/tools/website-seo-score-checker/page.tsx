import WebsiteSeoScoreCheckerPageContent from "@/components/tools/website-seo-score-checker/website-seo-score-checker-page";
import { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("website-seo-score-checker");

export default function WebsiteSeoScoreCheckerPage() {
  return <WebsiteSeoScoreCheckerPageContent />;
}
