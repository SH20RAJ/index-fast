"use client";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopBar from "@/components/dashboard/DashboardTopBar";
import { SiteProvider, type WebsiteBasic } from "@/components/dashboard/SiteContext";
import { LogProvider } from "@/components/dashboard/LogContext";
import AddSiteFlow from "@/components/dashboard/AddSiteFlow";

export default function DashboardShell({
  children,
  initialWebsites
}: {
  children: React.ReactNode;
  initialWebsites: WebsiteBasic[];
}) {
  return (
    <SiteProvider initialWebsites={initialWebsites}>
      <LogProvider>
        <div className="relative min-h-screen w-full overflow-x-hidden bg-background text-foreground">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_0%_0%,color-mix(in_oklab,var(--primary)_14%,transparent),transparent_60%)] opacity-90 dark:opacity-100" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_100%_100%,color-mix(in_oklab,var(--primary)_10%,transparent),transparent_55%)] opacity-80" />

          <DashboardSidebar />

          <div className="relative flex min-h-screen flex-col md:pl-72 focus-within:z-10">
            {/* Mobile top spacing */}
            <div className="h-16 md:h-0" />

            {/* Main content */}
            <main className="flex-1 overflow-x-hidden px-4 pb-10 md:px-8 md:pb-12">
              <div className="mx-auto w-full max-w-7xl">
                <DashboardTopBar />
                {children}
              </div>
            </main>
          </div>

          {/* Floating Add Site button — fixed bottom-right */}
          <div className="fixed bottom-6 right-6 z-50">
            <AddSiteFlow floating />
          </div>
        </div>
      </LogProvider>
    </SiteProvider>
  );
}
