"use client";

import { motion, type Variants } from "framer-motion";
import { Zap, Shield, BarChart3, Clock } from "lucide-react";

const items = [
  {
    title: "Pure Indexing Speed",
    description: "Unlike all-in-one SEO tools, we focus on one thing: getting your pages indexed. Our pipeline is optimized for zero-latency delivery.",
    icon: Zap
  },
  {
    title: "10x Faster than Manual",
    description: "Manually submitting to GSC is a chore. We automate the submission of thousands of URLs while you sleep.",
    icon: Clock
  },
  {
    title: "Bulk & Automation",
    description: "From programmatic SEO to giant ecommerce stores, we handle bulk URL discovery and auto-pings without limits.",
    icon: BarChart3
  },
  {
    title: "Official API Access",
    description: "We use official Google & Bing endpoints. No sketchy bots, no grey-hat tactics. Just clean, reliable signal delivery.",
    icon: Shield
  }
];

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function DifferentiationSection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight">The IndexFast Edge</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Built for indexing, not vanity metrics. Here is why modern teams switch to us.</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {items.map((item, idx) => (
            <motion.div
              key={item.title}
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 rounded-[32px] bg-card border border-border/50 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group"
            >
              <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-3">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
