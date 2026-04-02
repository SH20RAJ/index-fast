import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ToolCta from "./ToolCta";

interface ToolPageShellProps {
  badge: string;
  title: string;
  description: string;
  intentKeywords: string[];
  steps: string[];
  faqs: Array<{ question: string; answer: string }>;
  categoryTitle?: string;
  relatedTools?: Array<{ slug: string; title: string }>;
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
}: ToolPageShellProps) {
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
        </div>
      </div>
    </section>
  );
}
