"use client";

import { cn } from "@/lib/utils";

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
    { label: "Inventory", value: inventoryTotal },
    { label: "Sitemap", value: sitemapCount },
    { 
      label: "IndexNow", 
      value: hasIndexNowKey ? "Active" : "Off", 
      color: hasIndexNowKey ? "text-pink-500" : "text-zinc-400" 
    },
    { 
      label: "Bing API", 
      value: hasBingApiKey ? "Ready" : "Off", 
      color: hasBingApiKey ? "text-pink-500" : "text-zinc-400" 
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="p-4 rounded-2xl bg-card border border-border/50 space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
          <p className={cn("text-2xl font-serif font-bold tracking-tight text-foreground", stat.color && !stat.color.includes("zinc") ? "text-primary" : "")}>
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
