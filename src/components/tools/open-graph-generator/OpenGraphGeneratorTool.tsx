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
  Share2,
  Image as ImageIcon,
  Type,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function OpenGraphGeneratorTool() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [image, setImage] = useState("");
  const [siteName, setSiteName] = useState("");
  const [copied, setCopied] = useState(false);

  const generatedCode = `<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${url || "https://example.com/"}">
<meta property="og:title" content="${title || "Page Title"}">
<meta property="og:description" content="${description || "Page description goes here."}">
<meta property="og:image" content="${image || "https://example.com/image.png"}">
<meta property="og:site_name" content="${siteName || "Your Site Name"}">`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    toast.success("OG Tags copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <Card className="rounded-3xl border-border bg-card/50 shadow-sm overflow-hidden">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-5">
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Page Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter title for sharing"
                  className="h-11 rounded-xl bg-background border-border text-sm focus-visible:ring-primary/20"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Description</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter summary for social cards"
                  className="min-h-[80px] rounded-2xl bg-background border-border p-4 text-xs leading-relaxed focus-visible:ring-primary/20 resize-none"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Canonical URL</Label>
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/page"
                  className="h-11 rounded-xl bg-background border-border text-sm focus-visible:ring-primary/20"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">OG Image URL</Label>
                <Input
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://example.com/og-image.png"
                  className="h-11 rounded-xl bg-background border-border text-sm focus-visible:ring-primary/20"
                />
              </div>
            </div>

            <div className="space-y-6">
              {/* Preview */}
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1 flex items-center gap-1.5">
                  <Share2 className="h-3 w-3" /> Social Card Preview
                </Label>
                <div className="rounded-2xl bg-background border border-border/50 shadow-sm overflow-hidden flex flex-col max-w-[400px]">
                  <div className="h-[200px] bg-muted flex items-center justify-center relative overflow-hidden">
                    {image ? (
                      <img src={image} alt="OG Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="h-12 w-12 text-muted-foreground/20" />
                    )}
                  </div>
                  <div className="p-4 space-y-1.5 border-t border-border/40">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                      {url ? new URL(url).hostname : "YOURDOMAIN.COM"}
                    </p>
                    <h3 className="text-base font-bold text-foreground line-clamp-1">
                      {title || "Example Shared Title"}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {description || "This is how your site description will appear when shared on Facebook, LinkedIn, and other social networks."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Code */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                    <Code className="h-3 w-3" /> Generated Tags
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
                <pre className="p-4 rounded-2xl bg-zinc-950 text-zinc-400 font-mono text-[10px] leading-relaxed overflow-x-auto scrollbar-hide border border-white/5 h-[140px]">
                  {generatedCode}
                </pre>
              </div>
            </div>
          </div>

          {/* Pro CTA */}
          <div className="p-6 rounded-[2rem] bg-zinc-950 text-white relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(244,63,94,0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <h4 className="text-lg font-bold tracking-tight">Generate dynamic OG images</h4>
                <p className="text-sm text-zinc-400 max-w-md">
                  IndexFast Pro automatically generates beautiful, high-converting social images for every page on your site using AI.
                </p>
              </div>
              <Button asChild className="rounded-xl bg-white text-black hover:bg-zinc-200 font-bold px-6">
                <a href="/sign-up">
                  Get Pro
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
