"use client";

import Link from "next/link";
import { Website } from "@/components/dashboard/types";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Globe, 
  Zap, 
  RefreshCw, 
  Search, 
  BarChart3, 
  Trash2,
  ExternalLink,
  ShieldCheck,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SiteCardProps {
  site: Website;
  onSync: (id: string) => void;
  onOpenGsc?: (id: string) => void;
  onDeleteSite?: (id: string) => void;
}

export default function SiteCard({ site, onSync, onOpenGsc, onDeleteSite }: SiteCardProps) {
  const hostname = new URL(site.url).hostname;

  return (
    <Card className="group relative overflow-hidden border-border/40 bg-card/30 backdrop-blur-sm transition-all hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 rounded-[24px]">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/5 text-primary border border-primary/10 shadow-inner group-hover:scale-110 transition-transform duration-500">
                <Globe className="h-6 w-6 stroke-[1.5px]" />
              </div>
              {site.isPro && (
                <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20 border-2 border-background">
                  <Zap className="h-3 w-3 text-primary-foreground fill-primary-foreground" />
                </div>
              )}
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-tighter leading-none group-hover:text-primary transition-colors">
                  {hostname}
                </h3>
                {site.isPro && (
                  <Badge variant="secondary" className="h-5 px-1.5 text-[9px] font-black uppercase tracking-widest bg-primary/10 text-primary border-none">
                    Pro
                  </Badge>
                )}
              </div>
              <p className="text-xs font-medium text-muted-foreground/60 flex items-center gap-1.5">
                {site.url}
                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 md:gap-8">
            <div className="hidden lg:flex flex-col items-end gap-1">
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/40">Last Sync</span>
              <div className="flex items-center gap-1.5 text-xs font-bold">
                <Activity className="h-3 w-3 text-emerald-500" />
                {site.lastSyncAt ? new Date(site.lastSyncAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : "Not synced"}
              </div>
            </div>

            <div className="h-10 w-px bg-border/40 hidden md:block" />

            <div className="flex items-center gap-2">
              <TooltipProvider>
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onSync(site.id)}
                        className="h-10 w-10 rounded-xl bg-primary/5 text-primary hover:bg-primary hover:text-primary-foreground transition-all active:scale-95 shadow-sm"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="font-bold">Sync Sitemap</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="h-10 w-10 rounded-xl bg-emerald-500/5 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all active:scale-95 shadow-sm"
                      >
                        <Link href={`/sites/${site.id}/audit`}>
                          <BarChart3 className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="font-bold">AI SEO Audit</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={onOpenGsc ? () => onOpenGsc(site.id) : undefined}
                        disabled={!onOpenGsc}
                        className="h-10 w-10 rounded-xl bg-blue-500/5 text-blue-600 hover:bg-blue-500 hover:text-white transition-all active:scale-95 shadow-sm"
                      >
                        <Search className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="font-bold">GSC Insights</TooltipContent>
                  </Tooltip>

                  <div className="w-px h-6 bg-border/40 mx-1" />

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={onDeleteSite ? () => onDeleteSite(site.id) : undefined}
                        disabled={!onDeleteSite}
                        className="h-10 w-10 rounded-xl bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-95 shadow-sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="font-bold">Remove Site</TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </CardContent>
      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </Card>
  );
}