import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const trustPoints = [
  "No credit card required",
  "500 URLs free",
  "Works in 2 minutes",
];

export default function Hero() {
  return (
    <section className="mx-auto max-w-3xl px-6 pt-28 pb-16 sm:pt-36 sm:pb-24">
      {/* Eyebrow */}
      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-primary">
        SEO Indexing Automation
      </p>

      {/* Headline — clear outcome, 8 words */}
      <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem] lg:leading-[1.1]">
        Index every page.
        <br />
        From your IDE.
      </h1>

      {/* Subheadline — how, not what */}
      <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
        Run one command in Cursor or VS Code. IndexFast submits your URLs to Google,
        Bing, and IndexNow — no dashboards, no manual work.
      </p>

      {/* CTA group */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button asChild size="lg" className="h-11 rounded-lg px-6 text-sm font-medium">
          <Link href="/sign-up">
            Start for free
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Link>
        </Button>
        <Button
          asChild
          variant="ghost"
          size="lg"
          className="h-11 px-6 text-sm font-medium text-muted-foreground"
        >
          <Link href="/tools">Try free tools</Link>
        </Button>
      </div>

      {/* Trust signals */}
      <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-1.5">
        {trustPoints.map((point) => (
          <li key={point} className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
            {point}
          </li>
        ))}
      </ul>

      {/* Social proof */}
      <p className="mt-8 text-xs text-muted-foreground/70">
        Trusted by 2,000+ SEO teams and developers
      </p>
    </section>
  );
}
