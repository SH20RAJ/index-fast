import DomainAgeCheckerPageContent from "@/components/tools/domain-age-checker/domain-age-checker-page";
import { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("domain-age-checker");

export default function DomainAgeCheckerPage() {
  return <DomainAgeCheckerPageContent />;
}
