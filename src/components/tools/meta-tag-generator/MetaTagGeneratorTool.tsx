"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Copy, 
  CheckCircle2, 
  Code,
  ArrowRight,
  ShieldCheck,
  Search,
  Eye,
  Type,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function MetaTagGeneratorTool() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [copied, setCopied] = useState(false);

  const generatedCode = `<!-- Primary Meta Tags -->
<title>${title || "Page Title"}</title>
<meta name="title" content="${title || "Page Title"}">
<meta name="description" content="${description || "Page description goes here."}">
<meta name="keywords" content="${keywords || "keywords, separated, by, commas"}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:title" content="${title || "Page Title"}">
<meta property="og:description" content="${description || "Page description goes here."}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:title" content="${title || "Page Title"}">
<meta property="twitter:description" content="${description || "Page description goes here."}">`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    toast.success("Tags copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <Card className="rounded-3xl border-border bg-card/50 shadow-sm overflow-hidden">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Page Title</Label>
                  <span className={cn("text-[9px] font-bold", title.length > 60 ? "text-red-500" : "text-muted-foreground")}>
                    {title.length}/60
                  </span>
                </div>
                <Input
                  value={title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setTitle(e.target.value)}
                  placeholder="Enter your page title"
                  className="h-12 rounded-xl bg-background border-border text-sm focus-visible:ring-primary/20"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Description</Label>
                  <span className={cn("text-[9px] font-bold", description.length > 160 ? "text-red-500" : "text-muted-foreground")}>
                    {description.length}/160
                  </span>
                </div>
                <Textarea
                  value={description}
                  onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDescription(e.target.value)}
                  placeholder="Enter your page description..."
                  className="min-h-[100px] rounded-2xl bg-background border-border p-4 text-xs leading-relaxed focus-visible:ring-primary/20 resize-none"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Keywords</Label>
                <Input
                  value={keywords}
                  onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setKeywords(e.target.value)}
                  placeholder="keyword1, keyword2, keyword3"
                  className="h-12 rounded-xl bg-background border-border text-sm focus-visible:ring-primary/20"
                />
              </div>
            </div>

            <div className="space-y-6">
              {/* Google Preview */}
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1 flex items-center gap-1.5">
                  <Search className="h-3 w-3" /> Search Engine Preview
                </Label>
                <div className="p-5 rounded-2xl bg-background border border-border/50 shadow-sm space-y-1.5 overflow-hidden">
                  <p className="text-[11px] text-[#202124] truncate">https://www.yourdomain.com</p>
                  <h3 className="text-lg text-[#1a0dab] hover:underline cursor-pointer truncate font-medium">
                    {title || "Example Page Title - Your Website"}
                  </h3>
                  <p className="text-[13px] text-[#4d5156] leading-relaxed line-clamp-2">
                    {description || "This is how your page description will appear in Google search results. Make sure it's catchy and contains your primary keyword."}
                  </p>
                </div>
              </div>

              {/* Code Preview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                    <Code className="h-3 w-3" /> Generated HTML
                  </Label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleCopy}
                    className="h-7 rounded-lg text-[9px] font-bold uppercase"
                  >
                    {copied ? <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" /> : <Copy className="h-3 w-3 mr-1" />}
                    Copy
                  </Button>
                </div>
                <div className="relative group">
                  <pre className="p-4 rounded-2xl bg-zinc-950 text-zinc-400 font-mono text-[10px] leading-relaxed overflow-x-auto scrollbar-hide border border-white/5 h-[160px]">
                    {generatedCode}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Pro CTA */}
          <div className="p-6 rounded-[2rem] bg-zinc-950 text-white relative overflow-hidden group mt-4">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(244,63,94,0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <h4 className="text-lg font-bold tracking-tight">Let AI write your meta tags</h4>
                <p className="text-sm text-zinc-400 max-w-md">
                  IndexFast Pro uses AI to generate high-converting meta tags and tracks their performance across all search engines automatically.
                </p>
              </div>
              <Button asChild className="rounded-xl bg-white text-black hover:bg-zinc-200 font-bold px-6">
                <a href="/sign-up">
                  Generate with AI
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
