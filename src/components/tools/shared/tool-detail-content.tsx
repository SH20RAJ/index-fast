import { notFound } from "next/navigation";
import ToolPageShell from "@/app/(tools)/tools/_components/ToolPageShell";
import {
  getCategoryById,
  getToolBySlug,
  getToolFaqs,
  getToolsByCategory,
  getToolSteps,
} from "@/lib/tools-catalog";

interface ToolDetailContentProps {
  slug: string;
}

export default function ToolDetailContent({ slug }: ToolDetailContentProps) {
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
