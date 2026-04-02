import ToolStaticPage, { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("domain-spam-score-checker");

export default function DomainSpamScoreCheckerPage() {
  return <ToolStaticPage slug="domain-spam-score-checker" />;
}
