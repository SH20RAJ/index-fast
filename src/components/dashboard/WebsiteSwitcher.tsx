"use client";

import * as React from "react";
import { Check, ChevronDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSiteContext } from "@/components/dashboard/SiteContext";
import Link from "next/link";

export default function WebsiteSwitcher() {
  const { websites, selectedSite, setSelectedSite } = useSiteContext();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  // Close on outside click
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on Escape
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  const displayUrl = selectedSite
    ? selectedSite.url.replace(/^https?:\/\//, "").replace(/\/$/, "")
    : "Select site";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label="Switch website"
        className={cn(
          "flex items-center gap-2 w-full px-3 py-2 rounded-md border text-sm text-left transition-colors",
          "border-border bg-background hover:bg-muted",
          open && "border-ring ring-1 ring-ring"
        )}
      >
        <span className="flex-1 truncate font-medium">{displayUrl}</span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-md">
          {websites.length > 0 && (
            <ul className="py-1 max-h-60 overflow-auto">
              {websites.map((site) => {
                const siteUrl = site.url
                  .replace(/^https?:\/\//, "")
                  .replace(/\/$/, "");
                const isSelected = selectedSite?.id === site.id;
                return (
                  <li key={site.id}>
                    <button
                      onClick={() => {
                        setSelectedSite(site);
                        setOpen(false);
                      }}
                      className={cn(
                        "flex items-center gap-2 w-full px-3 py-1.5 text-sm text-left transition-colors",
                        "hover:bg-muted",
                        isSelected && "font-medium"
                      )}
                    >
                      <span className="flex-1 truncate">{siteUrl}</span>
                      {isSelected && (
                        <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          {websites.length === 0 && (
            <p className="px-3 py-2 text-xs text-muted-foreground">
              No websites yet.
            </p>
          )}
          <div className="border-t border-border">
            <Link
              href="/sites/new"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Add site
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
