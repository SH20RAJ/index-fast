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
      color: hasIndexNowKey ? "text-emerald-500" : "text-zinc-400" 
    },
    { 
      label: "Bing API", 
      value: hasBingApiKey ? "Ready" : "Off", 
      color: hasBingApiKey ? "text-emerald-500" : "text-zinc-400" 
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div key={stat.label} className="space-y-1 px-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{stat.label}</p>
          <p className={cn("text-2xl font-light tracking-tight text-zinc-900 dark:text-zinc-100", stat.color)}>
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
