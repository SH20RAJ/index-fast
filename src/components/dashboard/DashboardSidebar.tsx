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
          { label: "Universal Ping", href: "/toolbox/ping" },
          { label: "Free Tools", href: "/tools" },
          { label: "Blogs", href: "/blogs" },
        ],
      },
    ],
  },
];

function SidebarItem({ 
  item, 
  active, 
  onClick 
}: { 
  item: typeof navSections[0]["items"][0]; 
  active: boolean; 
  onClick?: () => void;
}) {
  return (
    <Button
      variant={active ? "default" : "ghost"}
      color={active ? "primary" : "secondary"}
      asChild
      className={cn(
        "w-full justify-start gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-all duration-200",
        active 
          ? "shadow-md shadow-primary/20" 
          : "text-muted-foreground hover:text-foreground"
      )}
      onClick={onClick}
    >
      <Link href={item.href || "#"}>
        <item.icon className={cn("h-4 w-4 shrink-0", active ? "text-primary-foreground" : "")} />
        <span className="flex-1 font-medium">{item.label}</span>
        {active && <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground/90 animate-in fade-in zoom-in duration-300" />}
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
    <div className="flex h-full min-h-0 flex-col border-r border-border/50 bg-background/60 backdrop-blur-3xl dark:bg-background/40">
      <div className="border-b border-border/50 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer" onClick={handleNavClick}>
            <div className="absolute -inset-1.5 bg-gradient-to-tr from-primary/30 to-primary/0 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Image 
              src="/logo.png" 
              alt="IndexFast logo" 
              width={40} 
              height={40} 
              className="relative h-10 w-10 rounded-xl object-cover ring-1 ring-border/50 shadow-lg" 
            />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-base font-bold leading-none tracking-tight">IndexFast</span>
            <span className="text-[11px] text-muted-foreground mt-1 font-medium italic">Workspace Command</span>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-3 py-6">
        <nav className="space-y-8">
          {navSections.map((section) => (
            <div key={section.label} className="space-y-3">
              <p className="px-3 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/50">
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
                        <SidebarItem 
                          item={item} 
                          active={active} 
                          onClick={handleNavClick} 
                        />
                      ) : (
                        <>
                          <Button
                            variant={submenuOpen ? "secondary" : "ghost"}
                            color="secondary"
                            onClick={() => setOpenSubmenu(submenuOpen ? null : item.label)}
                            className={cn(
                              "w-full justify-start gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-all duration-200",
                              submenuOpen ? "bg-secondary/50 text-foreground" : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            <item.icon className="h-4 w-4 shrink-0" />
                            <span className="flex-1 font-medium">{item.label}</span>
                            <ChevronDown className={cn(
                              "h-4 w-4 transition-transform duration-300",
                              submenuOpen && "rotate-180"
                            )} />
                          </Button>
                          
                          {submenuOpen && item.children && (
                            <div className="mt-1.5 ml-5.5 space-y-1 border-l-2 border-border/30 pl-4 py-1 animate-in slide-in-from-left-2 duration-300">
                              {item.children.map((child) => {
                                const childActive = pathname === child.href;
                                return (
                                  <Link
                                    key={child.href}
                                    href={child.href}
                                    onClick={handleNavClick}
                                    className={cn(
                                      "block rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all duration-200",
                                      childActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
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

      <div className="mt-auto border-t border-border/50 p-4 space-y-4 bg-muted/30 backdrop-blur-xl">
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
          >
            <Link href="/settings">
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
          >
            {mode === "dark" ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-indigo-400" />
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
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:flex md:h-screen md:w-72 md:flex-col md:overflow-hidden z-20">
        <SidebarContent />
      </aside>
    </>
  );
}
