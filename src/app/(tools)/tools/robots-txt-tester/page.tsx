import type { Metadata } from "next";
import ToolPageShell from "../_components/ToolPageShell";

export const metadata: Metadata = {
  title: "Free Robots.txt Tester | IndexFast",
  description:
    "Test robots.txt rules and verify if important pages are blocked from crawlers. Free robots.txt tester built for practical SEO workflows.",
  keywords: [
    "free robots txt tester for seo",
    "robots txt checker online",
    "is my url blocked by robots",
    "robots rules validator",
  ],
  alternates: {
    canonical: "/tools/robots-txt-tester",
  },
  openGraph: {
    title: "Free Robots.txt Tester | IndexFast",
    description:
      "Avoid accidental crawl blocks and protect ranking pages with a quick robots.txt test.",
    url: "/tools/robots-txt-tester",
    type: "website",
  },
};

export default function RobotsTxtTesterPage() {
  return (
    <ToolPageShell
      badge="Technical SEO Quick Fix"
      title="Free robots.txt tester to catch accidental crawl blocks"
      description="Many pages fail to index because robots rules are too broad. Test critical URLs and verify what bots can actually access before shipping updates."
      intentKeywords={[
        "free robots txt tester for seo",
        "is my url blocked by robots",
        "robots txt checker online",
      ]}
      steps={[
        "Paste your robots.txt location and one target URL.",
        "Run a rule simulation for common search bots.",
        "Create a free account to save and compare robots tests over time.",
      ]}
      faqs={[
        {
          question: "What problem does this solve?",
          answer:
            "It prevents hidden crawl blocks that stop category, blog, or product pages from being discovered.",
        },
        {
          question: "Is this only for developers?",
          answer:
            "No. Bloggers and non-technical teams can use this to validate URL-level access without editing server configs.",
        },
        {
          question: "How does this lead to paid usage?",
          answer:
            "After fixing robots issues, teams upgrade for recurring checks, alerts, and integrated URL submission flows.",
        },
      ]}
    />
  );
}
