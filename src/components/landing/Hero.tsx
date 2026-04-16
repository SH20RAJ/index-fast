"use client";

import { MinimalHero } from "@/components/ui/minimal-hero";
import { useRouter } from "next/navigation";
import { Zap, Globe2, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  const router = useRouter();

  const heroData = {
    badge: "Version 4.0 out now — bing & indexnow support",
    title: (
      <>
        Instant indexing <br /> 
        <span className="text-muted-foreground/40">for global teams.</span>
      </>
    ),
    subtitle:
      "Stop waiting for Google's mercy. IndexFast automates your technical SEO workflows by directly injecting your high-value URLs into search indices in under 60 seconds.",
    actions: [
      {
        text: "Accelerate Indexing",
        onClick: () => router.push("/sign-up"),
        variant: "default" as const,
      },
      {
        text: "How It Works",
        onClick: () => router.push("/how-it-works"),
        variant: "outline" as const,
      },
    ],
    stats: [
      {
        value: "120+",
        label: "Search Pings",
        icon: <Globe2 className="h-4 w-4" />,
      },
      {
        value: "< 60s",
        label: "Avg. Index Time",
        icon: <Zap className="h-4 w-4" />,
      },
      {
        value: "10K+",
        label: "URLs Submitted",
        icon: <BarChart3 className="h-4 w-4" />,
      },
    ],
  };

  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-48 sm:pb-32">
      {/* Ultra-Minimal Background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* Subtle center-top glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[800px] bg-primary/5 blur-[120px] rounded-full" />
        {/* Clean minimal grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.03)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <MinimalHero
          badge={heroData.badge}
          title={heroData.title}
          subtitle={heroData.subtitle}
          actions={heroData.actions}
          className="mb-16 sm:mb-24"
        />

        {/* Stats Row - Moved below main fold */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 border-t border-border/40 pt-10"
        >
          {heroData.stats.map((stat, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/5 text-primary">
                {stat.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight">{stat.value}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{stat.label}</span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
