"use client";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { SiteProvider, type WebsiteBasic } from "@/components/dashboard/SiteContext";

export default function DashboardShell({ 
  children,
  initialWebsites 
}: { 
  children: React.ReactNode;
  initialWebsites: WebsiteBasic[];
}) {
  return (
    <SiteProvider initialWebsites={initialWebsites}>
      <div className="relative min-h-screen w-full overflow-x-hidden bg-background text-foreground">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,var(--primary),transparent_25%)] opacity-[0.03] dark:opacity-[0.07]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,var(--primary),transparent_25%)] opacity-[0.03] dark:opacity-[0.07]" />
        
        <DashboardSidebar />
        
        <div className="relative flex min-h-screen flex-col md:pl-72 focus-within:z-10">
          {/* Mobile top spacing */}
          <div className="h-16 md:h-0" />
          
          {/* Main content */}
          <main className="flex-1 overflow-x-hidden px-4 pb-8 pt-4 md:px-8 md:py-8">
            <div className="mx-auto w-full max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SiteProvider>
  );
}
