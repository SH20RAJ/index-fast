"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Moon, Sun, ChevronRight, Zap } from "lucide-react";
import { useUser } from "@stackframe/stack";
import { useColorMode } from "@/components/ThemeRegistry";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
  { name: "How it works", href: "/how-it-works" },
  { name: "Pricing", href: "/pricing" },
  { name: "Tools", href: "/tools" },
  { name: "Blog", href: "/blog" },
  { name: "Docs", href: "/docs" },
];

export default function Navbar() {
  const user = useUser();
  const pathname = usePathname();
  const { mode, toggleColorMode } = useColorMode();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-300 px-4 py-4",
        isScrolled ? "pt-4" : "pt-6"
      )}
    >
      <nav 
        className={cn(
          "mx-auto max-w-5xl rounded-2xl transition-all duration-500 border",
          isScrolled 
            ? "bg-background/80 backdrop-blur-xl border-border/50 shadow-sm py-2 px-3 sm:px-4" 
            : "bg-transparent border-transparent py-2 px-3 sm:px-4"
        )}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group transition-transform active:scale-95">
            <div className="relative h-8 w-8 overflow-hidden rounded-xl shadow-inner border border-border/50">
               <Image 
                 src="/logo.png" 
                 alt="IndexFast" 
                 fill 
                 className="object-cover transition-transform duration-500 group-hover:scale-110" 
               />
            </div>
            <span className="text-base font-bold tracking-tight text-foreground sm:text-lg">
              IndexFast
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:bg-muted/50",
                  isActive(item.href) ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleColorMode}
              className="h-9 w-9 rounded-xl transition-all hover:bg-muted"
            >
              {mode === "dark" ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-primary" />}
            </Button>

            <div className="hidden sm:flex items-center gap-2">
              {user ? (
                <Button asChild variant="default" size="sm" className="h-9 rounded-xl px-5 font-bold">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button asChild variant="ghost" size="sm" className="h-9 rounded-xl px-4 font-semibold text-muted-foreground hover:text-foreground">
                    <Link href="/sign-in">Sign in</Link>
                  </Button>
                  <Button asChild size="sm" className="h-9 rounded-xl px-5 font-bold bg-primary hover:bg-primary/90">
                    <Link href="/sign-up">Get started</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden h-9 w-9 rounded-xl"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-4 right-4 mt-2 lg:hidden"
          >
            <div className="rounded-3xl border border-border/50 bg-background/95 backdrop-blur-2xl p-4 shadow-2xl shadow-black/10 overflow-hidden">
              <div className="flex flex-col gap-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-2xl text-base font-semibold transition-colors",
                      isActive(item.href) ? "bg-primary/5 text-primary" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                  >
                    {item.name}
                    <ChevronRight className="h-4 w-4 opacity-30" />
                  </Link>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-border/50 flex flex-col gap-3">
                {user ? (
                  <Button asChild className="w-full h-12 rounded-2xl font-bold text-base shadow-xl shadow-primary/10">
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild variant="outline" className="w-full h-12 rounded-2xl font-bold text-base border-border/50">
                      <Link href="/sign-in">Sign in</Link>
                    </Button>
                    <Button asChild className="w-full h-12 rounded-2xl font-bold text-base shadow-xl shadow-primary/10 bg-primary">
                      <Link href="/sign-up">Get started for free</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
