import MetaTagGeneratorPageContent from "@/components/tools/meta-tag-generator/meta-tag-generator-page";
import { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("meta-tag-generator");

export default function MetaTagGeneratorPage() {
  return <MetaTagGeneratorPageContent />;
}
