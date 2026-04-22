import BacklinkCheckerPageContent from "@/components/tools/backlink-checker/backlink-checker-page";
import { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("backlink-checker");

export default function BacklinkCheckerPage() {
  return <BacklinkCheckerPageContent />;
}
