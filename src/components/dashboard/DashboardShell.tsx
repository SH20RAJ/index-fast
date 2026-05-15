"use client";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopBar from "@/components/dashboard/DashboardTopBar";
import { SiteProvider, type WebsiteBasic } from "@/components/dashboard/SiteContext";
import { LogProvider } from "@/components/dashboard/LogContext";
import ChatAssistant from "@/components/dashboard/ChatAssistant";
import Link from "next/link";
import { Plus } from "lucide-react";

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

          {/* Floating Actions */}
          <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
            <ChatAssistant />
            <Link
              href="/sites/new"
              className="group flex h-14 w-14 items-center justify-center rounded-full bg-zinc-950 shadow-2xl shadow-black/40 ring-1 ring-white/10 transition-all duration-300 hover:scale-110 hover:shadow-primary/30 dark:bg-white"
              title="Add Website"
            >
              <Plus className="h-6 w-6 text-white dark:text-zinc-950 transition-transform duration-300 group-hover:rotate-90" />
            </Link>
          </div>
        </div>
      </LogProvider>
    </SiteProvider>
  );
}
