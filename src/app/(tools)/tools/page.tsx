import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
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
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
      <div className="space-y-8">
        <div className="space-y-3">
          <Badge variant="outline">Free SEO Tool Stack</Badge>
          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">Free SEO tools directory for practical workflows</h1>
          <p className="max-w-3xl text-sm text-muted-foreground md:text-base">
            Browse every tool by function, run diagnostics in minutes, and transition to automated projects when you are ready to scale.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <Card size="sm">
            <CardHeader>
              <CardDescription>Directory coverage</CardDescription>
              <CardTitle>{SEO_TOOLS.length} tools</CardTitle>
            </CardHeader>
          </Card>
          <Card size="sm">
            <CardHeader>
              <CardDescription>Category track</CardDescription>
              <CardTitle>{TOOL_CATEGORIES.length} tracks</CardTitle>
            </CardHeader>
          </Card>
          <Card size="sm">
            <CardHeader>
              <CardDescription>SEO intent</CardDescription>
              <CardTitle>Targeted</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {TOOL_CATEGORIES.map((category) => {
          const categoryTools = getToolsByCategory(category.id);
          return (
            <div key={category.id} className="space-y-4 pt-2">
              <div>
                <h2 className="text-xl font-semibold md:text-2xl">{category.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {categoryTools.map((tool) => (
                  <Card key={tool.slug} className="h-full">
                    <CardHeader>
                      <Badge variant="outline" className="w-fit">{tool.primaryKeyword}</Badge>
                      <CardTitle>{tool.title}</CardTitle>
                      <CardDescription>{tool.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button asChild>
                        <Link href={`/tools/${tool.slug}`}>
                          Open tool <ArrowUpRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}

        <ToolCta
          primaryText="Turn free checks into recurring growth"
          secondaryText="Create an account to save scans, add projects, and automate daily indexing workflows from sitemap updates."
        />
      </div>
    </section>
  );
}
