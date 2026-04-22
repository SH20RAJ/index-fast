import DomainHostingCheckerPageContent from "@/components/tools/domain-hosting-checker/domain-hosting-checker-page";
import { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("domain-hosting-checker");

export default function DomainHostingCheckerPage() {
  return <DomainHostingCheckerPageContent />;
}
