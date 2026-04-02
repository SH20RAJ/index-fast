import ToolStaticPage, { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("google-cache-checker");

export default function GoogleCacheCheckerPage() {
  return <ToolStaticPage slug="google-cache-checker" />;
}
