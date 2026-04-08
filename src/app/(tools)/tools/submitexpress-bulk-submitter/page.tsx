import ToolStaticPage, { createToolMetadata } from "@/components/tools/shared/tool-static-page";
import SubmitExpressBulkSubmitterPageContent from "@/components/tools/submitexpress-bulk-submitter/submitexpress-bulk-submitter-page";

export const metadata = createToolMetadata("submitexpress-bulk-submitter");

export default function SubmitExpressBulkSubmitterPage() {
  return <SubmitExpressBulkSubmitterPageContent />;
}
