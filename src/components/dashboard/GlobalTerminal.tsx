"use client";

import { CheckCircle2, XCircle, Loader2, ChevronDown, ChevronUp, Trash2, Terminal } from "lucide-react";
import { useLogs } from "./LogContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function GlobalTerminal() {
  const { logs, isTerminalOpen, setIsTerminalOpen, clearLogs } = useLogs();

  if (logs.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[60] w-full max-w-md">
      <div
        className={cn(
          "rounded-lg border border-border bg-card overflow-hidden transition-all duration-200",
          !isTerminalOpen && "h-10"
        )}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-3 py-2 border-b border-border cursor-pointer select-none"
          onClick={() => setIsTerminalOpen(!isTerminalOpen)}
        >
          <div className="flex items-center gap-2">
            <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-medium">Operations Log</span>
            <span className="text-[10px] text-muted-foreground">{logs.length}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                if (confirm("Clear all logs?")) clearLogs();
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
            {isTerminalOpen ? (
              <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </div>
        </div>

        {/* Content */}
        {isTerminalOpen && (
          <div className="h-80 overflow-y-auto">
            <div className="divide-y divide-border">
              {logs.map((log, i) => (
                <div
                  key={`${log.timestamp.getTime()}-${i}`}
                  className="px-3 py-2 flex items-start gap-2"
                >
                  <span className="mt-0.5 shrink-0">
                    {log.status === "pending" ? (
                      <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                    ) : log.status === "success" ? (
                      <CheckCircle2 className="h-3 w-3 text-primary" />
                    ) : (
                      <XCircle className="h-3 w-3 text-destructive" />
                    )}
                  </span>
                  <div className="flex-1 min-w-0 font-mono text-[11px] leading-relaxed">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-foreground">{log.url}</span>
                      <span className="text-[9px] text-muted-foreground shrink-0 tabular-nums">
                        {log.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="uppercase tracking-wide text-[9px] text-muted-foreground">
                        {log.engine}
                      </span>
                      {log.message && (
                        <span className="text-muted-foreground truncate">{log.message}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
