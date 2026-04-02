import ToolStaticPage, { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("domain-authority-checker");

export default function DomainAuthorityCheckerPage() {
  return <ToolStaticPage slug="domain-authority-checker" />;
}
