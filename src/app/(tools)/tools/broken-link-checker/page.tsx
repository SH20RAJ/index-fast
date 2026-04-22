import BrokenLinkCheckerPageContent from "@/components/tools/broken-link-checker/broken-link-checker-page";
import { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("broken-link-checker");

export default function BrokenLinkCheckerPage() {
  return <BrokenLinkCheckerPageContent />;
}
