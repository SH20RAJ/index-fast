"use client";

import { useState } from "react";
import { Archive, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface ArchiveSubmissionResponse {
  success: boolean;
  attempted: number;
  succeeded: number;
  failed: number;
  failures: string[];
  message?: string;
  error?: string;
}

interface ArchiveSubmissionPanelProps {
  websiteId?: string;
  websiteUrl?: string;
}

export default function ArchiveSubmissionPanel({ websiteId, websiteUrl }: ArchiveSubmissionPanelProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ArchiveSubmissionResponse | null>(null);
  const [includeSubpaths, setIncludeSubpaths] = useState(false);

  async function handleSubmitToArchive() {
    if (!websiteId) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/websites/archive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ websiteId, includeSubpaths }),
      });

      const data = (await res.json()) as ArchiveSubmissionResponse;
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        attempted: 0,
        succeeded: 0,
        failed: 0,
        failures: [],
        error: error instanceof Error ? error.message : "Failed to submit to Wayback Machine",
      });
    } finally {
      setLoading(false);
    }
  }

  if (!websiteId) return null;

  return (
    <div className="rounded-lg border border-border bg-card p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Archive className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-medium">Archive to Wayback Machine</h3>
      </div>

      <p className="text-xs text-muted-foreground">
        Save your site to the Internet Archive for a permanent backup.
      </p>

      {/* Website URL */}
      <div className="rounded-md bg-muted/50 px-3 py-2">
        <code className="text-xs font-mono break-all text-foreground">
          {websiteUrl || "Your website"}
        </code>
      </div>

      {/* Option */}
      <label className="flex items-center gap-2 cursor-pointer">
        <Checkbox
          checked={includeSubpaths}
          onCheckedChange={(checked) => setIncludeSubpaths(checked as boolean)}
        />
        <span className="text-sm text-muted-foreground">
          Include /blog, /pricing, /contact
        </span>
      </label>

      {/* Action */}
      <Button
        onClick={handleSubmitToArchive}
        disabled={loading}
        variant="outline"
        size="sm"
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Archive className="h-3.5 w-3.5" />
            Start Archiving
          </>
        )}
      </Button>

      {/* Result */}
      {result && (
        <div className="space-y-3">
          {result.success ? (
            <div className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <span className="text-muted-foreground">{result.message}</span>
            </div>
          ) : (
            <div className="flex items-start gap-2 text-sm">
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
              <span className="text-muted-foreground">
                {result.error || result.message || "Archive submission failed"}
              </span>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-md bg-muted/50 px-3 py-2">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Attempted</p>
              <p className="text-sm font-medium tabular-nums">{result.attempted}</p>
            </div>
            <div className="rounded-md bg-muted/50 px-3 py-2">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Succeeded</p>
              <p className="text-sm font-medium tabular-nums">{result.succeeded}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
