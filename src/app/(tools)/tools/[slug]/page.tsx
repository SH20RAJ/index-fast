import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ToolStaticPage, { createToolMetadata } from "@/components/tools/shared/tool-static-page";
import { getToolBySlug } from "@/lib/tools-catalog";

interface ToolDynamicPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ToolDynamicPageProps): Promise<Metadata> {
  const { slug } = await params;
  return createToolMetadata(slug);
}

export default async function ToolDynamicPage({ params }: ToolDynamicPageProps) {
  const { slug } = await params;

  if (!getToolBySlug(slug)) {
    notFound();
  }

  return <ToolStaticPage slug={slug} />;
}
