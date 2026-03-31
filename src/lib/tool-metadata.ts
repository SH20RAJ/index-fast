import type { Metadata } from "next";
import { getToolBySlug } from "@/lib/tools-catalog";

export function getToolMetadata(slug: string): Metadata {
  const tool = getToolBySlug(slug);

  if (!tool) {
    return {
      title: "Tool Not Found | IndexFast",
      description: "The requested SEO tool page could not be found.",
    };
  }

  return {
    title: `${tool.title} | IndexFast`,
    description: tool.description,
    keywords: tool.intentKeywords,
    alternates: {
      canonical: `/tools/${tool.slug}`,
    },
    openGraph: {
      title: `${tool.title} | IndexFast`,
      description: tool.description,
      url: `/tools/${tool.slug}`,
      type: "website",
    },
  };
}
