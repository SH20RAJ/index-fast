import GoogleCacheCheckerPageContent from "@/components/tools/google-cache-checker/google-cache-checker-page";
import { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("google-cache-checker");

export default function GoogleCacheCheckerPage() {
  return <GoogleCacheCheckerPageContent />;
}
