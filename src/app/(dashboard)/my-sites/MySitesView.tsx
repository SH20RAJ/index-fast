"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Globe, 
  Search,
  ArrowUpRight,
  Plus,
  Activity,
  MoreVertical,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface DashboardSiteSummary {
  id: string;
  name: string;
  domain: string;
  url: string;
  sitemapUrl: string | null;
  lastSyncAt: Date | null;
  indexNowVerified: boolean;
  bingApiKeyLastFour: string | null;
  autoIndexingEnabled: boolean;
  sourceCount: number;
}

interface MySitesViewProps {
  initialSites: DashboardSiteSummary[];
}

export default function MySitesView({ initialSites }: MySitesViewProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSites = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return initialSites;
    return initialSites.filter((site) =>
      site.name?.toLowerCase().includes(query) || 
      site.url.toLowerCase().includes(query)
    );
  }, [initialSites, searchQuery]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">My Sites</h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">Manage and monitor all your connected properties.</p>
        </div>
        <Button asChild className="rounded-full font-bold h-11 px-6 shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-105 active:scale-95">
          <Link href="/sites/new">
            <Plus className="mr-2 h-5 w-5" />
            Add Website
          </Link>
        </Button>
      </div>

      <div className="relative group max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
        <Input
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          placeholder="Search by name or URL..."
          className="pl-11 h-12 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm focus-visible:ring-primary/20"
        />
      </div>

      <div className="grid gap-4 mt-8">
        {filteredSites.length === 0 ? (
          <div className="py-24 text-center rounded-[32px] bg-zinc-50/50 dark:bg-white/5 border-2 border-dashed border-zinc-200 dark:border-zinc-800">
            <div className="h-16 w-16 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-6">
              <Globe className="h-8 w-8 text-primary/40" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">No websites found</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-[280px] mx-auto">
              Start by adding your first website to monitor its indexing status.
            </p>
            <Button asChild className="mt-8 rounded-full h-11 px-8 font-bold">
              <Link href="/sites/new">Add your first site</Link>
            </Button>
          </div>
        ) : (
          filteredSites.map((site) => (
            <Link 
              key={site.id} 
              href={`/sites/${site.id}`}
              className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800/60 rounded-[24px] hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all gap-4 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative flex items-center gap-5 min-w-0">
                <div className="h-12 w-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center shrink-0 border border-zinc-100 dark:border-zinc-800 group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
                  <Globe className="h-6 w-6 text-zinc-400 group-hover:text-primary transition-colors" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 truncate">
                      {site.name || new URL(site.url).hostname}
                    </h3>
                    {site.autoIndexingEnabled && (
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-xs text-muted-foreground font-medium truncate max-w-[200px]">{site.url}</p>
                    <div className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      {site.sourceCount} Sources
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative flex items-center gap-3 sm:ml-auto">
                <div className="hidden sm:flex flex-col items-end mr-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Last Sync</span>
                  <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                    {site.lastSyncAt ? new Date(site.lastSyncAt).toLocaleDateString() : 'Never'}
                  </span>
                </div>
                
                <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                  <ArrowUpRight className="h-5 w-5" />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
