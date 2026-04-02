"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { useStackApp, useUser } from "@stackframe/stack";
import { useColorMode } from "@/components/ThemeRegistry";
import {
  Activity,
  Bolt,
  Globe,
  LayoutDashboard,
  Settings,
  Wrench,
  LogOut,
  Menu,
  Moon,
  Sun,
  ChevronDown,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navSections = [
  {
    label: "Workspace",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "Websites",
        href: "/sites",
        icon: Globe,
        children: [
          { label: "All Websites", href: "/sites" },
          { label: "URLs & Inventory", href: "/sites/url" },
          { label: "Auto Jobs", href: "/sites/jobs" },
        ],
      },
    ],
  },
  {
    label: "Monitor",
    items: [
      {
        label: "Submissions",
        href: "/submissions",
        icon: Activity,
      },
    ],
  },
  {
    label: "Tools",
    items: [
      {
        label: "Toolbox",
        href: "/toolbox",
        icon: Wrench,
        children: [
          { label: "Overview", href: "/toolbox" },
          { label: "Free Tools", href: "/tools" },
          { label: "Blogs", href: "/blogs" },
        ],
      },
    ],
  },
];

function SidebarContent({ closeSheet }: { closeSheet?: () => void }) {
  const pathname = usePathname();
  const user = useUser();
  const stack = useStackApp();
  const { mode, toggleColorMode } = useColorMode();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

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

  const handleNavClick = () => {
    closeSheet?.();
  };

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="border-b border-border px-4 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Bolt className="h-4.5 w-4.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-none">IndexFast</span>
            <span className="text-[11px] text-muted-foreground">Dashboard</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-5">
        <nav className="space-y-6">
          {navSections.map((section) => (
            <div key={section.label} className="space-y-2">
              <p className="px-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground/70">
                {section.label}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const hasChildren = Boolean(item.children?.length);
                  const active = item.href ? isActive(item.href) : false;
                  const submenuOpen = openSubmenu === item.label;

                  return (
                    <div key={item.label}>
                      {!hasChildren ? (
                        <Link
                          href={item.href || "#"}
                          onClick={handleNavClick}
                          className={cn(
                            "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                            active
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                          <span className="flex-1">{item.label}</span>
                        </Link>
                      ) : (
                        <>
                          <button
                            onClick={() => setOpenSubmenu(submenuOpen ? null : item.label)}
                            className={cn(
                              "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                              active
                                ? "bg-muted text-foreground"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                          >
                            <item.icon className="h-4 w-4" />
                            <span className="flex-1">{item.label}</span>
                            <ChevronDown className={cn(
                              "h-4 w-4 transition-transform",
                              submenuOpen && "rotate-180"
                            )} />
                          </button>
                          {submenuOpen && item.children && (
                            <div className="ml-4 space-y-1 border-l border-border pl-3 py-1">
                              {item.children.map((child) => (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  onClick={handleNavClick}
                                  className={cn(
                                    "block rounded-md px-2.5 py-1.5 text-xs transition-colors",
                                    pathname === child.href
                                      ? "bg-muted text-foreground"
                                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                  )}
                                >
                                  {child.label}
                                </Link>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      <div className="border-t border-border p-4 space-y-3">
        <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3">
          <Avatar className="h-10 w-10 border border-border">
            <AvatarFallback className="bg-muted text-foreground text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium leading-tight">{displayName}</p>
            <p className="truncate text-[11px] text-muted-foreground">{primaryEmail}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-md px-2 text-[11px]"
            asChild
          >
            <Link href="/settings">
              <Settings className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Settings</span>
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-md px-2 text-[11px]"
            onClick={toggleColorMode}
            title={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
          >
            {mode === "dark" ? (
              <Sun className="h-3.5 w-3.5" />
            ) : (
              <Moon className="h-3.5 w-3.5" />
            )}
            <span className="hidden sm:inline">{mode === "dark" ? "Light" : "Dark"}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-md px-2 text-[11px] text-destructive hover:bg-destructive/10"
            onClick={() => {
              closeSheet?.();
              stack.signOut();
            }}
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-16 px-4 flex items-center border-b border-border/20 bg-background/95 backdrop-blur-sm">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-lg">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SidebarContent closeSheet={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
        <div className="flex-1 text-center">
          <h1 className="font-bold">Dashboard</h1>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:sticky md:top-0 md:flex md:h-screen w-72 flex-col border-r border-border/20 bg-background/50 backdrop-blur-sm">
        <SidebarContent />
      </aside>
    </>
  );
}
