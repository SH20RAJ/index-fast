"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useStackApp, useUser } from "@stackframe/stack";
import { useColorMode } from "@/components/ThemeRegistry";
import {
  Activity,
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

  useEffect(() => {
    const section = navSections.find((group) =>
      group.items.some((item) => item.children?.some((child) => pathname === child.href || pathname.startsWith(`${child.href}/`)))
    );

    if (section) {
      const activeItem = section.items.find((item) =>
        item.children?.some((child) => pathname === child.href || pathname.startsWith(`${child.href}/`))
      );
      if (activeItem) {
        setOpenSubmenu(activeItem.label);
      }
    }
  }, [pathname]);

  const handleNavClick = () => {
    closeSheet?.();
  };

  return (
    <div className="flex h-full min-h-0 flex-col border-r border-white/40 bg-white/75 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/85">
      <div className="border-b border-black/5 px-4 py-4 dark:border-white/10">
        <div className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white/70 px-3 py-2 shadow-sm dark:border-white/10 dark:bg-white/5">
          <Image src="/logo.png" alt="IndexFast logo" width={36} height={36} className="h-9 w-9 rounded-xl object-cover ring-1 ring-black/5" />
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-sm font-semibold leading-none tracking-tight">IndexFast</span>
            <span className="text-[11px] text-muted-foreground">Workspace command center</span>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-3 py-5">
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
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "group flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-all",
                            active
                              ? "bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950"
                              : "text-muted-foreground hover:bg-black/5 hover:text-foreground dark:hover:bg-white/8"
                          )}
                        >
                          <item.icon className="h-4 w-4 shrink-0" />
                          <span className="flex-1">{item.label}</span>
                          {active && <span className="h-2 w-2 rounded-full bg-current/85" />}
                        </Link>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => setOpenSubmenu(submenuOpen ? null : item.label)}
                            aria-expanded={submenuOpen}
                            className={cn(
                              "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition-all",
                              active
                                ? "bg-black/5 text-foreground dark:bg-white/8"
                                : "text-muted-foreground hover:bg-black/5 hover:text-foreground dark:hover:bg-white/8"
                            )}
                          >
                            <item.icon className="h-4 w-4 shrink-0" />
                            <span className="flex-1">{item.label}</span>
                            <ChevronDown className={cn(
                              "h-4 w-4 transition-transform",
                              submenuOpen && "rotate-180"
                            )} />
                          </button>
                          {submenuOpen && item.children && (
                            <div className="ml-4 space-y-1 border-l border-border/80 pl-3 py-1">
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

      <div className="mt-auto border-t border-border p-4 space-y-3">
        <div className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white/80 p-3 shadow-sm dark:border-white/10 dark:bg-white/5">
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
            className="h-9 rounded-xl border-black/10 bg-white/80 px-2 text-[11px] shadow-sm hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
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
            className="h-9 rounded-xl border-black/10 bg-white/80 px-2 text-[11px] shadow-sm hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
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
            className="h-9 rounded-xl border-black/10 bg-white/80 px-2 text-[11px] text-destructive shadow-sm hover:bg-destructive/10 dark:border-white/10 dark:bg-white/5"
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
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-16 px-4 flex items-center border-b border-black/5 bg-white/85 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/85">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-xl border border-black/5 bg-white/70 shadow-sm dark:border-white/10 dark:bg-white/5">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <SidebarContent closeSheet={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
        <div className="flex-1 text-center">
          <h1 className="text-sm font-semibold tracking-tight">Dashboard</h1>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:flex md:h-screen md:w-72 md:flex-col md:overflow-hidden">
        <SidebarContent />
      </aside>
    </>
  );
}
