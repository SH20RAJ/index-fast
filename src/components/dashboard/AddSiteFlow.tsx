"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Globe, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface AddSiteFlowProps {
  floating?: boolean;
}

export default function AddSiteFlow({ floating = false }: AddSiteFlowProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setUrl("");
    setOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    try {
      const response = await fetch("/api/websites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to add site");

      toast.success("Site added successfully");
      reset();
      router.refresh();
      if (data.website?.id) {
        router.push(`/sites/url?siteId=${data.website.id}`);
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!val) reset(); setOpen(val); }}>
      <DialogTrigger asChild>
        {floating ? (
          <button
            className="group flex h-14 w-14 items-center justify-center rounded-full bg-zinc-950 shadow-2xl shadow-black/40 ring-1 ring-white/10 transition-all duration-300 hover:scale-110 hover:shadow-primary/30 dark:bg-white"
            title="Add Website"
            aria-label="Add Website"
          >
            <span aria-hidden="true">
              <Plus className="h-6 w-6 text-white dark:text-zinc-950 transition-transform duration-300 group-hover:rotate-90" />
            </span>
          </button>
        ) : (
          <Button className="rounded-full bg-zinc-950 dark:bg-white dark:text-zinc-950 font-bold px-6 h-10 gap-2">
            <Plus className="h-4 w-4" />
            Add Website
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden rounded-[32px] border-none shadow-2xl">
        <div className="p-8">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-xl font-bold tracking-tight text-center">
              Add Site
            </DialogTitle>
            <DialogDescription className="text-center text-sm">
              Enter your website URL to start tracking
            </DialogDescription>
          </DialogHeader>

          <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                  GSC Import Deprecated
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                  Google Search Console import is temporarily unavailable. We are focusing on core SEO features first. Please add your site manually.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="url" className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                Website URL
              </Label>
              <Input
                id="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
                className="h-12 rounded-xl bg-zinc-50 border-none dark:bg-white/5"
                autoFocus
              />
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
                className="flex-1 h-12 rounded-xl font-bold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !url}
                className="flex-[2] h-12 rounded-xl font-bold"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Globe className="h-4 w-4 mr-2" />
                    Add Website
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}