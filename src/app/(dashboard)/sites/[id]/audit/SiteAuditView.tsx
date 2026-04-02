"use client";

import React from "react";
import { cn } from "@/lib/utils";
import PageHeader from "@/components/dashboard/PageHeader";
import AuditPanel from "@/components/dashboard/AuditPanel";
import type { AuditIssue } from "@/components/dashboard/AuditPanel";
import { AlertCircle, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
      <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
          <AlertCircle className="h-8 w-8 text-muted-foreground/40" />
        </div>
        <h3 className="text-xl font-black tracking-tighter">Website not found</h3>
        <p className="text-sm font-medium text-muted-foreground max-w-xs mx-auto">
          The requested site identifier does not exist in our repository.
        </p>
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
