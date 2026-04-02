"use client";

import { useStackApp } from "@stackframe/stack";
import { Button } from "@/components/ui/button";

export default function FinalCTA() {
  const stack = useStackApp();

  return (
    <section id="cta" className="py-14 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-foreground px-6 py-12 text-center text-background sm:px-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_0%,rgba(255,255,255,0.22),transparent_45%)]" />
          <div className="relative space-y-5">
            <h2 className="text-3xl font-black tracking-tight sm:text-5xl">Ready to index your content?</h2>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-background/75 sm:text-lg">
              Stop waiting for search engines to find your pages. Get discovered faster with a reliable indexing workflow.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button variant="secondary" size="lg" onClick={() => stack.redirectToSignUp()}>
                Get Started Free
              </Button>
              <Button variant="outline" size="lg" asChild className="border-background/30 bg-transparent text-background hover:bg-background/10 hover:text-background">
                <a href="/pricing">View Pricing</a>
              </Button>
            </div>
            <p className="text-xs font-medium tracking-[0.14em] text-background/60 uppercase">
              No card required • Setup in minutes • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
