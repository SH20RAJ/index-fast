import ToolStaticPage, { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("domain-hosting-checker");

export default function DomainHostingCheckerPage() {
  return <ToolStaticPage slug="domain-hosting-checker" />;
}
