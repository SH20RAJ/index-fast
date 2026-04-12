"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

const normalizeUrl = (url: string) => {
  if (!url) return "";
  return url
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "")
    .toLowerCase();
};

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const [websites, setWebsites] = useState<WebsiteBasic[]>(initialWebsites);
  const [selectedSite, setSelectedSite] = useState<WebsiteBasic | null>(null);
  const [loading, setLoading] = useState(true);

  const urlParam = searchParams.get("url");

  // Sync state FROM URL or localStorage
  useEffect(() => {
    if (websites.length > 0) {
      let found: WebsiteBasic | undefined;

      // 1. Check URL first
      if (urlParam) {
        const normalizedParam = normalizeUrl(urlParam);
        found = websites.find(w => normalizeUrl(w.url) === normalizedParam || w.id === urlParam);
      }

      // 2. Fall back to local storage
      if (!found) {
        const savedSiteId = localStorage.getItem("indexfast_selected_site_id");
        if (savedSiteId) {
          found = websites.find((w) => w.id === savedSiteId);
        }
      }

      // 3. Fall back to the first website logically
      if (!found) {
        found = websites[0];
      }

      // Ensure we don't cause infinite re-renders
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
    // Note: Omit selectedSite from deps to let urlParam drive changes smoothly
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [websites, urlParam]);

  // Sync state TO URL and localStorage when user changes explicit state
  useEffect(() => {
    if (selectedSite) {
      localStorage.setItem("indexfast_selected_site_id", selectedSite.id);
      
      // Update URL if the selectedSite doesn't match the current url parameter
      if (normalizeUrl(urlParam || "") !== normalizeUrl(selectedSite.url)) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("url", selectedSite.url);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }
    } else {
      localStorage.removeItem("indexfast_selected_site_id");
      
      if (urlParam) {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("url");
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }
    }
  }, [selectedSite, pathname, router, searchParams, urlParam]);

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
