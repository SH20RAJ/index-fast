"use client";

import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildBingIndexNowPortalUrl, buildGoogleSearchConsolePropertyUrl } from "@/lib/utils";

interface ExternalLinksProps {
  websiteUrl: string;
}

export default function ExternalLinks({ websiteUrl }: ExternalLinksProps) {
  return (
    <div className="space-y-4 px-1">
      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">External Links</h3>
      <div className="grid gap-2">
        <Button asChild variant="outline" className="h-12 justify-between rounded-2xl border-zinc-100 dark:border-white/5 hover:bg-zinc-50 dark:hover:bg-white/5 font-medium text-xs">
          <a href={buildBingIndexNowPortalUrl(websiteUrl)} target="_blank" rel="noopener noreferrer">
            Bing Portal <ExternalLink className="h-3 w-3 opacity-30" />
          </a>
        </Button>
        <Button asChild variant="outline" className="h-12 justify-between rounded-2xl border-zinc-100 dark:border-white/5 hover:bg-zinc-50 dark:hover:bg-white/5 font-medium text-xs">
          <a href={buildGoogleSearchConsolePropertyUrl(websiteUrl)} target="_blank" rel="noopener noreferrer">
            Google Console <ExternalLink className="h-3 w-3 opacity-30" />
          </a>
        </Button>
      </div>
    </div>
  );
}
