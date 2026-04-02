"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto flex w-full max-w-[1440px] gap-4 px-3 py-3 md:px-4 md:py-4">
        <DashboardSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

        <main className="min-w-0 flex-1">
          <div className="mb-3 flex items-center justify-between rounded-xl border bg-background p-2 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <p className="text-sm font-semibold">IndexFast Dashboard</p>
            <div className="h-9 w-9" />
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}
