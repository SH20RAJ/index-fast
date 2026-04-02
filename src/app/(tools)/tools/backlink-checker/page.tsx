import ToolStaticPage, { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("backlink-checker");

export default function BacklinkCheckerPage() {
  return <ToolStaticPage slug="backlink-checker" />;
}
