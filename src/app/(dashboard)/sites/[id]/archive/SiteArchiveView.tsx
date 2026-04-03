"use client";

import React, { useState } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import ArchiveSubmissionPanel from "@/components/dashboard/ArchiveSubmissionPanel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Archive, Globe, Shield, TrendingUp } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SiteArchiveViewProps {
  id: string;
  url: string;
}

function getHostname(rawUrl: string) {
  try {
    return new URL(rawUrl).hostname;
  } catch {
    return rawUrl;
  }
}

export default function SiteArchiveView({ id, url }: SiteArchiveViewProps) {
  return (
    <div className="space-y-8 pb-16">
      <PageHeader
        title="Wayback Machine Archive"
        description={`Create permanent backups for ${getHostname(url)}`}
      />

      <div className="max-w-4xl mx-auto w-full space-y-6">
        {/* Info Alert */}
        <Alert>
          <Archive className="h-4 w-4" />
          <AlertDescription>
            Archive.org (Wayback Machine) creates permanent, publicly accessible snapshots of your website. This is a free and highly recommended practice for SEO and credibility.
          </AlertDescription>
        </Alert>

        {/* Archive Panel */}
        <ArchiveSubmissionPanel websiteId={id} websiteUrl={url} />

        {/* Benefits Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-border/70 bg-card/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Globe className="h-4 w-4" />
                SEO Benefits
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>✓ Helps Google understand your site history</p>
              <p>✓ Signals site stability and legitimacy</p>
              <p>✓ Provides a backup in case of attacks</p>
              <p>✓ Improves overall domain trust score</p>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="h-4 w-4" />
                Trust & Credibility
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>✓ Shows potential customers your history</p>
              <p>✓ Proves you're not a new scam domain</p>
              <p>✓ Links to your archive boost authority</p>
              <p>✓ Public proof of domain ownership</p>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-4 w-4" />
                Free & Permanent
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>✓ No cost to submit or maintain</p>
              <p>✓ Snapshots stay forever</p>
              <p>✓ Publicly searchable and shareable</p>
              <p>✓ Works retroactively for old URLs</p>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Archive className="h-4 w-4" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>✓ One-click submission to archive.org</p>
              <p>✓ Homepage + subpaths captured</p>
              <p>✓ Appears in Wayback Machine instantly</p>
              <p>✓ Can submit as often as you want</p>
            </CardContent>
          </Card>
        </div>

        {/* FAQ */}
        <Card className="border-border/70 bg-card/70">
          <CardHeader>
            <CardTitle className="text-base">FAQ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="font-medium mb-1">Is it safe to archive my site?</p>
              <p className="text-muted-foreground">Yes, archiving is safe. Archive.org respects robots.txt if you want to opt-out, but having your site archived is a trust signal.</p>
            </div>
            <div>
              <p className="font-medium mb-1">Will it help my SEO?</p>
              <p className="text-muted-foreground">Yes. Search engines view archived sites as more authoritative and legitimate. It signals you have nothing to hide.</p>
            </div>
            <div>
              <p className="font-medium mb-1">Do I need multiple submissions?</p>
              <p className="text-muted-foreground">You can submit as often as you want. We recommend quarterly snapshots to maintain a fresh history.</p>
            </div>
            <div>
              <p className="font-medium mb-1">Is this tracked in my usage quota?</p>
              <p className="text-muted-foreground">No. Archive submissions don't count against your IndexFast submission limits.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
