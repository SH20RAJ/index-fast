"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { AlertCircle, ArrowRight, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function PainSection() {
  return (
    <section className="py-24 sm:py-32 bg-stone-50 dark:bg-stone-900/20 border-y border-border/50">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-12 lg:grid-cols-2 items-center"
        >
          <div className="space-y-6">
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-bold uppercase tracking-widest">
              <AlertCircle className="h-3 w-3" /> The SEO Reality
            </motion.div>
            
            <motion.h2 variants={itemVariants} className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-foreground leading-[1.1]">
              Not indexed? <br />
              <span className="text-muted-foreground italic">You don't exist.</span>
            </motion.h2>
            
            <motion.p variants={itemVariants} className="text-lg text-muted-foreground leading-relaxed">
              You spent hours writing great content. You published it, waited, and checked your rankings. Nothing. <br /><br />
              The brutal truth: <span className="text-foreground font-semibold underline decoration-primary/30">If Google doesn't index your page, it will never rank.</span> Most sites wait weeks for a crawl. You can't afford to wait.
            </motion.p>
            
            <motion.div variants={itemVariants}>
              <Button asChild variant="link" className="p-0 h-auto text-primary font-bold group">
                <Link href="/sign-up" className="flex items-center gap-2">
                  Stop staying invisible <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </div>
          
          <motion.div 
            variants={itemVariants}
            className="relative aspect-square sm:aspect-video lg:aspect-square bg-card rounded-3xl border border-border shadow-2xl overflow-hidden group"
          >
            <Image 
              src="/images/page_not_found.png"
              alt="Page not found illustration"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 512px"
              className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            
            {/* Visual indicator of "Missing" */}
            <div className="absolute top-6 right-6 flex gap-1.5">
               <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
               <div className="h-2 w-2 rounded-full bg-red-500/20" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
