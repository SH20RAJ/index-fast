"use client";

import { cn } from "@/lib/utils";
import { Shield, Lock, Eye, Calendar, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function PrivacyView() {
  const sections = [
    {
      title: "Data We Collect",
      icon: <Eye className="h-5 w-5 text-sky-500" />,
      content: "We collect search console data and URL information explicitly provided by you to enable our indexing services. We do not sell or share this data with third parties."
    },
    {
      title: "How We Use Data",
      icon: <Sparkles className="h-5 w-5 text-emerald-500" />,
      content: "The data is used solely to facilitate the submission of your content to search engine indexing APIs and to provide status updates in your dashboard."
    },
    {
      title: "Your Rights",
      icon: <Shield className="h-5 w-5 text-amber-500" />,
      content: "You have the right to export or delete your account data at any time. We believe in complete transparency regarding your information."
    }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto px-6 py-24 md:py-32 relative z-10">
        <div className="space-y-4 mb-16">
          <Badge variant="outline" className="h-8 px-4 text-[10px] font-black uppercase tracking-[0.2em] border-primary/20 bg-primary/5 text-primary rounded-full">
            Security First
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground leading-[0.9]">
            Privacy <span className="text-primary italic font-hand inline-block -rotate-3 ml-2">Policy</span>
          </h1>
          
          <div className="flex items-center gap-2 text-muted-foreground/60">
            <Calendar className="h-4 w-4" />
            <p className="text-sm font-medium">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="grid gap-12 mb-20">
          {sections.map((section, idx) => (
            <div key={idx} className="group p-8 rounded-[32px] bg-card/30 backdrop-blur-sm border border-border/40 hover:border-primary/20 transition-all hover:bg-card/50 shadow-xl shadow-primary/5">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-10 w-10 flex items-center justify-center rounded-2xl bg-muted border border-border/20 group-hover:scale-110 transition-transform duration-500">
                  {section.icon}
                </div>
                <h2 className="text-2xl font-black tracking-tighter text-foreground">
                  {section.title}
                </h2>
              </div>
              <p className="text-lg font-medium text-muted-foreground/80 leading-relaxed max-w-2xl px-1">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        <div className="p-8 md:p-12 rounded-[40px] bg-slate-9 border-2 border-dashed border-primary/20 bg-primary/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700">
            <Lock className="h-24 w-24 text-primary" />
          </div>
          
          <div className="relative z-10">
            <h3 className="text-3xl font-black tracking-tighter text-foreground mb-4">Questions?</h3>
            <p className="text-lg font-medium text-muted-foreground/60 leading-relaxed mb-8 max-w-xl">
              If you have any questions about our privacy practices or how we handle your data, our security team is here to help.
            </p>
            <a 
              href="mailto:support@indexfast.com" 
              className="inline-flex h-12 items-center px-8 rounded-2xl bg-foreground text-background font-black tracking-tight hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10"
            >
              Contact Support
            </a>
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
