"use client";

import { cn } from "@/lib/utils";
import { Scale, BookOpen, UserCheck, ShieldAlert, CreditCard, Calendar, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function TermsView() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      icon: <BookOpen className="h-5 w-5 text-sky-500" />,
      content: "By accessing and using IndexFast, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services."
    },
    {
      title: "2. Description of Service",
      icon: <Scale className="h-5 w-5 text-emerald-500" />,
      content: "IndexFast provides automated URL submission and SEO indexing tools. We facilitate communication with search engine APIs but do not guarantee specific ranking results or indexing speed, as these are controlled by third-party search engines."
    },
    {
      title: "3. User Responsibilities",
      icon: <UserCheck className="h-5 w-5 text-amber-500" />,
      content: "You are responsible for the URLs you submit. You must not use our service for spam, illegal content, or to violate the terms of service of search engines (e.g., Google or Bing)."
    },
    {
      title: "4. Account & Data",
      icon: <ShieldAlert className="h-5 w-5 text-rose-500" />,
      content: "You are responsible for maintaining the security of your account. We reserve the right to suspend accounts that engage in abusive behavior or exceed their plan limits."
    },
    {
      title: "5. Payments & Refunds",
      icon: <CreditCard className="h-5 w-5 text-indigo-500" />,
      content: "Subscriptions are billed in advance. Refunds are handled on a case-by-case basis in accordance with our billing provider's policies. You can cancel your subscription at any time via the dashboard."
    }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-1/2 translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
        <div className="absolute top-40 right-10 w-96 h-96 bg-sky-500 rounded-full blur-[120px]" />
        <div className="absolute bottom-40 left-10 w-96 h-96 bg-indigo-500 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto px-6 py-24 md:py-32 relative z-10">
        <div className="space-y-4 mb-20">
          <Badge variant="outline" className="h-8 px-4 text-[10px] font-black uppercase tracking-[0.2em] border-sky-500/20 bg-sky-500/5 text-sky-600 rounded-full">
            Legal Framework
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground leading-[0.9]">
            Terms of <span className="text-primary italic font-hand inline-block rotate-3 ml-2">Service</span>
          </h1>
          
          <div className="flex items-center gap-2 text-muted-foreground/60">
            <Calendar className="h-4 w-4" />
            <p className="text-sm font-medium">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="grid gap-8 mb-24">
          {sections.map((section, idx) => (
            <div key={idx} className="group relative p-8 rounded-[32px] bg-card/30 backdrop-blur-sm border border-border/40 hover:border-sky-500/20 transition-all hover:bg-card/50 shadow-xl shadow-sky-500/5 overflow-hidden">
              <div className="flex items-start gap-6 relative z-10">
                <div className="mt-1 h-12 w-12 flex items-center justify-center rounded-2xl bg-muted border border-border/20 group-hover:bg-sky-500/10 group-hover:border-sky-500/20 transition-all duration-500 shrink-0">
                  {section.icon}
                </div>
                <div className="space-y-3">
                  <h2 className="text-2xl font-black tracking-tighter text-foreground leading-none">
                    {section.title}
                  </h2>
                  <p className="text-lg font-medium text-muted-foreground/80 leading-relaxed max-w-2xl">
                    {section.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-8 md:p-12 rounded-[40px] border-2 border-dashed border-sky-500/20 bg-sky-500/5 relative overflow-hidden group">
          <div className="absolute top-1/2 -translate-y-1/2 right-0 p-8 opacity-5 scale-150 rotate-[-15deg] group-hover:rotate-0 transition-transform duration-1000">
            <Scale className="h-48 w-48 text-sky-500" />
          </div>
          
          <div className="relative z-10 space-y-6">
            <h3 className="text-3xl font-black tracking-tighter text-foreground">Need Clarification?</h3>
            <p className="text-lg font-medium text-muted-foreground/60 leading-relaxed max-w-2xl">
              Our terms are designed to be fair and transparent. If you have any specific legal inquiries or require a DPA, our legal team is ready to assist.
            </p>
            <div className="flex flex-wrap gap-4">
              <a 
                href="mailto:legal@indexfast.com" 
                className="inline-flex h-12 items-center px-8 rounded-2xl bg-sky-600 text-white font-black tracking-tight hover:bg-sky-700 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-sky-600/20"
              >
                Email Legal Team
              </a>
              <button className="inline-flex h-12 items-center px-8 rounded-2xl bg-background border border-border/40 text-foreground font-black tracking-tight hover:bg-muted transition-all gap-2 group/btn">
                Download PDF <ArrowRight className="h-4 w-4 opacity-50 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Subtle Bottom Branding */}
      <div className="pb-12 text-center opacity-5">
        <span className="text-8xl font-black tracking-[-0.1em] select-none">INDEXFAST</span>
      </div>
    </div>
  );
}
