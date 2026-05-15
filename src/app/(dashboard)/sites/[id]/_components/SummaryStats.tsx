"use client";

import { cn } from "@/lib/utils";

import { Card, CardContent } from "@/components/ui/card";
import { 
  Database, 
  Map as MapIcon, 
  Zap, 
  Search,
  CheckCircle2,
  XCircle
} from "lucide-react";

interface SummaryStatsProps {
  inventoryTotal: number;
  sitemapCount: number;
  hasIndexNowKey: boolean;
  hasBingApiKey: boolean;
}

export default function SummaryStats({ 
  inventoryTotal, 
  sitemapCount, 
  hasIndexNowKey, 
  hasBingApiKey 
}: SummaryStatsProps) {
  const stats = [
    { 
      label: "Inventory", 
      value: inventoryTotal, 
      sub: "URLs discovered",
      icon: Database,
      color: "text-blue-500",
      bg: "bg-blue-500/5"
    },
    { 
      label: "Sitemap", 
      value: sitemapCount, 
      sub: "Active pages",
      icon: MapIcon,
      color: "text-amber-500",
      bg: "bg-amber-500/5"
    },
    { 
      label: "IndexNow", 
      value: hasIndexNowKey ? "Active" : "Disabled", 
      sub: "Instant push",
      icon: Zap,
      color: hasIndexNowKey ? "text-pink-500" : "text-zinc-400",
      bg: hasIndexNowKey ? "bg-pink-500/5" : "bg-zinc-500/5",
      status: hasIndexNowKey ? "success" : "off"
    },
    { 
      label: "Bing API", 
      value: hasBingApiKey ? "Connected" : "Off", 
      sub: "Webmaster tools",
      icon: Search,
      color: hasBingApiKey ? "text-purple-500" : "text-zinc-400",
      bg: hasBingApiKey ? "bg-purple-500/5" : "bg-zinc-500/5",
      status: hasBingApiKey ? "success" : "off"
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="group border-none bg-zinc-50/50 dark:bg-white/5 overflow-hidden rounded-[2rem] hover:shadow-xl hover:shadow-zinc-900/5 transition-all duration-500">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <div className={cn("p-2.5 rounded-2xl w-fit transition-transform group-hover:scale-110 duration-500", stat.bg)}>
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</p>
                    {stat.status === "success" && <CheckCircle2 className="h-3 w-3 text-emerald-500" />}
                    {stat.status === "off" && <XCircle className="h-3 w-3 text-zinc-300" />}
                  </div>
                  <h3 className="text-2xl font-serif font-bold tracking-tight mt-1">{stat.value}</h3>
                  <p className="text-[10px] text-muted-foreground/60 font-medium mt-0.5">{stat.sub}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
