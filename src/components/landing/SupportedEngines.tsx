"use client";

import { motion, type Variants } from "framer-motion";
import { LogoCloud } from "@/components/ui/logo-cloud-2";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
  },
};

export default function SupportedEngines() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="space-y-4 pb-12 text-center"
      >
        <motion.p 
          variants={fadeUp}
          className="text-xs font-bold uppercase tracking-[0.22em] text-primary"
        >
          Global Reach
        </motion.p>
        <motion.h2 
          variants={fadeUp}
          className="text-3xl font-serif font-bold tracking-tight sm:text-5xl"
        >
          Get indexed on Google, Bing,<br />
          and <span className="text-primary italic">120+ more</span>
        </motion.h2>
        <motion.p 
          variants={fadeUp}
          className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg"
        >
          We submit your pages directly to every major search engine and the Internet Archive, 
          ensuring your content is discovered and preserved instantly.
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <LogoCloud />
      </motion.div>
    </section>
  );
}
