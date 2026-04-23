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
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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
    <div className="flex flex-col h-full bg-card">
      <div className="flex items-center justify-between border-b px-6 py-4 bg-muted/5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold">AI Assistant</h3>
              <Badge variant="secondary" className="text-[9px] h-4 px-1 uppercase leading-none font-black bg-primary/10 text-primary border-none">Beta</Badge>
            </div>
            <p className="text-[10px] text-muted-foreground font-medium">Powered by Gemini 2.0 & Search Console API</p>
          </div>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-6" ref={scrollRef}>
        <div className="max-w-2xl mx-auto space-y-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-6 rounded-[2rem] bg-primary/5 p-6 relative">
                <div className="absolute inset-0 animate-pulse bg-primary/10 rounded-[2rem] blur-xl" />
                <Sparkles className="h-10 w-10 text-primary relative" />
              </div>
              <h2 className="text-2xl font-serif font-bold mb-2">Your Personal SEO Agent</h2>
              <p className="max-w-md text-sm text-muted-foreground leading-relaxed">
                Ask me to analyze your search console data, perform technical audits, 
                or index your latest content across all search engines.
              </p>
              
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                <QuickActionCard 
                  onClick={() => { if (!isLoading) sendMessage({ text: "Show my search performance for the last 28 days" }); }} 
                  icon={BarChart3} 
                  title="Analyze Performance" 
                  desc="Clicks, impressions, and CTR trends"
                />
                <QuickActionCard 
                  onClick={() => { if (!isLoading) sendMessage({ text: "Identify quick SEO wins for my site" }); }} 
                  icon={Zap} 
                  title="Quick Wins" 
                  desc="Keywords ranking on page 2"
                />
                <QuickActionCard 
                  onClick={() => { if (!isLoading) sendMessage({ text: "List all my connected websites" }); }} 
                  icon={Globe} 
                  title="Manage Sites" 
                  desc="Check indexing status"
                />
                <QuickActionCard 
                  onClick={() => { if (!isLoading) sendMessage({ text: "Generate meta tags for https://example.com" }); }} 
                  icon={Sparkles} 
                  title="AI Content" 
                  desc="Meta tags and blog ideas"
                />
              </div>
            </div>
          )}
          
          {messages.map((m: any) => (
            <div key={m.id} className={cn("flex w-full", m.role === "user" ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[85%] rounded-[1.5rem] px-5 py-3 text-sm shadow-sm leading-relaxed",
                m.role === "user" 
                  ? "bg-primary text-primary-foreground rounded-br-none" 
                  : "bg-muted/30 border border-border/50 rounded-bl-none text-foreground"
              )}>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {m.content}
                </div>
                {"toolInvocations" in m && (m as any).toolInvocations?.map((toolInvocation: any) => {
                  const { toolName, toolCallId, state } = toolInvocation;
                  return (
                    <div key={toolCallId} className="mt-3 flex items-center gap-2 rounded-xl bg-background/50 p-2.5 text-[10px] font-bold border border-border/40">
                      <Loader2 className={cn("h-3 w-3 animate-spin text-primary", state === "result" && "hidden")} />
                      <span className="uppercase tracking-widest">{state === "result" ? "✓" : "⚡"} {toolName.replace(/_/g, ' ')}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {isLoading && !messages.some((m: any) => m.role === 'assistant' && !m.content) && (
            <div className="flex justify-start">
              <div className="bg-muted/30 border border-border/50 rounded-[1.5rem] rounded-bl-none px-5 py-3">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="p-6 border-t bg-muted/5">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto flex items-center gap-3">
          <Input
            placeholder="Ask your assistant anything about your SEO..."
            value={input}
            onChange={handleInputChange}
            className="flex-1 h-14 rounded-2xl border-border/60 bg-background px-6 shadow-sm focus-visible:ring-primary/20"
          />
          <Button type="submit" disabled={isLoading || !input} className="h-14 w-14 rounded-2xl shadow-xl shadow-primary/20 shrink-0">
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </form>
        <p className="mt-4 text-center text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
          Powered by Gemini 2.0 & Search Console API
        </p>
      </div>
    </div>
  );
}

function QuickActionCard({ icon: Icon, title, desc, onClick }: { icon: any, title: string, desc: string, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-start p-4 rounded-[1.5rem] border border-border/60 bg-background/50 text-left transition-all hover:border-primary/30 hover:bg-primary/5 group"
    >
      <div className="h-8 w-8 rounded-xl bg-primary/5 flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
        <Icon className="h-4 w-4" />
      </div>
      <h4 className="text-xs font-bold mb-1">{title}</h4>
      <p className="text-[10px] text-muted-foreground leading-tight">{desc}</p>
    </button>
  );
}
