"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useUser } from "@stackframe/stack";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useColorMode } from "@/components/ThemeRegistry";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

export default function Navbar() {
  const user = useUser();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { mode, toggleColorMode } = useColorMode();

  const primaryLinks = [
    { label: "Home", href: "/" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Docs", href: "/docs" },
    { label: "Tools", href: "/tools" },
    { label: "Blog", href: "/blog" },
    { label: "Pricing", href: "/#pricing" },
  ];

  function isActiveLink(href: string) {
    if (href === "/") {
      return pathname === "/";
    }
    if (href.startsWith("/tools")) {
      return pathname.startsWith("/tools");
    }
    if (href.startsWith("/blog")) {
      return pathname.startsWith("/blog");
    }
    if (href.startsWith("/how-it-works")) {
      return pathname.startsWith("/how-it-works");
    }
    if (href.startsWith("/docs")) {
      return pathname.startsWith("/docs");
    }
    return false;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group inline-flex items-center gap-2.5 transition-transform hover:scale-105">
          <Image src="/logo.png" alt="IndexFast logo" width={32} height={32} className="h-8 w-8 rounded-lg object-cover shadow-sm" />
          <span className="text-base font-bold tracking-tight text-foreground">IndexFast</span>
        </Link>

        <div className="hidden items-center gap-1.5 md:flex">
          {primaryLinks.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              asChild
              className={`h-9 px-4 text-sm font-medium transition-all ${
                isActiveLink(item.href)
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleColorMode}
            aria-label="Toggle dark mode"
            className="h-9 w-9"
          >
            {mode === "dark" ? (
              <Sun className="h-4 w-4 transition-transform hover:rotate-90" />
            ) : (
              <Moon className="h-4 w-4 transition-transform hover:-rotate-12" />
            )}
          </Button>
          {user ? (
            <Button asChild className="h-9 font-semibold shadow-md">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild className="h-9 px-4 font-medium">
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild className="h-9 px-4 font-semibold shadow-md">
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleColorMode}
            aria-label="Toggle dark mode"
            className="h-9 w-9"
          >
            {mode === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open menu" className="h-9 w-9">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-sm border-l border-border/50">
              <SheetHeader className="border-b border-border/50 pb-4">
                <SheetTitle className="flex items-center gap-2 text-left">
                  <Image
                    src="/logo.png"
                    alt="IndexFast logo"
                    width={20}
                    height={20}
                    className="h-5 w-5 rounded object-cover"
                  />
                  <span className="text-lg font-bold">IndexFast</span>
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 grid gap-2">
                {primaryLinks.map((item) => (
                  <Button
                    key={item.label}
                    variant="ghost"
                    asChild
                    className={`justify-start px-4 text-base ${
                      isActiveLink(item.href)
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground"
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    <Link href={item.href}>{item.label}</Link>
                  </Button>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="grid gap-2">
                {user ? (
                  <Button asChild onClick={() => setMobileOpen(false)} className="font-semibold">
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" asChild onClick={() => setMobileOpen(false)}>
                      <Link href="/sign-in">Sign In</Link>
                    </Button>
                    <Button asChild onClick={() => setMobileOpen(false)} className="font-semibold">
                      <Link href="/sign-up">Get Started</Link>
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
