"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, Loader2, Send, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SubmitAllResponse {
  success: boolean;
  totalUrls?: number;
  totalBatches?: number;
  successBatches?: number;
  failedBatches?: number;
  failures?: string[];
  error?: string;
}

export default function IndexNowPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SubmitAllResponse | null>(null);

  async function handleSubmitAll() {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/indexnow/submit-all", { method: "POST" });
      const data = (await res.json()) as SubmitAllResponse;
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Failed to submit URLs",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="border-b border-border/70 py-14 sm:py-20">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-3 sm:mb-10">
          <Badge variant="outline" className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.14em]">
            IndexNow Tool
          </Badge>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Send all your pages to search engines</h1>
          <p className="max-w-3xl text-base text-muted-foreground sm:text-lg">
            Quickly send all your pages to search engines at once so they can find your content faster.
          </p>
        </div>

        <Card className="border-border/70 bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Send className="h-5 w-5" /> Send All Pages
            </CardTitle>
            <CardDescription>
              We'll send all your website's pages to search engines in groups.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-border/70 bg-background/70 p-3 text-sm text-muted-foreground">
                <p className="inline-flex items-center gap-2 font-medium text-foreground">
                  <ShieldCheck className="h-4 w-4" /> Protocol Key
                </p>
                <p className="mt-1 font-mono text-xs">74c28309a177441488a4ea77d823c277</p>
              </div>
              <div className="rounded-lg border border-border/70 bg-background/70 p-3 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Source</p>
                <p className="mt-1 text-xs">All public sitemap paths (landing, tools, blog, resources, and indexnow page)</p>
              </div>
            </div>

            <Button onClick={handleSubmitAll} disabled={loading} className="w-full sm:w-auto">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                </>
              ) : (
                <>
                  Send All Pages <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            {result ? (
              result.success ? (
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    Success. Submitted {result.totalUrls} URLs across {result.totalBatches} batch(es). Successful batches: {result.successBatches}.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive">
                  <AlertDescription>
                    {result.error || "Some batches failed."}
                    {result.failures && result.failures.length > 0 ? ` ${result.failures.join(" | ")}` : ""}
                  </AlertDescription>
                </Alert>
              )
            ) : null}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
