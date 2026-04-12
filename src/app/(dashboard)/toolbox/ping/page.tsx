import type { Metadata } from "next";
import { Suspense } from "react";
import PingView from "./PingView";

export const metadata: Metadata = {
  title: "Universal Ping | IndexFast",
  description:
    "Broadcast your content to 100+ ping services, Google regional endpoints, and blog directories to accelerate search discovery.",
};

export default function PingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PingView />
    </Suspense>
  );
}
