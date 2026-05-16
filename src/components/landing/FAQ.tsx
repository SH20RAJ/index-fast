"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { LANDING_FAQS } from "@/lib/landing-faq";
import { cn } from "@/lib/utils";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 bg-background border-t border-border/40">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
            Support
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
            FAQ
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base max-w-lg mx-auto leading-relaxed">
            Everything you need to know about setting up and getting indexed.
          </p>
        </div>

        <div className="space-y-3">
          {LANDING_FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={cn(
                  "group overflow-hidden rounded-2xl border transition-all duration-300",
                  isOpen
                    ? "border-primary/20 bg-primary/[0.02] shadow-sm"
                    : "border-border/50 bg-card/50 hover:border-border hover:bg-card"
                )}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between p-5 text-left transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className={cn(
                    "text-sm font-semibold tracking-tight sm:text-base transition-colors",
                    isOpen ? "text-primary" : "text-foreground"
                  )}>
                    {faq.question}
                  </span>
                  <div className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
                    isOpen
                      ? "rotate-90 border-primary bg-primary text-white"
                      : "border-border text-muted-foreground group-hover:border-foreground group-hover:text-foreground"
                  )}>
                    {isOpen ? (
                      <Minus className="h-3 w-3" />
                    ) : (
                      <Plus className="h-3 w-3" />
                    )}
                  </div>
                </button>
                {/* Always render answer in DOM for crawlers; use CSS to hide/show */}
                <div
                  className="transition-all duration-300 ease-[cubic-bezier(0.04,0.62,0.23,0.98)]"
                  style={{
                    maxHeight: isOpen ? "500px" : "0px",
                    opacity: isOpen ? 1 : 0,
                    overflow: "hidden",
                  }}
                  aria-hidden={!isOpen}
                >
                  <div className="px-5 pb-5">
                    <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
