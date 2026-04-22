import DomainAuthorityCheckerPageContent from "@/components/tools/domain-authority-checker/domain-authority-checker-page";
import { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("domain-authority-checker");

export default function DomainAuthorityCheckerPage() {
  return <DomainAuthorityCheckerPageContent />;
}
