"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  RefreshCcw, 
  Copy,
  Check,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface AuditIssue {
  type: "error" | "warning" | "info";
  title: string;
  description: string;
  recommendation: string;
  cursorPrompt: string;
}

interface AuditPanelProps {
  websiteId: string;
  initialResult?: {
    score: number;
    issues: AuditIssue[];
  };
}

function normalizeAuditResult(input: unknown) {
  if (!input || typeof input !== "object") {
    return null;
  }

  const candidate = input as { score?: unknown; issues?: unknown };
  return {
    score: typeof candidate.score === "number" ? candidate.score : 0,
    issues: Array.isArray(candidate.issues) ? (candidate.issues as AuditIssue[]) : [],
  };
}

export default function AuditPanel({ websiteId, initialResult }: AuditPanelProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(() => normalizeAuditResult(initialResult));
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const runAudit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/websites/${websiteId}/audit`, { method: "POST" });
      const data = await res.json();
      setResult(normalizeAuditResult(data));
      toast.success("Audit completed successfully");
    } catch (error) {
      console.error("Audit failed:", error);
      toast.error("Failed to run SEO audit");
    } finally {
      setLoading(false);
    }
  };

  const copyPrompt = (prompt: string, index: number) => {
    navigator.clipboard.writeText(prompt);
    setCopiedIndex(index);
    toast.success("Prompt copied to clipboard");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!result && !loading) {
    return (
      <Card className="border-dashed border-2 border-border/40 bg-card/20 py-12">
        <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-black tracking-tight">Run AI SEO Audit</h3>
            <p className="text-sm text-muted-foreground max-w-[280px]">
              Get instant SEO insights and ready-to-use Cursor prompts to fix your site.
            </p>
          </div>
          <Button onClick={runAudit} className="gap-2 font-bold shadow-xl shadow-primary/20">
            <RefreshCcw className="h-4 w-4" /> Start Audit
          </Button>
        </CardContent>
      </Card>
    );
  }

  const score = result?.score ?? 0;
  const issues = result?.issues ?? [];

  const getScoreColor = (s: number) => {
    if (s >= 80) return "text-pink-500 border-pink-500/20";
    if (s >= 50) return "text-amber-500 border-amber-500/20";
    return "text-red-500 border-red-500/20";
  };

  return (
    <div className="space-y-6">
      {/* Score Header */}
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden group">
        <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className={cn(
              "relative h-20 w-20 rounded-full border-[6px] flex items-center justify-center transition-all duration-700 group-hover:scale-110",
              getScoreColor(score)
            )}>
              <span className="text-2xl font-black">{score}</span>
              <div className="absolute inset-0 rounded-full bg-current opacity-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">SEO Health Score</h3>
              <p className="text-xs text-muted-foreground font-medium opacity-70">
                Based on critical on-page SEO signals
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={runAudit}
            disabled={loading}
            className="gap-2 font-bold border-border/40 bg-background/50 hover:bg-primary/5 hover:text-primary transition-all"
          >
            <RefreshCcw className={cn("h-4 w-4 transition-transform duration-700", loading && "animate-spin")} />
            {loading ? "Analyzing..." : "Re-audit"}
          </Button>
        </CardContent>
      </Card>

      {/* Issues List */}
      <div className="space-y-4">
        {issues.length === 0 ? (
          <Card className="border-pink-500/10 bg-pink-500/5 py-12">
            <CardContent className="flex flex-col items-center justify-center text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-pink-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-pink-500" />
              </div>
              <div className="space-y-1">
                <h4 className="font-black tracking-tight">Everything looks great!</h4>
                <p className="text-xs text-pink-600/70 font-medium">No critical SEO issues found on this sweep.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          issues.map((issue, idx) => (
            <Card key={idx} className="border-border/40 bg-card/40 hover:bg-card/60 transition-all group overflow-hidden">
              <CardContent className="p-5">
                <div className="flex gap-4">
                  <div className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                    issue.type === "error" ? "bg-red-500/10 text-red-500" : 
                    issue.type === "warning" ? "bg-amber-500/10 text-amber-500" : 
                    "bg-pink-500/10 text-pink-500"
                  )}>
                    {issue.type === "error" ? <AlertCircle className="h-5 w-5" /> : 
                     issue.type === "warning" ? <AlertTriangle className="h-5 w-5" /> : 
                     <Info className="h-5 w-5" />}
                  </div>
                  
                  <div className="flex-grow space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <h4 className="text-base font-black tracking-tight leading-tight">{issue.title}</h4>
                      <Badge variant="outline" className={cn(
                        "font-black text-[10px] uppercase border-none px-2 py-0.5",
                        issue.type === "error" ? "bg-red-500/10 text-red-600" : 
                        issue.type === "warning" ? "bg-amber-500/10 text-amber-600" : 
                        "bg-pink-500/10 text-pink-600"
                      )}>
                        {issue.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                      {issue.description}
                    </p>
                    
                    <div className="p-4 rounded-2xl bg-muted/30 border border-border/10 space-y-2 relative group/prompt">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                          <CheckCircle2 className="h-3 w-3" /> Cursor Prompt to Fix
                        </span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => copyPrompt(issue.cursorPrompt, idx)}
                                className="p-1.5 rounded-lg bg-background border border-border/20 text-muted-foreground hover:text-primary hover:border-primary/20 transition-all"
                              >
                                {copiedIndex === idx ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs font-bold">Copy Prompt</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <p className="text-sm italic text-muted-foreground/80 leading-relaxed pr-8">
                        &quot;{issue.cursorPrompt}&quot;
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
