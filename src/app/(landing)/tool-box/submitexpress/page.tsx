import { Suspense } from "react";
import SubmitExpressView from "./SubmitExpressView";

export const metadata = {
  title: "SubmitExpress Submission",
  description: "Bulk submit your URLs and Sitemaps to search engines via SubmitExpress.",
};

export default function SubmitExpressPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SubmitExpressView />
    </Suspense>
  );
}
