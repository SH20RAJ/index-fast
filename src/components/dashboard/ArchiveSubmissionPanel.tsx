"use client";

import { useState } from "react";
import { Archive, ArrowRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import DashboardPanel from "./DashboardPanel";

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

  if (!websiteId) {
    return null;
  }

  return (
    <DashboardPanel title="Wayback Machine Archive" className="lg:flex-1">
      <div className="space-y-4">
        {/* Info Card */}
        <Card className="border-border/40 bg-background/60">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Archive className="h-4 w-4" />
              Submit to Internet Archive
            </CardTitle>
            <CardDescription className="text-xs">
              Create a permanent backup of your site on the Wayback Machine (archive.org). Free, permanent, and no account needed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* URL Display */}
            <div className="rounded-lg border border-border/40 bg-background/40 p-3">
              <p className="text-xs text-muted-foreground font-medium mb-1">Target URL</p>
              <code className="text-xs font-mono break-all text-foreground">{websiteUrl || "Your website"}</code>
            </div>

            {/* Options */}
            <div className="space-y-3 pb-2 border-b border-border/30">
              <label className="flex items-start gap-2 cursor-pointer">
                <Checkbox
                  checked={includeSubpaths}
                  onCheckedChange={(checked) => setIncludeSubpaths(checked as boolean)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">Include common subpaths</p>
                  <p className="text-xs text-muted-foreground">Also archive /blog, /pricing, /contact</p>
                </div>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmitToArchive}
              disabled={loading}
              className="w-full gap-2"
              variant="outline"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Archiving...
                </>
              ) : (
                <>
                  <Archive className="h-4 w-4" />
                  Submit to Wayback Machine
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>

            {/* Results */}
            {result ? (
              result.success ? (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-900">
                    {result.message}
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {result.error || result.message || "Archive submission failed"}
                  </AlertDescription>
                </Alert>
              )
            ) : null}

            {/* Stats */}
            {result ? (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="rounded-lg border border-border/30 bg-background/40 p-2">
                  <p className="text-xs text-muted-foreground">Attempted</p>
                  <p className="text-lg font-bold">{result.attempted}</p>
                </div>
                <div className="rounded-lg border border-border/30 bg-background/40 p-2">
                  <p className="text-xs text-muted-foreground">Success</p>
                  <p className="text-lg font-bold text-green-600">{result.succeeded}</p>
                </div>
              </div>
            ) : null}

            {/* Benefits */}
            <div className="rounded-lg border border-border/30 bg-muted/20 p-3">
              <p className="text-xs font-semibold text-foreground mb-2">Benefits:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>✓ Permanent backup of your site</li>
                <li>✓ Helps Google understand your site better</li>
                <li>✓ SEO preservation and credibility</li>
                <li>✓ Historical record for future reference</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardPanel>
  );
}
