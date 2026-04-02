import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
    <div className="bg-background py-10 md:py-14">
      <div className="container mx-auto max-w-6xl space-y-8 px-4">
        <section className="space-y-3">
          <Badge variant="secondary">Free SEO tool stack</Badge>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Free SEO tools directory for practical workflows
          </h1>
          <p className="max-w-3xl text-muted-foreground">
            Browse every tool by function, run diagnostics in minutes, and move into automation when you are ready to scale.
          </p>
        </section>

        <section className="grid gap-3 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Directory coverage</CardDescription>
              <CardTitle>{SEO_TOOLS.length} tools</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Category tracks</CardDescription>
              <CardTitle>{TOOL_CATEGORIES.length} tracks</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Workflow focus</CardDescription>
              <CardTitle>Indexing-ready</CardTitle>
            </CardHeader>
          </Card>
        </section>

        {TOOL_CATEGORIES.map((category) => {
          const categoryTools = getToolsByCategory(category.id);
          return (
            <section key={category.id} className="space-y-4 pt-2">
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold tracking-tight">{category.title}</h2>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {categoryTools.map((tool) => (
                  <Card key={tool.slug} className="h-full">
                    <CardContent className="space-y-3 p-5">
                      <Badge variant="outline">{tool.primaryKeyword}</Badge>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">{tool.title}</h3>
                        <p className="text-sm text-muted-foreground">{tool.description}</p>
                      </div>
                      <Button asChild variant="outline" className="w-full justify-between sm:w-auto">
                        <Link href={`/tools/${tool.slug}`}>
                          Open tool
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          );
        })}

        <ToolCta
          primaryText="Turn free checks into recurring growth"
          secondaryText="Create an account to save scans, add projects, and automate daily indexing workflows from sitemap updates."
        />
      </div>
    </div>
  );
}
