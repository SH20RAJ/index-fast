"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Terminal, CheckCircle2, XCircle, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export interface LogEntry {
  url: string;
  engine: string;
  status: "success" | "failed" | "pending";
  message?: string;
}

interface SubmissionTerminalProps {
  logs: LogEntry[];
  isOpen: boolean;
  onClose: () => void;
}

export default function SubmissionTerminal({ logs, isOpen, onClose }: SubmissionTerminalProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className={cn(
        "fixed bottom-6 right-6 z-50 w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-800 bg-black/95 shadow-2xl transition-all duration-300",
        !isExpanded && "h-12"
      )}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-zinc-500" />
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Submission Live Logs</span>
          <span className="ml-2 rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-500">{logs.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsExpanded(!isExpanded)} className="text-zinc-500 hover:text-white">
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>
          <button onClick={onClose} className="text-zinc-500 hover:text-white">
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="h-80 overflow-y-auto p-4 font-mono text-[11px] leading-relaxed">
          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {logs.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-3 border-b border-white/5 pb-2 last:border-0"
                >
                  <div className="mt-0.5">
                    {log.status === "pending" ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-500" />
                    ) : log.status === "success" ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-rose-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-4">
                      <span className="truncate text-zinc-300">{log.url}</span>
                      <span className="shrink-0 uppercase tracking-tighter text-zinc-500 font-bold">{log.engine}</span>
                    </div>
                    {log.message && <div className="mt-1 text-zinc-600 italic">└ {log.message}</div>}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {logs.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center py-12 text-center text-zinc-600">
                <p>Waiting for selection...</p>
                <p className="text-[9px] mt-1">Select URLs above and click "Bulk Ping"</p>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
