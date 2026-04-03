import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Sparkles, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ToolCta from "./_components/ToolCta";
import { SEO_TOOLS, TOOL_CATEGORIES, getToolsByCategory } from "@/lib/tools-catalog";

export const metadata: Metadata = {
  title: "Free SEO Tools Directory",
  description:
    "Browse a complete free SEO tools directory organized by category: indexing, crawl diagnostics, keyword research, backlinks, domain authority, and metadata optimization.",
  keywords: [
    "free seo tools directory",
    "seo tools for indexing",
    "keyword research tools free",
    "backlink checker tools",
    "domain authority tools",
    "meta tags tools",
  ],
  alternates: {
    canonical: "/tools",
  },
  openGraph: {
    title: "Free SEO Tools Directory | IndexFast",
    description: "Find practical SEO tools by category and convert free checks into recurring automation.",
    url: "/tools",
    type: "website",
  },
};

export default function ToolsHomePage() {
  return (
    <section className="relative overflow-hidden border-b border-border/70">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-secondary/60 blur-3xl" />
        <div className="absolute left-1/4 top-1/3 h-64 w-64 rounded-full bg-muted/70 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
        <div className="space-y-10">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <div className="space-y-4">
              <Badge variant="outline" className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.14em]">
                <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Free SEO Tool Stack
              </Badge>
              <h1 className="max-w-4xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                Pick a tool,
                <span className="block text-muted-foreground">fix a bottleneck in minutes.</span>
              </h1>
              <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                High-intent SEO utilities for crawl diagnostics, indexing workflows, and metadata checks. Start free, then
                move your winning workflows into recurring automation.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <Button asChild>
                  <a href="#tool-categories">
                    Explore Tools <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/#pricing">See Pro Automation</Link>
                </Button>
              </div>
            </div>

            <Card className="border-border/70 bg-card/80">
              <CardHeader>
                <CardDescription>Directory Snapshot</CardDescription>
                <CardTitle className="text-xl">Built for execution, not vanity metrics</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                <div className="rounded-lg border border-border/70 bg-background/70 p-3">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Tools</p>
                  <p className="text-2xl font-black tracking-tight">{SEO_TOOLS.length}</p>
                </div>
                <div className="rounded-lg border border-border/70 bg-background/70 p-3">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Categories</p>
                  <p className="text-2xl font-black tracking-tight">{TOOL_CATEGORIES.length}</p>
                </div>
                <div className="rounded-lg border border-border/70 bg-background/70 p-3">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Best For</p>
                  <p className="text-base font-semibold">Operators shipping weekly</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="rounded-xl border border-border/70 bg-card/60 p-3 sm:p-4" id="tool-categories">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Jump by category</p>
            <div className="flex flex-wrap gap-2">
              {TOOL_CATEGORIES.map((category) => (
                <a
                  key={category.id}
                  href={`#${category.id}`}
                  className="inline-flex items-center rounded-full border border-border/80 bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
                >
                  {category.title}
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            {TOOL_CATEGORIES.map((category) => {
              const categoryTools = getToolsByCategory(category.id);
              return (
                <section key={category.id} id={category.id} className="scroll-mt-24 space-y-4 pt-1">
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <h2 className="text-2xl font-black tracking-tight md:text-3xl">{category.title}</h2>
                      <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{category.description}</p>
                    </div>
                    <Badge variant="outline" className="w-fit">
                      {categoryTools.length} tools in this track
                    </Badge>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {categoryTools.map((tool, index) => (
                      <Card key={tool.slug} className="group h-full border-border/70 bg-card/70 transition-colors hover:border-primary/40">
                        <CardHeader className="space-y-3">
                          <div className="flex items-center justify-between gap-2">
                            <Badge variant="outline" className="w-fit">
                              {tool.primaryKeyword}
                            </Badge>
                            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                              <Wrench className="h-3.5 w-3.5" /> {String(index + 1).padStart(2, "0")}
                            </span>
                          </div>
                          <CardTitle className="text-lg leading-tight">{tool.title}</CardTitle>
                          <CardDescription className="text-sm leading-relaxed">{tool.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <Button asChild className="w-full justify-center">
                            <Link href={`/tools/${tool.slug}`}>
                              Open Tool <ArrowUpRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          <ToolCta
            primaryText="Turn quick checks into recurring wins"
            secondaryText="Create an account to save scans, add projects, and automate sitemap-driven indexing workflows daily."
          />
        </div>
      </div>
    </section>
  );
}
