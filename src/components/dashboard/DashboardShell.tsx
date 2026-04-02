"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px]">
        <DashboardSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

        <main className="flex min-h-screen flex-1 flex-col">
          <div className="sticky top-0 z-30 border-b border-border/70 bg-background/95 px-4 py-3 backdrop-blur md:hidden">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">IndexFast Dashboard</div>
              <Button size="icon" variant="outline" onClick={() => setMobileOpen(true)} aria-label="Open menu">
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 px-4 py-4 sm:px-6 md:px-8 md:py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
