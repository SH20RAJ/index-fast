"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, 
  X, 
  Send, 
  MessageSquare, 
  Loader2, 
  Globe, 
  Zap, 
  BarChart3,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-[380px] sm:w-[450px]"
          >
            <Card className="border-border/60 bg-card/95 shadow-2xl backdrop-blur-xl">
              <CardHeader className="flex flex-row items-center justify-between border-b p-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute -inset-1 animate-pulse rounded-full bg-primary/20" />
                    <Bot className="relative h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-bold">IndexFast AI</CardTitle>
                    <p className="text-[10px] text-emerald-500 font-medium">Assistant Online</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 rounded-full">
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              
              <CardContent className="p-0">
                <ScrollArea className="h-[450px] p-4" ref={scrollRef}>
                  <div className="space-y-4">
                    {messages.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="mb-4 rounded-2xl bg-primary/5 p-3">
                          <Zap className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="mb-1 text-sm font-bold">How can I help you today?</h3>
                        <p className="px-8 text-xs text-muted-foreground">
                          Try asking "Index my site" or "Run an SEO audit on indexfast.co"
                        </p>
                        
                        <div className="mt-6 grid grid-cols-2 gap-2 px-4">
                          <QuickAction onClick={() => {
                            if (!isLoading) sendMessage({ text: "List my websites" });
                          }} icon={Globe} label="My Sites" />
                          <QuickAction onClick={() => {
                            if (!isLoading) sendMessage({ text: "Show my stats" });
                          }} icon={BarChart3} label="View Stats" />
                        </div>
                      </div>
                    )}
                    
                    {messages.map((m: any) => (
                      <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                        <div className={cn(
                          "max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm",
                          m.role === "user" 
                            ? "bg-primary text-primary-foreground rounded-br-none" 
                            : "bg-muted/50 border border-border/50 rounded-bl-none"
                        )}>
                          <div className="prose prose-sm dark:prose-invert">
                            {m.content}
                          </div>
                          {"toolInvocations" in m && (m as any).toolInvocations?.map((toolInvocation: any) => {
                            const { toolName, toolCallId, state } = toolInvocation;
                            return (
                              <div key={toolCallId} className="mt-2 flex items-center gap-2 rounded-lg bg-background/50 p-2 text-[10px] font-medium border border-border/40">
                                <Loader2 className={cn("h-3 w-3 animate-spin text-primary", state === "result" && "hidden")} />
                                <span>{state === "result" ? "✓" : "⚡"} {toolName.replace(/_/g, ' ')}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                    {isLoading && !messages.some((m: any) => m.role === 'assistant' && !m.content) && (
                      <div className="flex justify-start">
                        <div className="bg-muted/50 border border-border/50 rounded-2xl rounded-bl-none px-4 py-2">
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
              
              <CardFooter className="border-t p-3">
                <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
                  <Input
                    placeholder="Ask anything..."
                    value={input}
                    onChange={handleInputChange}
                    className="flex-1 border-none bg-muted/30 focus-visible:ring-1"
                  />
                  <Button type="submit" size="icon" disabled={isLoading || !input} className="h-9 w-9 rounded-xl shadow-lg shadow-primary/20">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-14 w-14 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95",
          isOpen ? "bg-background text-foreground border border-border/60" : "bg-primary text-primary-foreground"
        )}
      >
        {isOpen ? <ChevronDown className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </Button>
    </div>
  );
}

function QuickAction({ icon: Icon, label, onClick }: { icon: any, label: string, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/40 px-3 py-2 text-[10px] font-bold transition-all hover:bg-primary/5 hover:border-primary/30"
    >
      <Icon className="h-3 w-3 text-primary" />
      {label}
    </button>
  );
}
