"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import {
  Bot,
  Send,
  Loader2,
  Globe,
  Zap,
  BarChart3,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export function ChatInterface() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");

  const { messages, sendMessage, status } = useChat({
    api: "/api/chat/dashboard",
  } as any);

  const isLoading = status === "submitted" || status === "streaming";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 border-b px-6 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
          <Bot className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">AI Assistant</h3>
          <p className="text-xs text-muted-foreground">SEO analysis and indexing</p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1" ref={scrollRef}>
        <div className="max-w-2xl mx-auto px-6 py-8 space-y-5">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted mb-4">
                <Sparkles className="h-5 w-5 text-muted-foreground" />
              </div>
              <h2 className="text-lg font-semibold text-foreground mb-1">Your SEO Agent</h2>
              <p className="text-sm text-muted-foreground max-w-sm mb-8">
                Analyze search console data, perform audits, or index your latest content.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
                <QuickAction
                  onClick={() => { if (!isLoading) sendMessage({ text: "Show my search performance for the last 28 days" }); }}
                  icon={BarChart3}
                  label="Analyze performance"
                />
                <QuickAction
                  onClick={() => { if (!isLoading) sendMessage({ text: "Identify quick SEO wins for my site" }); }}
                  icon={Zap}
                  label="Quick SEO wins"
                />
                <QuickAction
                  onClick={() => { if (!isLoading) sendMessage({ text: "List all my connected websites" }); }}
                  icon={Globe}
                  label="Manage sites"
                />
                <QuickAction
                  onClick={() => { if (!isLoading) sendMessage({ text: "Generate meta tags for https://example.com" }); }}
                  icon={Sparkles}
                  label="Generate meta tags"
                />
              </div>
            </div>
          )}

          {messages.map((m: any) => (
            <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[80%] text-sm leading-relaxed",
                m.role === "user"
                  ? "bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-2.5"
                  : "text-foreground"
              )}>
                <div className={cn("prose prose-sm dark:prose-invert max-w-none", m.role !== "user" && "prose-neutral")}>
                  {m.content}
                </div>
                {"toolInvocations" in m && (m as any).toolInvocations?.map((toolInvocation: any) => {
                  const { toolName, toolCallId, state } = toolInvocation;
                  return (
                    <div key={toolCallId} className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      {state !== "result" && <Loader2 className="h-3 w-3 animate-spin" />}
                      <span>{toolName.replace(/_/g, " ")}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {isLoading && !messages.some((m: any) => m.role === "assistant" && !m.content) && (
            <div className="flex justify-start">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t px-6 py-4">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto flex items-center gap-2">
          <Input
            placeholder="Ask about your SEO..."
            value={input}
            onChange={handleInputChange}
            className="flex-1 h-10 bg-muted border-0 focus-visible:ring-1"
            aria-label="Chat input"
          />
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            disabled={isLoading || !input}
            className="h-10 w-10 shrink-0 text-muted-foreground hover:text-foreground"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}

function QuickAction({ icon: Icon, label, onClick }: { icon: any; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2.5 rounded-lg border border-border px-3.5 py-2.5 text-sm text-foreground text-left transition-colors hover:bg-muted"
    >
      <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
      {label}
    </button>
  );
}
