"use client";

import PageHeader from "@/components/dashboard/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Search } from "lucide-react";

export default function InsightsView() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Search Insights"
        description="GSC performance data for your site."
      />

      <Card className="p-12 text-center border-dashed bg-muted/30">
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-full bg-amber-500/10 p-4">
            <AlertTriangle className="h-8 w-8 text-amber-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-amber-900 dark:text-amber-200">
              GSC Insights Deprecated
            </h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Google Search Console insights are temporarily unavailable. We are focusing on core SEO features first.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <Search className="h-4 w-4" />
            <span>Other SEO tools coming soon</span>
          </div>
        </div>
      </Card>
    </div>
  );
}