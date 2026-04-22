"use client";

import React from "react";
import { cn } from "@/lib/utils";
import PageHeader from "@/components/dashboard/PageHeader";
import AuditPanel from "@/components/dashboard/AuditPanel";
import type { AuditIssue } from "@/components/dashboard/AuditPanel";
import { AlertCircle, Globe, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SiteAuditViewProps {
  id: string;
  initialSite: SiteAuditRecord | null;
}

interface SiteAuditRecord {
  id: string;
  url: string;
  siteHealth?: {
    score: number;
    issues: AuditIssue[];
  };
}

function getHostname(rawUrl: string) {
  try {
    return new URL(rawUrl).hostname;
  } catch {
    return rawUrl;
  }
}

export default function SiteAuditView({ id, initialSite }: SiteAuditViewProps) {
  const site = initialSite;

  if (!site) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center space-y-6">
        <div className="h-16 w-16 rounded-3xl bg-muted/50 flex items-center justify-center border border-border/50">
          <AlertCircle className="h-8 w-8 text-muted-foreground/40" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-serif font-bold tracking-tight">Website not found</h3>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            This website doesn't exist or you don't have access to it.
          </p>
        </div>
        <Button asChild variant="outline" className="rounded-xl px-6">
           <Link href="/sites">
             <ArrowLeft className="mr-2 h-4 w-4" /> Back to Websites
           </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      <PageHeader
        title="AI SEO Audit"
        description={`Analyzing SEO health for ${getHostname(site.url)}`}
      />

      <div className="max-w-4xl mx-auto w-full">
        <AuditPanel 
          websiteId={id} 
          initialResult={site.siteHealth}
        />
      </div>
    </div>
  );
}
