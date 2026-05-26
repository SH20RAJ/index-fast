import { Metadata } from "next";
import { Suspense } from "react";
import SitemapExtractorView from "./SitemapExtractorView";

export const metadata: Metadata = {
  title: "Sitemap to URL Extractor | IndexFast",
  description: "Convert any XML sitemap, sitemap index, or RSS feed into a clean, actionable list of URLs.",
};

export default function SitemapExtractorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SitemapExtractorView />
    </Suspense>
  );
}
