import TwitterCardGeneratorPageContent from "@/components/tools/twitter-card-generator/twitter-card-generator-page";
import { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("twitter-card-generator");

export default function TwitterCardGeneratorPage() {
  return <TwitterCardGeneratorPageContent />;
}
