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
  {
    name: "Brave Search Submission",
    url: "https://search.brave.com/submit-url",
    category: "Tech Stack",
    difficulty: "Easy",
    impact: "Medium",
    description: "Submit your site directly to Brave Search for faster discovery and indexing.",
  },
  {
    name: "SubmitExpress",
    url: "https://www.submitexpress.com/free-tools/free-website-submission/",
    category: "Directory",
    difficulty: "Easy",
    impact: "Low",
    description: "A free submission tool to notify multiple search engines and directories about your site.",
  },
  {
    name: "Free Search Engine Submission (LowestHosting)",
    url: "https://www.lowesthosting.com/sesubmit/",
    category: "Directory",
    difficulty: "Easy",
    impact: "Medium",
    description: "Submit your website to over 140 search engines including Google, Bing, and Yahoo simultaneously.",
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
    <div className="space-y-12 pb-16 pt-4 max-w-6xl mx-auto px-6">
      <PageHeader
        title="Toolbox"
        description="The ultimate stack for search visibility and growth."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {hubLinks.map((entry) => (
          <Link key={entry.title} href={entry.href} className="group">
            <Card className="h-full border-zinc-100 dark:border-white/5 bg-white dark:bg-zinc-900/40 transition-all hover:shadow-xl hover:shadow-black/5 rounded-[32px] overflow-hidden">
              <CardContent className="p-8 space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-zinc-50 dark:bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-rose-500 transition-colors">
                  <entry.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">{entry.title}</h3>
                  <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">
                    {entry.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
          <h2 className="text-xl font-light tracking-tight text-zinc-900 dark:text-zinc-100">Growth Directory</h2>
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
            <Input
              placeholder="Search platforms..."
              className="pl-10 h-11 bg-white border-zinc-200 rounded-xl focus-visible:ring-rose-500/20 dark:bg-white/5 dark:border-white/10"
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 px-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all",
                activeCategory === cat
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-lg"
                  : "bg-zinc-100 text-zinc-500 dark:bg-white/5 dark:text-zinc-400 hover:bg-zinc-200"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <Card 
              key={item.name} 
              className="group relative rounded-[32px] border-zinc-100 dark:border-white/5 bg-white dark:bg-zinc-900/40 transition-all hover:shadow-xl hover:shadow-black/5"
            >
              <CardContent className="p-8 flex flex-col h-full space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 pr-8 tracking-tight">{item.name}</h3>
                  <a href={getTrackingUrl(item)} target="_blank" className="text-zinc-300 hover:text-rose-500 transition-colors">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-light leading-relaxed flex-grow">
                  {item.description}
                </p>
                <div className="flex gap-3 pt-2">
                  <Badge variant="secondary" className="bg-zinc-50 text-zinc-400 dark:bg-white/5 border-none text-[9px] font-bold uppercase tracking-widest">
                    {item.impact}
                  </Badge>
                  <Badge variant="secondary" className="bg-zinc-50 text-zinc-400 dark:bg-white/5 border-none text-[9px] font-bold uppercase tracking-widest">
                    {item.difficulty}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <section className="pt-12 grid gap-12 lg:grid-cols-2">
        <div className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-400 px-1">Digital Methods</h3>
          <div className="space-y-4">
            {seoMethods.map((method) => (
              <div key={method} className="flex items-start gap-4 p-6 rounded-[24px] bg-zinc-50/50 dark:bg-white/[0.02] border border-zinc-100 dark:border-white/5">
                <CheckCircle2 className="h-4 w-4 text-pink-500 mt-0.5" />
                <p className="text-sm text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">{method}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-400 px-1">Problem Playbooks</h3>
          <div className="grid gap-4">
            {problemPlaybooks.map((playbook) => (
              <Link key={playbook.title} href={playbook.href} className="group">
                <div className="p-6 rounded-[24px] bg-white dark:bg-zinc-900/40 border border-zinc-100 dark:border-white/5 transition-all group-hover:shadow-lg group-hover:shadow-black/5">
                  <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-rose-500 transition-colors">{playbook.title}</h4>
                  <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">{playbook.action}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
