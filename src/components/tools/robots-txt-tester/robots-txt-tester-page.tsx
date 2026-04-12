import { Suspense } from "react";
import ToolDetailContent from "@/components/tools/shared/tool-detail-content";
import RobotsTxtTesterView from "@/app/(dashboard)/toolbox/robots-txt-tester/RobotsTxtTesterView";

export default function RobotsTxtTesterPageContent() {
  return (
    <div className="space-y-12">
      <ToolDetailContent slug="robots-txt-tester" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-16">
        <Suspense fallback={<div>Loading...</div>}>
          <RobotsTxtTesterView />
        </Suspense>
      </div>
    </div>
  );
}
