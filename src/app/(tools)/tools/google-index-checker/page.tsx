import ToolStaticPage, { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("google-index-checker");

export default function GoogleIndexCheckerPage() {
  return <ToolStaticPage slug="google-index-checker" />;
}
