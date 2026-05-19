"use client";

import { useState } from "react";
import { 
  Trash2, 
  Plus, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  addWebsiteSourceAction, 
  deleteWebsiteSourceAction 
} from "@/app/(dashboard)/actions";
import { toast } from "sonner";
import { useActionState } from "react";
import { defaultActionState } from "@/app/(dashboard)/action-state";
import { cn } from "@/lib/utils";

interface SitemapSource {
  id: string;
  url: string;
  lastFetchedAt: string | null;
  type: string;
}

interface SitemapManagerProps {
  websiteId: string;
  sources: SitemapSource[];
  onRefresh: () => Promise<void>;
}

export default function SitemapManager({ websiteId, sources, onRefresh }: SitemapManagerProps) {
  const [newSitemapUrl, setNewSitemapUrl] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleDelete = async (sourceId: string) => {
    const formData = new FormData();
    formData.append("sourceId", sourceId);
    
    try {
      const res = await deleteWebsiteSourceAction({ status: "idle", message: "" }, formData);
      if (res.status === "success") {
        toast.success("Sitemap removed");
        await onRefresh();
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error("Failed to delete sitemap");
    }
  };

  const handleAdd = async () => {
    if (!newSitemapUrl) return;
    setIsAdding(true);
    
    const formData = new FormData();
    formData.append("websiteId", websiteId);
    formData.append("url", newSitemapUrl);
    formData.append("type", "sitemap");

    try {
      const res = await addWebsiteSourceAction({ status: "idle", message: "" }, formData);
      if (res.status === "success") {
        toast.success("Sitemap added");
        setNewSitemapUrl("");
        await onRefresh();
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error("Failed to add sitemap");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Source Management</h3>
          <h2 className="text-xl font-serif font-bold tracking-tight mt-1">Sitemaps</h2>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900/50 rounded-[2.5rem] border border-border/40 p-6 space-y-6 shadow-sm">
        <div className="flex gap-3">
          <Input 
            placeholder="Add new sitemap URL..." 
            value={newSitemapUrl}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewSitemapUrl(e.target.value)}
            className="h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-none shadow-inner text-sm"
          />
          <Button 
            onClick={handleAdd}
            disabled={isAdding || !newSitemapUrl}
            className="h-12 px-6 rounded-2xl font-bold gap-2"
          >
            {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add
          </Button>
        </div>

        <div className="space-y-3">
          {sources.length === 0 ? (
            <div className="py-12 text-center border-2 border-dashed border-border/40 rounded-[2rem]">
              <FileText className="h-8 w-8 text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground font-medium italic">No sitemaps configured yet.</p>
            </div>
          ) : (
            sources.map((source) => (
              <div 
                key={source.id}
                className="group flex items-center justify-between p-4 bg-zinc-50/50 dark:bg-white/5 rounded-2xl border border-transparent hover:border-primary/20 transition-all"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate max-w-[400px]">
                      {source.url}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                        {source.lastFetchedAt ? `Last synced ${new Date(source.lastFetchedAt).toLocaleDateString()}` : "Never synced"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-all"
                    onClick={() => handleDelete(source.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-zinc-400 hover:text-primary hover:bg-primary/5 transition-all" asChild>
                    <a href={source.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
