import Link from "next/link";
import { ArrowRight, CheckCircle2, Zap, Globe, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const trustPoints = [
  "No credit card required",
  "500 URLs free",
  "Works in 2 minutes",
];

const stats = [
  { label: "Search Engines", value: "120+", icon: Globe },
  { label: "Index Time", value: "Minutes", icon: Zap },
  { label: "Success Rate", value: "99.9%", icon: ShieldCheck },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background pt-24 pb-20 sm:pt-32 sm:pb-32">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[10%] left-[10%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] h-[400px] w-[400px] rounded-full bg-rose-500/5 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Next-Gen Indexing Platform
          </div>

          {/* Headline */}
          <h1 className="text-balance text-5xl font-bold tracking-tight text-foreground sm:text-7xl lg:text-8xl lg:leading-[1.05] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
            Index every page <br />
            <span className="bg-gradient-to-r from-primary via-rose-500 to-orange-500 bg-clip-text text-transparent">
              instantly from Cursor.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mt-8 max-w-2xl text-lg sm:text-xl leading-relaxed text-muted-foreground font-light animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            The first MCP-native indexing engine. Submit millions of URLs to Google,
            Bing, and IndexNow directly from your AI IDE. No more waiting weeks for crawl bots.
          </p>

          {/* CTA group */}
          <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
            <Button asChild size="lg" className="h-14 rounded-2xl px-8 text-base font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-1">
              <Link href="/sign-up">
                Start Indexing Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-14 px-8 rounded-2xl text-base font-medium border-border/50 bg-background/50 backdrop-blur-sm hover:bg-zinc-50 dark:hover:bg-white/5 transition-all"
            >
              <Link href="/tools">View Free Tools</Link>
            </Button>
          </div>

          {/* Trust signals */}
          <ul className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-4 animate-in fade-in duration-1000 delay-700">
            {trustPoints.map((point) => (
              <li key={point} className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 className="h-3 w-3" />
                </div>
                {point}
              </li>
            ))}
          </ul>

          {/* Stats grid */}
          <div className="mt-20 w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-8 p-8 rounded-[40px] border border-border/40 bg-zinc-50/50 dark:bg-zinc-900/40 backdrop-blur-sm animate-in zoom-in-95 duration-1000 delay-500">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background shadow-sm text-muted-foreground">
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Proof */}
          <div className="mt-12 flex flex-col items-center gap-4 animate-in fade-in duration-1000 delay-1000">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-zinc-200" />
              ))}
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              Trusted by <span className="text-foreground font-bold">2,000+</span> growth teams
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
