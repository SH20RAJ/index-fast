"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStackApp, useUser } from "@stackframe/stack";
import {
  Bolt,
  ChevronRight,
  Clock3,
  Globe,
  LayoutDashboard,
  Link2,
  LogOut,
  Settings,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const navGroups = [
  {
    label: "Workspace",
    items: [
      { label: "Command Center", href: "/dashboard", icon: LayoutDashboard },
      { label: "Websites", href: "/sites", icon: Globe },
      { label: "URLs & Submissions", href: "/sites/url", icon: Link2 },
      { label: "Auto Submit Jobs", href: "/sites/jobs", icon: Clock3 },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Submission Stream", href: "/submissions", icon: Clock3 },
      { label: "SEO Toolbox", href: "/toolbox", icon: Wrench },
      { label: "Billing & Settings", href: "/settings", icon: Settings },
    ],
  },
] as const;

interface DashboardSidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

function SidebarContent({ onNavigate }: { onNavigate: () => void }) {
  const pathname = usePathname();
  const user = useUser();
  const stack = useStackApp();

  const displayName = user?.displayName?.trim() || "User";
  const primaryEmail = user?.primaryEmail || "No email";
  const initials = useMemo(
    () =>
      displayName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("") || "U",
    [displayName]
  );

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Card className="flex h-full flex-col rounded-xl border bg-background">
      <div className="flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2" onClick={onNavigate}>
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Bolt className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold">IndexFast</span>
        </Link>
        <Badge variant="secondary">Dashboard</Badge>
      </div>
      <Separator />

      <ScrollArea className="flex-1 px-2 py-3">
        <div className="space-y-4">
          {navGroups.map((group) => (
            <div key={group.label} className="space-y-1">
              <p className="px-2 pb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {group.label}
              </p>
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Button
                    key={item.href}
                    asChild
                    variant={active ? "secondary" : "ghost"}
                    className={cn("w-full justify-start", active && "font-semibold")}
                  >
                    <Link href={item.href} onClick={onNavigate}>
                      <Icon className="mr-2 h-4 w-4" />
                      {item.label}
                      <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
                    </Link>
                  </Button>
                );
              })}
            </div>
          ))}
        </div>
      </ScrollArea>

      <Separator />
      <div className="space-y-3 p-3">
        <div className="flex items-center gap-3 rounded-lg border p-2">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{displayName}</p>
            <p className="truncate text-xs text-muted-foreground">{primaryEmail}</p>
          </div>
        </div>
        <Button variant="outline" className="w-full justify-start" onClick={() => stack.signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </Card>
  );
}

export default function DashboardSidebar({ mobileOpen, onMobileClose }: DashboardSidebarProps) {
  return (
    <>
      <aside className="hidden h-[calc(100vh-1.5rem)] w-72 shrink-0 md:block">
        <SidebarContent onNavigate={() => undefined} />
      </aside>

      <Sheet open={mobileOpen} onOpenChange={(open) => !open && onMobileClose()}>
        <SheetContent side="left" className="w-[88vw] max-w-80 p-2">
          <SheetHeader className="sr-only">
            <SheetTitle>Dashboard navigation</SheetTitle>
          </SheetHeader>
          <div className="h-full">
            <SidebarContent onNavigate={onMobileClose} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
