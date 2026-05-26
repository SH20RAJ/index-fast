"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { LANDING_FAQS } from "@/lib/landing-faq";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 bg-background">
      <div className="mx-auto max-w-2xl px-6">
        <div className="text-center mb-12 space-y-2">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
            Frequently asked questions
          </h2>
          <p className="text-sm text-muted-foreground">
            Everything you need to know about IndexFast.
          </p>
        </div>

        <div className="divide-y divide-border">
          {LANDING_FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index}>
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-medium text-foreground sm:text-base">
                    {faq.question}
                  </span>
                  <ChevronRight
                    className="h-4 w-4 shrink-0 ml-4 text-muted-foreground transition-transform duration-150"
                    style={{
                      transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                    }}
                  />
                </button>
                <div
                  style={{
                    maxHeight: isOpen ? "300px" : "0px",
                    opacity: isOpen ? 1 : 0,
                    overflow: "hidden",
                    transition: "max-height 150ms ease, opacity 150ms ease",
                  }}
                  aria-hidden={!isOpen}
                >
                  <p className="pb-4 text-sm leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
