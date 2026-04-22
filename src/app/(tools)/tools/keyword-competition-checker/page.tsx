import KeywordCompetitionCheckerPageContent from "@/components/tools/keyword-competition-checker/keyword-competition-checker-page";
import { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("keyword-competition-checker");

export default function KeywordCompetitionCheckerPage() {
  return <KeywordCompetitionCheckerPageContent />;
}
