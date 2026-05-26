"use client";

import Link from "next/link";
import { Website } from "@/components/dashboard/types";
import { Button } from "@/components/ui/button";
import { Globe, RefreshCw, BarChart3, Trash2 } from "lucide-react";

interface SiteCardProps {
  site: Website;
  onSync: (id: string) => void;
  onOpenGsc?: (id: string) => void;
  onDeleteSite?: (id: string) => void;
}

export default function SiteCard({ site, onSync, onOpenGsc, onDeleteSite }: SiteCardProps) {
  const hostname = new URL(site.url).hostname;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-muted text-muted-foreground">
          <Globe className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{hostname}</p>
          <p className="text-xs text-muted-foreground truncate">{site.url}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {site.lastSyncAt && (
          <span className="hidden sm:inline text-xs text-muted-foreground mr-2">
            Synced {new Date(site.lastSyncAt).toLocaleDateString()}
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onSync(site.id)}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <Link href={`/sites/${site.id}/audit`}>
            <BarChart3 className="h-3.5 w-3.5" />
          </Link>
        </Button>
        {onDeleteSite && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDeleteSite(site.id)}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
