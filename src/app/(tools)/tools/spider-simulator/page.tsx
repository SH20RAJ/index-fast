import SpiderSimulatorPageContent from "@/components/tools/spider-simulator/spider-simulator-page";
import { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("spider-simulator");

export default function SpiderSimulatorPage() {
  return <SpiderSimulatorPageContent />;
}
