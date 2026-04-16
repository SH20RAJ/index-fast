"use client";

import {
  GlobeIcon,
  BarChart3,
  SearchCheckIcon,
  FileTextIcon,
  ZapIcon,
  SparklesIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface AIAssistantCardProps {
  onClose?: () => void;
  onSend?: (text: string, model: string) => void;
  userName?: string;
}

export const AIAssistantCard = ({
  onClose,
  onSend,
  userName = "there",
}: AIAssistantCardProps) => {
  const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const textarea = form.querySelector("textarea") as HTMLTextAreaElement;
    const select = form.querySelector("[data-model]") as HTMLInputElement;
    const text = textarea?.value?.trim();
    if (text && onSend) {
      onSend(text, select?.value ?? "gpt-4");
      textarea.value = "";
    }
  };

  const quickPrompts = [
    { label: "Submit URLs", icon: <GlobeIcon className="text-blue-500" />, prompt: "How do I submit my URLs for indexing?" },
    { label: "Analyze SEO", icon: <BarChart3 className="text-orange-500" />, prompt: "Analyze the SEO health of my site." },
    { label: "Check Indexing", icon: <SearchCheckIcon className="text-green-500" />, prompt: "Why aren't my pages indexed yet?" },
    { label: "Generate Sitemap", icon: <FileTextIcon className="text-pink-500" />, prompt: "Help me generate a sitemap." },
    { label: "Speed Up Crawl", icon: <ZapIcon className="text-yellow-500" />, prompt: "How do I speed up crawling?" },
    { label: "More", icon: <SparklesIcon className="text-purple-500" />, prompt: "" },
  ];

  return (
    <Card className="flex h-full w-full flex-col gap-4 p-4 shadow-none border-0">
      {/* Header icons */}
      <div className="flex flex-row items-center justify-end p-0 gap-0.5">
        <Button variant="ghost" size="icon" className="size-8" onClick={onClose} aria-label="Close">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 text-muted-foreground">
            <path d="M18 6l-12 12" />
            <path d="M6 6l12 12" />
          </svg>
        </Button>
      </div>

      <CardContent className="flex flex-1 flex-col p-0">
        {/* Welcome area */}
        <div className="flex flex-col items-center justify-center space-y-6 px-4 py-2">
          {/* IndexFast star logo (dark rounded square) */}
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0A0D12] shadow-md ring-1 ring-white/10">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2Z"
                fill="none"
              />
              <path
                clipRule="evenodd"
                d="M3 12c4.5 0 9-4.5 9-9 0 4.5 4.5 9 9 9-4.5 0-9 4.5-9 9 0-4.5-4.5-9-9-9z"
                fill="white"
                fillRule="evenodd"
                fillOpacity="0.85"
              />
            </svg>
          </div>

          {/* Greeting */}
          <div className="flex flex-col space-y-1 text-center">
            <h2 className="text-lg font-medium tracking-tight text-muted-foreground">
              Hi {userName},
            </h2>
            <h3 className="text-base font-semibold tracking-tight">
              How can IndexFast help you today?
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-[260px] mx-auto">
              Ask me anything about URL indexing, sitemaps, search engines, or your SEO strategy.
            </p>
          </div>

          {/* Quick prompt badges */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {quickPrompts.map((p) => (
              <Badge
                key={p.label}
                variant="secondary"
                className="h-7 cursor-pointer gap-1.5 rounded-md px-2 text-xs [&_svg]:size-3.5 [&_svg]:shrink-0"
                onClick={() => p.prompt && onSend?.(p.prompt, "gpt-4")}
              >
                {p.icon}
                {p.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Textarea + toolbar */}
        <form onSubmit={handleSend} className="relative mt-auto flex-col rounded-md ring-1 ring-border">
          <div className="relative">
            <Textarea
              placeholder="Ask me anything about indexing..."
              className="peer min-h-[90px] resize-none rounded-b-none border-none bg-transparent py-3 pl-9 pr-9 shadow-none focus-visible:ring-0"
            />
            {/* Search icon */}
            <div className="pointer-events-none absolute left-0 top-[14px] flex items-center justify-center pl-3 text-muted-foreground/60">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" className="size-4">
                <g fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11.5" cy="11.5" r="9.5" />
                  <path strokeLinecap="round" d="M18.5 18.5L22 22" />
                </g>
              </svg>
            </div>
          </div>

          {/* Bottom toolbar */}
          <div className="flex items-center justify-between rounded-b-md border-t bg-muted/50 px-3 py-2 dark:bg-muted">
            <Select
              defaultValue="indexfast-ai"
              options={[
                { label: "IndexFast AI", value: "indexfast-ai" },
                { label: "GPT-4", value: "gpt-4" },
                { label: "GPT-3.5", value: "gpt-3.5" },
              ]}
              className="w-[130px] h-7 text-xs"
            />
            <Button type="submit" size="sm" className="h-7 gap-1.5 px-3 text-xs">
              <ZapIcon className="size-3" />
              Send
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
