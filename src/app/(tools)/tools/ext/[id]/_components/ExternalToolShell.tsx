"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ExternalLink, Tag, ChevronLeft, Globe, Maximize2, Minimize2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { FreeTool, getFreeTierLabel } from "@/lib/tools-catalog";

interface Props {
  tool: FreeTool;
  categoryTitle: string;
  categoryEmoji: string;
  relatedTools: FreeTool[];
}

const TIER_STYLES: Record<string, string> = {
  "free": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  "freemium": "bg-blue-500/10 text-blue-600 border-blue-500/20",
  "limited-free": "bg-amber-500/10 text-amber-600 border-amber-500/20",
};

export default function ExternalToolShell({ tool, categoryTitle, categoryEmoji, relatedTools }: Props) {
  const [expanded, setExpanded] = useState(false);
  const tierLabel = getFreeTierLabel(tool.tier);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/tools" className="hover:text-foreground transition-colors flex items-center gap-1">
          <ChevronLeft className="h-3 w-3" /> Tools
        </Link>
        <span>/</span>
        <Link href={`/tools#${tool.categoryId}`} className="hover:text-foreground transition-colors">
          {categoryEmoji} {categoryTitle}
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium truncate max-w-[200px]">{tool.title}</span>
      </nav>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className={cn("font-semibold text-xs", TIER_STYLES[tool.tier])}>
            {tierLabel}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {categoryEmoji} {categoryTitle}
          </Badge>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{tool.title}</h1>
            <p className="mt-2 max-w-2xl text-base text-muted-foreground leading-relaxed">{tool.description}</p>
          </div>
          <div className="shrink-0">
            <Button size="lg" asChild className="font-bold">
              <a href={tool.url} target="_blank" rel="noopener noreferrer">
                Open Tool <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {tool.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full border border-border/50 bg-muted/40 px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground"
            >
              <Tag className="h-2.5 w-2.5" />
              {tag}
            </span>
          ))}
        </div>
      </div>

      <Separator />

      {/* Embed or open-only section */}
      {tool.canEmbed ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Live Tool Preview</p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExpanded((e) => !e)}
                className="text-xs gap-1.5"
              >
                {expanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                {expanded ? "Collapse" : "Expand"}
              </Button>
              <Button variant="outline" size="sm" asChild className="text-xs gap-1.5">
                <a href={tool.url} target="_blank" rel="noopener noreferrer">
                  <Globe className="h-3.5 w-3.5" /> Open in new tab
                </a>
              </Button>
            </div>
          </div>

          <div
            className={cn(
              "relative overflow-hidden rounded-xl border border-border/60 bg-background shadow-sm transition-all duration-300",
              expanded ? "h-[85vh]" : "h-[560px]"
            )}
          >
            <iframe
              src={tool.url}
              title={tool.title}
              className="h-full w-full border-0"
              loading="lazy"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
            />
          </div>
          <p className="text-[10px] text-muted-foreground text-center">
            Embedded from <a href={tool.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">{new URL(tool.url).hostname}</a>. 
            If the tool isn't loading, open it directly in a new tab.
          </p>
        </div>
      ) : (
        /* No-embed fallback */
        <Card className="border-dashed border-2 border-border/50">
          <CardContent className="flex flex-col items-center justify-center gap-5 py-14 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border/60 bg-card text-3xl">
              {categoryEmoji}
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-black tracking-tight">{tool.title}</h2>
              <p className="max-w-md text-sm text-muted-foreground leading-relaxed">
                This tool runs on its own platform and can't be embedded here. Click below to open it directly in a new tab.
              </p>
            </div>
            <Button size="lg" asChild className="font-bold">
              <a href={tool.url} target="_blank" rel="noopener noreferrer">
                Open {tool.title} <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <p className="text-xs text-muted-foreground">
              Opens <span className="font-mono font-semibold">{new URL(tool.url).hostname}</span> in a new tab
            </p>
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* Meta info cards */}
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Category", value: `${categoryEmoji} ${categoryTitle}` },
          { label: "Pricing", value: tierLabel },
          { label: "Access", value: tool.canEmbed ? "Embeddable" : "External link" },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-border/40 bg-card/50 p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{item.label}</p>
            <p className="mt-1 font-semibold text-sm">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Related tools */}
      {relatedTools.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-black tracking-tight">More {categoryTitle} Tools</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {relatedTools.map((related) => (
              <Card
                key={related.id}
                className="group border-border/40 bg-card/50 transition-all hover:border-primary/40 hover:bg-card/80"
              >
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-sm leading-tight group-hover:text-primary transition-colors">
                      {related.title}
                    </p>
                    <Badge variant="outline" className={cn("text-[9px] shrink-0", TIER_STYLES[related.tier])}>
                      {getFreeTierLabel(related.tier)}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{related.description}</p>
                  <Button variant="outline" size="sm" asChild className="w-full text-xs mt-1">
                    <Link href={`/tools/ext/${related.id}`}>
                      View Tool <ArrowUpRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Back to all tools */}
      <div className="flex flex-wrap gap-3 pt-2">
        <Button asChild>
          <Link href="/tools">← All Tools</Link>
        </Button>
        <Button variant="outline" asChild>
          <a href={tool.url} target="_blank" rel="noopener noreferrer">
            Open {tool.title} <ExternalLink className="ml-1.5 h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  );
}
