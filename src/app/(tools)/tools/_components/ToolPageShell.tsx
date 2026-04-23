import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, ShieldCheck, Zap } from "lucide-react";
import ToolCta from "./ToolCta";
import { getRecommendedExternalTools } from "@/lib/tools-catalog";

interface ToolPageShellProps {
  badge: string;
  title: string;
  description: string;
  intentKeywords: string[];
  steps: string[];
  faqs: Array<{ question: string; answer: string }>;
  categoryTitle?: string;
  relatedTools?: Array<{ slug: string; title: string }>;
  children?: React.ReactNode;
  slug?: string;
}

export default function ToolPageShell({
  badge,
  title,
  description,
  intentKeywords,
  steps,
  faqs,
  categoryTitle,
  relatedTools,
  children,
  slug,
}: ToolPageShellProps) {
  const externalRecommendations = slug ? getRecommendedExternalTools(slug) : [];

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
      <div className="space-y-7">
        <div className="space-y-3">
          <Badge variant="outline">{badge}</Badge>
          <h1 className="max-w-4xl text-3xl font-semibold tracking-tight md:text-5xl">{title}</h1>
          <p className="max-w-3xl text-sm text-muted-foreground md:text-base">{description}</p>
          {categoryTitle && <p className="text-xs text-muted-foreground">Track: {categoryTitle}</p>}
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {[
            { label: "Tool Type", val: "Free SEO Utility", desc: "Built for practical pre-campaign validation." },
            { label: "Ideal For", val: "Growth Operators", desc: "Rapid checks before publishing or scaling." },
            { label: "Next Step", val: "Save + Automate", desc: "Move from one-off checks to recurring logs." },
          ].map((stat) => (
            <Card key={stat.label} size="sm">
              <CardHeader>
                <CardDescription>{stat.label}</CardDescription>
                <CardTitle>{stat.val}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-xs text-muted-foreground">{stat.desc}</CardContent>
            </Card>
          ))}
        </div>

        {children}

        {externalRecommendations.length > 0 && (
          <div className="space-y-6 py-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-500 fill-amber-500" />
                  <h2 className="text-xl font-bold tracking-tight">Professional Grade Alternatives</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  Our lightweight tool is great for quick checks. For deep audits and production workflows, we recommend these industry leaders.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {externalRecommendations.map((ext) => (
                <Card key={ext.id} className="group relative overflow-hidden border-border/50 bg-muted/20 hover:bg-muted/30 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-bold">{ext.title}</CardTitle>
                      <Badge variant="secondary" className="text-[10px] uppercase tracking-tighter">{ext.tier}</Badge>
                    </div>
                    <CardDescription className="text-xs line-clamp-2 mt-1">
                      {ext.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" size="sm" className="w-full text-xs font-bold uppercase tracking-widest h-9" asChild>
                      <a href={ext.url} target="_blank" rel="noopener noreferrer">
                        Visit Tool
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <Separator />

        <div className="flex flex-wrap gap-2">
          {intentKeywords.map((keyword) => (
            <Badge key={keyword} variant="outline">{keyword}</Badge>
          ))}
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold md:text-2xl">How it works</h2>
          <div className="grid gap-3 md:grid-cols-3">
            {steps.map((step, index) => (
              <Card key={step}>
                <CardHeader>
                  <CardDescription>Step {index + 1}</CardDescription>
                  <CardTitle className="text-base">{step}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        <ToolCta
          primaryText="Run this free tool, then scale it"
          secondaryText="Use free checks to find issues in minutes. Create an account to automate daily submissions with IndexFast Pro."
        />

        <div className="space-y-3">
          <h2 className="text-xl font-semibold md:text-2xl">Frequently asked questions</h2>
          <Card>
            <CardContent className="space-y-3 pt-4">
              {faqs.map((faq, index) => (
                <div key={faq.question}>
                  <h3 className="text-sm font-semibold">{faq.question}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{faq.answer}</p>
                  {index !== faqs.length - 1 && <Separator className="mt-3" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {relatedTools && relatedTools.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Related tools</h2>
            <div className="grid gap-2 md:grid-cols-3">
              {relatedTools.map((tool) => (
                <Button key={tool.slug} variant="outline" className="justify-start" asChild>
                  <Link href={`/tools/${tool.slug}`}>{tool.title}</Link>
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/tools">Explore all tools</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">View platform</Link>
          </Button>
          <Button variant="ghost" className="text-rose-500 hover:text-rose-600 hover:bg-rose-50" asChild>
            <a href="https://www.indexfast.co" target="_blank" rel="noopener noreferrer">
              Discover all features on indexfast.co
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
