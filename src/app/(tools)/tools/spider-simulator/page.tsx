import ToolStaticPage, { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("spider-simulator");

export default function SpiderSimulatorPage() {
  return <ToolStaticPage slug="spider-simulator" />;
}
