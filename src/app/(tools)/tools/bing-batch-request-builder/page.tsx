import BingBatchRequestBuilderPageContent from "@/components/tools/bing-batch-request-builder/bing-batch-request-builder-page";
import { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("bing-batch-request-builder");

export default function BingBatchRequestBuilderPage() {
  return <BingBatchRequestBuilderPageContent />;
}
