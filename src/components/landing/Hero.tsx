"use client";

import HeroSection from "@/components/ui/hero-section-9";
import { useRouter } from "next/navigation";
import { Zap, Globe2, BarChart3 } from "lucide-react";

export default function Hero() {
  const router = useRouter();

  const heroData = {
    title: (
      <>
        Force search engines <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-500 to-primary/80">
          to notice you now.
        </span>
      </>
    ),
    subtitle:
      "IndexFast automates sitemap tracking and directly injects your URLs into Bing & IndexNow APIs — so your content ranks faster, not later.",
    actions: [
      {
        text: "Accelerate Indexing Now",
        onClick: () => router.push("/sign-up"),
        variant: "default" as const,
        className:
          "rounded-2xl px-8 font-black text-sm uppercase tracking-wide shadow-[0_0_30px_rgba(99,102,241,0.25)]",
      },
      {
        text: "See The Infrastructure",
        onClick: () => router.push("/how-it-works"),
        variant: "outline" as const,
        className: "rounded-2xl px-6 font-bold text-sm uppercase tracking-wide",
      },
    ],
    stats: [
      {
        value: "120+",
        label: "Search Pings",
        icon: <Globe2 className="h-5 w-5 text-muted-foreground" />,
      },
      {
        value: "< 60s",
        label: "Avg. Index Time",
        icon: <Zap className="h-5 w-5 text-muted-foreground" />,
      },
      {
        value: "10K+",
        label: "URLs Submitted",
        icon: <BarChart3 className="h-5 w-5 text-muted-foreground" />,
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=2076&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    ],
  };

  return (
    <div className="relative border-b border-border/70">
      {/* Background decorations matching original hero aesthetic */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,hsl(var(--primary)/0.14),transparent_35%),radial-gradient(circle_at_90%_0%,hsl(var(--primary)/0.1),transparent_38%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.35)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.35)_1px,transparent_1px)] bg-[size:34px_34px] [mask-image:linear-gradient(to_bottom,black,transparent_88%)]" />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <HeroSection
          title={heroData.title}
          subtitle={heroData.subtitle}
          actions={heroData.actions}
          stats={heroData.stats}
          images={heroData.images}
          className="bg-transparent py-16 sm:py-24"
        />
      </div>
    </div>
  );
}
