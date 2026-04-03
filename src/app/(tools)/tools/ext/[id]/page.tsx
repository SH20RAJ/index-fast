import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllFreeToolById, ALL_FREE_TOOL_CATEGORIES, ALL_FREE_TOOLS, getFreeTierLabel } from "@/lib/tools-catalog";
import ExternalToolShell from "./_components/ExternalToolShell";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return ALL_FREE_TOOLS.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const tool = getAllFreeToolById(id);
  if (!tool) return {};
  const category = ALL_FREE_TOOL_CATEGORIES.find((c) => c.id === tool.categoryId);
  return {
    title: `${tool.title} — Free SEO Tool`,
    description: tool.description,
    keywords: tool.tags,
    alternates: { canonical: `/tools/ext/${tool.id}` },
    openGraph: {
      title: `${tool.title} | IndexFast Tools`,
      description: tool.description,
      url: `/tools/ext/${tool.id}`,
      type: "website",
    },
  };
}

export default async function ExternalToolPage({ params }: Props) {
  const { id } = await params;
  const tool = getAllFreeToolById(id);
  if (!tool) notFound();
  const category = ALL_FREE_TOOL_CATEGORIES.find((c) => c.id === tool.categoryId);
  const relatedTools = ALL_FREE_TOOLS.filter(
    (t) => t.categoryId === tool.categoryId && t.id !== tool.id
  ).slice(0, 6);

  return (
    <ExternalToolShell
      tool={tool}
      categoryTitle={category?.title ?? ""}
      categoryEmoji={category?.emoji ?? "🔧"}
      relatedTools={relatedTools}
    />
  );
}
