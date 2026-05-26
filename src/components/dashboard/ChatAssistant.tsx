"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import {
  Bot,
  X,
  Send,
  MessageSquare,
  Loader2,
  Globe,
  Zap,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

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
    <>
      {/* Panel overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 md:bg-transparent"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Side panel */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l bg-background transition-transform duration-200 ease-out md:w-[400px]",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted">
              <Bot className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">AI Assistant</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 text-muted-foreground"
            aria-label="Close chat"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full" ref={scrollRef}>
            <div className="px-5 py-6 space-y-5">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted mb-4">
                    <Bot className="h-4.5 w-4.5 text-muted-foreground" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">SEO Agent</h3>
                  <p className="text-xs text-muted-foreground max-w-[240px] mb-6">
                    Analyze data, run audits, or index your content.
                  </p>
                  <div className="grid grid-cols-1 gap-1.5 w-full">
                    <QuickAction
                      onClick={() => { if (!isLoading) sendMessage({ text: "List my websites" }); }}
                      icon={Globe}
                      label="List my sites"
                    />
                    <QuickAction
                      onClick={() => { if (!isLoading) sendMessage({ text: "Show search performance" }); }}
                      icon={BarChart3}
                      label="Search performance"
                    />
                    <QuickAction
                      onClick={() => { if (!isLoading) sendMessage({ text: "Find quick SEO wins" }); }}
                      icon={Zap}
                      label="Find SEO wins"
                    />
                  </div>
                </div>
              )}

              {messages.map((m: any) => (
                <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[85%] text-sm leading-relaxed",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-2xl rounded-br-md px-3.5 py-2"
                      : "text-foreground"
                  )}>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
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
        </div>

        {/* Input */}
        <div className="border-t px-5 py-3">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input
              placeholder="Ask about SEO..."
              value={input}
              onChange={handleInputChange}
              className="flex-1 h-9 bg-muted border-0 text-sm focus-visible:ring-1"
              aria-label="Chat input"
            />
            <Button
              type="submit"
              size="icon"
              variant="ghost"
              disabled={isLoading || !input}
              className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground"
              aria-label="Send message"
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          </form>
        </div>
      </div>

      {/* Floating trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-foreground text-background transition-all",
          isOpen && "opacity-0 pointer-events-none"
        )}
        aria-label="Open chat"
      >
        <MessageSquare className="h-4 w-4" />
      </button>
    </>
  );
}

function QuickAction({ icon: Icon, label, onClick }: { icon: any; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-foreground text-left transition-colors hover:bg-muted w-full"
    >
      <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      {label}
    </button>
  );
}
