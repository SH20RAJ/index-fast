import ToolStaticPage, { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("broken-link-checker");

export default function BrokenLinkCheckerPage() {
  return <ToolStaticPage slug="broken-link-checker" />;
}
