import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ToolPageShell from "../_components/ToolPageShell";
import {
  SEO_TOOLS,
  getCategoryById,
  getToolBySlug,
  getToolFaqs,
  getToolKeywordTargets,
  getToolsByCategory,
  getToolSteps,
} from "@/lib/tools-catalog";

interface ToolPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return SEO_TOOLS.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    return {
      title: "Tool Not Found",
      description: "The requested SEO tool page could not be found.",
    };
  }

  return {
    title: `${tool.title} - Free Online SEO Tool | IndexFast`,
    description: tool.description,
    keywords: getToolKeywordTargets(tool),
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

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  const category = getCategoryById(tool.categoryId);
  const faqs = getToolFaqs(tool.categoryId);
  const keywordTargets = getToolKeywordTargets(tool);
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
      <ToolPageShell
        badge={category?.badge ?? "SEO Tool"}
        title={`Free ${tool.title} for practical SEO workflows`}
        description={tool.description}
        intentKeywords={keywordTargets}
        steps={getToolSteps(tool.categoryId)}
        faqs={faqs}
        categoryTitle={category?.title}
        relatedTools={relatedTools}
      />
    </>
  );
}
