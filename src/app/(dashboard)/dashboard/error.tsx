"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard page error:", error);
  }, [error]);

  return (
    <div className="mx-auto grid max-w-xl gap-6 px-4 py-16 text-center">
      <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/10 text-destructive">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight">Dashboard failed to load</h1>
        <p className="text-muted-foreground">
          {error.message || "An unexpected error occurred while loading your dashboard data."}
        </p>
        {error.digest ? <p className="text-xs text-muted-foreground/80">Error ID: {error.digest}</p> : null}
      </div>
      <div className="flex flex-col justify-center gap-2 sm:flex-row">
        <Button onClick={() => reset()}>Try again</Button>
        <Button variant="outline" asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}
