"use client";

import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SitesEmptyState() {
  return (
    <div className="py-24 flex flex-col items-center justify-center text-center bg-card/20 border-2 border-dashed border-border/50 rounded-[32px]">
      <div className="h-16 w-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-6">
        <Globe className="h-8 w-8 text-primary/40" />
      </div>
      
      <div className="space-y-2 mb-8 max-w-[320px]">
        <h3 className="text-lg font-bold tracking-tight">No websites found</h3>
        <p className="text-sm text-muted-foreground/80">
          Connect your Google Search Console or add a website manually to get started.
        </p>
      </div>
      <Button asChild className="h-11 px-8 rounded-full font-bold">
        <Link href="/sites/new">Add website</Link>
      </Button>
    </div>
  );
}