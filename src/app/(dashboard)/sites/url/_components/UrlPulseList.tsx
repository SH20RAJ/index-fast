"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface UrlItem {
  id: string;
  url: string;
  isIndexed: boolean | null;
  lastDetectedAt: string | null;
}

interface UrlPulseListProps {
  inventoryUrls: UrlItem[];
  sitemapUrls: string[];
  onExport: (format: "csv" | "json") => void;
}

export default function UrlPulseList({ inventoryUrls, sitemapUrls, onExport }: UrlPulseListProps) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 25;

  const allUrls = useMemo(() => {
    const list: Array<UrlItem | string> = [...inventoryUrls];
    // Only add sitemap URLs if inventory is small (or we can just combine them all)
    // For simplicity, let's combine and deduplicate by URL string
    const existingUrlStrings = new Set(inventoryUrls.map(u => u.url));
    sitemapUrls.forEach(url => {
      if (!existingUrlStrings.has(url)) {
        list.push(url);
      }
    });
    return list;
  }, [inventoryUrls, sitemapUrls]);

  const totalPages = Math.ceil(allUrls.length / itemsPerPage);
  const paginatedItems = allUrls.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Inventory Pulse</h3>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => onExport("csv")} 
            className="h-8 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-rose-500"
          >
            CSV
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => onExport("json")} 
            className="h-8 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-rose-500"
          >
            JSON
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900/40 rounded-[32px] border border-zinc-100 dark:border-white/5 overflow-hidden">
        <div className="divide-y divide-zinc-50 dark:divide-white/5">
          {paginatedItems.map((item, idx) => {
            const url = typeof item === "object" ? item.url : item;
            const isIndexed = typeof item === "object" && item.isIndexed;
            const lastDetected = typeof item === "object" && item.lastDetectedAt 
              ? new Date(item.lastDetectedAt).toLocaleDateString() 
              : "Syncing...";

            return (
              <div key={idx} className="p-4 md:px-8 md:py-5 flex items-center justify-between hover:bg-zinc-50/50 dark:hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-4 min-w-0">
                  <div className={cn(
                    "h-1.5 w-1.5 rounded-full shrink-0",
                    isIndexed ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" : "bg-zinc-200 dark:bg-zinc-800"
                  )} />
                  <p className="text-xs font-light text-zinc-500 truncate">{url}</p>
                </div>
                <span className="ml-4 shrink-0 text-[10px] font-bold text-zinc-300 tabular-nums uppercase tracking-widest">
                  {lastDetected}
                </span>
              </div>
            );
          })}
          {paginatedItems.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-xs text-zinc-400 italic">No URLs found in the stream.</p>
            </div>
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center pt-4 gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="rounded-full px-4 text-xs font-bold uppercase tracking-widest" 
            onClick={() => setPage(p => Math.max(1, p - 1))} 
            disabled={page === 1}
          >
            Prev
          </Button>
          <div className="flex items-center px-4 text-xs font-bold text-zinc-400">{page} / {totalPages}</div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="rounded-full px-4 text-xs font-bold uppercase tracking-widest" 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </section>
  );
}
