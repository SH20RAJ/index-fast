"use client";

import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const faqs = [
  {
    q: "How fast is indexing?",
    a: "URLs typically get crawled and indexed in 4-24 hours. Without automation, this process can take weeks.",
  },
  {
    q: "Is it safe for SEO?",
    a: "Yes. We use official Bing and IndexNow APIs. This is the recommended way to notify engines.",
  },
  {
    q: "Do I need to be a developer?",
    a: "No. The dashboard is built for operators and marketers, not only engineers.",
  },
  {
    q: "Can I cancel any time?",
    a: "Yes. We offer monthly billing with no long contracts. You can cancel directly from your dashboard.",
  },
  {
    q: "What sites are supported?",
    a: "Any site verified in Search Console, including WordPress, Shopify, and custom builds.",
  },
];

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
          {faqs.map((faq) => (
            <details key={faq.q} className="group p-4 sm:p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold tracking-tight">
                {faq.q}
                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
              </summary>
              <p className="pt-3 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
