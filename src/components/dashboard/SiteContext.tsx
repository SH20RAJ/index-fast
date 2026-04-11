"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface WebsiteBasic {
  id: string;
  url: string;
  gscConnected: boolean | null;
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

  // Initialize selected site on mount
  useEffect(() => {
    if (websites.length > 0) {
      // Check local storage for previously selected site
      const savedSiteId = localStorage.getItem("indexfast_selected_site_id");
      if (savedSiteId) {
        const found = websites.find((w) => w.id === savedSiteId);
        if (found) {
          setSelectedSite(found);
          setLoading(false);
          return;
        }
      }
      
      // Default to first site if none in local storage or not found
      setSelectedSite(websites[0]);
    } else {
      setSelectedSite(null);
    }
    setLoading(false);
  }, [websites]);

  // Update local storage when site changes
  useEffect(() => {
    if (selectedSite) {
      localStorage.setItem("indexfast_selected_site_id", selectedSite.id);
    } else {
      localStorage.removeItem("indexfast_selected_site_id");
    }
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
