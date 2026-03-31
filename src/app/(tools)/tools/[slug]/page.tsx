import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ToolPageShell from "../_components/ToolPageShell";
import {
  SEO_TOOLS,
  getCategoryById,
  getToolBySlug,
  getToolFaqs,
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
    title: tool.title,
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

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  const category = getCategoryById(tool.categoryId);
  const relatedTools = getToolsByCategory(tool.categoryId)
    .filter((item) => item.slug !== tool.slug)
    .slice(0, 6)
    .map((item) => ({ slug: item.slug, title: item.title }));

  return (
    <ToolPageShell
      badge={category?.badge ?? "SEO Tool"}
      title={`Free ${tool.title} for practical SEO workflows`}
      description={tool.description}
      intentKeywords={tool.intentKeywords}
      steps={getToolSteps(tool.categoryId)}
      faqs={getToolFaqs(tool.categoryId)}
      categoryTitle={category?.title}
      relatedTools={relatedTools}
    />
  );
}
