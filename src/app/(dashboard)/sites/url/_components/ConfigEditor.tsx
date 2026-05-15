"use client";

import { useState } from "react";
import { 
  Key, 
  Bing, // Note: I should use a generic icon if Bing icon isn't available
  Settings2,
  Save,
  Loader2,
  ExternalLink,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { 
  updateIndexNowSettingsAction, 
  updateBingApiKeyAction 
} from "@/app/(dashboard)/actions";
import { toast } from "sonner";

interface ConfigEditorProps {
  websiteId: string;
  indexNowKey: string | null;
  indexNowKeyLocation: string | null;
  bingApiKeyLastFour: string | null;
  onRefresh: () => Promise<void>;
}

export default function ConfigEditor({ 
  websiteId, 
  indexNowKey, 
  indexNowKeyLocation, 
  bingApiKeyLastFour,
  onRefresh 
}: ConfigEditorProps) {
  const [inKey, setInKey] = useState(indexNowKey || "");
  const [inLocation, setInLocation] = useState(indexNowKeyLocation || "");
  const [bingKey, setBingKey] = useState("");
  const [isSavingIndexNow, setIsSavingIndexNow] = useState(false);
  const [isSavingBing, setIsSavingBing] = useState(false);

  const handleSaveIndexNow = async () => {
    setIsSavingIndexNow(true);
    const formData = new FormData();
    formData.append("websiteId", websiteId);
    formData.append("indexNowKey", inKey);
    formData.append("indexNowKeyLocation", inLocation);

    try {
      const res = await updateIndexNowSettingsAction({ status: "idle", message: "" }, formData);
      if (res.status === "success") {
        toast.success("IndexNow settings updated");
        await onRefresh();
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error("Failed to update IndexNow settings");
    } finally {
      setIsSavingIndexNow(false);
    }
  };

  const handleSaveBing = async () => {
    setIsSavingBing(true);
    const formData = new FormData();
    formData.append("websiteId", websiteId);
    formData.append("bingApiKey", bingKey);

    try {
      const res = await updateBingApiKeyAction({ status: "idle", message: "" }, formData);
      if (res.status === "success") {
        toast.success("Bing API key updated");
        setBingKey("");
        await onRefresh();
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error("Failed to update Bing API key");
    } finally {
      setIsSavingBing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Protocol Settings</h3>
          <h2 className="text-xl font-serif font-bold tracking-tight mt-1">Connectivity</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* IndexNow Config */}
        <div className="bg-white dark:bg-zinc-900/50 rounded-[2.5rem] border border-border/40 p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-lg">IndexNow</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 px-1">API Key</Label>
              <Input 
                value={inKey}
                onChange={(e) => setInKey(e.target.value)}
                placeholder="Paste your IndexNow key..."
                className="h-11 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-none shadow-inner"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 px-1">Key Location URL</Label>
              <Input 
                value={inLocation}
                onChange={(e) => setInLocation(e.target.value)}
                placeholder="https://example.com/your-key.txt"
                className="h-11 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-none shadow-inner"
              />
            </div>
            <Button 
              onClick={handleSaveIndexNow}
              disabled={isSavingIndexNow}
              className="w-full h-11 rounded-xl font-bold gap-2 mt-2"
            >
              {isSavingIndexNow ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save IndexNow Settings
            </Button>
          </div>
        </div>

        {/* Bing Config */}
        <div className="bg-white dark:bg-zinc-900/50 rounded-[2.5rem] border border-border/40 p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-500/5 flex items-center justify-center text-blue-500">
              <Key className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-lg">Bing Webmaster API</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 px-1">
                {bingApiKeyLastFour ? `Current Key: ****${bingApiKeyLastFour}` : "API Key"}
              </Label>
              <Input 
                type="password"
                value={bingKey}
                onChange={(e) => setBingKey(e.target.value)}
                placeholder="Paste new Bing API key..."
                className="h-11 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-none shadow-inner"
              />
            </div>
            <div className="pt-8">
              <Button 
                onClick={handleSaveBing}
                disabled={isSavingBing || !bingKey}
                variant="outline"
                className="w-full h-11 rounded-xl font-bold gap-2 border-zinc-200 dark:border-zinc-800"
              >
                {isSavingBing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Update Bing API Key
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
