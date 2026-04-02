"use client";

import { Button } from "@/components/ui/button";
import { Plus, Globe } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function SitesEmptyState() {
  return (
    <div
      className={cn(
        "py-20 md:py-32 flex flex-col items-center justify-center text-center",
        "bg-card/30 backdrop-blur-sm rounded-[40px] border-2 border-dashed border-border/40",
        "transition-all duration-500 hover:border-primary/20 group"
      )}
    >
      <div className="relative mb-8">
        <div className="h-20 w-20 rounded-full bg-primary/5 flex items-center justify-center animate-pulse group-hover:scale-110 transition-transform">
          <Globe className="h-10 w-10 text-primary/30" />
        </div>
        <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-background border-2 border-border/20 flex items-center justify-center">
          <Plus className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      
      <div className="space-y-2 mb-8 max-w-[300px]">
        <h3 className="text-xl font-black tracking-tight text-foreground/90">
          No websites added
        </h3>
        <p className="text-sm font-medium text-muted-foreground/60">
          Add your first site to start tracking indexing and sitemap performance.
        </p>
      </div>

      <Button
        asChild
        className="h-12 px-8 rounded-2xl font-black tracking-tighter shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95"
      >
        <Link href="/sites" className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add Your First Site
        </Link>
      </Button>
    </div>
  );
}