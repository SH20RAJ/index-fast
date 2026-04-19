"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Equal, X, Moon, Sun } from "lucide-react";
import { useUser } from "@stackframe/stack";
import { useColorMode } from "@/components/ThemeRegistry";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Product", href: "/how-it-works" },
  { name: "Pricing", href: "/pricing" },
  { name: "Docs", href: "/docs" },
  { name: "Tools", href: "/tools" },
];

export default function Navbar() {
  const user = useUser();
  const pathname = usePathname();
  const { mode, toggleColorMode } = useColorMode();
  const [menuState, setMenuState] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function isActiveLink(href: string) {
    if (href === "/how-it-works") return pathname.startsWith("/how-it-works");
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="fixed left-0 top-0 z-50 w-full px-3 pt-3 sm:px-4 sm:pt-4">
      <nav
        data-state={menuState ? "active" : undefined}
        className={cn(
          "relative mx-auto grid max-w-6xl grid-cols-[1fr_auto] items-center gap-2 rounded-2xl border border-transparent px-3 py-2.5 transition-all duration-300 sm:px-4 lg:grid-cols-[auto_1fr_auto] lg:gap-4",
          isScrolled &&
            "border-border/70 bg-background/75 shadow-lg shadow-black/[0.03] backdrop-blur-xl dark:bg-background/70 dark:shadow-black/20",
        )}
      >
        <div className="flex min-w-0 items-center justify-between gap-3 lg:justify-start">
          <Link href="/" aria-label="IndexFast home" className="flex shrink-0 items-center gap-2.5 rounded-lg outline-offset-4">
            <Image src="/logo.png" alt="IndexFast" width={32} height={32} className="h-8 w-8 rounded-lg object-cover shadow-sm" />
            <span className="text-sm font-semibold tracking-tight text-foreground sm:text-base">IndexFast</span>
          </Link>

          <button
            type="button"
            onClick={() => setMenuState(!menuState)}
            aria-label={menuState ? "Close menu" : "Open menu"}
            className="relative -mr-1 rounded-xl p-2.5 lg:hidden"
          >
            <Equal
              className={cn("m-auto size-6 transition-all duration-200", menuState && "rotate-90 scale-0 opacity-0")}
            />
            <X
              className={cn(
                "absolute inset-0 m-auto size-6 transition-all duration-200",
                menuState ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0",
              )}
            />
          </button>
        </div>

        <ul className="hidden items-center justify-center gap-1 justify-self-center lg:flex">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActiveLink(item.href)
                    ? "bg-primary/10 text-foreground"
                    : "text-muted-foreground hover:bg-muted/80 hover:text-foreground",
                )}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        <div
          className={cn(
            "col-span-2 flex flex-col gap-4 rounded-2xl border border-border/80 bg-background/95 p-5 shadow-2xl backdrop-blur-xl dark:bg-card/95 max-lg:mt-2 lg:col-span-1 lg:flex lg:w-auto lg:flex-row lg:items-center lg:gap-2 lg:justify-self-end lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none",
            menuState ? "flex" : "hidden lg:flex",
          )}
        >
          <ul className="space-y-1 border-b border-border/60 pb-4 lg:hidden">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMenuState(false)}
                  className={cn(
                    "block rounded-xl px-3 py-2.5 text-base font-medium",
                    isActiveLink(item.href) ? "bg-primary/10 text-foreground" : "text-muted-foreground",
                  )}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center lg:flex-row">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleColorMode}
              aria-label="Toggle color mode"
              className="hidden h-9 w-9 shrink-0 rounded-lg lg:inline-flex"
            >
              {mode === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {user ? (
              <Button asChild size="sm" className="h-10 rounded-lg px-5 font-semibold shadow-sm">
                <Link href="/dashboard" onClick={() => setMenuState(false)}>
                  Dashboard
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild size="sm" className="h-10 rounded-lg font-medium lg:px-3">
                  <Link href="/sign-in" onClick={() => setMenuState(false)}>
                    Sign in
                  </Link>
                </Button>
                <Button asChild size="sm" className="h-10 rounded-lg px-5 font-semibold shadow-md shadow-primary/15">
                  <Link href="/sign-up" onClick={() => setMenuState(false)}>
                    Get started
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
