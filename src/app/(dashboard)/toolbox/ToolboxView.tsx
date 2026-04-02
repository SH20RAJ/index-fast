"use client";

import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  ExternalLink, 
  TrendingUp, 
  Zap, 
  Globe, 
  BookOpen, 
  Wrench, 
  ShieldCheck,
  ArrowRight,
  Sparkles,
  LayoutGrid,
  Filter,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import PageHeader from "@/components/dashboard/PageHeader";
import { addUtmParams, cn } from "@/lib/utils";

type DirectoryItem = {
  name: string;
  url: string;
  category: "Launch" | "Community" | "Directory" | "Tech Stack";
  difficulty: "Easy" | "Medium" | "Hard";
  impact: "Low" | "Medium" | "High" | "Very High";
  description: string;
};

const directories: DirectoryItem[] = [
  {
    name: "Product Hunt",
    url: "https://www.producthunt.com/",
    category: "Launch",
    difficulty: "Medium",
    impact: "High",
    description: "The best place to launch new products and get initial traction.",
  },
  {
    name: "Indie Hackers",
    url: "https://www.indiehackers.com/",
    category: "Community",
    difficulty: "Easy",
    impact: "Medium",
    description: "Share your journey and get feedback from other builders.",
  },
  {
    name: "Reddit (r/sideproject)",
    url: "https://www.reddit.com/r/sideproject/",
    category: "Community",
    difficulty: "Medium",
    impact: "High",
    description: "A great subreddit to showcase what you're building.",
  },
  {
    name: "Reddit (r/saas)",
    url: "https://www.reddit.com/r/saas/",
    category: "Community",
    difficulty: "Hard",
    impact: "High",
    description: "Discuss SaaS building, marketing, and scaling.",
  },
  {
    name: "Hacker News",
    url: "https://news.ycombinator.com/",
    category: "Launch",
    difficulty: "Hard",
    impact: "Very High",
    description: "If you hit the front page, expect massive traffic.",
  },
  {
    name: "Microlaunch",
    url: "https://microlaunch.net/",
    category: "Launch",
    difficulty: "Easy",
    impact: "Medium",
    description: "A platform for launching small projects and micro-SaaS.",
  },
  {
    name: "Betalist",
    url: "https://betalist.com/",
    category: "Directory",
    difficulty: "Medium",
    impact: "Medium",
    description: "Get early adopters for your upcoming startup.",
  },
  {
    name: "StartupBase",
    url: "https://startupbase.io/",
    category: "Directory",
    difficulty: "Easy",
    impact: "Low",
    description: "A community of makers and early adopters.",
  },
  {
    name: "1000 Tools",
    url: "https://1000.tools/",
    category: "Directory",
    difficulty: "Easy",
    impact: "Low",
    description: "A curated list of tools for makers and developers.",
  },
  {
    name: "SaasHub",
    url: "https://www.saashub.com/",
    category: "Directory",
    difficulty: "Easy",
    impact: "Medium",
    description: "The independent software marketplace.",
  },
  {
    name: "AlternativeTo",
    url: "https://alternativeto.net/",
    category: "Directory",
    difficulty: "Easy",
    impact: "Medium",
    description: "List your product in software alternatives pages for intent-driven traffic.",
  },
  {
    name: "G2",
    url: "https://www.g2.com/",
    category: "Directory",
    difficulty: "Hard",
    impact: "Very High",
    description: "High-intent software comparison traffic and review visibility.",
  },
  {
    name: "Capterra",
    url: "https://www.capterra.com/",
    category: "Directory",
    difficulty: "Hard",
    impact: "High",
    description: "SaaS marketplace with strong B2B conversion potential.",
  },
  {
    name: "GetApp",
    url: "https://www.getapp.com/",
    category: "Directory",
    difficulty: "Medium",
    impact: "Medium",
    description: "Reach buyers searching category pages and software roundups.",
  },
  {
    name: "Peerlist",
    url: "https://peerlist.io/",
    category: "Community",
    difficulty: "Easy",
    impact: "Medium",
    description: "Builder-focused platform to launch products and collect feedback.",
  },
  {
    name: "HackerNoon",
    url: "https://hackernoon.com/",
    category: "Community",
    difficulty: "Medium",
    impact: "Medium",
    description: "Publish technical stories and link your product in relevant context.",
  },
  {
    name: "Dev.to",
    url: "https://dev.to/",
    category: "Community",
    difficulty: "Easy",
    impact: "Medium",
    description: "Share engineering-focused launch stories and tutorials.",
  },
  {
    name: "Twitter / X Build In Public",
    url: "https://x.com/",
    category: "Community",
    difficulty: "Medium",
    impact: "High",
    description: "Ship updates and launch threads to collect early beta users.",
  },
  {
    name: "LinkedIn Founder Posts",
    url: "https://www.linkedin.com/",
    category: "Community",
    difficulty: "Medium",
    impact: "High",
    description: "Distribute B2B launch stories and attract agency/SMB customers.",
  },
  {
    name: "Fazier",
    url: "https://fazier.com/",
    category: "Launch",
    difficulty: "Easy",
    impact: "Medium",
    description: "Quick launch portal for startup discovery and backlink acquisition.",
  },
  {
    name: "Uneed",
    url: "https://www.uneed.best/",
    category: "Launch",
    difficulty: "Easy",
    impact: "Medium",
    description: "Submit your product to reach startup-curious audiences.",
  },
  {
    name: "Launching Next",
    url: "https://www.launchingnext.com/",
    category: "Launch",
    difficulty: "Easy",
    impact: "Low",
    description: "Straightforward directory launch with basic referral traffic.",
  },
  {
    name: "Startup Stash",
    url: "https://startupstash.com/",
    category: "Directory",
    difficulty: "Medium",
    impact: "Medium",
    description: "Useful for evergreen category placement and long-tail discovery.",
  },
  {
    name: "Futurepedia",
    url: "https://www.futurepedia.io/",
    category: "Directory",
    difficulty: "Medium",
    impact: "High",
    description: "Relevant listing source for AI-adjacent products and workflows.",
  },
  {
    name: "Toolify",
    url: "https://www.toolify.ai/",
    category: "Directory",
    difficulty: "Easy",
    impact: "Medium",
    description: "AI tool listing traffic with strong long-tail discovery potential.",
  },
  {
    name: "Google Search Console",
    url: "https://search.google.com/search-console",
    category: "Tech Stack",
    difficulty: "Easy",
    impact: "Very High",
    description: "Core index coverage, performance, and URL inspection platform for technical SEO.",
  },
  {
    name: "Bing Webmaster Tools",
    url: "https://www.bing.com/webmasters/about",
    category: "Tech Stack",
    difficulty: "Easy",
    impact: "High",
    description: "Manage Bing indexing, diagnostics, and IndexNow visibility from one dashboard.",
  },
  {
    name: "Google Analytics (GA4)",
    url: "https://analytics.google.com/",
    category: "Tech Stack",
    difficulty: "Easy",
    impact: "Very High",
    description: "Behavior, attribution, and conversion tracking baseline for every growth workflow.",
  },
  {
    name: "Google AdSense",
    url: "https://www.google.com/adsense/start/",
    category: "Tech Stack",
    difficulty: "Medium",
    impact: "Medium",
    description: "Monetization layer for content sites with performance and revenue reporting.",
  },
  {
    name: "Google Tag Manager",
    url: "https://tagmanager.google.com/",
    category: "Tech Stack",
    difficulty: "Medium",
    impact: "High",
    description: "Ship tracking and event instrumentation quickly without app redeploys.",
  },
  {
    name: "Looker Studio",
    url: "https://lookerstudio.google.com/",
    category: "Tech Stack",
    difficulty: "Medium",
    impact: "High",
    description: "Build stakeholder dashboards combining GA4, GSC, Bing, and rank trackers.",
  },
  {
    name: "Ahrefs",
    url: "https://ahrefs.com/",
    category: "Tech Stack",
    difficulty: "Medium",
    impact: "Very High",
    description: "All-in-one suite for backlinks, keyword research, audits, and AI visibility monitoring.",
  },
  {
    name: "SEMrush",
    url: "https://www.semrush.com/",
    category: "Tech Stack",
    difficulty: "Medium",
    impact: "Very High",
    description: "SEO plus AI visibility and competitive intelligence for cross-channel growth.",
  },
  {
    name: "Ubersuggest",
    url: "https://neilpatel.com/ubersuggest/",
    category: "Tech Stack",
    difficulty: "Easy",
    impact: "Medium",
    description: "Lightweight keyword, traffic, and backlink discovery tool for faster starts.",
  },
  {
    name: "SE Ranking",
    url: "https://seranking.com/",
    category: "Tech Stack",
    difficulty: "Medium",
    impact: "High",
    description: "AI visibility tracking, rank monitoring, site audits, and agency reporting in one suite.",
  },
  {
    name: "Moz Pro",
    url: "https://moz.com/products/pro",
    category: "Tech Stack",
    difficulty: "Easy",
    impact: "High",
    description: "Keyword and link intelligence platform with strong authority metrics.",
  },
  {
    name: "Screaming Frog SEO Spider",
    url: "https://www.screamingfrog.co.uk/seo-spider/",
    category: "Tech Stack",
    difficulty: "Hard",
    impact: "Very High",
    description: "Technical crawl workhorse for audits, redirects, canonicals, and metadata validation.",
  },
  {
    name: "Sitebulb",
    url: "https://sitebulb.com/",
    category: "Tech Stack",
    difficulty: "Medium",
    impact: "High",
    description: "Visual technical auditing with prioritized issues and actionable crawl insights.",
  },
  {
    name: "ContentKing",
    url: "https://www.contentkingapp.com/",
    category: "Tech Stack",
    difficulty: "Medium",
    impact: "High",
    description: "24/7 SEO monitoring and alerting for sudden site changes that affect rankings.",
  },
  {
    name: "Similarweb",
    url: "https://www.similarweb.com/",
    category: "Tech Stack",
    difficulty: "Medium",
    impact: "High",
    description: "Competitive traffic intelligence for benchmarking acquisition channels and market share.",
  },
  {
    name: "Keyword.com",
    url: "https://keyword.com/",
    category: "Tech Stack",
    difficulty: "Easy",
    impact: "High",
    description: "SERP rank and AI visibility tracking with agency-friendly reporting workflows.",
  },
  {
    name: "Hotjar",
    url: "https://www.hotjar.com/",
    category: "Tech Stack",
    difficulty: "Easy",
    impact: "Medium",
    description: "Heatmaps and session recordings to diagnose UX friction hurting conversions.",
  },
  {
    name: "Microsoft Clarity",
    url: "https://clarity.microsoft.com/",
    category: "Tech Stack",
    difficulty: "Easy",
    impact: "Medium",
    description: "Free behavior analytics and replay data for landing-page optimization loops.",
  },
  {
    name: "Plausible Analytics",
    url: "https://plausible.io/",
    category: "Tech Stack",
    difficulty: "Easy",
    impact: "Medium",
    description: "Privacy-first analytics alternative with simpler dashboards and low overhead.",
  },
  {
    name: "Matomo",
    url: "https://matomo.org/",
    category: "Tech Stack",
    difficulty: "Medium",
    impact: "Medium",
    description: "Self-hosted analytics stack for teams that need ownership and compliance control.",
  },
  {
    name: "Google PageSpeed Insights",
    url: "https://pagespeed.web.dev/",
    category: "Tech Stack",
    difficulty: "Easy",
    impact: "High",
    description: "Core Web Vitals diagnostics linked to search performance and UX outcomes.",
  },
];

const seoMethods = [
  "Crawlability first: validate robots.txt, sitemap integrity, and canonical consistency.",
  "Indexation loop: submit critical URLs, inspect index status, and iterate from logs weekly.",
  "Content system: map pages to search intent clusters before publishing.",
  "Authority engine: build relevant mentions and backlinks with launch + directory cadence.",
  "Measurement discipline: connect GSC + GA4 + rank tracking before changing strategy.",
];

const problemPlaybooks = [
  {
    title: "Pages not indexed",
    signal: "URLs discovered but not indexed or delayed for days.",
    action: "Run indexability + sitemap checks, then push priority URLs via IndexNow/Bing batch.",
    href: "/sites",
    cta: "Open URL Manager",
  },
  {
    title: "Traffic dropped suddenly",
    signal: "Sharp clicks/impressions decline in recent 7-14 days.",
    action: "Validate crawl errors, server response changes, and submission failures from stream logs.",
    href: "/submissions",
    cta: "Open Submission Stream",
  },
  {
    title: "Weak keyword growth",
    signal: "Content published but rankings and qualified sessions stay flat.",
    action: "Use tools catalog and blog playbooks to improve intent targeting, internal links, and snippets.",
    href: "/tools",
    cta: "Open Free Tools",
  },
];

const hubLinks = [
  {
    title: "SEO Blogs & Playbooks",
    description: "Learn proven methods, checklists, and practical SEO workflows.",
    href: "/blogs",
    icon: BookOpen,
  },
  {
    title: "Free SEO Tools",
    description: "Run technical checks and generators across crawl, metadata, and authority.",
    href: "/tools",
    icon: Wrench,
  },
  {
    title: "Website Problem Scanner",
    description: "Track issues by site and move directly to fixes from dashboard workflows.",
    href: "/sites",
    icon: ShieldCheck,
  },
];

export default function ToolboxView() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", "Launch", "Community", "Directory", "Tech Stack"];

  const getTrackingUrl = (platform: DirectoryItem) => {
    return addUtmParams(
      platform.url,
      "indexfast",
      "toolbox",
      platform.category.toLowerCase(),
      platform.name.toLowerCase().replace(/\s+/g, "_")
    );
  };

  const filtered = useMemo(() => {
    return directories.filter((d) => {
      const matchesSearch =
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.category.toLowerCase().includes(search.toLowerCase()) ||
        d.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === "All" || d.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  const grouped = useMemo(() => {
    const fresh: Record<string, DirectoryItem[]> = { Launch: [], Community: [], Directory: [], "Tech Stack": [] };
    filtered.forEach((item) => {
      if (fresh[item.category]) {
        fresh[item.category].push(item);
      }
    });
    return fresh;
  }, [filtered]);

  const stats = useMemo(() => {
    return {
      total: directories.length,
      highImpact: directories.filter((d) => d.impact === "High" || d.impact === "Very High").length,
      easyWins: directories.filter((d) => d.difficulty === "Easy").length,
    };
  }, []);

  return (
    <div className="space-y-8 pb-12 pt-4">
      <PageHeader
        title="SEO Toolbox"
        description="Find launch channels plus the best SEO and analytics stack to monitor indexing, visibility, and growth."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {hubLinks.map((entry) => (
          <Card key={entry.title} className="border-border/40 bg-card/50 shadow-sm transition-all hover:bg-card/80 group">
            <CardContent className="p-5 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <entry.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-base font-black tracking-tight">{entry.title}</CardTitle>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed flex-grow mb-4">
                {entry.description}
              </p>
              <Button asChild variant="outline" className="w-fit gap-2 font-bold bg-background/50 border-border/40 hover:bg-primary/5 hover:text-primary hover:border-primary/20">
                <Link href={entry.href}>
                  Explore <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: "Platforms", value: stats.total, icon: Globe, color: "text-blue-500" },
          { label: "High Impact", value: stats.highImpact, icon: TrendingUp, color: "text-emerald-500" },
          { label: "Easy Wins", value: stats.easyWins, icon: Zap, color: "text-amber-500" },
        ].map((stat) => (
          <Card key={stat.label} className="border-border/40 bg-card/40">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                <p className="text-2xl font-black">{stat.value}</p>
              </div>
              <div className={cn("h-8 w-8 rounded-lg bg-background border border-border/20 flex items-center justify-center shadow-xs shrink-0", stat.color)}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/40 bg-card/30 backdrop-blur-sm overflow-hidden sticky top-14 z-20 shadow-lg">
        <CardContent className="p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by platform, category, or use case…"
              className="pl-10 h-11 bg-background/50 border-border/40 focus-visible:ring-primary/20 transition-all font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-bold tracking-tight transition-all",
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105"
                    : "bg-background/80 text-muted-foreground border border-border/40 hover:border-border/80 hover:bg-background"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <Card className="border-dashed border-2 border-border/40 bg-transparent py-20">
          <CardContent className="flex flex-col items-center text-center">
            <div className="h-20 w-20 rounded-full bg-muted/20 flex items-center justify-center mb-6">
              <Search className="h-10 w-10 text-muted-foreground opacity-50" />
            </div>
            <h3 className="text-2xl font-black tracking-tight mb-2">No matches found</h3>
            <p className="text-muted-foreground max-w-sm">
              Try a broader keyword or switch back to "All" categories to see what we have.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-12">
          {(Object.keys(grouped) as string[])
            .filter((cat) => grouped[cat].length > 0)
            .map((cat) => (
              <div key={cat} className="space-y-4">
                <div className="flex items-center gap-3 ml-1">
                  <div className="h-6 w-1 bg-primary rounded-full" />
                  <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                    {cat}
                    <Badge variant="outline" className="rounded-md font-black border-primary/20 text-primary bg-primary/5">
                      {grouped[cat].length}
                    </Badge>
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {grouped[cat].map((item) => (
                    <Card 
                      key={item.name} 
                      className="border-border/40 bg-card/40 transition-all hover:bg-card/70 hover:border-primary/20 group relative overflow-hidden"
                    >
                      <CardContent className="p-5 flex flex-col h-full">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-black tracking-tight group-hover:text-primary transition-colors leading-tight pr-8">
                            {item.name}
                          </h3>
                          <Link
                            href={getTrackingUrl(item)}
                            target="_blank"
                            className="absolute top-4 right-4 p-2 rounded-lg bg-background/50 border border-border/20 text-muted-foreground hover:text-primary hover:border-primary/30 transition-all hover:scale-110"
                            aria-label={`Open ${item.name}`}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed flex-grow mb-6">
                          {item.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-auto">
                          <Badge variant="secondary" className="px-2 py-0.5 text-[10px] font-black uppercase tracking-tighter bg-background/80 border border-border/10">
                            Impact: {item.impact}
                          </Badge>
                          <Badge variant="secondary" className="px-2 py-0.5 text-[10px] font-black uppercase tracking-tighter bg-background/80 border border-border/10">
                            Difficulty: {item.difficulty}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-12">
        <Card className="border-border/40 bg-card/20 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-black tracking-tight flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" /> Methods We Teach
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            {seoMethods.map((method) => (
              <div key={method} className="flex items-start gap-3 p-3 rounded-xl bg-background/40 border border-border/10">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="h-3 w-3 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">{method}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/20 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-black tracking-tight flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-500" /> Playbooks & Fixes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-2">
            {problemPlaybooks.map((playbook) => (
              <div key={playbook.title} className="p-4 rounded-xl bg-background/40 border border-border/10 group/item hover:bg-background/60 transition-colors">
                <h4 className="text-sm font-black tracking-tight mb-1 group-hover/item:text-primary transition-colors">{playbook.title}</h4>
                <p className="text-xs text-muted-foreground mb-3 opacity-70">Fix: {playbook.action}</p>
                <Button asChild size="sm" variant="ghost" className="h-8 px-0 hover:bg-transparent text-primary hover:text-primary/80 font-bold group">
                  <Link href={playbook.href}>
                    {playbook.cta} <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-none bg-primary/5 p-8 rounded-[2rem] relative overflow-hidden group mt-12">
        <div className="absolute -top-24 -right-24 h-64 w-64 bg-primary/10 rounded-full blur-[80px] transition-transform group-hover:scale-150 duration-1000" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 bg-emerald-500/5 rounded-full blur-[80px] transition-transform group-hover:scale-150 duration-1000" />
        
        <CardContent className="p-0 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="space-y-4 text-center md:text-left">
            <Badge className="bg-primary/20 text-primary hover:bg-primary/20 border-none font-black px-4 py-1 rounded-full uppercase tracking-widest text-[10px]">
              <Sparkles className="h-3 w-3 mr-2" /> Premium Strategy
            </Badge>
            <h3 className="text-3xl font-black tracking-tighter sm:text-4xl">Need a custom SEO strategy?</h3>
            <p className="text-muted-foreground max-w-lg mx-auto md:mx-0 leading-relaxed font-medium">
              Upgrade to our advanced dashboards for cluster mapping, internal link automation, and deep competitive intelligence.
            </p>
          </div>
          <Button asChild size="lg" className="h-14 px-8 rounded-2xl font-black shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all bg-primary hover:bg-primary/90 text-primary-foreground group">
            <Link href="/blogs">
              Read Guides <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
