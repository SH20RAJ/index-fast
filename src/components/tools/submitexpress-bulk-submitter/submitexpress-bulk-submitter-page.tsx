import ToolDetailContent from "@/components/tools/shared/tool-detail-content";
import SubmitExpressView from "@/app/(dashboard)/toolbox/submitexpress/SubmitExpressView";

export default function SubmitExpressBulkSubmitterPageContent() {
  return (
    <div className="space-y-12">
      <ToolDetailContent slug="submitexpress-bulk-submitter" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-16">
        <SubmitExpressView />
      </div>
    </div>
  );
}
