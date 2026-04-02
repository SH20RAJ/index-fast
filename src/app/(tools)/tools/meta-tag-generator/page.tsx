import ToolStaticPage, { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("meta-tag-generator");

export default function MetaTagGeneratorPage() {
  return <ToolStaticPage slug="meta-tag-generator" />;
}
