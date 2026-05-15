import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Key, 
  UploadCloud, 
  FileText, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  ChevronRight,
  Info,
  Terminal,
  ExternalLink,
  History,
  Lock,
  Globe
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "The Comprehensive Guide to IndexNow Keys | IndexFast Documentation",
  description: "Learn why IndexNow is the future of SEO, how to generate a secure key, and how to verify your domain for instant search engine indexing across Bing, Yandex, and more.",
};

export default function IndexNowKeyPage() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-6 lg:py-24">
      {/* Header Section */}
      <div className="space-y-6 mb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] uppercase font-bold tracking-widest animate-in fade-in slide-in-from-bottom-2">
          <Zap className="h-3 w-3" /> Industry Standard Protocol
        </div>
        <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.05]">
          Understanding the <br />
          <span className="text-muted-foreground">IndexNow Protocol</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          IndexNow is an open-source initiative that shifts the SEO paradigm from a traditional "pull" model to a high-efficiency "push" model. 
          Instead of waiting for crawlers, you notify them instantly.
        </p>
      </div>

      <div className="grid gap-16 lg:grid-cols-[1fr_300px]">
        <div className="space-y-20">
          
          {/* Why IndexNow? Section */}
          <section className="space-y-8">
            <div className="p-8 md:p-12 rounded-[3rem] bg-zinc-50 dark:bg-zinc-900/50 border border-border/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12">
                <Globe className="h-64 w-64" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight mb-6">Why IndexNow Matters</h2>
              <div className="grid md:grid-cols-2 gap-8 relative z-10">
                <div className="space-y-3">
                  <h3 className="font-bold text-foreground flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" /> Instant Discovery
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    According to <a href="https://www.indexnow.org" target="_blank" className="text-primary hover:underline font-medium">IndexNow.org</a>, the protocol eliminates the "waiting period" where search engines take days or weeks to find new content.
                  </p>
                </div>
                <div className="space-y-3">
                  <h3 className="font-bold text-foreground flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" /> Resource Efficiency
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Search engines like <span className="font-bold text-foreground">Bing</span> and <span className="font-bold text-foreground">Yandex</span> prioritize URLs that you "push", reducing unnecessary crawl load on your server.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Implementation Steps */}
          <div className="space-y-16">
            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-xl font-black italic">
                  01
                </div>
                <h2 className="text-3xl font-bold tracking-tight">Generate a Secure Key</h2>
              </div>
              <div className="prose prose-zinc dark:prose-invert max-w-none">
                <p>
                  Your IndexNow key acts as a <span className="font-bold italic underline decoration-primary/30">digital signature</span>. It ensures that only you (the site owner) can trigger indexing pings.
                </p>
                <Card className="rounded-3xl bg-muted/20 border-dashed border-border/80">
                  <CardContent className="p-6">
                    <p className="text-sm font-bold text-foreground mb-3">Key Requirements:</p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 list-none pl-0 text-xs text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <div className="h-1 w-1 rounded-full bg-primary" /> Alphanumeric (a-z, A-Z, 0-9)
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1 w-1 rounded-full bg-primary" /> Length: 8 to 128 characters
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-foreground shadow-sm font-black italic">
                  02
                </div>
                <h2 className="text-3xl font-bold tracking-tight">Host the Key File</h2>
              </div>
              <div className="prose prose-zinc dark:prose-invert max-w-none">
                <p>
                  This is the most critical security step. By placing the key in a public file on your server, you prove ownership to the search engine.
                </p>
                <div className="bg-zinc-950 rounded-[2.5rem] p-10 overflow-hidden relative group">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <FileText className="h-24 w-24 text-white" />
                  </div>
                  <div className="space-y-6 font-mono text-sm relative z-10">
                    <div className="space-y-2">
                      <p className="text-zinc-500 uppercase text-[10px] tracking-widest font-bold">1. File Name (Must match key)</p>
                      <p className="text-zinc-100 bg-white/5 p-3 rounded-xl border border-white/10">74c28309a177.txt</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-zinc-500 uppercase text-[10px] tracking-widest font-bold">2. File Content (Key only)</p>
                      <p className="text-primary bg-primary/5 p-3 rounded-xl border border-primary/20">74c28309a177</p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-6 leading-relaxed">
                  When IndexFast (or any search engine) detects a ping, they will first check <code className="text-primary font-bold">yourdomain.com/key-name.txt</code> to verify that the key matches the submission.
                </p>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm shadow-primary/5 font-black italic">
                  03
                </div>
                <h2 className="text-3xl font-bold tracking-tight">The "Single-Ping" Magic</h2>
              </div>
              <div className="prose prose-zinc dark:prose-invert max-w-none">
                <p>
                  One of the primary benefits of IndexNow is its <span className="font-bold">cross-engine synchronization</span>. When IndexFast pings Microsoft Bing, Bing automatically notifies all other participating search engines.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8">
                  {['Bing', 'Yandex', 'Seznam.cz', 'Naver'].map((engine) => (
                    <div key={engine} className="flex items-center justify-center p-4 rounded-2xl bg-muted/30 border border-border/50 text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all cursor-default">
                      {engine}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-4 italic">
                  Note: While Google does not yet support the IndexNow protocol, IndexFast uses separate Google APIs to ensure your site is indexed there as well.
                </p>
              </div>
            </section>

            {/* Video Tutorial */}
            <div className="my-12 p-1 rounded-[2.5rem] bg-gradient-to-br from-primary/20 to-transparent">
              <div className="overflow-hidden rounded-[2.4rem] bg-zinc-950 aspect-video shadow-2xl">
                <iframe 
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/P8BvSg1H-M4" 
                  title="How to set up IndexNow Key"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
              <p className="text-[10px] text-center font-bold uppercase tracking-widest text-muted-foreground mt-4">Visual Guide: Setting up IndexNow Key</p>
            </div>
          </div>

          {/* Security Deep Dive */}
          <section className="pt-16 border-t border-border/50 space-y-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-zinc-950 dark:bg-white flex items-center justify-center text-white dark:text-zinc-950 shadow-xl">
                <Lock className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Why We Use API Keys</h2>
            </div>
            <div className="prose prose-zinc dark:prose-invert max-w-none">
              <p className="text-lg font-medium text-foreground/80 leading-relaxed">
                Security and autonomy are the foundations of IndexFast. We utilize API keys instead of account credentials for three major reasons:
              </p>
              <div className="grid gap-6 mt-8">
                <div className="p-6 rounded-3xl bg-muted/20 border border-border/50 space-y-2">
                  <h4 className="font-bold">1. Zero-Knowledge Proof</h4>
                  <p className="text-sm text-muted-foreground">The key hosted on your server is public proof that you own the domain. We don't need your Bing login or hosting passwords.</p>
                </div>
                <div className="p-6 rounded-3xl bg-muted/20 border border-border/50 space-y-2">
                  <h4 className="font-bold">2. Permission Scoping</h4>
                  <p className="text-sm text-muted-foreground">The IndexNow key only allows for "Content Submission". It does not grant access to billing, user management, or sensitive site data.</p>
                </div>
                <div className="p-6 rounded-3xl bg-muted/20 border border-border/50 space-y-2">
                  <h4 className="font-bold">3. Rapid Revocation</h4>
                  <p className="text-sm text-muted-foreground">If you ever want to stop using IndexFast, you simply delete the .txt file from your root. Access is revoked instantly across all search engines.</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          <div className="sticky top-32 space-y-8">
            <div className="p-8 rounded-[2.5rem] bg-zinc-950 text-white shadow-2xl shadow-zinc-900/20">
               <div className="flex items-center gap-2 mb-6">
                 <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                 <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">Documentation</span>
               </div>
               <h4 className="text-lg font-bold mb-4">Official Sources</h4>
               <div className="space-y-6">
                 <a href="https://www.indexnow.org" target="_blank" className="block group">
                   <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 group-hover:text-primary transition-colors">IndexNow.org</p>
                   <p className="text-[10px] text-zinc-400 mt-1">Official Protocol Documentation</p>
                 </a>
                 <a href="https://www.bing.com/webmasters/help/indexnow-insights-report-a6e45722" target="_blank" className="block group">
                   <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 group-hover:text-primary transition-colors">Bing Help</p>
                   <p className="text-[10px] text-zinc-400 mt-1">Crawl Efficiency & Insights</p>
                 </a>
               </div>
            </div>

            <Card className="rounded-3xl border-primary/20 bg-primary/[0.02] shadow-xl shadow-primary/5">
               <CardContent className="p-6 space-y-4">
                 <h4 className="text-sm font-bold">Ready to index?</h4>
                 <p className="text-xs text-muted-foreground leading-relaxed">
                   Set up your key today and watch your pages hit the search results in minutes.
                 </p>
                 <Button className="w-full rounded-xl font-bold shadow-lg shadow-primary/20" asChild>
                   <Link href="/sign-up">Start Free Trial</Link>
                 </Button>
               </CardContent>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
    </svg>
  );
}
