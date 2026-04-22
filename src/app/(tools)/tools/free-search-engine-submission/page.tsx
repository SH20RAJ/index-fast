import FreeSearchEngineSubmissionPageContent from "@/components/tools/free-search-engine-submission/free-search-engine-submission-page";
import { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("free-search-engine-submission");

export default function FreeSearchEngineSubmissionPage() {
  return <FreeSearchEngineSubmissionPageContent />;
}
