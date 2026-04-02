import ToolStaticPage, { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("domain-age-checker");

export default function DomainAgeCheckerPage() {
  return <ToolStaticPage slug="domain-age-checker" />;
}
