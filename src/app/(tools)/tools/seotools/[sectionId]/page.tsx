import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SEO_TOOL_SECTIONS, getSeoToolLinksBySection, getSeoToolSectionById } from "@/lib/seo-tool-links";

interface SeoToolsSectionPageProps {
  params: Promise<{ sectionId: string }>;
}

export function generateStaticParams() {
  return SEO_TOOL_SECTIONS.map((section) => ({ sectionId: section.id }));
}

export async function generateMetadata({ params }: SeoToolsSectionPageProps): Promise<Metadata> {
  const { sectionId } = await params;
  const section = getSeoToolSectionById(sectionId);

  if (!section) {
    return {
      title: "SEO Section Not Found",
      description: "The requested SEO section does not exist.",
    };
  }

  return {
    title: `${section.title} SEO Tools | IndexFast`,
    description: section.description,
    alternates: { canonical: `/tools/seotools/${section.id}` },
  };
}

export default async function SeoToolsSectionPage({ params }: SeoToolsSectionPageProps) {
  const { sectionId } = await params;
  const section = getSeoToolSectionById(sectionId);

  if (!section) notFound();

  const links = getSeoToolLinksBySection(section.id);

  return (
    <section className="border-b border-border/70 py-14 sm:py-20">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-3">
          <Badge variant="outline" className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.14em]">
            <Sparkles className="mr-1.5 h-3.5 w-3.5" /> SEO section
          </Badge>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{section.title}</h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">{section.description}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {links.map((link) => (
            <Card key={link.title} className="border-border/70 bg-card/70">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg">{link.title}</CardTitle>
                  <Badge variant="secondary">{link.badge}</Badge>
                </div>
                <CardDescription className="text-sm">{link.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    Open <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/tools/seotools">All SEO tools</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/toolbox">Free toolbox access</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
