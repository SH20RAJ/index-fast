"use client";

import { useState, useMemo, useActionState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Globe, 
  RefreshCw, 
  Trash2, 
  BarChart3, 
  Search,
  ExternalLink,
  ChevronRight,
  MoreVertical,
  Activity,
  ArrowUpRight,
  Plus
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import PageHeader from "@/components/dashboard/PageHeader";
import {
  deleteWebsiteAction,
  runWebsiteSyncAction,
} from "@/app/(dashboard)/actions";
import { defaultActionState, type ActionState } from "@/app/(dashboard)/action-state";

interface WebsiteRecord {
  id: string;
  url: string;
  sitemapUrl: string | null;
  indexNowKey: string | null;
  bingApiKey: string | null;
  yandexToken: string | null;
  baiduToken: string | null;
  naverToken: string | null;
  siteHealth: unknown;
  lastSyncAt: Date | null;
}

interface SitesViewProps {
  initialSites: WebsiteRecord[];
  planName: string;
  websiteLimit: number;
}

export default function SitesView({ initialSites, planName, websiteLimit }: SitesViewProps) {
  const [siteSearchQuery, setSiteSearchQuery] = useState("");

  const [syncState, syncAction, syncPending] = useActionState<ActionState, FormData>(
    runWebsiteSyncAction,
    defaultActionState
  );
  const [deleteState, deleteAction, deletePending] = useActionState<ActionState, FormData>(
    deleteWebsiteAction,
    defaultActionState
  );

  const filteredSites = useMemo(() => {
    const query = siteSearchQuery.trim().toLowerCase();
    if (!query) return initialSites;
    return initialSites.filter((site) =>
      site.url.toLowerCase().includes(query)
    );
  }, [initialSites, siteSearchQuery]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Your Websites</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your connected properties and monitoring.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border border-border/50">
             {initialSites.length} / {websiteLimit} Used
          </div>
          <Button asChild className="rounded-full font-bold h-10 px-6 gap-2">
            <Link href="/sites/new">
              <Plus className="h-4 w-4" />
              Add Website
            </Link>
          </Button>
        </div>
      </div>

      <div className="relative group max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
        <Input
          value={siteSearchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSiteSearchQuery(e.target.value)}
          placeholder="Filter sites..."
          className="pl-10 h-10 bg-muted/30 border-none rounded-xl focus-visible:ring-1 focus-visible:ring-primary/20"
        />
      </div>

      <div className="grid gap-3 mt-8">
        {filteredSites.length === 0 ? (
          <div className="py-20 text-center rounded-[32px] bg-muted/20 border-2 border-dashed border-border/50">
            <Globe className="mx-auto h-8 w-8 text-muted-foreground/30" />
            <p className="mt-4 text-sm font-medium text-muted-foreground">No websites found.</p>
          </div>
        ) : (
          filteredSites.map((site) => (
            <div 
              key={site.id} 
              className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-card border border-border/50 rounded-2xl hover:border-primary/20 hover:shadow-sm transition-all gap-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0 border border-primary/10">
                  <Globe className="h-5 w-5 text-primary/70" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm truncate">{new URL(site.url).hostname}</h3>
                  <div className="flex items-center gap-3 mt-0.5">
                    <p className="text-[10px] text-muted-foreground truncate max-w-[150px]">{site.url}</p>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground/60">
                      <Activity className="h-3 w-3" />
                      <span>{site.lastSyncAt ? new Date(site.lastSyncAt).toLocaleDateString() : 'Never synced'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:ml-auto">
                <Button asChild variant="ghost" size="sm" className="h-9 rounded-lg text-xs font-bold gap-1.5 px-3">
                  <Link href={`/sites/${site.id}`}>
                    Manage <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </Button>
                
                <div className="flex items-center border-l border-border/50 pl-2 gap-1">
                  <form action={syncAction}>
                    <input type="hidden" name="websiteId" value={site.id} />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5"
                      title="Sync Site"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </Button>
                  </form>
                  
                  <Button asChild variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5" title="SEO Audit">
                    <Link href={`/sites/${site.id}/audit`}>
                      <BarChart3 className="h-3.5 w-3.5" />
                    </Link>
                  </Button>

                  <form action={deleteAction}>
                    <input type="hidden" name="websiteId" value={site.id} />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50"
                      title="Delete Site"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
