import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ToolPageShell from "@/app/(tools)/tools/_components/ToolPageShell";
import {
  getCategoryById,
  getToolBySlug,
  getToolFaqs,
  getToolKeywordTargets,
  getToolsByCategory,
  getToolSteps,
} from "@/lib/tools-catalog";

const DEFAULT_METADATA: Metadata = {
  title: "Free SEO Tool | IndexFast",
  description: "Explore practical free SEO tools from IndexFast.",
};

export function createToolMetadata(slug: string): Metadata {
  const tool = getToolBySlug(slug);

  if (!tool) {
    return DEFAULT_METADATA;
  }

  const keywords = getToolKeywordTargets(tool, 18);

  return {
    title: `${tool.title} (Free) | IndexFast`,
    description: tool.description,
    keywords,
    alternates: {
      canonical: `/tools/${tool.slug}`,
    },
    openGraph: {
      title: `${tool.title} | IndexFast`,
      description: tool.description,
      url: `/tools/${tool.slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${tool.title} | IndexFast`,
      description: tool.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-video-preview": -1,
        "max-snippet": -1,
      },
    },
  };
}

interface ToolStaticPageProps {
  slug: string;
}

export default function ToolStaticPage({ slug }: ToolStaticPageProps) {
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  const category = getCategoryById(tool.categoryId);
  const faqs = getToolFaqs(tool.categoryId);
  const keywordTargets = getToolKeywordTargets(tool, 18);
  const relatedTools = getToolsByCategory(tool.categoryId)
    .filter((item) => item.slug !== tool.slug)
    .slice(0, 6)
    .map((item) => ({ slug: item.slug, title: item.title }));

  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.title,
    description: tool.description,
    applicationCategory: category?.title ?? "SEO Tool",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    keywords: keywordTargets.join(", "),
    url: `https://www.indexfast.co/tools/${tool.slug}`,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "SEO Tools",
        item: "https://www.indexfast.co/tools",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: tool.title,
        item: `https://www.indexfast.co/tools/${tool.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <ToolPageShell
        badge={category?.badge ?? "SEO Tool"}
        title={`Free ${tool.title} for practical SEO workflows`}
        description={tool.description}
        intentKeywords={keywordTargets}
        steps={getToolSteps(tool.categoryId)}
        faqs={faqs}
        categoryTitle={category?.title}
        relatedTools={relatedTools}
        slug={slug}
      />
    </>
  );
}
