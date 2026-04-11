"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  AlertCircle,
  History,
  Globe,
  Database,
  Clock,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import { cn } from "@/lib/utils";

import { useSiteContext } from "@/components/dashboard/SiteContext";

type SubmissionRow = {
  id: string;
  url: string;
  engine: "bing" | "indexnow" | "google" | "pingomatic" | "pingler";
  status: "success" | "failed" | "pending";
  errorMessage: string | null;
  createdAt: string | null;
  websiteId: string;
  websiteUrl: string;
};

interface SubmissionsViewProps {
  initialRows: SubmissionRow[];
}

const PAGE_SIZE = 20;

export default function SubmissionsView({ initialRows }: SubmissionsViewProps) {
  const { selectedSite } = useSiteContext();
  const [rows] = useState<SubmissionRow[]>(initialRows);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [engineFilter, setEngineFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  const siteFilteredRows = useMemo(() => {
    if (!selectedSite) return [];
    return rows.filter((r) => r.websiteId === selectedSite.id);
  }, [rows, selectedSite]);

  const filtered = useMemo(() => {
    return siteFilteredRows.filter((row) => {
      const statusOk = statusFilter === "all" || row.status === statusFilter;
      const engineOk = engineFilter === "all" || row.engine === engineFilter;
      return statusOk && engineOk;
    });
  }, [siteFilteredRows, statusFilter, engineFilter]);

  // Reset to page 1 when a filter changes
  const handleStatusFilter = (v: string | number | any) => {
    setStatusFilter(String(v));
    setPage(1);
  };
  const handleEngineFilter = (v: string | number | any) => {
    setEngineFilter(String(v));
    setPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const totals = useMemo(
    () => ({
      all: siteFilteredRows.length,
      success: siteFilteredRows.filter((r) => r.status === "success").length,
      failed: siteFilteredRows.filter((r) => r.status === "failed").length,
      pending: siteFilteredRows.filter((r) => r.status === "pending").length,
    }),
    [siteFilteredRows]
  );

  // Page number list: always include 1, totalPages, and current ±2
  const pageNumbers = useMemo(() => {
    const nums = new Set<number>();
    nums.add(1);
    nums.add(totalPages);
    for (let i = safePage - 2; i <= safePage + 2; i++) {
      if (i >= 1 && i <= totalPages) nums.add(i);
    }
    return Array.from(nums).sort((a, b) => a - b);
  }, [safePage, totalPages]);

  const getStatusBadge = (status: SubmissionRow["status"]) => {
    switch (status) {
      case "success":
        return (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 gap-1 font-bold">
            <CheckCircle2 className="h-3 w-3" /> SUCCESS
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20 gap-1 font-bold">
            <AlertCircle className="h-3 w-3" /> FAILED
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 gap-1 font-bold">
            <Clock className="h-3 w-3" /> PENDING
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-5xl">
      <PageHeader
        title="Timeline"
        description="Every submission and indexing signal, chronicled in real-time."
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total", value: totals.all, icon: Database },
          { label: "Success", value: totals.success, icon: CheckCircle2, color: "text-emerald-500" },
          { label: "Failed", value: totals.failed, icon: AlertCircle, color: "text-rose-500" },
          { label: "Pending", value: totals.pending, icon: Clock, color: "text-amber-500" },
        ].map((item) => (
          <div key={item.label} className="space-y-1 px-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{item.label}</p>
            <p className={cn("text-3xl font-light tracking-tight text-zinc-900 dark:text-zinc-100", item.color)}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Filters simplified */}
      <div className="flex flex-wrap gap-3">
        <div className="w-40">
          <Select 
            value={statusFilter} 
            onChange={handleStatusFilter}
            options={[
              { label: "All statuses", value: "all" },
              { label: "Success", value: "success" },
              { label: "Failed", value: "failed" },
              { label: "Pending", value: "pending" },
            ]}
            className="w-full h-10"
          />
        </div>
        <div className="w-40">
          <Select 
            value={engineFilter} 
            onChange={handleEngineFilter}
            options={[
              { label: "All engines", value: "all" },
              { label: "IndexNow", value: "indexnow" },
              { label: "Bing", value: "bing" },
              { label: "Google", value: "google" },
              { label: "Ping-o-Matic", value: "pingomatic" },
              { label: "Pingler", value: "pingler" },
            ]}
            className="w-full h-10"
          />
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {rows.length === 0 || filtered.length === 0 ? (
          <div className="py-20 text-center rounded-[32px] bg-zinc-50/50 border-2 border-dashed border-zinc-200 dark:bg-white/[0.02] dark:border-white/5">
            <History className="mx-auto h-8 w-8 text-zinc-200" />
            <p className="mt-4 text-sm font-light text-zinc-500">The timeline is currently empty.</p>
          </div>
        ) : (
          <div className="bg-white rounded-[32px] border border-zinc-100 overflow-hidden dark:bg-zinc-900/40 dark:border-white/5 shadow-sm">
            <div className="divide-y divide-zinc-50 dark:divide-white/5">
              {paginated.map((row) => (
                <div key={row.id} className="p-5 md:p-6 hover:bg-zinc-50/50 dark:hover:bg-white/[0.02] transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-3">
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{row.websiteUrl}</p>
                        <Badge variant="secondary" className="bg-zinc-100 text-zinc-500 dark:bg-white/5 dark:text-zinc-400 border-none font-bold text-[9px] uppercase tracking-wider h-5 px-1.5">
                          {row.engine}
                        </Badge>
                      </div>
                      <p className="text-xs text-zinc-400 font-light truncate">{row.url}</p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-[10px] text-zinc-400 font-light">{row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "Unknown"}</span>
                      <div className="flex items-center gap-2">
                        {row.status === "success" ? (
                          <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
                        ) : row.status === "failed" ? (
                          <div className="h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.4)]" />
                        ) : (
                          <div className="h-2 w-2 rounded-full bg-amber-500" />
                        )}
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                          {row.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  {row.errorMessage && (
                    <div className="mt-3 p-3 bg-rose-500/5 rounded-xl border border-rose-500/10">
                      <p className="text-xs text-rose-500 font-medium leading-relaxed">
                        {row.errorMessage}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Pagination simplified ... */}
        {totalPages > 1 && (
          <div className="flex justify-center pt-6 gap-2">
            <Button variant="ghost" size="sm" className="rounded-full px-4 text-xs font-bold uppercase tracking-widest" onClick={() => setPage(p => Math.max(1, p-1))} disabled={safePage === 1}>Prev</Button>
            <div className="flex items-center px-4 text-xs font-bold text-zinc-400">
              {safePage} / {totalPages}
            </div>
            <Button variant="ghost" size="sm" className="rounded-full px-4 text-xs font-bold uppercase tracking-widest" onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={safePage === totalPages}>Next</Button>
          </div>
        )}
      </div>
    </div>
  );
}
