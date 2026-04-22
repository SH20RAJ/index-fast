import GoogleIndexCheckerPageContent from "@/components/tools/google-index-checker/google-index-checker-page";
import { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("google-index-checker");

export default function GoogleIndexCheckerPage() {
  return <GoogleIndexCheckerPageContent />;
}
