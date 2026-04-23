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
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for mobile */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
            />
            
            {/* Right Side Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l border-border/60 bg-card/95 shadow-2xl backdrop-blur-xl md:w-[400px] lg:w-[450px]"
            >
              <CardHeader className="flex flex-row items-center justify-between border-b p-5">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute -inset-1 animate-pulse rounded-full bg-primary/20" />
                    <Bot className="relative h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-sm font-bold">AI Assistant</CardTitle>
                      <Badge variant="secondary" className="text-[9px] h-4 px-1 uppercase leading-none font-black bg-primary/10 text-primary border-none">Beta</Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-medium">Powered by Gemini 2.0 & GSC API</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 rounded-full hover:bg-muted" aria-label="Close chat">
                  <X className="h-4 w-4" aria-hidden="true" />
                </Button>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-hidden p-0">
                <ScrollArea className="h-full p-6" ref={scrollRef}>
                  <div className="space-y-6">
                    {messages.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="mb-6 rounded-[2rem] bg-primary/5 p-6 relative">
                          <div className="absolute inset-0 animate-pulse bg-primary/10 rounded-[2rem] blur-xl" />
                          <Bot className="h-10 w-10 text-primary relative" />
                        </div>
                        <h3 className="mb-2 text-lg font-bold">SEO Agent at your service</h3>
                        <p className="px-8 text-sm text-muted-foreground leading-relaxed">
                          Ask me to analyze your search console data, perform technical audits, or index your content.
                        </p>
                        
                        <div className="mt-8 grid grid-cols-1 gap-3 w-full px-4">
                          <QuickAction onClick={() => {
                            if (!isLoading) sendMessage({ text: "List my websites" });
                          }} icon={Globe} label="Analyze My Sites" />
                          <QuickAction onClick={() => {
                            if (!isLoading) sendMessage({ text: "Show search performance" });
                          }} icon={BarChart3} label="Check Stats" />
                          <QuickAction onClick={() => {
                            if (!isLoading) sendMessage({ text: "Find quick SEO wins" });
                          }} icon={Zap} label="Find SEO Wins" />
                        </div>
                      </div>
                    )}
                    
                    {messages.map((m: any) => (
                      <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                        <div className={cn(
                          "max-w-[85%] rounded-[1.5rem] px-5 py-3 text-sm shadow-sm leading-relaxed",
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
                        <div className="bg-muted/50 border border-border/50 rounded-[1.5rem] rounded-bl-none px-5 py-3">
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
              
              <CardFooter className="border-t bg-muted/5 p-4">
                <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
                  <Input
                    placeholder="Ask your SEO assistant…"
                    value={input}
                    onChange={handleInputChange}
                    className="flex-1 border-border/60 bg-background/50 h-11 rounded-2xl focus-visible:ring-1"
                    aria-label="Chat input"
                  />
                  <Button type="submit" size="icon" disabled={isLoading || !input} className="h-11 w-11 rounded-2xl shadow-lg shadow-primary/20" aria-label="Send message">
                    <Send className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </form>
              </CardFooter>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.div 
        initial={false}
        animate={{ 
          x: isOpen ? 100 : 0,
          opacity: isOpen ? 0 : 1
        }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          size="icon"
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 bg-primary text-primary-foreground"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </motion.div>
    </>
  );
}

function QuickAction({ icon: Icon, label, onClick }: { icon: any, label: string, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between group rounded-2xl border border-border/60 bg-background/40 p-4 text-xs font-bold transition-all hover:bg-primary hover:text-primary-foreground hover:border-primary"
    >
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <ChevronRight className="h-4 w-4 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
    </button>
  );
}
