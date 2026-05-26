"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, RefreshCcw, AlertCircle, AlertTriangle, Info, CheckCircle2 } from "lucide-react";
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

function scoreColor(s: number) {
  if (s >= 80) return "text-primary";
  if (s >= 50) return "text-accent";
  return "text-destructive";
}

function issueIcon(type: AuditIssue["type"]) {
  if (type === "error") return <AlertCircle className="h-4 w-4 text-destructive" />;
  if (type === "warning") return <AlertTriangle className="h-4 w-4 text-accent" />;
  return <Info className="h-4 w-4 text-muted-foreground" />;
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
      toast.success("Audit completed");
    } catch (error) {
      console.error("Audit failed:", error);
      toast.error("Failed to run audit");
    } finally {
      setLoading(false);
    }
  };

  const copyPrompt = (prompt: string, index: number) => {
    navigator.clipboard.writeText(prompt);
    setCopiedIndex(index);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!result && !loading) {
    return (
      <div className="rounded-md border border-border bg-card p-6 flex flex-col items-center gap-3 text-center">
        <h3 className="text-sm font-medium">SEO Audit</h3>
        <p className="text-xs text-muted-foreground max-w-[260px]">
          Find SEO issues and get AI prompts to fix them.
        </p>
        <Button onClick={runAudit} size="sm" variant="outline">
          Start Audit
        </Button>
      </div>
    );
  }

  const score = result?.score ?? 0;
  const issues = result?.issues ?? [];

  return (
    <div className="space-y-3">
      {/* Score */}
      <div className="rounded-md border border-border bg-card px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={cn("text-lg font-semibold tabular-nums", scoreColor(score))}>
            {score}
          </span>
          <span className="text-xs text-muted-foreground">SEO Score</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={runAudit}
          disabled={loading}
          className="text-xs text-muted-foreground"
        >
          {loading ? "Analyzing..." : "Re-audit"}
        </Button>
      </div>

      {/* Issues */}
      {issues.length === 0 ? (
        <div className="rounded-md border border-border bg-card px-4 py-3 flex items-center gap-2">
          <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">No issues found.</span>
        </div>
      ) : (
        <div className="rounded-md border border-border bg-card divide-y divide-border">
          {issues.map((issue, idx) => (
            <div key={idx} className="px-4 py-3 space-y-2">
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 shrink-0">{issueIcon(issue.type)}</span>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-foreground">{issue.title}</h4>
                    <span className={cn(
                      "text-[10px] font-medium uppercase tracking-wide",
                      issue.type === "error" ? "text-destructive" :
                      issue.type === "warning" ? "text-accent" :
                      "text-muted-foreground"
                    )}>
                      {issue.type}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {issue.description}
                  </p>
                </div>
              </div>

              {/* AI Fix Prompt */}
              <div className="ml-6 rounded-md bg-background px-3 py-2 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    Fix with AI
                  </span>
                  <button
                    onClick={() => copyPrompt(issue.cursorPrompt, idx)}
                    className="p-0.5 text-muted-foreground hover:text-foreground"
                  >
                    {copiedIndex === idx ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed font-mono">
                  {issue.cursorPrompt}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
