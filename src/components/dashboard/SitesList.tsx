"use client";

import SiteCard from "@/components/dashboard/SiteCard";
import { Website } from "@/components/dashboard/types";

interface SitesListProps {
  sites: Website[];
  onSync: (id: string) => void;
}

export default function SitesList({ sites, onSync }: SitesListProps) {
  return (
    <div className="divide-y divide-border rounded-lg border border-border bg-card">
      {sites.map((site) => (
        <SiteCard key={site.id} site={site} onSync={onSync} />
      ))}
    </div>
  );
}