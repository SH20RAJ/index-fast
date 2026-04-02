"use client";

import SiteCard from "@/components/dashboard/SiteCard";
import { Website } from "@/components/dashboard/types";

interface SitesListProps {
  sites: Website[];
  onSync: (id: string) => void;
}

export default function SitesList({ sites, onSync }: SitesListProps) {
  return (
    <div className="space-y-4">
      {sites.map((site) => (
        <div key={site.id}>
          <SiteCard site={site} onSync={onSync} />
        </div>
      ))}
    </div>
  );
}