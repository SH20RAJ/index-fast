"use client";

import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LANDING_FAQS } from "@/lib/landing-faq";

export default function FAQ() {
  return (
    <section id="faq" className="border-b border-border/70 py-14 sm:py-20">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-3 text-center sm:mb-10">
          <Badge variant="outline" className="rounded-full px-3 py-1 text-[11px] tracking-[0.14em] uppercase">
            Common Questions
          </Badge>
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Frequently asked questions</h2>
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            Everything you need to know about setup, safety, and indexing outcomes.
          </p>
        </div>

        <div className="divide-y divide-border rounded-xl border border-border/70 bg-card/70">
          {LANDING_FAQS.map((faq) => (
            <details key={faq.question} className="group p-4 sm:p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold tracking-tight">
                {faq.question}
                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
              </summary>
              <p className="pt-3 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
