"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export interface LogEntry {
  url: string;
  engine: string;
  status: "success" | "failed" | "pending";
  message?: string;
  timestamp: Date;
}

interface LogContextType {
  logs: LogEntry[];
  addLog: (log: Omit<LogEntry, "timestamp">) => void;
  addLogs: (logs: Omit<LogEntry, "timestamp">[]) => void;
  clearLogs: () => void;
  isTerminalOpen: boolean;
  setIsTerminalOpen: (open: boolean) => void;
}

const LogContext = createContext<LogContextType | undefined>(undefined);

export function LogProvider({ children }: { children: React.ReactNode }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  const addLog = useCallback((log: Omit<LogEntry, "timestamp">) => {
    setLogs((prev) => [{ ...log, timestamp: new Date() }, ...prev].slice(0, 100));
    setIsTerminalOpen(true);
  }, []);

  const addLogs = useCallback((newLogs: Omit<LogEntry, "timestamp">[]) => {
    const stamped = newLogs.map(l => ({ ...l, timestamp: new Date() }));
    setLogs((prev) => [...stamped, ...prev].slice(0, 100));
    setIsTerminalOpen(true);
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  return (
    <LogContext.Provider value={{ 
      logs, 
      addLog, 
      addLogs, 
      clearLogs, 
      isTerminalOpen, 
      setIsTerminalOpen 
    }}>
      {children}
    </LogContext.Provider>
  );
}

export function useLogs() {
  const context = useContext(LogContext);
  if (context === undefined) {
    throw new Error("useLogs must be used within a LogProvider");
  }
  return context;
}
