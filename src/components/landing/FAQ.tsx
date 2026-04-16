"use client";

import { Badge } from "@/components/ui/badge";
import {
  Discussion,
  DiscussionBody,
  DiscussionContent,
  DiscussionExpand,
  DiscussionItem,
  DiscussionReplies,
  DiscussionTitle,
} from "@/components/ui/discussion";
import { LANDING_FAQS } from "@/lib/landing-faq";

export default function FAQ() {
  return (
    <section id="faq" className="border-b border-border/70 py-14 sm:py-20">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 space-y-3 text-center">
          <Badge
            variant="outline"
            className="rounded-full px-3 py-1 text-[11px] tracking-[0.14em] uppercase"
          >
            Common Questions
          </Badge>
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            Everything you need to know about setup, safety, and indexing outcomes.
          </p>
        </div>

        {/* Discussion-style FAQ */}
        <Discussion type="multiple" className="w-full space-y-1">
          {LANDING_FAQS.map((faq, index) => (
            <DiscussionItem key={index} value={`item-${index}`}>
              <DiscussionContent className="gap-2">
                <div className="flex flex-col gap-2 py-1">
                  <div className="flex flex-col gap-1">
                    <DiscussionTitle className="text-base tracking-tight">
                      {faq.question}
                    </DiscussionTitle>
                  </div>
                  <DiscussionExpand />
                </div>
              </DiscussionContent>
              <DiscussionReplies>
                <DiscussionBody className="text-muted-foreground pb-4 pt-2">
                  {faq.answer}
                </DiscussionBody>
              </DiscussionReplies>
            </DiscussionItem>
          ))}
        </Discussion>
      </div>
    </section>
  );
}
