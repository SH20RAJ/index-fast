"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Lock, 
  Rocket, 
  ShieldCheck, 
  Activity, 
  Zap, 
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Fingerprint,
  Sparkles
} from "lucide-react";
import { useStackApp } from "@stackframe/stack";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type AuthMode = "sign-in" | "sign-up";

interface AuthPageProps {
  mode: AuthMode;
}

export default function AuthPage({ mode }: AuthPageProps) {
  const stack = useStackApp();
  const isSignIn = mode === "sign-in";

  const pageTitle = isSignIn ? "Welcome back to IndexFast" : "Create your IndexFast workspace";
  const pageDescription = isSignIn
    ? "Sign in to run submissions, monitor indexation signals, and keep your content discoverable every day."
    : "Start free in under two minutes. Connect your properties, launch indexing workflows, and track visibility from one dashboard.";

  const bullets = isSignIn
    ? [
        "Open your dashboard and continue where you left off",
        "Review submission logs and indexing trends instantly",
        "Manage plans, team access, and automation in one place",
      ]
    : [
        "Import verified properties and sitemaps quickly",
        "Submit fresh URLs to Bing and IndexNow in one workflow",
        "Unlock recurring monitoring, alerts, and team operations",
      ];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
        {/* Left Column: Form Section */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-7 bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-black/50 p-8 md:p-12 flex flex-col justify-center"
        >
          <div className="flex flex-wrap gap-2 mb-8">
            <Badge variant="secondary" className="h-7 px-3 text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600 border-none">
              <ShieldCheck className="mr-1.5 h-3 w-3" /> Secure Auth
            </Badge>
            <Badge variant="secondary" className="h-7 px-3 text-[10px] font-black uppercase tracking-widest bg-sky-500/10 text-sky-600 border-none">
              <Activity className="mr-1.5 h-3 w-3" /> Realtime Ops
            </Badge>
            <Badge variant="secondary" className="h-7 px-3 text-[10px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-600 border-none">
              <Zap className="mr-1.5 h-3 w-3" /> 10x Velocity
            </Badge>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.95] mb-6">
            {pageTitle}
          </h1>

          <p className="text-lg font-medium text-slate-500 dark:text-slate-400 mb-10 max-w-xl leading-relaxed">
            {pageDescription}
          </p>

          <div className="space-y-4 mb-12">
            {bullets.map((item, idx) => (
              <motion.div 
                key={item} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="flex items-start gap-3"
              >
                <div className="mt-1 h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                </div>
                <span className="text-[15px] font-bold text-slate-700 dark:text-slate-300">
                  {item}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Button 
              size="lg"
              onClick={() => (isSignIn ? stack.redirectToSignIn() : stack.redirectToSignUp())}
              className="h-14 px-8 font-black rounded-2xl bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white shadow-xl shadow-sky-500/25 gap-3 w-full sm:w-auto transition-all active:scale-95 group"
            >
              {isSignIn ? <Lock className="h-5 w-5" /> : <Rocket className="h-5 w-5" />}
              {isSignIn ? "Continue to Sign In" : "Continue to Sign Up"}
              <ArrowRight className="h-4 w-4 opacity-50 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button 
              asChild
              variant="outline" 
              size="lg"
              className="h-14 px-8 font-black rounded-2xl border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 w-full sm:w-auto transition-all active:scale-95"
            >
              <Link href={isSignIn ? "/sign-up" : "/sign-in"}>
                {isSignIn ? "Create Workspace" : "Access Workspace"}
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Right Column: Teaser Section */}
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-[40px] p-8 md:p-12 flex flex-col justify-between relative overflow-hidden group shadow-2xl shadow-black/50"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none group-hover:scale-110 group-hover:rotate-12 transition-all duration-700">
            <Fingerprint className="h-32 w-32 text-sky-400 stroke-[0.5px]" />
          </div>

          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-2 text-sky-400">
              <Sparkles className="h-5 w-5 fill-current" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Efficiency Snapshot</span>
            </div>
            
            <h2 className="text-3xl font-black tracking-tighter text-white leading-tight">
              Faster indexing, cleaner operations.
            </h2>
            
            <p className="text-slate-400 font-medium leading-relaxed">
              Teams use IndexFast to automate manual SEO indexing, push instant discovery signals, and unify workflow transparency.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-12 relative z-10">
            {[
              { k: "Workflow setup", v: "< 2 min", c: "text-emerald-400" },
              { k: "Submission speed", v: "Realtime", c: "text-sky-400" },
              { k: "Ops visibility", v: "Live", c: "text-amber-400" },
              { k: "Manual workload", v: "-80%", c: "text-rose-400" },
            ].map((item) => (
              <div key={item.k} className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors">
                <p className={cn("text-base font-black tracking-tighter", item.c)}>{item.v}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.k}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-8 flex items-center gap-3 opacity-30 group-hover:opacity-60 transition-opacity">
            <div className="h-[1px] flex-1 bg-slate-800" />
            <TrendingUp className="h-4 w-4 text-sky-400" />
            <div className="h-[1px] flex-1 bg-slate-800" />
          </div>
        </motion.div>
      </div>
      
      {/* Footer Branding */}
      <div className="absolute bottom-12 left-0 right-0 flex justify-center opacity-10 pointer-events-none">
        <span className="text-[120px] font-black tracking-[-0.1em] leading-none select-none">
          INDEXFAST
        </span>
      </div>
    </div>
  );
}