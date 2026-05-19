import { Check, Shield, Zap } from "lucide-react";
import LandingProductPreview from "@/components/landing/LandingProductPreview";
import HeroCTA from "@/components/landing/HeroCTA";

const checklist = [
  "Index pages from your IDE (Cursor, Windsurf, Claude Code)",
  "No more manual Bing, Google, or Yandex Console visits",
  "Beat competitors to search results within minutes",
];

const stats = [
  { value: "4-24h", label: "Indexing Time" },
  { value: "100%", label: "API-Official" },
  { value: "5s", label: "IDE Response" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24 lg:pt-40 lg:pb-28">
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-16">
          <div className="text-center lg:text-left">
            <div
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary animate-fade-in-up-1 opacity-0"
            >
              <Zap className="h-3 w-3" />
              Index while you code with IndexFast MCP
            </div>

            <h1
              className="text-balance text-4xl font-serif font-bold tracking-tight text-foreground sm:text-5xl lg:text-[4rem] lg:leading-[1.1] animate-fade-in-up-2 opacity-0"
            >
              Ship code. Prompt your IDE. <br className="hidden lg:block" />
              <span className="text-primary italic">Get indexed instantly.</span>
            </h1>

            <p
              className="mx-auto mt-6 max-w-xl text-pretty text-base font-sans text-muted-foreground sm:text-lg lg:mx-0 animate-fade-in-up-3 opacity-0"
            >
              Stop opening Google Search Console. Just tell Cursor, Windsurf, or Claude to index your new pages using the IndexFast MCP server. We handle the Bing, Google, and IndexNow APIs automatically.
            </p>

            <ul
              className="mx-auto mt-8 max-w-xl space-y-3 text-left text-sm text-muted-foreground lg:mx-0 animate-fade-in-up-4 opacity-0"
            >
              {checklist.map((line) => (
                <li key={line} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span className="font-medium text-foreground/80">{line}</span>
                </li>
              ))}
            </ul>

            <HeroCTA />

            <div
              className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-muted-foreground lg:justify-start animate-fade-in-delay opacity-0"
            >
              <span className="inline-flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-primary" />
                No card to explore
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-amber-500" />
                Live in a few minutes
              </span>
            </div>

            <div
              className="mx-auto mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-border/60 pt-10 lg:mx-0 lg:max-w-none animate-fade-in-up-5 opacity-0"
            >
              {stats.map((s) => (
                <div key={s.label} className="text-center lg:text-left">
                  <p className="text-xl font-semibold tabular-nums tracking-tight text-foreground sm:text-2xl">{s.value}</p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-[11px]">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <LandingProductPreview className="mx-auto w-full max-w-md lg:mx-0 lg:max-w-none" />
        </div>
      </div>
    </section>
  );
}
