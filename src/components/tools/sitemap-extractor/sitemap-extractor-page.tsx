import { Suspense } from "react";
import ToolDetailContent from "@/components/tools/shared/tool-detail-content";
import SitemapExtractorView from "@/app/(dashboard)/toolbox/sitemap-extractor/SitemapExtractorView";

export default function SitemapExtractorPageContent() {
  return (
    <div className="space-y-12">
      <ToolDetailContent slug="sitemap-url-extractor" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-16">
        <Suspense fallback={<div>Loading...</div>}>
          <SitemapExtractorView />
        </Suspense>
      </div>
    </div>
  );
}
