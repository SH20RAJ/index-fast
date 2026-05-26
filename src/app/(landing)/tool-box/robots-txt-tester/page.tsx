import { Metadata } from "next";
import { Suspense } from "react";
import RobotsTxtTesterView from "./RobotsTxtTesterView";

export const metadata: Metadata = {
  title: "Robots.txt Tester | IndexFast",
  description: "Validate your robots.txt directives and verify whether critical URLs are blocked for search crawlers.",
};

export default function RobotsTxtTesterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RobotsTxtTesterView />
    </Suspense>
  );
}
