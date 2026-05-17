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
  LayoutDashboard,
  ShieldAlert,
  Target,
  Clock,
  ArrowRight,
  Lock
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Bing Webmaster API: The Complete Setup Guide | IndexFast",
  description: "Learn how to use the Bing Webmaster API to submit up to 10,000 URLs daily. Understand quotas, batch submissions, and why API keys are the safest way to automate your SEO.",
};

export default function BingApiKeyPage() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-6 lg:py-24">
      {/* Header Section */}
      <div className="space-y-6 mb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] uppercase font-bold tracking-widest animate-in fade-in slide-in-from-bottom-2">
          <Monitor className="h-3 w-3" /> Professional SEO Tooling
        </div>
        <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.05]">
          Mastering the Bing <br />
          <span className="text-muted-foreground text-blue-600/80">Webmaster API</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          The Bing Webmaster API is a heavy-duty solution for content teams. It provides direct, authorized access to Microsoft's search index with massive daily quotas.
        </p>
      </div>

      <div className="grid gap-16 lg:grid-cols-[1fr_300px]">
        <div className="space-y-20">
          
          {/* Research & Stats Section */}
          <section className="space-y-8">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="p-8 rounded-[2.5rem] bg-blue-500/5 border border-blue-500/10 space-y-4">
                <div className="h-10 w-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                  <Target className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">10,000 URLs / Day</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  According to <a href="https://www.bing.com/webmasters/help/url-submission-62272" target="_blank" className="text-blue-600 hover:underline">official Bing documentation</a>, most sites are granted a daily submission quota of 10,000 URLs.
                </p>
              </div>
              <div className="p-8 rounded-[2.5rem] bg-zinc-950 text-white space-y-4 shadow-xl shadow-blue-500/10">
                <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center text-primary">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">Batch Mode</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  The API supports "Batch Submission", allowing IndexFast to send up to <span className="font-bold text-white">500 URLs in a single request</span> for maximum efficiency.
                </p>
              </div>
            </div>
          </section>

          {/* Implementation Steps */}
          <div className="space-y-16">
            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-foreground shadow-sm font-black italic">
                  01
                </div>
                <h2 className="text-3xl font-bold tracking-tight">Sign In to Webmaster Tools</h2>
              </div>
              <div className="prose prose-zinc dark:prose-invert max-w-none">
                <p>
                  Your API journey starts at the <span className="font-bold">Bing Webmaster Tools</span> portal. This is where Microsoft tracks your site health, impressions, and indexing status.
                </p>
                <div className="mt-4">
                  <Button asChild variant="outline" className="rounded-xl border-blue-500/20 hover:bg-blue-500/5 text-blue-600 font-bold px-8">
                    <a href="https://www.bing.com/webmasters/" target="_blank" rel="noopener noreferrer">
                      Open Portal <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-foreground shadow-sm font-black italic">
                  02
                </div>
                <h2 className="text-3xl font-bold tracking-tight">Access the API Menu</h2>
              </div>
              <div className="prose prose-zinc dark:prose-invert max-w-none">
                <p>
                  Microsoft keeps the API key hidden under the settings menu to prevent accidental exposure.
                </p>
                <Card className="rounded-[2rem] bg-muted/30 border-border/50 overflow-hidden">
                  <CardContent className="p-8 space-y-6">
                    <div className="flex gap-4">
                      <div className="h-6 w-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-1">1</div>
                      <p className="text-sm font-medium">Click the <strong>Settings</strong> icon (top-right gear).</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="h-6 w-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-1">2</div>
                      <p className="text-sm font-medium">Locate <strong>API Access</strong> in the left-hand sidebar or menu.</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="h-6 w-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-1">3</div>
                      <p className="text-sm font-medium">Select <strong>API Key</strong> to view or generate your unique token.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 shadow-sm shadow-blue-500/5 font-black italic">
                  03
                </div>
                <h2 className="text-3xl font-bold tracking-tight">Generate & Connect</h2>
              </div>
              <div className="prose prose-zinc dark:prose-invert max-w-none">
                <p>
                  Once you have your key, copy it and head over to your <Link href="/my-sites" className="text-primary hover:underline font-bold">IndexFast Dashboard</Link>.
                </p>
                <div className="p-8 rounded-[2rem] bg-zinc-950 dark:bg-zinc-900 border border-border/50 relative overflow-hidden group">
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(59,130,246,0.1),transparent_50%)]" />
                   <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Secure API Token</p>
                   <div className="flex items-center justify-between gap-4 p-4 bg-white/5 rounded-xl border border-white/10 text-xs font-mono text-zinc-300">
                      <span className="truncate">a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2</span>
                      <ShieldCheck className="h-4 w-4 text-green-500 shrink-0" />
                   </div>
                </div>
              </div>
            </section>

            {/* Video Tutorial */}
            <div className="my-12 p-1 rounded-[2.5rem] bg-gradient-to-br from-blue-500/20 to-transparent">
              <div className="overflow-hidden rounded-[2.4rem] bg-zinc-950 aspect-video shadow-2xl">
                <iframe 
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/O-rGf-V3-X8" 
                  title="How to get Bing Webmaster API Key"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
              <p className="text-[10px] text-center font-bold uppercase tracking-widest text-muted-foreground mt-4">Visual Guide: Generating Bing API Key</p>
            </div>
          </div>

          {/* Why API Keys? Deep Dive */}
          <section className="pt-16 border-t border-border/50 space-y-10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">The Security of API Access</h2>
            </div>
            <div className="prose prose-zinc dark:prose-invert max-w-none">
              <p className="text-lg leading-relaxed text-foreground/80">
                At IndexFast, we prioritize your account's integrity. We use API keys instead of direct account access for three critical reasons:
              </p>
              <div className="grid md:grid-cols-3 gap-6 mt-10">
                <div className="space-y-4">
                  <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <h4 className="font-bold text-sm">Scoped Access</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">API keys are "scoped" to only perform URL submissions. We cannot access your emails, personal data, or other Bing properties.</p>
                </div>
                <div className="space-y-4">
                  <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                    <Lock className="h-4 w-4" />
                  </div>
                  <h4 className="font-bold text-sm">Secure Storage</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">Your API keys are encrypted at rest using industry-standard AES-256. They are only decrypted at the exact moment of submission.</p>
                </div>
                <div className="space-y-4">
                  <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                    <Clock className="h-4 w-4" />
                  </div>
                  <h4 className="font-bold text-sm">Instant Revocation</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">You can delete or regenerate your API key in Bing Webmaster Tools at any time to instantly cut off our access.</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          <div className="sticky top-32 space-y-8">
            <div className="p-8 rounded-[2.5rem] bg-blue-600 text-white shadow-2xl shadow-blue-500/20">
               <div className="flex items-center gap-2 mb-6">
                 <div className="h-1.5 w-1.5 rounded-full bg-white/40" />
                 <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Bing Resources</span>
               </div>
               <h4 className="text-lg font-bold mb-4 italic leading-tight">Official Citations</h4>
               <div className="space-y-6">
                 <a href="https://www.bing.com/webmaster/help/api-overview-ee2296a1" target="_blank" className="block group">
                   <p className="text-xs font-bold uppercase tracking-widest text-white/50 group-hover:text-white transition-colors">API Overview</p>
                   <p className="text-[10px] text-white/30 mt-1">Microsoft Bing documentation</p>
                 </a>
                 <a href="https://www.bing.com/webmasters/help/url-submission-62272" target="_blank" className="block group">
                   <p className="text-xs font-bold uppercase tracking-widest text-white/50 group-hover:text-white transition-colors">Submission Limits</p>
                   <p className="text-[10px] text-white/30 mt-1">Quota & Batching Rules</p>
                 </a>
               </div>
            </div>

            <Card className="rounded-3xl border-border/50 bg-card overflow-hidden">
               <CardContent className="p-6 space-y-4">
                 <h4 className="text-sm font-bold">New Site?</h4>
                 <p className="text-xs text-muted-foreground leading-relaxed">
                   If you just added your site, it might take 24 hours for Bing to grant your first submission quota.
                 </p>
                 <Button className="w-full rounded-xl font-bold bg-zinc-950 text-white" asChild>
                   <Link href="/dashboard">Back to Dashboard</Link>
                 </Button>
               </CardContent>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  );
}
