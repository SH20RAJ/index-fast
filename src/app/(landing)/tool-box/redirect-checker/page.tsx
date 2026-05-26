import { Metadata } from "next";
import { Suspense } from "react";
import RedirectCheckerView from "./RedirectCheckerView";

export const metadata: Metadata = {
  title: "Redirect Checker | IndexFast",
  description: "Trace HTTP redirect chains to detect loops, latency issues, and crawl budget waste.",
};

export default function RedirectCheckerPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RedirectCheckerView />
    </Suspense>
  );
}
