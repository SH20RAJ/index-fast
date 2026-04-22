"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type SubmitMode = "sitemap" | "urls";

interface ManualPushCardProps {
  sitemapUrl: string;
  onSitemapUrlChange: (url: string) => void;
  manualUrls: string;
  onManualUrlsChange: (urls: string) => void;
  submitting: boolean;
  onSubmit: (mode: SubmitMode) => Promise<void>;
  submitResult: { totalUrls: number } | null;
}

export default function ManualPushCard({
  sitemapUrl,
  onSitemapUrlChange,
  manualUrls,
  onManualUrlsChange,
  submitting,
  onSubmit,
  submitResult,
}: ManualPushCardProps) {
  const [mode, setMode] = useState<SubmitMode>("sitemap");

  return (
    <Card className="rounded-[32px] border-zinc-100 dark:border-white/5 bg-white dark:bg-zinc-900/40 shadow-sm overflow-hidden">
      <CardHeader className="border-b border-zinc-50 dark:border-white/5 px-8 py-6">
        <CardTitle className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-400">Manual Push</CardTitle>
      </CardHeader>
      <CardContent className="p-8 space-y-8">
        <Tabs value={mode} onValueChange={(v) => setMode(v as SubmitMode)} className="w-full space-y-8">
          <TabsList className="bg-zinc-100 dark:bg-white/5 p-1 rounded-full w-fit">
            <TabsTrigger 
              value="sitemap" 
              className="rounded-full px-8 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800"
            >
              Sitemap
            </TabsTrigger>
            <TabsTrigger 
              value="urls" 
              className="rounded-full px-8 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800"
            >
              Raw URLs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sitemap" className="mt-0 space-y-4 animate-in fade-in duration-500">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 px-1">Target Sitemap</Label>
              <Input 
                value={sitemapUrl} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSitemapUrlChange(e.target.value)} 
                className="h-12 rounded-2xl bg-zinc-50 border-none dark:bg-white/5 px-4"
              />
            </div>
          </TabsContent>

          <TabsContent value="urls" className="mt-0 space-y-4 animate-in fade-in duration-500">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 px-1">URL List (One per line)</Label>
              <Textarea 
                value={manualUrls} 
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onManualUrlsChange(e.target.value)} 
                className="min-h-[200px] rounded-2xl bg-zinc-50 border-none dark:bg-white/5 p-4 resize-none"
              />
            </div>
          </TabsContent>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-6">
            <Button 
              onClick={() => void onSubmit(mode)} 
              disabled={submitting} 
              className="h-14 w-full sm:w-60 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white shadow-xl shadow-zinc-900/10 font-bold uppercase tracking-widest text-xs"
            >
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              {submitting ? "Pushing..." : "Broadcast"}
            </Button>
            <p className="text-[10px] text-zinc-400 italic leading-relaxed max-w-[200px]">
              Pings are distributed in batches across global endpoints.
            </p>
          </div>
        </Tabs>

        {submitResult && (
          <div className="mt-8 p-6 rounded-[24px] bg-pink-500/5 border border-pink-500/10 space-y-2 animate-in zoom-in-95 duration-500">
            <p className="text-xs font-bold text-pink-600 uppercase tracking-widest">Broadcast Finished</p>
            <p className="text-sm text-pink-700/80 font-light">Successfully pushed {submitResult.totalUrls} signals to the unseen stream.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
