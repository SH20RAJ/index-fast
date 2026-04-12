import { Suspense } from "react";
import ToolDetailContent from "@/components/tools/shared/tool-detail-content";
import RedirectCheckerView from "@/app/(dashboard)/toolbox/redirect-checker/RedirectCheckerView";

export default function RedirectCheckerPageContent() {
  return (
    <div className="space-y-12">
      <ToolDetailContent slug="redirect-checker" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-16">
        <Suspense fallback={<div>Loading...</div>}>
          <RedirectCheckerView />
        </Suspense>
      </div>
    </div>
  );
}
