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

import { 
  ChevronLeft, 
  ChevronRight, 
  Download,
  Link as LinkIcon,
  Copy,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";

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
  const itemsPerPage = 20;

  const allUrls = useMemo(() => {
    const list: Array<UrlItem | string> = [...inventoryUrls];
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("URL copied to clipboard");
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Data Inventory</h3>
          <h2 className="text-xl font-serif font-bold tracking-tight mt-1">Live URL Pulse</h2>
        </div>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onExport("csv")} 
            className="h-9 rounded-xl text-[10px] font-bold uppercase tracking-widest border-border/50 hover:bg-zinc-50 dark:hover:bg-white/5 gap-2"
          >
            <Download className="h-3 w-3" />
            CSV
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onExport("json")} 
            className="h-9 rounded-xl text-[10px] font-bold uppercase tracking-widest border-border/50 hover:bg-zinc-50 dark:hover:bg-white/5 gap-2"
          >
            <Download className="h-3 w-3" />
            JSON
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-white/5 rounded-[2.5rem] border border-border/40 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/40 bg-zinc-50/50 dark:bg-white/[0.02]">
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">URL Status</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">Address</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 text-right">Detected</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {paginatedItems.map((item, idx) => {
                const url = typeof item === "object" ? item.url : item;
                const isIndexed = typeof item === "object" && item.isIndexed;
                const lastDetected = typeof item === "object" && item.lastDetectedAt 
                  ? new Date(item.lastDetectedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                  : "Sync Pending";

                return (
                  <tr key={idx} className="group hover:bg-zinc-50/50 dark:hover:bg-white/[0.01] transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "h-2 w-2 rounded-full",
                          isIndexed ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-zinc-200 dark:bg-zinc-800"
                        )} />
                        <span className={cn(
                          "text-[10px] font-bold uppercase tracking-widest",
                          isIndexed ? "text-emerald-600" : "text-muted-foreground/60"
                        )}>
                          {isIndexed ? "Indexed" : "Detected"}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 min-w-[300px] max-w-[500px]">
                      <div className="flex items-center gap-3">
                        <p className="text-xs font-medium text-foreground truncate flex-1">{url}</p>
                        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => copyToClipboard(url)}
                            className="p-1.5 rounded-lg hover:bg-zinc-200/50 dark:hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                            title="Copy URL"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                          <a 
                            href={url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg hover:bg-zinc-200/50 dark:hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                            title="Open URL"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <span className="text-[10px] font-bold text-muted-foreground/60 tabular-nums uppercase tracking-widest">
                        {lastDetected}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {paginatedItems.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                       <LinkIcon className="h-6 w-6 text-muted-foreground/20" />
                       <p className="text-sm text-muted-foreground font-medium italic">No discovered URLs in the stream yet.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 pt-2">
          <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-1.5">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-9 w-9 rounded-xl border-border/50" 
              onClick={() => setPage(p => Math.max(1, p - 1))} 
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-9 w-9 rounded-xl border-border/50" 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
