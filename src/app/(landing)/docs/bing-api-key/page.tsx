import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Key, 
  ExternalLink, 
  CheckCircle2, 
  Zap, 
  ShieldCheck,
  Search,
  Monitor,
  LayoutDashboard
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "How to Get a Bing Webmaster API Key | IndexFast Documentation",
  description: "Step-by-step guide on how to generate and configure your Bing Webmaster Tools API key for automated indexing with IndexFast.",
};

export default function BingApiKeyPage() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-6 lg:py-24">
      {/* Header Section */}
      <div className="space-y-6 mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] uppercase font-bold tracking-widest animate-in fade-in slide-in-from-bottom-2">
          <Monitor className="h-3 w-3" /> Search Engine Guide
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
          Bing Webmaster <br />
          <span className="text-muted-foreground text-blue-600/80">API Configuration</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          The Bing Webmaster API key allows IndexFast to submit your URLs directly to Microsoft Bing, ensuring your latest content is crawled and indexed within minutes.
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-[1fr_280px]">
        <div className="space-y-12">
          {/* Section 1: Sign In */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-zinc-950 dark:bg-white flex items-center justify-center text-white dark:text-zinc-950 shadow-xl">
                <Search className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">1. Access Bing Webmaster Tools</h2>
            </div>
            <div className="prose prose-zinc dark:prose-invert max-w-none">
              <p>
                First, you need to sign in to the official dashboard. If your site isn't added yet, you'll need to verify ownership via DNS or an HTML tag.
              </p>
              <div className="mt-4">
                <Button asChild variant="outline" className="rounded-xl border-border/60 hover:bg-muted/50 font-bold">
                  <a href="https://www.bing.com/webmasters/" target="_blank" rel="noopener noreferrer">
                    Open Bing Webmaster Tools <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </section>

          {/* Section 2: Navigate to Settings */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-foreground shadow-sm">
                <Settings className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">2. Navigate to API Settings</h2>
            </div>
            <div className="prose prose-zinc dark:prose-invert max-w-none">
              <p>
                Once logged in, follow these steps to find the hidden API menu:
              </p>
              <div className="grid gap-4 mt-6">
                {[
                  "Select your website from the top-left site switcher.",
                  "Click the Settings (gear icon) in the top-right toolbar.",
                  "Under the 'API Access' category, select 'API Key'."
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-white text-[10px] font-bold">
                      {i + 1}
                    </div>
                    <p className="text-sm font-medium leading-6">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 3: Generate Key */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 shadow-sm shadow-blue-500/5">
                <Key className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">3. Generate & Copy Your Key</h2>
            </div>
            <div className="prose prose-zinc dark:prose-invert max-w-none">
              <p>
                If you haven't generated a key before, click the **Generate API Key** button.
              </p>
              <div className="p-8 rounded-[2rem] bg-zinc-950 dark:bg-zinc-900 border border-border/50 relative overflow-hidden group">
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(59,130,246,0.1),transparent_50%)]" />
                 <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Your Generated Key</p>
                 <div className="flex items-center justify-between gap-4 p-3 bg-white/5 rounded-xl border border-white/10 text-sm font-mono text-zinc-300">
                    <span className="truncate">74c28309a177441488a4ea77d823c277</span>
                    <Badge variant="outline" className="text-white/40 border-white/10 text-[10px]">Copied</Badge>
                 </div>
              </div>
              <p className="text-sm text-muted-foreground italic mt-6">
                Note: Treat this key like a password. Anyone with this key can submit or remove URLs from your Bing profile.
              </p>
            </div>
          </section>

          {/* Section 4: Connect to IndexFast */}
          <section className="space-y-6 pt-12 border-t border-border/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm shadow-primary/5">
                <LayoutDashboard className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">4. Connect to IndexFast</h2>
            </div>
            <div className="prose prose-zinc dark:prose-invert max-w-none">
              <p>
                Return to IndexFast and paste the key into your site configuration settings.
              </p>
              <div className="grid gap-4 mt-8">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-green-500/5 border border-green-500/10">
                   <CheckCircle2 className="h-5 w-5 text-green-500" />
                   <span className="text-sm font-medium">Automatic URL submission enabled</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-green-500/5 border border-green-500/10">
                   <CheckCircle2 className="h-5 w-5 text-green-500" />
                   <span className="text-sm font-medium">Daily crawl stats integration</span>
                </div>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button asChild className="rounded-xl h-12 px-8 font-bold shadow-xl shadow-primary/20">
                  <Link href="/dashboard">
                    Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" asChild className="rounded-xl h-12 px-8 font-bold">
                  <Link href="/my-sites">
                    Manage My Sites
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          <div className="sticky top-32 space-y-8">
            <div className="p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-950 border border-border/50 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Why Bing API?</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                   <Zap className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                   <p className="text-xs text-muted-foreground leading-relaxed">Direct daily submission quotas</p>
                </div>
                <div className="flex items-start gap-3">
                   <ShieldCheck className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                   <p className="text-xs text-muted-foreground leading-relaxed">Higher trust signal for Microsoft Search</p>
                </div>
                <div className="flex items-start gap-3">
                   <Monitor className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                   <p className="text-xs text-muted-foreground leading-relaxed">Better diagnostic data in dashboard</p>
                </div>
              </div>
            </div>

            <Card className="rounded-3xl border-blue-500/20 bg-blue-500/[0.02] overflow-hidden">
               <CardContent className="p-6 space-y-4">
                 <h4 className="text-sm font-bold">Using IndexNow?</h4>
                 <p className="text-xs text-muted-foreground leading-relaxed">
                   You can use both! IndexNow for real-time pings and Bing API for daily full-site syncs.
                 </p>
                 <Button variant="outline" size="sm" className="w-full rounded-xl border-blue-500/20 hover:bg-blue-500/5 text-blue-600" asChild>
                   <Link href="/docs/indexnow-key">Setup IndexNow</Link>
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
