"use client";

import { useStackApp } from "@stackframe/stack";
import { Button } from "@/components/ui/button";

export default function FinalCTA() {
  const stack = useStackApp();

  return (
    <section id="cta" className="py-14 sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-border/70 bg-foreground px-6 py-16 text-center text-background sm:px-12 lg:py-24">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_0%,rgba(var(--primary),0.15),transparent_45%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(circle,black,transparent_80%)]" />
          
          <div className="relative space-y-8 max-w-3xl mx-auto">
            <h2 className="text-4xl font-black tracking-tight sm:text-6xl leading-[1.05]">
              Force search engines <br />
              <span className="text-background/60">to notice you now.</span>
            </h2>
            <p className="mx-auto max-w-xl text-lg leading-relaxed text-background/70 sm:text-xl">
              Every hour your pages stay unindexed, you lose traffic to competitors. Join 500+ SEO teams automating their visibility.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row pt-4">
              <Button 
                variant="secondary" 
                size="lg" 
                onClick={() => stack.redirectToSignUp()}
                className="h-16 px-10 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-white transition-all"
              >
                Accelerate My Indexing
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                asChild 
                className="h-16 px-8 rounded-2xl font-bold text-sm uppercase tracking-widest border-background/20 bg-transparent text-background hover:bg-background/10 hover:text-background"
              >
                <a href="/pricing">View Pricing</a>
              </Button>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 pt-4">
              <span className="text-[10px] font-black tracking-[0.2em] text-background/40 uppercase">No Card Required</span>
              <span className="text-[10px] font-black tracking-[0.2em] text-background/40 uppercase">Setup in 2 Mins</span>
              <span className="text-[10px] font-black tracking-[0.2em] text-background/40 uppercase">API Native</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
