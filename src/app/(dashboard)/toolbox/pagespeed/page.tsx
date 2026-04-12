import { Metadata } from "next";
import { Suspense } from "react";
import PageSpeedView from "./PageSpeedView";

export const metadata: Metadata = {
  title: "PageSpeed Insights - IndexFast",
  description: "Analyze your website performance, accessibility, and SEO metrics using Google Lighthouse diagnostics.",
};

export default function PageSpeedPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageSpeedView />
    </Suspense>
  );
}
