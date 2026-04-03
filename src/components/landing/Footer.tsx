"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-border/70 py-10">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:px-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2">
            <Image src="/logo.png" alt="IndexFast logo" width={32} height={32} className="h-8 w-8 rounded-lg object-cover" />
            <span className="text-base font-black tracking-tight">IndexFast</span>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            The high-velocity URL submission system built for SEO operators and growth teams.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 text-sm sm:grid-cols-3">
          <div className="space-y-2">
            <p className="text-xs font-bold tracking-[0.14em] uppercase text-muted-foreground">Platform</p>
            <div className="grid gap-1 text-muted-foreground">
              <Link href="/" className="hover:text-foreground">Home</Link>
              <Link href="/pricing" className="hover:text-foreground">Pricing</Link>
              <Link href="/blog" className="hover:text-foreground">Insights</Link>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-bold tracking-[0.14em] uppercase text-muted-foreground">Legal</p>
            <div className="grid gap-1 text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
              <Link href="/terms" className="hover:text-foreground">Terms</Link>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-bold tracking-[0.14em] uppercase text-muted-foreground">Support</p>
            <div className="grid gap-1 text-muted-foreground">
              <Link href="/contact" className="hover:text-foreground">Contact</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-8 flex w-full max-w-6xl flex-wrap items-center justify-between gap-2 border-t border-border/70 px-4 pt-4 text-xs text-muted-foreground sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} IndexFast Inc.</p>
        <p>Crafted for search visibility.</p>
      </div>
    </footer>
  );
}
