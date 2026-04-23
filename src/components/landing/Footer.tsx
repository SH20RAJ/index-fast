"use client";

import Link from "next/link";
import Image from "next/image";
import { Code, Bird, Users, Mail, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const footerLinks = {
  product: [
    { name: "How It Works", href: "/how-it-works" },
    { name: "Pricing", href: "/pricing" },
    { name: "Tools", href: "/tools" },
    { name: "IndexNow", href: "/indexnow" },
  ],
  resources: [
    { name: "Documentation", href: "/docs" },
    { name: "Blog", href: "/blog" },
    { name: "Status", href: "/status" },
  ],
  company: [
    { name: "About", href: "/how-it-works" },
    { name: "Contact", href: "/contact" },
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
  ],
};

const socialLinks = [
  { name: "Bluesky", icon: Bird, href: "https://bsky.app/profile/indexfast.bsky.social" },
  // { name: "Twitter", icon: Bird, href: "https://twitter.com/indexfast" },
  // { name: "GitHub", icon: Code, href: "https://github.com/indexfast" },
  // { name: "LinkedIn", icon: Users, href: "https://linkedin.com/company/indexfast" },
  { name: "Email", icon: Mail, href: "mailto:hello@indexfast.co" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background py-12 md:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <Image 
                src="/logo.png" 
                alt="IndexFast" 
                width={32} 
                height={32} 
                className="rounded-lg shadow-sm"
              />
              <span className="text-xl font-serif font-bold tracking-tight">IndexFast</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Automated indexing for modern content teams. Get your site noticed faster on Google, Bing, and beyond.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-secondary/5 p-2 text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
                  title={social.name}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground mb-6">Product</h3>
            <ul className="space-y-4">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-primary flex items-center group">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground mb-6">Resources</h3>
            <ul className="space-y-4">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground mb-6">Support</h3>
            <div className="space-y-4">
              <ul className="space-y-4">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="pt-2">
                <a 
                  href="mailto:hello@indexfast.co" 
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary/5 px-4 py-2 text-xs font-bold text-primary transition-colors hover:bg-primary/10"
                >
                  hello@indexfast.co <ArrowUpRight className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-border/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {currentYear} IndexFast Inc. All rights reserved.
          </p>
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
             <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
             <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
             <Link href="/contact" className="hover:text-primary transition-colors">Help</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
