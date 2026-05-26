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
        <div className="flex min-h-screen bg-background text-foreground">

          {/* Sidebar */}
          <DashboardSidebar />

          {/* Main content area */}
          <div className="flex flex-1 flex-col md:pl-60">

            {/* Mobile top spacing for the mobile header */}
            <div className="h-14 md:h-0" />

            {/* Page content */}
            <main className="flex-1 overflow-x-hidden">
              <div className="mx-auto w-full max-w-6xl px-6 py-8 md:px-10 md:py-10">
                <DashboardTopBar />
                {children}
              </div>
            </main>
          </div>

          {/* Floating actions */}
          <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
            <ChatAssistant />
            <Link
              href="/sites/new"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-foreground text-background shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              title="Add Website"
            >
              <Plus className="h-5 w-5" />
            </Link>
          </div>

        </div>
      </LogProvider>
    </SiteProvider>
  );
}
