"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useMemo, useState, type ComponentType } from "react";
import { useStackApp, useUser } from "@stackframe/stack";
import { useColorMode } from "@/components/ThemeRegistry";
import {
  Globe,
  Settings,
  Wrench,
  LogOut,
  Menu,
  Moon,
  Sun,
  Send,
  Clock,
  Bot,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface NavItem {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { label: "Sites", href: "/sites", icon: Globe },
  { label: "Push Indexing", href: "/dashboard/push", icon: Send },
  { label: "Scheduler", href: "/dashboard/cron", icon: Clock },
  { label: "AI Agents", href: "/dashboard/mcp", icon: Bot },
  { label: "Toolbox", href: "/toolbox", icon: Wrench },
];

function SidebarContent({ closeSheet }: { closeSheet?: () => void }) {
  const pathname = usePathname();
  const user = useUser();
  const stack = useStackApp();
  const { mode, toggleColorMode } = useColorMode();

  const displayName = user?.displayName?.trim() || "User";
  const primaryEmail = user?.primaryEmail || "";
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

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const handleNavClick = () => {
    closeSheet?.();
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Logo */}
      <div className="px-4 pt-5 pb-3">
        <Link
          href="/dashboard"
          onClick={handleNavClick}
          className="flex items-center gap-2.5"
        >
          <Image
            src="/logo.png"
            alt="IndexFast"
            width={24}
            height={24}
            className="h-6 w-6 rounded-md object-cover"
          />
          <span className="text-sm font-semibold text-foreground tracking-tight">
            IndexFast
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 min-h-0 overflow-y-auto px-2 py-1">
        <ul className="space-y-px">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={handleNavClick}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] leading-tight",
                    active
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0 opacity-70" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom: user + actions */}
      <div className="mt-auto border-t border-border px-2 py-3 space-y-1">
        {/* User info */}
        <div className="flex items-center gap-2.5 rounded-md px-2.5 py-1.5">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="bg-secondary text-muted-foreground text-[10px] font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] leading-tight text-foreground">
              {displayName}
            </p>
            {primaryEmail && (
              <p className="truncate text-[11px] text-muted-foreground">
                {primaryEmail}
              </p>
            )}
          </div>
        </div>

        {/* Action row */}
        <div className="flex items-center gap-px">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 h-7 rounded-md text-muted-foreground hover:text-foreground"
            asChild
            title="Settings"
            aria-label="Settings"
          >
            <Link href="/settings" onClick={handleNavClick}>
              <Settings className="h-3.5 w-3.5" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 h-7 rounded-md text-muted-foreground hover:text-foreground"
            onClick={toggleColorMode}
            title={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
            aria-label={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
          >
            {mode === "dark" ? (
              <Sun className="h-3.5 w-3.5" />
            ) : (
              <Moon className="h-3.5 w-3.5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 h-7 rounded-md text-muted-foreground hover:text-destructive"
            onClick={() => {
              closeSheet?.();
              stack.signOut();
            }}
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut className="h-3.5 w-3.5" />
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
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 px-3 flex items-center border-b border-border bg-background">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open navigation"
              className="h-8 w-8 rounded-md"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-60 p-0">
            <SidebarContent closeSheet={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
        <span className="flex-1 text-center text-sm font-medium text-foreground">
          Dashboard
        </span>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:flex md:h-screen md:w-60 md:flex-col z-20 border-r border-border bg-background">
        <SidebarContent />
      </aside>
    </>
  );
}
