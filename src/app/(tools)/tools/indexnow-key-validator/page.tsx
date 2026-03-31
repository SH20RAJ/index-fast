import type { Metadata } from "next";
import ToolPageShell from "../_components/ToolPageShell";

export const metadata: Metadata = {
  title: "Free IndexNow Key Validator | IndexFast",
  description:
    "Validate IndexNow key placement and setup before submitting URLs. Free IndexNow key validator for bloggers, indie makers, and SEO teams.",
  keywords: [
    "indexnow key validator free",
    "indexnow key file checker",
    "verify indexnow setup",
    "indexnow protocol validator",
  ],
  alternates: {
    canonical: "/tools/indexnow-key-validator",
  },
  openGraph: {
    title: "Free IndexNow Key Validator | IndexFast",
    description:
      "Confirm your IndexNow key file is reachable and valid before running automated submissions.",
    url: "/tools/indexnow-key-validator",
    type: "website",
  },
};

export default function IndexNowKeyValidatorPage() {
  return (
    <ToolPageShell
      badge="IndexNow Setup Tool"
      title="Free IndexNow key validator for accurate submission setup"
      description="Check that your IndexNow key file is published correctly and your host alignment is valid. This avoids silent submission failures that waste time."
      intentKeywords={[
        "indexnow key validator free",
        "indexnow key file checker",
        "verify indexnow setup",
      ]}
      steps={[
        "Enter your domain and IndexNow key filename.",
        "Validate key file availability and protocol expectations.",
        "Sign up to automate new URL submissions from your sitemap.",
      ]}
      faqs={[
        {
          question: "Why validate the key file first?",
          answer:
            "If the key file is missing or mismatched, submissions can fail silently. Validation removes this risk before automation.",
        },
        {
          question: "Can I use this before Bing API setup?",
          answer:
            "Yes. This is a standalone prerequisite check for IndexNow and works before any Bing batch workflow.",
        },
        {
          question: "What is the paid upgrade path?",
          answer:
            "Upgrade to automatically detect new sitemap URLs and push them to IndexNow and Bing on a schedule.",
        },
      ]}
    />
  );
}