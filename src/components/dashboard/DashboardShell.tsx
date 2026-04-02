"use client";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        {/* Mobile top spacing */}
        <div className="h-16 md:h-0" />
        {/* Main content */}
        <main className="flex-1 overflow-x-hidden p-6 md:p-8">
          <div className="mx-auto max-w-6xl w-full space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
