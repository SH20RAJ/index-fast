"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ArrowRight, Clock3, Globe2, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/70 bg-background pt-20 pb-14 sm:pt-24 sm:pb-18">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,hsl(var(--primary)/0.14),transparent_35%),radial-gradient(circle_at_90%_0%,hsl(var(--primary)/0.1),transparent_38%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.35)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.35)_1px,transparent_1px)] bg-[size:34px_34px] [mask-image:linear-gradient(to_bottom,black,transparent_88%)]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto flex max-w-4xl flex-col items-center text-center"
        >
          <Badge variant="outline" className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.14em]">
            Indexing Infrastructure
          </Badge>

          <h1 className="mt-5 text-4xl font-black tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Submit new pages fast.
            <span className="block text-muted-foreground">Stay visible while competitors wait.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            IndexFast pushes your freshest URLs to IndexNow and Bing from one operational workflow, so content updates get discovered earlier.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-11 rounded-xl px-6 font-semibold">
              <Link href="/sign-up">
                Start Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-11 rounded-xl px-6 font-semibold">
              <Link href="/how-it-works">See How It Works</Link>
            </Button>
          </div>

          <div className="mt-9 grid w-full max-w-3xl gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-border/70 bg-card/70 p-3 text-left">
              <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                <Clock3 className="h-3.5 w-3.5" />
                Fast Submit
              </p>
              <p className="mt-1.5 text-sm font-semibold">Push URLs within minutes of publishing.</p>
            </div>
            <div className="rounded-xl border border-border/70 bg-card/70 p-3 text-left">
              <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                <Globe2 className="h-3.5 w-3.5" />
                Engine Reach
              </p>
              <p className="mt-1.5 text-sm font-semibold">IndexNow + Bing in one clean workflow.</p>
            </div>
            <div className="rounded-xl border border-border/70 bg-card/70 p-3 text-left">
              <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5" />
                Verified Ops
              </p>
              <p className="mt-1.5 text-sm font-semibold">Track accepted and failed submissions clearly.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
