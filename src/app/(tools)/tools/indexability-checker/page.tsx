import type { Metadata } from "next";
import ToolPageShell from "../_components/ToolPageShell";

export const metadata: Metadata = {
  title: "Free URL Indexability Checker | IndexFast",
  description:
    "Use this free URL indexability checker to detect crawl and index blockers like noindex tags, canonical conflicts, and robots directives.",
  keywords: [
    "free url indexability checker",
    "check if page is indexable",
    "noindex checker",
    "canonical tag checker",
    "seo crawlability test",
  ],
  alternates: {
    canonical: "/tools/indexability-checker",
  },
  openGraph: {
    title: "Free URL Indexability Checker | IndexFast",
    description:
      "Find indexability issues before they block rankings. Built for bloggers and fast-moving SEO teams.",
    url: "/tools/indexability-checker",
    type: "website",
  },
};

export default function IndexabilityCheckerPage() {
  return (
    <ToolPageShell
      badge="Low-Competition SEO Intent"
      title="Free URL Indexability Checker for faster crawling and ranking"
      description="Check one URL and instantly identify why search engines may skip it. This page targets long-tail search intent such as free URL indexability checker and check if page is indexable."
      intentKeywords={[
        "free url indexability checker",
        "check if page is indexable",
        "noindex checker",
      ]}
      steps={[
        "Paste your page URL and run a quick scan.",
        "Review noindex, canonical, robots, and status signals.",
        "Create an account to save checks and monitor changes weekly.",
      ]}
      faqs={[
        {
          question: "What does this checker validate?",
          answer:
            "It highlights common index blockers: noindex directives, canonical mismatches, robots restrictions, and status code issues.",
        },
        {
          question: "Who should use this tool?",
          answer:
            "Bloggers, indie hackers, affiliate builders, and agencies that need a quick technical SEO signal before publishing pages.",
        },
        {
          question: "How does this convert into paid value?",
          answer:
            "Free checks find immediate issues. Pro unlocks monitoring and automatic submission workflows after fixes are applied.",
        },
      ]}
    />
  );
}