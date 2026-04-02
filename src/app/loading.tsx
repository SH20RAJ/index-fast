"use client";

import { motion } from "framer-motion";
import { Zap, Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background gap-8 overflow-hidden">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative"
      >
        <div className="relative z-10 w-20 h-20 rounded-[28px] bg-primary flex items-center justify-center shadow-2xl shadow-primary/20 border border-white/10 overflow-hidden group">
          <Zap className="text-primary-foreground h-10 w-10 fill-current group-hover:scale-110 transition-transform duration-500" />
          <motion.div 
            animate={{ 
              top: ["100%", "-100%"] 
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="absolute left-0 right-0 h-1/2 bg-white/20 skew-y-12"
          />
        </div>
        
        {/* Pulsing Aura */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute inset-[-20px] rounded-[40px] border-2 border-primary/30"
        />
      </motion.div>

      <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl font-black tracking-tighter text-foreground font-outfit">
          INDEXFAST
        </h1>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-muted/40 rounded-full border border-border/10">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            Synchronizing Engine
          </span>
        </div>
      </div>

      <motion.p 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-lg font-medium text-muted-foreground/60 italic font-hand rotate-[-1deg]"
      >
        Getting things ready...
      </motion.p>
    </div>
  );
}
