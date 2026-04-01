"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export function FloatingPaths({ position }: { position: number }) {
  const paths = React.useMemo(() => 
    Array.from({ length: 36 }, (_, i) => ({
      id: i,
      d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
        380 - i * 5 * position
      } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
        152 - i * 5 * position
      } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
        684 - i * 5 * position
      } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
      color: `rgba(15,23,42,${0.1 + i * 0.03})`,
      width: 0.5 + i * 0.03,
      duration: 20 + ((i * 1337) % 100) / 10,
    })), [position]);

  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      <svg
        className="h-full w-full text-slate-950 dark:text-white"
        viewBox="0 0 696 316"
        fill="none"
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.02}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: path.duration,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export default function MinimalHero() {
  return (
    <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-4">
      <FloatingPaths position={1} />
      <FloatingPaths position={-1} />
      
      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="mb-8"
        >
          <span className="rounded-full bg-primary/10 px-4 py-1.5 text-sm font-bold tracking-tight text-primary ring-1 ring-inset ring-primary/20">
            Indexing infrastructure for teams
          </span>
        </motion.div>
        
        <motion.h1
          className="font-sans text-6xl font-black leading-[1.1] tracking-tight sm:text-7xl md:text-8xl lg:text-9xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Index <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent">
            instantly.
          </span>
        </motion.h1>

        <motion.p
          className="mx-auto mt-10 max-w-2xl text-lg font-medium text-muted-foreground md:text-xl lg:text-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Push your URLs to Google and Bing search results the millisecond you publish. No more waiting for crawlers.
        </motion.p>

        <motion.div
          className="mt-12 flex flex-wrap items-center justify-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Button size="lg" className="h-16 rounded-2xl px-10 text-xl font-black shadow-2xl shadow-primary/20">
            Get started
            <ChevronRight className="ml-2 size-6" />
          </Button>
          <Button size="lg" variant="ghost" className="h-16 rounded-2xl px-10 text-xl font-bold">
            Live demo
          </Button>
        </motion.div>
      </div>

      {/* Subtle bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-background via-background/80 to-transparent" />
    </section>
  );
}
