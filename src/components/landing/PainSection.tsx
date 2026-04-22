"use client";

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
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center space-y-4">
               <div className="h-20 w-20 rounded-2xl bg-muted flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                  <SearchX className="h-10 w-10 text-muted-foreground/40" />
               </div>
               <p className="text-sm font-bold text-muted-foreground uppercase tracking-tighter opacity-50">Search Results</p>
               <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: "0%" }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="h-full bg-primary/20"
                  />
               </div>
               <p className="font-serif italic text-muted-foreground/60">"Your page not found..."</p>
            </div>
            {/* Visual indicator of "Missing" */}
            <div className="absolute top-4 right-4 flex gap-1">
               <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
               <div className="h-1.5 w-1.5 rounded-full bg-red-500/40" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
