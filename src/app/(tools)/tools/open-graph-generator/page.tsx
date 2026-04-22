import OpenGraphGeneratorPageContent from "@/components/tools/open-graph-generator/open-graph-generator-page";
import { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("open-graph-generator");

export default function OpenGraphGeneratorPage() {
  return <OpenGraphGeneratorPageContent />;
}
