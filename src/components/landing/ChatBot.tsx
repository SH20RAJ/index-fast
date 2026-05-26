"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text?: string) => {
    const content = text ?? input;
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream");

      let assistantMessage = "";
      const assistantId = (Date.now() + 1).toString();

      setMessages((prev) => [
        ...prev,
        { id: assistantId, content: "", role: "assistant", timestamp: new Date() },
      ]);

      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        for (const line of chunk.split("\n")) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              const delta = data.choices?.[0]?.delta?.content || "";
              if (delta) {
                assistantMessage += delta;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId ? { ...m, content: assistantMessage } : m
                  )
                );
              }
            } catch {
              // skip parse errors
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: "Sorry, I encountered an error. Please try again.",
          role: "assistant",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <>
      {/* Floating trigger */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex h-10 w-10 items-center justify-center rounded-lg bg-foreground text-background transition-colors hover:bg-foreground/90"
          aria-label="Open chat"
        >
          <MessageCircle className="h-4 w-4" />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-1.5rem)] flex flex-col rounded-xl border border-border bg-background shadow-lg overflow-hidden" style={{ height: "520px" }}>
          {/* Header */}
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h3 className="text-sm font-semibold text-foreground">IndexFast Assistant</h3>
            <button
              onClick={() => { setIsOpen(false); setMessages([]); }}
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto">
            {!hasMessages ? (
              <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                <h3 className="text-sm font-semibold text-foreground mb-1">How can I help?</h3>
                <p className="text-xs text-muted-foreground mb-5 max-w-[220px]">
                  Ask about indexing, sitemaps, or SEO strategy.
                </p>
                <div className="grid grid-cols-1 gap-1.5 w-full">
                  <QuickPrompt
                    label="Submit URLs for indexing"
                    onClick={() => handleSend("How do I submit my URLs for indexing?")}
                  />
                  <QuickPrompt
                    label="Analyze my SEO health"
                    onClick={() => handleSend("Analyze the SEO health of my site.")}
                  />
                  <QuickPrompt
                    label="Check indexing status"
                    onClick={() => handleSend("Why aren't my pages indexed yet?")}
                  />
                </div>
              </div>
            ) : (
              <div className="px-4 py-5 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={message.role === "user" ? "flex justify-end" : "flex justify-start"}
                  >
                    <div
                      className={
                        message.role === "user"
                          ? "bg-primary text-primary-foreground rounded-2xl rounded-br-md px-3.5 py-2 text-sm leading-relaxed max-w-[85%]"
                          : "text-foreground text-sm leading-relaxed max-w-[85%]"
                      }
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t px-4 py-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything..."
                className="flex-1 h-9 rounded-lg bg-muted border-0 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                disabled={isLoading}
              />
              <Button
                onClick={() => handleSend()}
                disabled={isLoading || !input.trim()}
                size="icon"
                variant="ghost"
                className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground"
              >
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function QuickPrompt({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg border border-border px-3 py-2 text-xs text-foreground text-left transition-colors hover:bg-muted"
    >
      {label}
    </button>
  );
}
