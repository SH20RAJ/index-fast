"use client";
import { useState } from "react";
import Link from "next/link";
import { useUser } from "@stackframe/stack";
import { Bolt, Menu, Moon, Sun, X } from "lucide-react";
import { useColorMode } from "@/components/ThemeRegistry";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

export default function Navbar() {
  const user = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { mode, toggleColorMode } = useColorMode();

  const primaryLinks = [
    { label: "Tools", href: "/tools" },
    { label: "Blog", href: "/blog" },
    { label: "Pricing", href: "/#pricing" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group inline-flex items-center gap-2.5">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Bolt className="h-4 w-4" />
          </span>
          <span className="text-base font-black tracking-tight">IndexFast</span>
        </Link>

        <div className="hidden items-center gap-1 rounded-xl border border-border/70 bg-card/60 p-1 md:flex">
          {primaryLinks.map((item) => (
            <Button key={item.label} variant="ghost" asChild className="h-8 px-3 text-sm text-muted-foreground hover:text-foreground">
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Button variant="outline" size="icon" onClick={toggleColorMode} aria-label="Toggle dark mode">
            {mode === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          {user ? (
            <Button asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Button variant="outline" size="icon" onClick={toggleColorMode} aria-label="Toggle dark mode">
            {mode === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger render={<Button variant="outline" size="icon" aria-label="Open menu" />}>
              <Menu className="h-4 w-4" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[88vw] max-w-sm">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-left">
                  <Bolt className="h-4 w-4" /> IndexFast
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 grid gap-2">
                {primaryLinks.map((item) => (
                  <Button key={item.label} variant="ghost" asChild className="justify-start" onClick={() => setMobileOpen(false)}>
                    <Link href={item.href}>{item.label}</Link>
                  </Button>
                ))}
              </div>
              <Separator className="my-6" />
              <div className="grid gap-2">
                {user ? (
                  <Button asChild onClick={() => setMobileOpen(false)}>
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" asChild onClick={() => setMobileOpen(false)}>
                      <Link href="/sign-in">Sign In</Link>
                    </Button>
                    <Button asChild onClick={() => setMobileOpen(false)}>
                      <Link href="/sign-up">Get Started</Link>
                    </Button>
                  </>
                )}
                <Button variant="ghost" className="justify-start" onClick={() => setMobileOpen(false)}>
                  <X className="mr-2 h-4 w-4" /> Close
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
