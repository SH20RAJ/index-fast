import type { Metadata } from "next";
import ToolPageShell from "../_components/ToolPageShell";

export const metadata: Metadata = {
  title: "Free Sitemap Health Checker | IndexFast",
  description:
    "Validate sitemap URLs, find broken links, and clean your XML before pushing to Bing and IndexNow. Free sitemap health checker for SEO teams.",
  keywords: [
    "free sitemap health checker",
    "xml sitemap validator online",
    "sitemap broken links checker",
    "sitemap seo audit tool",
  ],
  alternates: {
    canonical: "/tools/sitemap-health-checker",
  },
  openGraph: {
    title: "Free Sitemap Health Checker | IndexFast",
    description:
      "Find broken and low-quality URLs in your sitemap before wasting crawl budget.",
    url: "/tools/sitemap-health-checker",
    type: "website",
  },
};

export default function SitemapHealthCheckerPage() {
  return (
    <ToolPageShell
      badge="High-Intent SEO Utility"
      title="Free sitemap health checker that catches indexing waste"
      description="Audit your sitemap for status errors, duplicates, and low-quality URL patterns. Perfect for small sites and growing content teams that need clean submissions."
      intentKeywords={[
        "free sitemap health checker",
        "xml sitemap validator online",
        "sitemap broken links checker",
      ]}
      steps={[
        "Enter your sitemap URL and fetch all listed pages.",
        "Review broken, redirected, noindex, and duplicate URL signals.",
        "Sign up to schedule recurring sitemap health scans.",
      ]}
      faqs={[
        {
          question: "Why should I validate my sitemap before submission?",
          answer:
            "Submitting low-quality or broken URLs can delay indexing and dilute crawl focus. A clean sitemap improves indexing efficiency.",
        },
        {
          question: "Can this help with Bing SubmitUrlBatch?",
          answer:
            "Yes. Use this check first to make sure your batch includes index-worthy URLs, then push only validated pages.",
        },
        {
          question: "What do paid plans unlock?",
          answer:
            "Paid plans unlock larger scans, automated rescans, and persistent health history for each project.",
        },
      ]}
    />
  );
}