"use client";
import { useStackApp } from "@stackframe/stack";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { KeyRound, Sparkles, Zap, Globe, ShieldCheck } from "lucide-react";

export default function Hero() {
  const stack = useStackApp();

  const redirect = () => {
    window.location.href = "/dashboard";
  }

  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden bg-zinc-950 text-zinc-50 pt-20">
      {/* Subtle Romantic Gradient Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden flex items-center justify-center">
        <div className="absolute h-[60vh] w-[60vw] rounded-full bg-rose-500/5 blur-[120px] mix-blend-screen" />
        <div className="absolute h-[50vh] w-[50vw] translate-x-1/4 translate-y-1/4 rounded-full bg-indigo-500/5 blur-[120px] mix-blend-screen" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-4 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="flex flex-col items-center space-y-8"
        >
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-1.5 text-xs tracking-[0.2em] text-zinc-400 backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5 text-rose-400" />
            <span>THE SEO ENIGMA REVEALED</span>
          </motion.div>

          <h1 className="font-serif text-5xl font-light leading-tight tracking-tight sm:text-7xl lg:text-8xl">
            Whisper to the <br />
            <span className="italic text-rose-200">algorithm.</span>
          </h1>

          <p className="max-w-2xl text-lg font-light leading-relaxed text-zinc-400 sm:text-xl">
            IndexNow is the secret handshake between you and search engines. 
            When you change content, we broadcast it instantly to Bing, Yandex, and regional leaders—ensuring your truth is seen before it fades.
          </p>

          <Button
              size="lg"
              className="group relative h-16 overflow-hidden rounded-full bg-zinc-100 px-12 text-lg text-zinc-950 transition-all hover:scale-105 hover:bg-white hover:shadow-[0_0_40px_rgba(244,63,94,0.2)]"
              // redirect to /dashboard
              onClick={() => redirect() }
            >
              <div className="relative z-10 flex items-center gap-3 font-medium">
                <KeyRound className="h-5 w-5 transition-transform group-hover:rotate-12" />
                Uncover the Mystery
              </div>
            </Button> <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
           
            
            <div className="flex items-center gap-6 px-4 py-2 text-zinc-500 text-sm">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-rose-400/60" />
                <span>Instant Pings</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-indigo-400/60" />
                <span>Global Reach</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-zinc-400/60" />
                <span>Verified Submission</span>
              </div>
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="pt-0 text-sm italic text-zinc-500"
          >
            Entry is limited. IndexNow ensures your most recent work is indexed within minutes, not weeks.
          </motion.div>
        </motion.div>
      </div>
      
      {/* Decorative arrow to other sections */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-widest text-zinc-600">The Journey Continues</span>
        <div className="h-12 w-[1px] bg-gradient-to-b from-zinc-800 to-transparent" />
      </motion.div>
    </section>
  );
}
