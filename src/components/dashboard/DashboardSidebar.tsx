"use client";

import Link from "next/link";
import Image from "next/image";
import { useSiteContext } from "@/components/dashboard/SiteContext";
import WebsiteSwitcher from "@/components/dashboard/WebsiteSwitcher";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState, type ComponentType } from "react";
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
  Box,
  LineChart,
  RefreshCw,
  Bot,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface NavChildItem {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  children?: NavChildItem[];
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    label: "Main",
    items: [
      {
        label: "My Sites",
        href: "/dashboard",
        icon: Globe,
      },
      {
        label: "AI Agents (MCP)",
        href: "/dashboard/mcp",
        icon: Bot,
      },
      {
        label: "Toolbox",
        href: "/toolbox",
        icon: Wrench,
      },
    ],
  },
];


function SidebarItem({ 
  item, 
  active, 
  onClick,
  href
}: { 
  item: NavItem;
  active: boolean; 
  onClick?: () => void;
  href?: string;
}) {
  return (
    <Button
      variant="ghost"
      asChild
      className={cn(
        "w-full justify-start gap-3 rounded-none border-l-2 px-4 py-2.5 text-sm transition-all duration-200",
        active 
          ? "border-primary bg-primary/5 text-foreground font-semibold" 
          : "border-transparent text-muted-foreground hover:bg-secondary/5 hover:text-foreground"
      )}
      onClick={onClick}
    >
      <Link href={href || item.href || "#"}>
        <item.icon className={cn("h-4 w-4 shrink-0", active ? "text-primary" : "")} />
        <span className="flex-1">{item.label}</span>
      </Link>
    </Button>
  );
}

function SidebarContent({ closeSheet }: { closeSheet?: () => void }) {
  const pathname = usePathname();
  const user = useUser();
  const stack = useStackApp();
  const { mode, toggleColorMode } = useColorMode();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  
  const { websites, selectedSite, setSelectedSite } = useSiteContext();

  const getHref = (href: string) => {
    if (!selectedSite || 
        href.startsWith('http') || 
        href.startsWith('/toolbox') || 
        href.startsWith('/blogs') || 
        href.startsWith('/settings') || 
        href.startsWith('/tools')) {
      return href;
    }
    const separator = href.includes("?") ? "&" : "?";
    return `${href}${separator}url=${encodeURIComponent(selectedSite.url)}`;
  };

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
  const isChildActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    const section = navSections.find((group) =>
      group.items.some((item) => item.children?.some((child) => isChildActive(child.href)))
    );

    if (section) {
      const activeItem = section.items.find((item) =>
        item.children?.some((child) => isChildActive(child.href))
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
    <div className="flex h-full min-h-0 flex-col border-r border-border/70 bg-card/40 backdrop-blur-2xl dark:bg-card/25">
      <div className="px-6 py-6 pb-4">
        <div className="flex items-center gap-3">
          <Link href={getHref("/dashboard")} className="relative group cursor-pointer" onClick={handleNavClick}>
            <div className="absolute -inset-2 rounded-xl bg-primary/15 blur-xl opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
            <Image 
              src="/logo.png" 
              alt="IndexFast" 
              width={36} 
              height={36} 
              className="relative h-9 w-9 rounded-xl object-cover ring-1 ring-border/50 shadow-sm" 
            />
          </Link>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-sm font-bold leading-none tracking-tight">IndexFast</span>
            <span className="text-[10px] text-zinc-400 mt-1 font-medium">Dashboard</span>
          </div>
        </div>

        {/* Global Site Selector */}
        {websites.length > 0 && (
          <div className="mt-6">
            <WebsiteSwitcher />
          </div>
        )}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-2">
        <nav className="space-y-6">
          {navSections.map((section) => (
            <div key={section.label} className="space-y-1">
              <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 dark:text-zinc-400">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const hasChildren = Boolean(item.children?.length);
                  const active = item.href
                    ? isActive(item.href) || Boolean(item.children?.some((child) => isChildActive(child.href)))
                    : false;
                  const submenuOpen = openSubmenu === item.label;

                  return (
                    <div key={item.label}>
                      {!hasChildren ? (
                        <SidebarItem 
                          item={item} 
                          active={active} 
                          onClick={handleNavClick}
                          href={getHref(item.href)}
                        />
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            onClick={() => setOpenSubmenu(submenuOpen ? null : item.label)}
                            className={cn(
                              "w-full justify-start gap-3 rounded-xl px-3 py-2 text-sm transition-all duration-200",
                              submenuOpen ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800/50 dark:text-zinc-100" : "text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                            )}
                          >
                            <item.icon className="h-4 w-4 shrink-0 opacity-70" />
                            <span className="flex-1 font-medium">{item.label}</span>
                            <ChevronDown className={cn(
                              "h-3.5 w-3.5 opacity-40 transition-transform duration-300",
                              submenuOpen && "rotate-180"
                            )} />
                          </Button>
                          
                          {submenuOpen && item.children && (
                            <div className="mt-0.5 ml-4 space-y-0.5 border-l border-zinc-200 dark:border-zinc-800 pl-4 py-1 animate-in slide-in-from-left-2 duration-300">
                              {item.children.map((child) => {
                                const childActive = isChildActive(child.href);
                                return (
                                  <Link
                                    key={child.href}
                                    href={getHref(child.href)}
                                    onClick={handleNavClick}
                                    className={cn(
                                      "block rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all duration-200",
                                      childActive
                                        ? "text-primary"
                                        : "text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                                    )}
                                  >
                                    {child.label}
                                  </Link>
                                );
                              })}
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

      <div className="mt-auto space-y-4 border-t border-border/70 bg-muted/20 p-4 backdrop-blur-xl">
        <div className="flex items-center gap-3 rounded-2xl p-2 transition-colors hover:bg-background/20">
          <Avatar className="h-10 w-10 border-2 border-primary/20 shadow-sm">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold leading-tight">{displayName}</p>
            <p className="truncate text-[10px] text-muted-foreground font-medium">{primaryEmail}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="secondary"
            size="sm"
            color="secondary"
            className="h-9 rounded-xl px-0 shadow-sm transition-transform active:scale-95"
            asChild
            title="Settings"
            aria-label="Settings"
          >
            <Link href={getHref("/settings")}>
              <Settings className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            color="secondary"
            className="h-9 rounded-xl px-0 shadow-sm transition-transform active:scale-95"
            onClick={toggleColorMode}
            title={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
            aria-label={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
          >
            {mode === "dark" ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-pink-400" />
            )}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            color="danger"
            className="h-9 rounded-xl px-0 shadow-sm transition-transform active:scale-95"
            onClick={() => {
              closeSheet?.();
              stack.signOut();
            }}
            title="Logout"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
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
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-16 px-4 flex items-center border-b border-black/5 bg-white/85 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/85">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open navigation menu" className="rounded-xl border border-black/5 bg-white/70 shadow-sm dark:border-white/10 dark:bg-white/5">
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
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:flex md:h-screen md:w-72 md:flex-col z-20 overflow-y-auto border-r border-border/70">
        <SidebarContent />
      </aside>
    </>
  );
}
