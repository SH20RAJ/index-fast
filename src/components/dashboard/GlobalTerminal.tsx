"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Terminal, CheckCircle2, XCircle, Loader2, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { useLogs } from "./LogContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function GlobalTerminal() {
  const { logs, isTerminalOpen, setIsTerminalOpen, clearLogs } = useLogs();

  if (logs.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[60] w-full max-w-lg">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={cn(
          "overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl transition-all duration-300 dark:border-white/10 dark:bg-zinc-950/90 backdrop-blur-xl",
          !isTerminalOpen && "h-14"
        )}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between border-b border-zinc-100 px-4 py-3 dark:border-white/5 cursor-pointer"
          onClick={() => setIsTerminalOpen(!isTerminalOpen)}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
              <Terminal className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Live Operations Log</span>
              <span className="text-xs font-bold">{logs.length} entries active</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg hover:bg-rose-500/10 hover:text-rose-500"
              onClick={(e) => {
                e.stopPropagation();
                if (confirm("Clear all logs?")) clearLogs();
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
            <div className={cn("transition-transform duration-300", isTerminalOpen ? "rotate-0" : "rotate-180")}>
              <ChevronDown className="h-4 w-4 text-zinc-400" />
            </div>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence>
          {isTerminalOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "320px", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-y-auto p-4 font-mono text-[11px] leading-relaxed custom-scrollbar"
            >
              <div className="space-y-2">
                {logs.map((log, i) => (
                  <motion.div
                    key={`${log.timestamp.getTime()}-${i}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-3 border-b border-zinc-50 pb-2 last:border-0 dark:border-white/5"
                  >
                    <div className="mt-1 shrink-0">
                      {log.status === "pending" ? (
                        <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
                      ) : log.status === "success" ? (
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <XCircle className="h-3 w-3 text-rose-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-4">
                        <span className="truncate text-zinc-600 dark:text-zinc-300">{log.url}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="uppercase tracking-tighter text-zinc-400 font-bold">{log.engine}</span>
                          <span className="text-[9px] text-zinc-300 dark:text-zinc-600">
                             {log.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                        </div>
                      </div>
                      {log.message && <div className="mt-1 text-zinc-400 italic font-sans">└ {log.message}</div>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
