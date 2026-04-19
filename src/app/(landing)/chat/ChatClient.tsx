"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Menu, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

export default function ChatClient() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hey! 👋 I'm the IndexFast Assistant. Ask me anything about SEO indexing, URL submissions, or how IndexFast can help your website rank faster.",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const newConversation = () => {
    const id = Date.now().toString();
    const conv: Conversation = {
      id,
      title: "New Conversation",
      messages: [
        {
          id: "1",
          content: "Hey! 👋 I'm the IndexFast Assistant. Ask me anything about SEO indexing, URL submissions, or how IndexFast can help your website rank faster.",
          role: "assistant",
          timestamp: new Date(),
        },
      ],
      createdAt: new Date(),
    };
    setConversations((prev) => [conv, ...prev]);
    setCurrentConversationId(id);
    setMessages(conv.messages);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    // Update conversation title if it's still "New Conversation"
    if (currentConversationId) {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === currentConversationId && conv.title === "New Conversation"
            ? { ...conv, title: input.slice(0, 50) }
            : conv
        )
      );
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
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
        {
          id: assistantId,
          content: "",
          role: "assistant",
          timestamp: new Date(),
        },
      ]);

      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              const content = data.choices?.[0]?.delta?.content || "";
              if (content) {
                assistantMessage += content;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId ? { ...m, content: assistantMessage } : m
                  )
                );
              }
            } catch {
              // Skip parsing errors
            }
          }
        }
      }

      // Update conversation with new messages
      if (currentConversationId) {
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === currentConversationId
              ? { ...conv, messages: updatedMessages }
              : conv
          )
        );
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

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-border/70 bg-card/50 backdrop-blur transform transition-transform duration-300 lg:relative lg:tranzinc-x-0 ${
          sidebarOpen ? "tranzinc-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-border/70">
            <Link href="/" className="font-bold text-lg flex items-center gap-2 hover:opacity-80 transition">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-600 to-pink-700 rounded-lg" />
              IndexFast
            </Link>
          </div>

          <Button
            onClick={newConversation}
            className="m-4 w-calc(100% - 32px) bg-pink-600 hover:bg-pink-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>

          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => {
                  setCurrentConversationId(conv.id);
                  setMessages(conv.messages);
                  setSidebarOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm truncate ${
                  currentConversationId === conv.id
                    ? "bg-pink-600 text-white"
                    : "hover:bg-muted text-foreground"
                }`}
              >
                {conv.title}
              </button>
            ))}
          </div>

          <div className="p-4 border-t border-border/70 space-y-2">
            <p className="text-xs text-muted-foreground">Powered by NVIDIA AI</p>
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link href="/">← Back to Home</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Mobile Header */}
        <div className="lg:hidden border-b border-border/70 p-4 flex items-center justify-between bg-card/50 backdrop-blur">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="font-bold">Chat</h1>
          <div className="w-9" />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="text-5xl">💬</div>
                <h2 className="text-2xl font-bold">Start a conversation</h2>
                <p className="text-muted-foreground max-w-sm">
                  Ask me anything about IndexFast, SEO indexing, or URL submissions.
                </p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-2xl px-4 py-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-pink-600 text-white rounded-br-none"
                      : "bg-muted text-foreground rounded-bl-none border border-border/50"
                  }`}
                >
                  <p className="leading-relaxed text-sm sm:text-base">{message.content}</p>
                  <p className={`text-xs mt-2 ${
                    message.role === "user" ? "text-pink-100" : "text-muted-foreground"
                  }`}>
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted text-foreground px-4 py-3 rounded-lg border border-border/50 rounded-bl-none">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-border/70 bg-card/50 backdrop-blur p-4 sm:p-6">
          <div className="max-w-4xl mx-auto space-y-3">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask me anything about IndexFast..."
                className="flex-1 px-4 py-3 bg-background border border-border/50 rounded-lg text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-transparent transition-all"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-pink-600 hover:bg-pink-700 text-white px-4"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Press Enter to send • Powered by NVIDIA Qwen
            </p>
          </div>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
