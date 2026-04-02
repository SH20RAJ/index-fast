"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle2, 
  AlertCircle, 
  History, 
  Search, 
  Filter,
  Globe,
  Database,
  Clock,
  ArrowUpRight
} from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import { cn } from "@/lib/utils";

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

export default function SubmissionsView({ initialRows }: SubmissionsViewProps) {
  const [rows] = useState<SubmissionRow[]>(initialRows);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [engineFilter, setEngineFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    return rows.filter((row) => {
      const statusOk = statusFilter === "all" || row.status === statusFilter;
      const engineOk = engineFilter === "all" || row.engine === engineFilter;
      return statusOk && engineOk;
    });
  }, [rows, statusFilter, engineFilter]);

  const totals = useMemo(() => {
    return {
      all: rows.length,
      success: rows.filter((r) => r.status === "success").length,
      failed: rows.filter((r) => r.status === "failed").length,
      pending: rows.filter((r) => r.status === "pending").length,
    };
  }, [rows]);

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
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Submissions"
        description="Monitor every IndexNow, Bing, and ping submission in one timeline."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Submissions", value: totals.all, icon: Database, color: "text-blue-500" },
          { label: "Success", value: totals.success, icon: CheckCircle2, color: "text-emerald-500" },
          { label: "Failed", value: totals.failed, icon: AlertCircle, color: "text-red-500" },
          { label: "Pending", value: totals.pending, icon: Clock, color: "text-amber-500" },
        ].map((item) => (
          <Card key={item.label} className="border-border/40 bg-card/50 shadow-sm transition-all hover:bg-card/80">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{item.label}</p>
                <p className="text-2xl font-black mt-1 tracking-tight">{item.value}</p>
              </div>
              <div className={cn("p-2 rounded-xl bg-background border border-border/20 shadow-xs", item.color)}>
                <item.icon className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/40 bg-card/30 backdrop-blur-sm">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-end">
          <div className="w-full space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Status Filter</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full bg-background/50 border-border/40">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Engine Filter</label>
            <Select value={engineFilter} onValueChange={setEngineFilter}>
              <SelectTrigger className="w-full bg-background/50 border-border/40">
                <SelectValue placeholder="All engines" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All engines</SelectItem>
                <SelectItem value="indexnow">IndexNow</SelectItem>
                <SelectItem value="bing">Bing</SelectItem>
                <SelectItem value="google">Google</SelectItem>
                <SelectItem value="pingomatic">Ping-o-Matic</SelectItem>
                <SelectItem value="pingler">Pingler</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {rows.length === 0 || filtered.length === 0 ? (
          <Card className="border-dashed border-2 border-border/40 bg-transparent py-16">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <div className="h-16 w-16 rounded-full bg-muted/20 flex items-center justify-center mb-4">
                <History className="h-8 w-8 text-muted-foreground opacity-50" />
              </div>
              <h3 className="text-xl font-black tracking-tight mb-1">No submissions found</h3>
              <p className="max-w-[280px] text-sm text-muted-foreground leading-relaxed">
                Run a website sync to generate your first submission log.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {filtered.map((row) => (
              <Card 
                key={row.id} 
                className={cn(
                  "border-border/40 bg-card/40 transition-all hover:bg-card/60 hover:border-border/60 group",
                  row.status === "failed" && "border-red-500/20"
                )}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Globe className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-bold tracking-tight group-hover:text-primary transition-colors truncate max-w-[200px] sm:max-w-md">
                            {row.websiteUrl}
                          </p>
                          <p className="text-[10px] font-medium text-muted-foreground opacity-70 flex items-center gap-1">
                            {row.createdAt ? new Date(row.createdAt).toLocaleString() : "Unknown time"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="px-2 py-0 text-[10px] font-black uppercase tracking-tighter">
                          {row.engine}
                        </Badge>
                        {getStatusBadge(row.status)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/40 border border-border/20">
                      <ArrowUpRight className="h-3 w-3 text-muted-foreground shrink-0" />
                      <p className="text-xs font-mono text-muted-foreground truncate w-full">{row.url}</p>
                    </div>

                    {row.errorMessage && (
                      <Alert className="bg-red-500/5 border-red-500/20 p-3">
                        <AlertDescription className="text-xs text-red-600 font-semibold flex items-center gap-2">
                          <AlertCircle className="h-3.5 w-3.5" />
                          {row.errorMessage}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
