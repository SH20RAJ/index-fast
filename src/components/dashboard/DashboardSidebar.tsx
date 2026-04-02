"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { useStackApp, useUser } from "@stackframe/stack";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Bolt,
  Globe,
  LayoutDashboard,
  Settings,
  Wrench,
  CheckCircle2,
  FileText,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Search,
  Sparkles,
  Command,
  UserCircle2,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navSections = [
  {
    label: "Workspace",
    items: [
      {
        label: "Command Center",
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
        label: "Submission Stream",
        href: "/submissions",
        icon: Activity,
      },
    ],
  },
  {
    label: "SEO Tools",
    items: [
      {
        label: "Toolbox Hub",
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

export default function DashboardSidebar() {
  const pathname = usePathname();
  const user = useUser();
  const stack = useStackApp();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

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
    <Sidebar variant="sidebar" collapsible="icon" className="border-r border-border/40 bg-background/50 backdrop-blur-xl">
      <SidebarHeader className="h-16 flex flex-row items-center gap-3 px-4 relative group">
        <Link href="/" className="flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95">
          <motion.div 
            whileHover={{ rotate: 180 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-xl shadow-primary/30"
          >
            <Bolt className="h-5 w-5 text-primary-foreground" />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-tighter leading-none">IndexFast</span>
            <span className="text-[10px] font-bold text-primary tracking-widest uppercase mt-0.5">Premium</span>
          </div>
        </Link>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
      </SidebarHeader>

      <SidebarContent className="px-2 py-6 custom-scrollbar">
        {navSections.map((section) => (
          <SidebarGroup key={section.label} className="mt-4 first:mt-0">
            <SidebarGroupLabel className="px-3 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/50 mb-2">
              {section.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {section.items.map((item) => {
                  const hasChildren = Boolean(item.children?.length);
                  const active = item.href ? isActive(item.href) : false;

                  return (
                    <SidebarMenuItem key={item.label}>
                      {!hasChildren ? (
                        <SidebarMenuButton
                          asChild
                          isActive={active}
                          tooltip={item.label}
                          onMouseEnter={() => setHoveredItem(item.label)}
                          onMouseLeave={() => setHoveredItem(null)}
                          className={cn(
                            "relative group h-10 px-3 rounded-xl transition-all duration-300",
                            active 
                              ? "bg-primary/10 text-primary font-black shadow-sm" 
                              : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                          )}
                        >
                          <Link href={item.href || "#"}>
                            <item.icon className={cn(
                              "h-4 w-4 transition-transform duration-300 group-hover:scale-110",
                              active ? "text-primary stroke-[2.5px]" : "opacity-70 group-hover:opacity-100"
                            )} />
                            <span className="tracking-tight">{item.label}</span>
                            {active && (
                              <motion.div
                                layoutId="active-pill"
                                className="absolute left-0 w-1 h-5 bg-primary rounded-full"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                              />
                            )}
                          </Link>
                        </SidebarMenuButton>
                      ) : (
                        <div className="space-y-1">
                          <SidebarMenuButton
                            isActive={active}
                            tooltip={item.label}
                            className={cn(
                              "group h-10 px-3 rounded-xl transition-all duration-300",
                              active 
                                ? "bg-primary/5 text-primary font-black" 
                                : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                            )}
                          >
                            <item.icon className={cn(
                              "h-4 w-4 transition-transform duration-300 group-hover:scale-110",
                              active ? "text-primary stroke-[2.5px]" : "opacity-70 group-hover:opacity-100"
                            )} />
                            <span className="tracking-tight">{item.label}</span>
                            <ChevronRight className={cn(
                              "ml-auto h-3.5 w-3.5 opacity-40 transition-transform group-data-[state=open]:rotate-90",
                              active && "opacity-100"
                            )} />
                          </SidebarMenuButton>
                          <SidebarMenuSub className="border-l-0 ml-4 pl-4 relative">
                            <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-primary/20 via-primary/5 to-transparent" />
                            {item.children?.map((child) => (
                              <SidebarMenuSubItem key={child.href}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={pathname === child.href}
                                  className={cn(
                                    "h-8 px-3 rounded-lg transition-all duration-200 text-xs",
                                    pathname === child.href 
                                      ? "text-primary font-black bg-primary/5" 
                                      : "text-muted-foreground/70 hover:text-foreground hover:bg-muted/20"
                                  )}
                                >
                                  <Link href={child.href}>{child.label}</Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </div>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        <SidebarSeparator className="my-6 opacity-40" />
        
        <SidebarGroup>
          <div className="px-3 mb-3 bg-muted/30 rounded-2xl p-4 border border-border/10 relative overflow-hidden group/upgrade">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover/upgrade:opacity-20 transition-opacity">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Status</p>
            <h4 className="text-xs font-black tracking-tight mb-2">Pro Plan Active</h4>
            <div className="h-1.5 w-full bg-primary/20 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "75%" }}
                className="h-full bg-primary"
              />
            </div>
            <p className="text-[9px] font-bold text-muted-foreground mt-2 flex items-center gap-1">
              <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" /> All engines monitored
            </p>
          </div>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-4 bg-muted/40 border-t border-border/20 backdrop-blur-md">
        <div className="flex items-center gap-3 w-full">
          <Avatar className="h-10 w-10 border-2 border-primary/20 shadow-xl shadow-primary/5 group-hover:scale-105 transition-transform">
            <AvatarFallback className="bg-gradient-to-br from-primary/10 to-primary/30 text-primary font-black text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-black tracking-tight leading-none mb-1">{displayName}</p>
            <p className="truncate text-[10px] font-bold text-muted-foreground opacity-60">{primaryEmail}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-9 px-0 rounded-xl gap-2 text-[11px] font-black uppercase tracking-tighter border-border/40 bg-background/50 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all active:scale-95"
            asChild
          >
            <Link href="/settings">
              <Settings className="h-3.5 w-3.5" />
              Settings
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-9 px-0 rounded-xl gap-2 text-[11px] font-black uppercase tracking-tighter text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all active:scale-95"
            onClick={() => stack.signOut()}
          >
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </Button>
        </div>
      </SidebarFooter>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </Sidebar>
  );
}
