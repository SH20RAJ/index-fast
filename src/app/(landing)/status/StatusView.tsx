"use client";

import { cn } from "@/lib/utils";
import { CheckCircle2, Activity, Globe, Server, Database, BadgeCheck, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function StatusView() {
  const systems = [
    { name: "Indexing Engine", status: "Operational", icon: <Globe className="h-4 w-4" /> },
    { name: "Website Dashboard", status: "Operational", icon: <Activity className="h-4 w-4" /> },
    { name: "API Services", status: "Operational", icon: <Server className="h-4 w-4" /> },
    { name: "Sitemap Processor", status: "Operational", icon: <Database className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950/20 relative overflow-hidden flex flex-col items-center justify-center py-20 px-6">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />
      
      <div className="max-w-xl w-full space-y-10 relative z-10">
        <div className="text-center space-y-4">
          <Badge variant="outline" className="h-8 px-4 text-[10px] font-black uppercase tracking-[0.2em] border-emerald-500/20 bg-emerald-500/5 text-emerald-600 rounded-full animate-pulse">
            Realtime Monitoring
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground leading-none">
            System <span className="text-emerald-500 italic font-hand inline-block -rotate-2 ml-2">Status</span>
          </h1>
          
          <p className="text-lg font-medium text-muted-foreground/60 max-w-sm mx-auto">
            Live health telemetry for all IndexFast persistence and automation layers.
          </p>
        </div>

        <Card className="border-emerald-500/20 bg-emerald-500/5 backdrop-blur-xl shadow-2xl shadow-emerald-500/10 rounded-[40px] overflow-hidden group">
          <CardContent className="p-10 flex flex-col items-center text-center space-y-4">
            <div className="h-20 w-20 rounded-[28px] bg-emerald-500 flex items-center justify-center shadow-2xl shadow-emerald-500/40 border border-white/20 group-hover:scale-110 transition-transform duration-500">
              <BadgeCheck className="h-10 w-10 text-white fill-white/10" />
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl font-black tracking-tighter text-emerald-600 dark:text-emerald-400">
                All Systems Operational
              </h2>
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-600/60 uppercase tracking-widest">
                <Clock className="h-3 w-3" />
                Updated {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3 w-full">
          {systems.map((s, idx) => (
            <div 
              key={s.name}
              className="flex items-center justify-between p-5 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all hover:translate-x-1"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                  {s.icon}
                </div>
                <span className="text-[15px] font-black tracking-tight text-slate-700 dark:text-slate-200">
                  {s.name}
                </span>
              </div>
              <Badge variant="secondary" className="h-7 px-4 text-[10px] font-black uppercase tracking-[0.1em] bg-emerald-500/10 text-emerald-600 border-none rounded-lg">
                {s.status}
              </Badge>
            </div>
          ))}
        </div>
        
        <div className="pt-6 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30">
            Precision uptime verified by IndexFast Ops
          </p>
        </div>
      </div>
      
      {/* Footer Decoration */}
      <div className="absolute bottom-12 opacity-5 pointer-events-none">
        <span className="text-[120px] font-black tracking-[-0.1em] leading-none select-none">STATUS</span>
      </div>
    </div>
  );
}
