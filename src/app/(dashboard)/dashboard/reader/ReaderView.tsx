"use client";

import { useState } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Copy, Download, Loader2, Sparkles, Wand2 } from "lucide-react";
import { getReaderContent } from "@/app/(dashboard)/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function ReaderView() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<string | null>(null);

  const handleRead = async () => {
    if (!url) {
      toast.error("Please enter a URL.");
      return;
    }

    setLoading(true);
    try {
      const res = await getReaderContent(url);
      if (res.status === "success" && res.data) {
        setContent(res.data);
        toast.success("Content extracted successfully!");
      } else {
        toast.error(res.message || "Failed to extract content.");
      }
    } catch (err) {
      toast.error("An error occurred while fetching content.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard!");
  };

  const downloadMarkdown = () => {
    if (!content) return;
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `content-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Download started!");
  };

  return (
    <div className="space-y-8 pb-32 max-w-5xl">
      <PageHeader
        title="AI Content Reader"
        description="Transform any webpage into clean, LLM-optimized Markdown for SEO analysis and repurposing."
      />

      <Card className="rounded-[40px] border-zinc-100 dark:bg-zinc-900/40 p-8 overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
           <Wand2 className="w-24 h-24 text-rose-500" />
        </div>
        <div className="relative space-y-6">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Target URL</span>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 group/input">
                 <BookOpen className="absolute left-4 top-1/2 -tranzinc-y-1/2 h-4 w-4 text-zinc-400 group-focus-within/input:text-rose-500 transition-colors" />
                 <Input
                   placeholder="https://example.com/blog-post"
                   value={url}
                   onChange={(e) => setUrl(e.target.value)}
                   className="h-14 pl-12 rounded-2xl bg-zinc-50 border-zinc-100 focus-visible:ring-rose-500/20 dark:bg-white/5 dark:border-white/10"
                   onKeyDown={(e) => e.key === "Enter" && handleRead()}
                 />
              </div>
              <Button 
                onClick={handleRead} 
                disabled={loading}
                className="h-14 px-8 rounded-2xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white font-bold transition-all active:scale-95 disabled:scale-100"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                {loading ? "Decrypting..." : "Read Content"}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <AnimatePresence>
        {content && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-pink-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Markdown Extraction Complete</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-9 rounded-xl gap-2 font-bold uppercase text-[10px]">
                  <Copy className="h-3.5 w-3.5" /> Copy
                </Button>
                <Button variant="ghost" size="sm" onClick={downloadMarkdown} className="h-9 rounded-xl gap-2 font-bold uppercase text-[10px]">
                  <Download className="h-3.5 w-3.5" /> Download
                </Button>
              </div>
            </div>

            <Card className="rounded-[40px] border-zinc-100 dark:bg-black/40 overflow-hidden">
               <div className="p-8 max-h-[600px] overflow-y-auto custom-scrollbar bg-zinc-50/50 dark:bg-black/20">
                  <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                    {content}
                  </pre>
               </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {!content && !loading && (
        <div className="py-20 text-center border-2 border-dashed border-zinc-100 dark:border-white/5 rounded-[40px] opacity-40">
           <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-50 dark:bg-white/5 mb-4">
              <Wand2 className="w-8 h-8 text-zinc-300" />
           </div>
           <p className="text-sm font-medium text-zinc-500 leading-relaxed max-w-xs mx-auto">
             Paste a URL above to convert it into a perfectly formatted Markdown document ready for your LLM or SEO analysis.
           </p>
        </div>
      )}
    </div>
  );
}
