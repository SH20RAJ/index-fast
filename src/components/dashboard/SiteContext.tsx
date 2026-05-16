"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface WebsiteBasic {
  id: string;
  url: string;
  sitemapUrl: string | null;
}

interface SiteContextType {
  selectedSite: WebsiteBasic | null;
  setSelectedSite: (site: WebsiteBasic | null) => void;
  websites: WebsiteBasic[];
  setWebsites: (sites: WebsiteBasic[]) => void;
  loading: boolean;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export function SiteProvider({
  children,
  initialWebsites = [],
}: {
  children: ReactNode;
  initialWebsites?: WebsiteBasic[];
}) {
  const [websites, setWebsites] = useState<WebsiteBasic[]>(initialWebsites);
  const [selectedSite, setSelectedSite] = useState<WebsiteBasic | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore selected site from localStorage, fallback to first site
  useEffect(() => {
    if (websites.length > 0) {
      let found: WebsiteBasic | undefined;

      const savedSiteId = localStorage.getItem("indexfast_selected_site_id");
      if (savedSiteId) {
        found = websites.find((w) => w.id === savedSiteId);
      }

      if (!found) {
        found = websites[0];
      }

      if (found && found.id !== selectedSite?.id) {
        setSelectedSite(found);
      }

      setLoading(false);
    } else {
      if (selectedSite !== null) {
        setSelectedSite(null);
      }
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [websites]);

  // Persist selected site to localStorage
  useEffect(() => {
    if (!selectedSite) {
      localStorage.removeItem("indexfast_selected_site_id");
      return;
    }
    localStorage.setItem("indexfast_selected_site_id", selectedSite.id);
  }, [selectedSite]);

  return (
    <SiteContext.Provider
      value={{ selectedSite, setSelectedSite, websites, setWebsites, loading }}
    >
      {children}
    </SiteContext.Provider>
  );
}

export function useSiteContext() {
  const context = useContext(SiteContext);
  if (context === undefined) {
    throw new Error("useSiteContext must be used within a SiteProvider");
  }
  return context;
}
