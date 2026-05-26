import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Book, 
  Key, 
  Settings, 
  Zap, 
  Globe, 
  ShieldCheck, 
  ArrowRight,
  Terminal,
  FileText
} from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";

const docCategories = [
  {
    title: "Getting Started",
    description: "Learn how to set up IndexFast and connect it to your AI IDE.",
    icon: Zap,
    links: [
      { name: "Quickstart Guide", href: "/how-it-works" },
      { name: "MCP Installation", href: "/docs/mcp" },
    ]
  },
  {
    title: "Authentication",
    description: "Manage your API keys and secure your indexing workflows.",
    icon: ShieldCheck,
    links: [
      { name: "Bing API Key", href: "/docs/bing-api-key" },
      { name: "IndexNow Key", href: "/docs/indexnow-key" },
    ]
  },
  {
    title: "Platforms",
    description: "Connect to major search engines and indexing protocols.",
    icon: Globe,
    links: [
      { name: "Google Search Console", href: "/docs/google-setup" },
      { name: "Bing Webmaster Tools", href: "/docs/bing-setup" },
      { name: "IndexNow Protocol", href: "/docs/indexnow-setup" },
    ]
  },
  {
    title: "Developer Tools",
    description: "Advanced configuration and CLI tools for power users.",
    icon: Terminal,
    links: [
      { name: "CLI Reference", href: "/docs/cli" },
      { name: "API Documentation", href: "/docs/api" },
    ]
  }
];

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 space-y-16">
      <div className="text-center space-y-4">
        <PageHeader
          title="Documentation"
          description="Everything you need to automate your search indexing."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {docCategories.map((category) => (
          <Card key={category.title} className="rounded-[32px] border-zinc-100 dark:border-white/5 bg-white dark:bg-zinc-900/40 overflow-hidden">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                  <category.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold tracking-tight">{category.title}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
              </div>

              <div className="grid gap-2">
                {category.links.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    className="group flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-white/5 transition-all"
                  >
                    <span className="text-sm font-medium group-hover:text-primary transition-colors">{link.name}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="rounded-[40px] bg-zinc-900 text-white p-12 text-center space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-64 w-64 bg-primary/20 blur-[100px] -z-10" />
        <h2 className="text-3xl font-bold tracking-tight">Need help from an expert?</h2>
        <p className="text-zinc-400 max-w-xl mx-auto">
          Can't find what you're looking for? Our team of SEO experts and developers are ready to help you with your custom setup.
        </p>
        <Button asChild size="lg" className="h-12 rounded-2xl px-8 text-base font-bold">
          <Link href="/contact">Contact Support</Link>
        </Button>
      </div>
    </div>
  );
}
