import SubmitexpressBulkSubmitterPageContent from "@/components/tools/submitexpress-bulk-submitter/submitexpress-bulk-submitter-page";
import { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("submitexpress-bulk-submitter");

export default function SubmitexpressBulkSubmitterPage() {
  return <SubmitexpressBulkSubmitterPageContent />;
}
