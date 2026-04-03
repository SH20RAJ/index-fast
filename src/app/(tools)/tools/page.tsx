import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Sparkles, Wrench, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ToolCta from "./_components/ToolCta";
import ToolsExplorer from "./_components/ToolsExplorer";
import ExternalResourcesSection from "./_components/ExternalResourcesSection";
import {
  SEO_TOOLS,
  TOOL_CATEGORIES,
  getToolsByCategory,
  ALL_FREE_TOOL_CATEGORIES,
  ALL_FREE_TOOLS,
  getAllFreeToolsByCategory,
  getFreeTierLabel,
} from "@/lib/tools-catalog";
import { cn } from "@/lib/utils";

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

const TIER_STYLES: Record<string, string> = {
  "free": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  "freemium": "bg-blue-500/10 text-blue-600 border-blue-500/20",
  "limited-free": "bg-amber-500/10 text-amber-600 border-amber-500/20",
};

export default function ToolsHomePage() {
  return (
    <>
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
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Own Tools</p>
                  <p className="text-2xl font-black tracking-tight">{SEO_TOOLS.length}</p>
                </div>
                <div className="rounded-lg border border-border/70 bg-background/70 p-3">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Curated External</p>
                  <p className="text-2xl font-black tracking-tight">{ALL_FREE_TOOLS.length}+</p>
                </div>
                <div className="rounded-lg border border-border/70 bg-background/70 p-3">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Categories</p>
                  <p className="text-2xl font-black tracking-tight">{TOOL_CATEGORIES.length + ALL_FREE_TOOL_CATEGORIES.length}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <ToolsExplorer
            tools={SEO_TOOLS}
            categories={TOOL_CATEGORIES}
            title="Search and sort tools fast"
            description="Filter by keyword, sort by SEO ratio, and open the fastest tools first."
            ctaHref="/tools/seotools"
            ctaLabel="Open SEO tools hub"
          />

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
              <span className="inline-flex items-center rounded-full border border-dashed border-border/60 px-3 py-1.5 text-xs text-muted-foreground">
                +
              </span>
              {ALL_FREE_TOOL_CATEGORIES.map((cat) => (
                <a
                  key={cat.id}
                  href={`#free-${cat.id}`}
                  className="inline-flex items-center gap-1 rounded-full border border-border/80 bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
                >
                  {cat.emoji} {cat.title}
                </a>
              ))}
            </div>
          </div>

          {/* ── Own built tools ── */}
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

      {/* ── Free External Tools Directory ── */}
      <section className="border-t border-border/70 py-14 sm:py-20" id="free-tools">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Section header */}
          <div className="space-y-4">
            <Badge variant="outline" className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.14em]">
              <ExternalLink className="mr-1.5 h-3 w-3" /> {ALL_FREE_TOOLS.length}+ Curated Free SEO Tools
            </Badge>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              The complete free SEO toolkit
              <span className="block text-muted-foreground">organised by category.</span>
            </h2>
            <p className="max-w-3xl text-base text-muted-foreground">
              Hand-curated collection of the best free and freemium SEO tools across every workflow — from Ping-O-Matic and Ahrefs to Surfer SEO and Claude. Click any tool to open or embed it.
            </p>
          </div>

          {/* Category filter pills */}
          <div className="flex flex-wrap gap-2">
            {ALL_FREE_TOOL_CATEGORIES.map((cat) => (
              <a
                key={cat.id}
                href={`#free-${cat.id}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card/60 px-3 py-1.5 text-xs font-medium transition-all hover:border-primary/40 hover:bg-muted"
              >
                <span>{cat.emoji}</span>
                <span>{cat.title}</span>
                <span className="text-muted-foreground">({getAllFreeToolsByCategory(cat.id).length})</span>
              </a>
            ))}
          </div>

          {/* Categories + tools grid */}
          <div className="space-y-14">
            {ALL_FREE_TOOL_CATEGORIES.map((cat) => {
              const catTools = getAllFreeToolsByCategory(cat.id);
              if (catTools.length === 0) return null;
              return (
                <div key={cat.id} id={`free-${cat.id}`} className="scroll-mt-24 space-y-5">
                  {/* Category header */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-card text-xl">
                      {cat.emoji}
                    </div>
                    <div>
                      <h3 className="text-xl font-black tracking-tight">{cat.title}</h3>
                      <p className="text-sm text-muted-foreground">{cat.description}</p>
                    </div>
                    <Badge variant="outline" className="ml-auto shrink-0 self-start">
                      {catTools.length} tools
                    </Badge>
                  </div>

                  {/* Tools grid */}
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {catTools.map((tool) => (
                      <Card
                        key={tool.id}
                        className="group flex flex-col border-border/40 bg-card/60 transition-all hover:border-primary/40 hover:bg-card/90 hover:shadow-sm"
                      >
                        <CardContent className="flex flex-col gap-3 p-4 h-full">
                          {/* Top row */}
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-bold text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">
                              {tool.title}
                            </p>
                            <Badge
                              variant="outline"
                              className={cn("shrink-0 text-[9px] font-semibold", TIER_STYLES[tool.tier])}
                            >
                              {getFreeTierLabel(tool.tier)}
                            </Badge>
                          </div>

                          {/* Description */}
                          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 flex-1">
                            {tool.description}
                          </p>

                          {/* Tags (first 3) */}
                          <div className="flex flex-wrap gap-1">
                            {tool.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full bg-muted/60 px-2 py-0.5 text-[9px] font-medium text-muted-foreground"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* Action buttons */}
                          <div className="flex gap-2 pt-1">
                            <Button asChild size="sm" className="flex-1 text-xs font-bold h-8">
                              <Link href={`/tools/ext/${tool.id}`}>
                                {tool.canEmbed ? "Open Tool" : "View Info"}
                                <ArrowUpRight className="ml-1 h-3 w-3" />
                              </Link>
                            </Button>
                            <Button asChild variant="outline" size="sm" className="h-8 w-8 p-0 shrink-0">
                              <a href={tool.url} target="_blank" rel="noopener noreferrer" title="Open externally">
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <ExternalResourcesSection />
    </>
  );
}


export default function ToolsHomePage() {
  return (
    <>
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

          <ToolsExplorer
            tools={SEO_TOOLS}
            categories={TOOL_CATEGORIES}
            title="Search and sort tools fast"
            description="Filter by keyword, sort by SEO ratio, and open the fastest tools first. Keep the free directory visible, then unlock the full toolbox after login."
            ctaHref="/tools/seotools"
            ctaLabel="Open SEO tools hub"
          />

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
      <ExternalResourcesSection />
    </>
  );
}
