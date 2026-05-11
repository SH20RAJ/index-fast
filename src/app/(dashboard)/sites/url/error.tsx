"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Site URL Page Error:", error);
  }, [error]);

  return (
    <div className="mx-auto flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4 py-16 text-center animate-in fade-in duration-500">
      <div className="relative group">
        <div className="absolute -inset-4 rounded-full bg-destructive/10 blur-xl group-hover:bg-destructive/20 transition-all duration-500" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-destructive/20 bg-destructive/5 text-destructive shadow-sm">
          <AlertTriangle className="h-10 w-10" />
        </div>
      </div>
      
      <div className="space-y-3 max-w-md">
        <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground">Intelligence Sync Failed</h1>
        <p className="text-sm font-medium text-muted-foreground/80 leading-relaxed">
          {error.message || "We encountered an error while trying to synchronize your site's URL inventory. This might be a temporary connection issue."}
        </p>
        {error.digest ? (
          <div className="mt-4 pt-4 border-t border-border/40">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">Protocol Signature</p>
            <p className="text-[10px] font-mono text-muted-foreground/60 mt-1">{error.digest}</p>
          </div>
        ) : null}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 w-full sm:w-auto">
        <Button 
          onClick={() => reset()} 
          className="h-12 w-full sm:w-auto px-8 rounded-2xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-zinc-950/10 dark:shadow-white/5 gap-2"
        >
          <RefreshCcw className="h-3.5 w-3.5" />
          Attempt Re-sync
        </Button>
        <Button 
          variant="outline" 
          asChild
          className="h-12 w-full sm:w-auto px-8 rounded-2xl border-border/60 font-bold uppercase tracking-widest text-[10px] gap-2"
        >
          <Link href="/dashboard">
            <Home className="h-3.5 w-3.5" />
            Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
