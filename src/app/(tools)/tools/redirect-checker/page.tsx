import RedirectCheckerPageContent from "@/components/tools/redirect-checker/redirect-checker-page";
import { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("redirect-checker");

export default function RedirectCheckerPage() {
  return <RedirectCheckerPageContent />;
}
