"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function titleFromPath(pathname: string): { title: string; subtitle?: string } {
  if (pathname === "/dashboard" || pathname === "/dashboard/") {
    return { title: "Overview", subtitle: "Your progress and recent activity" };
  }
  if (pathname.startsWith("/dashboard/insights")) {
    return { title: "Insights", subtitle: "Growth and performance" };
  }
  if (pathname.startsWith("/dashboard/sitemaps")) {
    return { title: "Sitemaps", subtitle: "List of pages found" };
  }
  if (pathname.startsWith("/dashboard/reader")) {
    return { title: "AI Reader", subtitle: "See how AI views your pages" };
  }
  if (pathname.startsWith("/dashboard/api")) {
    return { title: "API", subtitle: "Developer settings" };
  }
  if (pathname.startsWith("/submissions")) {
    return { title: "History", subtitle: "Recent updates" };
  }
  if (pathname.startsWith("/sites/url")) {
    return { title: "Inventory", subtitle: "All discovered pages" };
  }
  if (pathname.startsWith("/sites/jobs")) {
    return { title: "Automation", subtitle: "Automatic sync updates" };
  }
  if (pathname.startsWith("/sites")) {
    return { title: "Websites", subtitle: "Your connected sites" };
  }
  if (pathname.startsWith("/toolbox")) {
    return { title: "Toolbox", subtitle: "Extra tools and utilities" };
  }
  if (pathname.startsWith("/settings")) {
    return { title: "Settings", subtitle: "Account and billing" };
  }
  return { title: "Workspace", subtitle: "IndexFast" };
}

export default function DashboardTopBar() {
  const pathname = usePathname();
  const { title, subtitle } = titleFromPath(pathname || "");

  return (
    <header
      className={cn(
        "sticky z-30 -mx-4 mb-6 border-b border-border/60 bg-background/80 px-4 py-3 backdrop-blur-md md:-mx-8 md:mb-8 md:px-8",
        "md:top-0",
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold tracking-tight text-foreground md:text-xl">{title}</h1>
          {subtitle ? <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p> : null}
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-lg font-medium" asChild>
            <Link href="/pricing">
              <Crown className="mr-1.5 h-3.5 w-3.5 text-amber-500" />
              Plans & upgrade
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
