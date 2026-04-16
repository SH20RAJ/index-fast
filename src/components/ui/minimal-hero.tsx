"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, ChevronRight } from "lucide-react";

interface ActionProps {
  text: string;
  onClick: () => void;
  variant?: "default" | "outline" | "ghost" | "link" | "secondary" | "destructive";
  className?: string;
}

interface MinimalHeroProps {
  badge?: string;
  title: React.ReactNode;
  subtitle: string;
  actions: ActionProps[];
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const MinimalHero = ({
  badge,
  title,
  subtitle,
  actions,
  className,
}: MinimalHeroProps) => {
  return (
    <div className={cn("flex flex-col items-center text-center", className)}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl px-4"
      >
        {/* Top Badge */}
        {badge && (
          <motion.div variants={itemVariants} className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-mono font-medium tracking-tight text-primary uppercase">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
              </span>
              {badge}
            </span>
          </motion.div>
        )}

        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl font-black tracking-tight text-foreground sm:text-7xl lg:text-8xl leading-[1.05]"
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="mt-8 mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl leading-relaxed"
        >
          {subtitle}
        </motion.p>

        {/* Actions */}
        <motion.div
          variants={itemVariants}
          className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          {actions.map((action, index) => (
            <Button
              key={index}
              onClick={action.onClick}
              variant={action.variant}
              className={cn(
                "h-14 px-8 rounded-2xl text-base font-bold transition-all duration-300",
                index === 0 ? "bg-primary text-primary-foreground hover:scale-[1.02] shadow-xl shadow-primary/20" : "border-border/60 hover:bg-muted",
                action.className
              )}
            >
              <span className="flex items-center gap-2">
                {action.text}
                {index === 0 && <ArrowRight className="h-4 w-4" />}
                {index !== 0 && <ChevronRight className="h-4 w-4 opacity-50" />}
              </span>
            </Button>
          ))}
        </motion.div>

        {/* Small Trust Line */}
        <motion.p
          variants={itemVariants}
          className="mt-10 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground/50"
        >
          Trusted by 5,000+ Growth Teams Globally
        </motion.p>
      </motion.div>
    </div>
  );
};

export default MinimalHero;
