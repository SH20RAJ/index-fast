import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  WifiOff, 
  RefreshCcw, 
  AlertCircle 
} from "lucide-react";

export const metadata: Metadata = {
  title: "Offline | IndexFast",
  description: "You are offline right now. Reconnect to continue using IndexFast.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center rounded-[32px] bg-red-500/10 border border-red-500/20 text-red-500 shadow-2xl shadow-red-500/5">
          <WifiOff className="h-10 w-10 stroke-[1.5px]" />
          <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-red-500 border-4 border-background flex items-center justify-center">
            <AlertCircle className="h-3 w-3 text-white" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-black tracking-tighter text-foreground">
            Connection Interrupted
          </h1>
          <p className="text-base font-medium text-muted-foreground/60 leading-relaxed">
            Your connection dropped. Reconnect to continue sitemap syncs, submissions, and dashboard updates.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild className="h-12 px-8 font-black rounded-2xl shadow-xl shadow-primary/10 gap-2 transition-all active:scale-95 group">
            <Link href="/">
              <RefreshCcw className="h-4 w-4 transition-transform group-hover:rotate-180 duration-500" />
              Try Reconnecting
            </Link>
          </Button>
          <Button asChild variant="ghost" className="h-12 px-8 font-black rounded-2xl border border-transparent hover:border-border/40 hover:bg-muted/30 transition-all active:scale-95 text-muted-foreground/40 hover:text-muted-foreground">
            <Link href="https://twitter.com/sh20raj" target="_blank">
              Check Status
            </Link>
          </Button>
        </div>
        
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30">
          IndexFast Persistence Layer active
        </p>
      </div>
    </div>
  );
}