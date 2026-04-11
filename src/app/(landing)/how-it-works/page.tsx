import { Metadata } from "next";
import HowItWorksContent from "./HowItWorksContent";

export const metadata: Metadata = {
  title: "How It Works - IndexFast",
  description:
    "Learn how IndexFast connects your sitemap, submits fresh URLs to IndexNow and Bing, and tracks indexing outcomes in one workflow.",
  alternates: {
    canonical: "/how-it-works",
  },
};

export default function HowItWorksPage() {
  return <HowItWorksContent />;
}