import IndexabilityCheckerPageContent from "@/components/tools/indexability-checker/indexability-checker-page";
import { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("indexability-checker");

export default function IndexabilityCheckerPage() {
  return <IndexabilityCheckerPageContent />;
}
