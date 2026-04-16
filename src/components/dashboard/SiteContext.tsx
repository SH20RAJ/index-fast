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
  const isExcludedPage = pathname?.startsWith("/toolbox/") || pathname?.startsWith("/blogs") || pathname?.startsWith("/tools");

  // Sync state FROM URL or localStorage
  useEffect(() => {
    if (websites.length > 0) {
      let found: WebsiteBasic | undefined;

      // 1. Check URL first - Only if NOT a toolbox page (where ?url= is used for tools)
      if (urlParam && !isExcludedPage) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [websites, urlParam, isExcludedPage]);

  // Sync state TO URL and localStorage when user changes explicit state
  useEffect(() => {
    if (!selectedSite) {
      localStorage.removeItem("indexfast_selected_site_id");
      return;
    }

    localStorage.setItem("indexfast_selected_site_id", selectedSite.id);
    
    // ONLY update URL if NOT a toolbox page (to avoid conflict with tool inputs)
    if (!isExcludedPage) {
      const currentUrlParam = searchParams.get("url");
      if (normalizeUrl(currentUrlParam || "") !== normalizeUrl(selectedSite.url)) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("url", selectedSite.url);
        const nextUrl = `${pathname}?${params.toString()}`;
        window.history.replaceState({ ...window.history.state, as: nextUrl, url: nextUrl }, "", nextUrl);
      }
    }
  }, [selectedSite, pathname, router, searchParams, isExcludedPage]);

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
