"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Crown,
  Globe,
  Send,
  Clock,
  Bot,
  Wrench,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Page titles derived from the URL path                             */
/* ------------------------------------------------------------------ */

const titleMap: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/insights": "Insights",
  "/dashboard/push": "Push Indexing",
  "/dashboard/cron": "Scheduler",
  "/dashboard/mcp": "AI Agents",
  "/dashboard/sitemaps": "Sitemaps",
  "/dashboard/reader": "AI Reader",
  "/dashboard/api": "API",
  "/submissions": "History",
  "/sites": "Websites",
  "/sites/url": "Inventory",
  "/sites/jobs": "Automation",
  "/toolbox": "Toolbox",
  "/settings": "Settings",
};

function pageTitle(pathname: string): string {
  // Try exact match first, then longest prefix match
  if (titleMap[pathname]) return titleMap[pathname];
  let best = "";
  for (const prefix of Object.keys(titleMap)) {
    if (pathname.startsWith(prefix) && prefix.length > best.length) {
      best = prefix;
    }
  }
  return best ? titleMap[best] : "Dashboard";
}

/* ------------------------------------------------------------------ */
/*  Nav items for the mobile sheet                                    */
/* ------------------------------------------------------------------ */

const navItems = [
  { label: "Sites", href: "/sites", icon: Globe },
  { label: "Push Indexing", href: "/dashboard/push", icon: Send },
  { label: "Scheduler", href: "/dashboard/cron", icon: Clock },
  { label: "AI Agents", href: "/dashboard/mcp", icon: Bot },
  { label: "Toolbox", href: "/toolbox", icon: Wrench },
];

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function DashboardTopBar() {
  const pathname = usePathname();
  const title = pageTitle(pathname || "");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-30 -mx-6 mb-6 flex h-12 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur-sm",
          "md:-mx-10 md:mb-8 md:px-0",
        )}
      >
        {/* Left: hamburger (mobile) + title */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-md md:hidden"
            aria-label="Open navigation"
            onClick={() => setMobileNavOpen(true)}
          >
            <Menu className="h-4 w-4" />
          </Button>

          <h1 className="truncate text-sm font-medium text-foreground">
            {title}
          </h1>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 rounded-md text-xs font-medium"
            asChild
          >
            <Link href="/pricing">
              <Crown className="mr-1.5 h-3 w-3 text-amber-500" />
              Upgrade
            </Link>
          </Button>
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/*  Mobile sidebar sheet                                              */}
      {/* ------------------------------------------------------------------ */}
      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent side="left" className="w-60 p-0">
          <div className="flex h-full min-h-0 flex-col">
            {/* Close + logo */}
            <div className="flex items-center justify-between px-4 pt-5 pb-3">
              <span className="text-sm font-semibold text-foreground tracking-tight">
                IndexFast
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-md"
                aria-label="Close navigation"
                onClick={() => setMobileNavOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 min-h-0 overflow-y-auto px-2 py-1">
              <ul className="space-y-px">
                {navItems.map((item) => {
                  const active =
                    pathname === item.href ||
                    pathname?.startsWith(`${item.href}/`);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileNavOpen(false)}
                        className={cn(
                          "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm",
                          active
                            ? "bg-secondary text-foreground"
                            : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                        )}
                      >
                        <item.icon className="h-4 w-4 shrink-0 opacity-70" />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Footer link */}
            <div className="border-t border-border px-2 py-3">
              <Link
                href="/settings"
                onClick={() => setMobileNavOpen(false)}
                className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              >
                Settings
              </Link>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
