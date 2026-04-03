"use client";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen w-full overflow-hidden bg-[#f6f4ef] text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(15,23,42,0.08),transparent_32%),radial-gradient(circle_at_top_right,rgba(2,132,199,0.12),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(234,179,8,0.08),transparent_28%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.07),transparent_32%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.14),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(251,191,36,0.08),transparent_28%)]" />
      <DashboardSidebar />
      <div className="relative flex flex-1 flex-col">
        {/* Mobile top spacing */}
        <div className="h-16 md:h-0" />
        {/* Main content */}
        <main className="flex-1 overflow-x-hidden px-4 pb-8 pt-4 md:px-8 md:py-8">
          <div className="mx-auto w-full max-w-7xl space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
