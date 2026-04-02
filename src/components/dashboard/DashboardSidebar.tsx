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
  CheckCircle2,
  LogOut,
  Menu,
  Moon,
  Sun,
  ChevronDown,
  Zap,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
    <div className="flex flex-col gap-0 h-full bg-gradient-to-b from-background via-background to-muted/20">
      {/* Premium Header */}
      <div className="px-4 pt-6 pb-4 space-y-4 border-b border-border/10 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="relative flex h-12 w-12 items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/60 rounded-2xl opacity-90 blur-sm" />
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20">
              <Bolt className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-base font-black tracking-tight leading-tight">IndexFast</span>
            <span className="text-[10px] font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent tracking-widest uppercase">Premium ✨</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-6 space-y-8">
        <nav className="space-y-8">
          {navSections.map((section) => (
            <div key={section.label} className="space-y-3">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 px-3">
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
                            "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 relative group",
                            active
                              ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/30"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {active && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-primary-foreground to-primary-foreground/60 rounded-r-full" />
                          )}
                          <item.icon className={cn(
                            "w-4 h-4 transition-all duration-300",
                            active ? "scale-110" : "group-hover:scale-110"
                          )} />
                          <span className="flex-1">{item.label}</span>
                          {active && <Zap className="w-3 h-3 text-primary-foreground animate-pulse" />}
                        </Link>
                      ) : (
                        <>
                          <button
                            onClick={() => setOpenSubmenu(submenuOpen ? null : item.label)}
                            className={cn(
                              "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 text-left relative group",
                              active
                                ? "bg-gradient-to-r from-primary/15 to-primary/5 text-primary"
                                : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            <item.icon className={cn(
                              "w-4 h-4 transition-all duration-300",
                              active ? "text-primary" : ""
                            )} />
                            <span className="flex-1">{item.label}</span>
                            <ChevronDown className={cn(
                              "w-4 h-4 transition-transform duration-300",
                              submenuOpen && "rotate-180"
                            )} />
                          </button>
                          {submenuOpen && item.children && (
                            <div className="mt-2 ml-4 space-y-2 border-l-2 border-primary/30 pl-4 pb-2">
                              {item.children.map((child) => (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  onClick={handleNavClick}
                                  className={cn(
                                    "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200",
                                    pathname === child.href
                                      ? "text-primary bg-gradient-to-r from-primary/20 to-transparent font-bold"
                                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                  )}
                                >
                                  <div className={cn(
                                    "w-1.5 h-1.5 rounded-full transition-all",
                                    pathname === child.href ? "bg-primary w-2" : "bg-muted-foreground/30"
                                  )} />
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

      {/* Premium Status Card */}
      <div className="mx-3 mb-6 p-4 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-2xl border border-primary/20 shadow-xl shadow-primary/10 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10" />
        <div className="relative space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Account Status</p>
            <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-[9px] font-bold">Premium</Badge>
          </div>
          <h4 className="text-sm font-black tracking-tight">Pro Plan Active</h4>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-muted-foreground font-medium">Usage this month</span>
              <span className="text-[9px] font-bold text-primary">75%</span>
            </div>
            <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden border border-primary/20">
              <div className="h-full w-3/4 bg-gradient-to-r from-primary to-primary/60 rounded-full" />
            </div>
          </div>
          <p className="text-[8px] font-bold text-muted-foreground flex items-center gap-1.5 mt-2">
            <CheckCircle2 className="h-3 w-3 text-emerald-500 flex-shrink-0" /> 
            <span>All engines monitored & running</span>
          </p>
        </div>
      </div>

      {/* Premium User Section */}
      <div className="border-t border-border/10 bg-gradient-to-t from-muted/40 to-transparent p-4 space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-primary/5 to-transparent border border-primary/10">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10 rounded-xl blur" />
            <Avatar className="relative h-12 w-12 border-2 border-primary/30 shadow-lg shadow-primary/20">
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/40 text-primary font-black">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold leading-tight">{displayName}</p>
            <p className="truncate text-[9px] font-medium text-muted-foreground">{primaryEmail}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Button
            size="sm"
            className="h-10 rounded-xl gap-1.5 text-[11px] font-bold bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300"
            asChild
          >
            <Link href="/settings">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>
          </Button>
          <Button
            size="sm"
            className="h-10 rounded-xl gap-1.5 text-[11px] font-bold bg-muted/50 hover:bg-muted text-foreground transition-all duration-300"
            onClick={toggleColorMode}
            title={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
          >
            {mode === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">{mode === "dark" ? "Light" : "Dark"}</span>
          </Button>
          <Button
            size="sm"
            className="h-10 rounded-xl gap-1.5 text-[11px] font-bold text-destructive bg-destructive/10 hover:bg-destructive/20 transition-all duration-300"
            onClick={() => {
              closeSheet?.();
              stack.signOut();
            }}
          >
            <LogOut className="h-4 w-4" />
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
      <aside className="hidden md:flex w-72 flex-col border-r border-border/20 bg-background/50 backdrop-blur-sm">
        <SidebarContent />
      </aside>
    </>
  );
}
