"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { useStackApp, useUser } from "@stackframe/stack";
import {
  Activity,
  Bolt,
  ChevronDown,
  Globe,
  LayoutDashboard,
  Link2,
  LogOut,
  Settings,
  Wrench,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
  section: "Workspace" | "Monitor" | "Tools" | "Account";
  children?: Array<{ label: string; href: string }>;
}

const navItems: NavItem[] = [
  { label: "Command Center", href: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" />, section: "Workspace" },
  {
    label: "Websites",
    href: "/sites",
    icon: <Globe className="h-4 w-4" />,
    section: "Workspace",
    children: [
      { label: "Websites", href: "/sites" },
      { label: "URLs & Submissions", href: "/sites/url" },
      { label: "Auto Submit Jobs", href: "/sites/jobs" },
    ],
  },
  { label: "Submission Stream", href: "/submissions", icon: <Activity className="h-4 w-4" />, section: "Monitor" },
  {
    label: "SEO Toolbox",
    href: "/toolbox",
    icon: <Wrench className="h-4 w-4" />, section: "Tools",
    children: [
      { label: "Toolbox Hub", href: "/toolbox" },
      { label: "Free SEO Tools", href: "/tools" },
      { label: "Blogs", href: "/blogs" },
    ],
  },
  { label: "Billing & Settings", href: "/settings", icon: <Settings className="h-4 w-4" />, section: "Account" },
];

interface DashboardSidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function DashboardSidebar({ mobileOpen, onMobileClose }: DashboardSidebarProps) {
  const pathname = usePathname();
  const user = useUser();
  const stack = useStackApp();
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["Websites", "SEO Toolbox"]));

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

  const content = (
    <div className="flex h-full flex-col bg-card">
      <div className="border-b border-border px-4 py-4">
        <Link href="/" className="inline-flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Bolt className="h-4 w-4" />
          </span>
          <span className="text-base font-semibold">IndexFast</span>
        </Link>
      </div>

      <ScrollArea className="flex-1 px-2 py-3">
        {(["Workspace", "Monitor", "Tools", "Account"] as const).map((section) => {
          const sectionItems = navItems.filter((item) => item.section === section);
          return (
            <div key={section} className="mb-4">
              <p className="px-2 pb-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">{section}</p>
              <div className="space-y-1">
                {sectionItems.map((item) => {
                  const parentActive = item.href ? isActive(item.href) : false;
                  const hasChildren = Boolean(item.children?.length);
                  const open = expanded.has(item.label);

                  return (
                    <div key={item.label}>
                      <Button
                        variant={parentActive ? "secondary" : "ghost"}
                        className="h-9 w-full justify-between"
                        onClick={() => {
                          if (!hasChildren) {
                            onMobileClose();
                            return;
                          }
                          setExpanded((prev) => {
                            const next = new Set(prev);
                            if (next.has(item.label)) next.delete(item.label);
                            else next.add(item.label);
                            return next;
                          });
                        }}
                        asChild={!hasChildren}
                      >
                        {hasChildren ? (
                          <span className="flex w-full items-center justify-between">
                            <span className="inline-flex items-center gap-2">
                              {item.icon}
                              {item.label}
                            </span>
                            <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
                          </span>
                        ) : (
                          <Link href={item.href || "#"} className="inline-flex w-full items-center gap-2">
                            {item.icon}
                            {item.label}
                          </Link>
                        )}
                      </Button>

                      {hasChildren && open && (
                        <div className="ml-3 mt-1 space-y-1 border-l border-border pl-3">
                          {item.children?.map((child) => (
                            <Button
                              key={child.href}
                              variant={isActive(child.href) ? "secondary" : "ghost"}
                              className="h-8 w-full justify-start text-xs"
                              asChild
                              onClick={onMobileClose}
                            >
                              <Link href={child.href} className="inline-flex items-center gap-2">
                                <Link2 className="h-3.5 w-3.5" />
                                {child.label}
                              </Link>
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </ScrollArea>

      <Separator />
      <div className="space-y-3 p-3">
        <div className="flex items-center gap-3 rounded-lg border border-border p-2.5">
          <Avatar>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{displayName}</p>
            <p className="truncate text-xs text-muted-foreground">{primaryEmail}</p>
          </div>
          <Badge variant="outline">Pro</Badge>
        </div>

        <Button variant="outline" className="w-full justify-start" onClick={() => stack.signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden w-72 border-r border-border/70 md:block">{content}</aside>
      <Sheet open={mobileOpen} onOpenChange={(open) => !open && onMobileClose()}>
        <SheetContent side="left" className="w-[85vw] max-w-72 p-0">
          {content}
        </SheetContent>
      </Sheet>
    </>
  );
}
