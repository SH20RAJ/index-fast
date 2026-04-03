import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SEO_TOOL_SECTIONS, getSeoToolLinksBySection } from "@/lib/seo-tool-links";

export const metadata: Metadata = {
  title: "SEO Tools Hub",
  description:
    "Structured SEO tools, official links, and quick access to indexing, performance, research, audit, and visibility resources.",
  alternates: { canonical: "/tools/seotools" },
};

export default function SeoToolsHubPage() {
  return (
    <section className="border-b border-border/70 py-14 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 space-y-4">
          <Badge variant="outline" className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.14em]">
            <Sparkles className="mr-1.5 h-3.5 w-3.5" /> SEO tools hub
          </Badge>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">SEO tools, grouped and searchable</h1>
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Fast access to the most useful SEO tools on the web. Keep the free directory visible, and log in for the full toolbox.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {SEO_TOOL_SECTIONS.map((section) => {
            const links = getSeoToolLinksBySection(section.id);
            return (
              <Card key={section.id} className="border-border/70 bg-card/70">
                <CardHeader className="space-y-2 pb-3">
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                  <CardDescription className="text-sm">{section.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {links.slice(0, 4).map((link) => (
                    <a
                      key={link.title}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-lg border border-border/60 bg-background/70 px-3 py-2 text-sm transition-colors hover:bg-muted"
                    >
                      <span className="truncate">{link.title}</span>
                      <ArrowRight className="h-4 w-4 shrink-0" />
                    </a>
                  ))}
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/tools/seotools/${section.id}`}>Open section</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {getSeoToolLinksBySection("indexing")
            .concat(getSeoToolLinksBySection("performance"))
            .slice(0, 8)
            .map((link) => (
              <Card key={link.title} className="border-border/70 bg-card/60">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-base">{link.title}</CardTitle>
                    <Badge variant="secondary">{link.badge}</Badge>
                  </div>
                  <CardDescription className="text-sm">{link.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button asChild variant="outline" className="w-full">
                    <a href={link.url} target="_blank" rel="noopener noreferrer">Visit</a>
                  </Button>
                </CardContent>
              </Card>
            ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/toolbox">Get free access to toolbox</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/tools">Back to all tools</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
