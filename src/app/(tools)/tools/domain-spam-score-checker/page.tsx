import DomainSpamScoreCheckerPageContent from "@/components/tools/domain-spam-score-checker/domain-spam-score-checker-page";
import { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("domain-spam-score-checker");

export default function DomainSpamScoreCheckerPage() {
  return <DomainSpamScoreCheckerPageContent />;
}
