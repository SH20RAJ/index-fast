"use client";

import { useStackApp } from "@stackframe/stack";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function FinalCTA() {
  const stack = useStackApp();

  return (
    <section id="cta" className="py-20 bg-background">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-zinc-950 px-8 py-16 text-center shadow-2xl sm:px-16 lg:py-24">
          {/* Decorative background */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(244,63,94,0.15),transparent_70%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(circle,black,transparent_90%)]" />
          </div>
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/70">
              <Sparkles className="h-3.5 w-3.5 text-rose-500" />
              Start for free
            </div>
            
            <div className="space-y-4">
              <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                Ready to get <br />
                <span className="text-zinc-500">indexed today?</span>
              </h2>
              <p className="mx-auto max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base">
                Stop waiting for search engines to find you. Join hundreds of teams automating their indexing and growing their traffic.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row pt-4">
              <Button 
                onClick={() => stack.redirectToSignUp()}
                className="h-12 px-8 rounded-xl font-bold bg-white text-zinc-950 hover:bg-zinc-200 transition-all w-full sm:w-auto"
              >
                Get Started for Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline"
                asChild 
                className="h-12 px-8 rounded-xl font-bold border-white/10 bg-transparent text-white hover:bg-white/5 w-full sm:w-auto"
              >
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3 pt-6">
              {[
                "No card required",
                "2-minute setup",
                "Instant results"
              ].map((text) => (
                <div key={text} className="flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-rose-500" />
                  <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
