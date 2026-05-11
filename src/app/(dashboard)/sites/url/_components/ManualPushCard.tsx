"use client";

import { useState } from "react";
import { Loader2, Send, CheckCircle2, Save, History, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type SubmitMode = "sitemap" | "urls";

interface ManualPushCardProps {
  sitemapUrl: string;
  onSitemapUrlChange: (url: string) => void;
  manualUrls: string;
  onManualUrlsChange: (urls: string) => void;
  submitting: boolean;
  onSubmit: (mode: SubmitMode) => Promise<void>;
  submitResult: { totalUrls: number } | null;
  sitemapCandidates?: string[];
  onSaveSitemap?: (url: string) => Promise<void>;
  savingSitemap?: boolean;
}

export default function ManualPushCard({
  sitemapUrl,
  onSitemapUrlChange,
  manualUrls,
  onManualUrlsChange,
  submitting,
  onSubmit,
  submitResult,
  sitemapCandidates = [],
  onSaveSitemap,
  savingSitemap = false,
}: ManualPushCardProps) {
  const [mode, setMode] = useState<SubmitMode>("sitemap");

  return (
    <Card className="rounded-[2.5rem] border-none bg-zinc-50/50 dark:bg-white/5 shadow-sm overflow-hidden transition-all duration-500">
      <CardHeader className="px-8 pt-8 pb-4">
        <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Indexing Signal</CardTitle>
        <h2 className="text-xl font-serif font-bold tracking-tight mt-1 text-foreground">Manual Broadcast</h2>
      </CardHeader>
      <CardContent className="px-8 pb-8 space-y-6">
        <Tabs value={mode} onValueChange={(v) => setMode(v as SubmitMode)} className="w-full space-y-6">
          <TabsList className="bg-zinc-200/50 dark:bg-white/5 p-1 rounded-full w-fit">
            <TabsTrigger 
              value="sitemap" 
              className="rounded-full px-6 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-sm transition-all"
            >
              Sitemap
            </TabsTrigger>
            <TabsTrigger 
              value="urls" 
              className="rounded-full px-6 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-sm transition-all"
            >
              Raw List
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sitemap" className="mt-0 space-y-4 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between px-1">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">Primary Sitemap</Label>
                  {onSaveSitemap && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onSaveSitemap(sitemapUrl)}
                      disabled={savingSitemap || !sitemapUrl}
                      className="h-6 rounded-lg px-2 text-[9px] font-black uppercase tracking-tighter hover:bg-primary/10 hover:text-primary transition-colors gap-1"
                    >
                      {savingSitemap ? <Loader2 className="h-2.5 w-2.5 animate-spin" /> : <Save className="h-2.5 w-2.5" />}
                      {savingSitemap ? "Saving..." : "Store Permanent"}
                    </Button>
                  )}
                </div>
                <Input 
                  value={sitemapUrl} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSitemapUrlChange(e.target.value)} 
                  className="h-12 rounded-2xl bg-white dark:bg-zinc-900 border-none px-4 text-sm font-medium focus-visible:ring-1 focus-visible:ring-primary/20 shadow-inner"
                  placeholder="https://example.com/sitemap.xml"
                />
              </div>

              {sitemapCandidates.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[9px] font-black uppercase tracking-[0.15em] text-muted-foreground/40 px-1 flex items-center gap-1.5">
                    <Search className="h-2.5 w-2.5" />
                    All Discovered Sitemaps
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {sitemapCandidates.map((url) => (
                      <TooltipProvider key={url}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onSitemapUrlChange(url)}
                              className={cn(
                                "h-8 rounded-xl text-[10px] font-medium px-3 transition-all border-none shadow-sm",
                                sitemapUrl === url 
                                  ? "bg-primary text-white shadow-primary/20" 
                                  : "bg-white dark:bg-zinc-900 text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800"
                              )}
                            >
                              <span className="truncate max-w-[150px]">
                                {url.split('/').pop() || url}
                              </span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-zinc-900 text-white text-[10px] border-none px-2 py-1">
                            {url}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="urls" className="mt-0 space-y-4 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 px-1">Specific Pages</Label>
              <Textarea 
                value={manualUrls} 
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onManualUrlsChange(e.target.value)} 
                className="min-h-[160px] rounded-[24px] bg-white dark:bg-zinc-900 border-none p-4 resize-none text-sm font-medium focus-visible:ring-1 focus-visible:ring-primary/20"
                placeholder="https://example.com/page-1\nhttps://example.com/page-2"
              />
            </div>
          </TabsContent>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
            <Button 
              onClick={() => void onSubmit(mode)} 
              disabled={submitting} 
              className="h-12 w-full sm:w-auto px-10 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:opacity-90 transition-opacity font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-zinc-950/10 dark:shadow-white/5"
            >
              {submitting ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Send className="mr-2 h-3.5 w-3.5" />}
              {submitting ? "Processing" : "Submit Signal"}
            </Button>
            <div className="flex items-center gap-2 px-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                Real-time global distribution
              </p>
            </div>
          </div>
        </Tabs>

        {submitResult && (
          <div className="p-5 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10 flex items-start gap-4 animate-in zoom-in-95 slide-in-from-top-2 duration-500">
             <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
               <CheckCircle2 className="h-4 w-4 text-emerald-600" />
             </div>
             <div>
               <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Success</p>
               <p className="text-xs text-emerald-800/70 font-medium mt-0.5">Broadcasted {submitResult.totalUrls} URLs to search engine networks.</p>
             </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
