"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Filter, Search, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { ToolDefinition, ToolCategory } from "@/lib/tools-catalog";
import { getToolSignals } from "@/lib/tool-signals";

type SortMode = "recommended" | "seoRatio" | "priority" | "easy" | "fast" | "name";

interface ToolsExplorerProps {
  tools: ToolDefinition[];
  categories: ToolCategory[];
  selectedCategoryId?: string | null;
  title: string;
  description: string;
  ctaHref: string;
  ctaLabel: string;
}

const priorityRank: Record<string, number> = { High: 3, Medium: 2, Low: 1 };
const easeRank: Record<string, number> = { Easy: 3, Moderate: 2, Advanced: 1 };
const speedRank: Record<string, number> = { Fast: 3, Standard: 2, Deep: 1 };

export default function ToolsExplorer({
  tools,
  categories,
  selectedCategoryId = null,
  title,
  description,
  ctaHref,
  ctaLabel,
}: ToolsExplorerProps) {
  const [query, setQuery] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("recommended");
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(selectedCategoryId);

  const visibleTools = useMemo(() => {
    const loweredQuery = query.trim().toLowerCase();
    const filtered = tools.filter((tool) => {
      const signals = getToolSignals(tool);
      const matchesQuery = !loweredQuery || signals.searchText.includes(loweredQuery);
      const matchesCategory = !activeCategoryId || tool.categoryId === activeCategoryId;
      return matchesQuery && matchesCategory;
    });

    return [...filtered].sort((left, right) => {
      const leftSignals = getToolSignals(left);
      const rightSignals = getToolSignals(right);

      if (sortMode === "seoRatio") return rightSignals.seoRatio - leftSignals.seoRatio;
      if (sortMode === "priority") return priorityRank[rightSignals.priority] - priorityRank[leftSignals.priority];
      if (sortMode === "easy") return easeRank[rightSignals.ease] - easeRank[leftSignals.ease];
      if (sortMode === "fast") return speedRank[rightSignals.speed] - speedRank[leftSignals.speed];
      if (sortMode === "name") return left.title.localeCompare(right.title);

      return priorityRank[rightSignals.priority] * 100 + rightSignals.seoRatio - (priorityRank[leftSignals.priority] * 100 + leftSignals.seoRatio);
    });
  }, [activeCategoryId, query, sortMode, tools]);

  const summary = useMemo(() => {
    const signals = visibleTools.map((tool) => getToolSignals(tool));
    const averageSeoRatio = signals.length
      ? Math.round(signals.reduce((sum, item) => sum + item.seoRatio, 0) / signals.length)
      : 0;
    const fastCount = signals.filter((item) => item.speed === "Fast").length;
    const easyCount = signals.filter((item) => item.ease === "Easy").length;
    return { averageSeoRatio, fastCount, easyCount };
  }, [visibleTools]);

  return (
    <section className="border-t border-border/70 py-14 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <Badge variant="outline" className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.14em]">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" /> SEO tools, sorted
            </Badge>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">{title}</h2>
            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">{description}</p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center sm:w-fit sm:grid-cols-3">
            <Card className="border-border/70 bg-card/70">
              <CardContent className="p-3">
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">SEO ratio</p>
                <p className="text-xl font-black">{summary.averageSeoRatio}%</p>
              </CardContent>
            </Card>
            <Card className="border-border/70 bg-card/70">
              <CardContent className="p-3">
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Fast</p>
                <p className="text-xl font-black">{summary.fastCount}</p>
              </CardContent>
            </Card>
            <Card className="border-border/70 bg-card/70">
              <CardContent className="p-3">
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Easy</p>
                <p className="text-xl font-black">{summary.easyCount}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid gap-4 rounded-2xl border border-border/70 bg-card/60 p-4 md:grid-cols-[1.4fr_0.7fr_0.9fr] md:items-center">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -tranzinc-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search tools, keywords, or use cases"
              className="pl-9"
            />
          </label>

          <Select
            value={sortMode}
            onChange={(value: any) => setSortMode(value as SortMode)}
            options={[
              { label: "Recommended", value: "recommended" },
              { label: "SEO ratio", value: "seoRatio" },
              { label: "Priority", value: "priority" },
              { label: "Easy first", value: "easy" },
              { label: "Fast first", value: "fast" },
              { label: "A to Z", value: "name" },
            ]}
            prefix={<Filter className="h-4 w-4" />}
            className="w-full"
            selectClassName="h-10"
          />

          <div className="flex flex-wrap gap-2 md:justify-end">
            <Button
              type="button"
              variant={activeCategoryId === null ? "default" : "outline"}
              className="h-10"
              onClick={() => setActiveCategoryId(null)}
            >
              All
            </Button>
            {categories.slice(0, 4).map((category) => (
              <Button
                key={category.id}
                type="button"
                variant={activeCategoryId === category.id ? "default" : "outline"}
                className="h-10"
                onClick={() => setActiveCategoryId(category.id)}
              >
                {category.badge}
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {visibleTools.map((tool) => {
            const signals = getToolSignals(tool);
            return (
              <Card key={tool.slug} className="group border-border/70 bg-card/70 transition-colors hover:border-primary/40">
                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="outline" className="w-fit">
                      {tool.categoryId.replace(/-/g, " ")}
                    </Badge>
                    <Badge className="bg-foreground text-background hover:bg-foreground/90">SEO {signals.seoRatio}%</Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight">{tool.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">{tool.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <div className="flex flex-wrap gap-2 text-xs">
                    <Badge variant="secondary">Priority {signals.priority}</Badge>
                    <Badge variant="secondary">{signals.ease}</Badge>
                    <Badge variant="secondary">{signals.speed}</Badge>
                  </div>
                  <Button asChild className="w-full justify-center">
                    <Link href={`/tools/${tool.slug}`}>
                      Open tool <ArrowUpRight className="ml-1 h-4 w-4 transition-transform group-hover:tranzinc-x-0.5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className={cn("mt-6 text-sm text-muted-foreground", visibleTools.length ? "" : "rounded-lg border border-border/70 bg-card/60 p-4") }>
          {visibleTools.length ? `${visibleTools.length} tools matched your filters.` : "No tools matched your search. Clear filters to keep going."}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <Link href={ctaHref}>{ctaLabel}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/tools/seotools">Open SEO tools hub</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
