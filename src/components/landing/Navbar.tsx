"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useUser } from "@stackframe/stack";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "How it works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "Tools", href: "/tools" },
  { label: "Blog", href: "/blog" },
  { label: "Docs", href: "/docs" },
];

export default function Navbar() {
  const user = useUser();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
        <div className="mx-auto flex h-12 max-w-5xl items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-6 w-6 overflow-hidden rounded">
              <Image
                src="/logo.png"
                alt="IndexFast"
                fill
                className="object-cover"
              />
            </div>
            <span className="text-sm font-semibold text-foreground">
              IndexFast
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  isActive(link.href)
                    ? "rounded px-2.5 py-1 text-sm font-medium text-foreground"
                    : "rounded px-2.5 py-1 text-sm text-muted-foreground hover:text-foreground"
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {user ? (
              <Button asChild size="sm" className="h-7 px-3 text-xs">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="h-7 px-3 text-xs text-muted-foreground"
                >
                  <Link href="/sign-in">Sign in</Link>
                </Button>
                <Button asChild size="sm" className="h-7 px-3 text-xs">
                  <Link href="/sign-up">Get started</Link>
                </Button>
              </div>
            )}

            {/* Mobile toggle */}
            <button
              className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:text-foreground md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="border-t border-border bg-background md:hidden">
            <nav className="flex flex-col px-4 py-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={
                    isActive(link.href)
                      ? "px-2 py-2 text-sm font-medium text-foreground"
                      : "px-2 py-2 text-sm text-muted-foreground"
                  }
                >
                  {link.label}
                </Link>
              ))}

              <div className="mt-2 flex flex-col gap-1.5 border-t border-border pt-2">
                {user ? (
                  <Button asChild size="sm" className="h-8 w-full text-xs">
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                ) : (
                  <>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="h-8 w-full text-xs"
                    >
                      <Link href="/sign-in">Sign in</Link>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      className="h-8 w-full text-xs"
                    >
                      <Link href="/sign-up">Get started</Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
