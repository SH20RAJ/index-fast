import ToolStaticPage, { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("website-link-count-checker");

export default function WebsiteLinkCountCheckerPage() {
  return <ToolStaticPage slug="website-link-count-checker" />;
}
