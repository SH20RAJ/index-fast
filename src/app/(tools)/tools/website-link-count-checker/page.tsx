import WebsiteLinkCountCheckerPageContent from "@/components/tools/website-link-count-checker/website-link-count-checker-page";
import { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("website-link-count-checker");

export default function WebsiteLinkCountCheckerPage() {
  return <WebsiteLinkCountCheckerPageContent />;
}
