"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Globe, 
  Layers, 
  Key, 
  Settings2, 
  CheckCircle2, 
  Loader2, 
  Plus, 
  Trash2, 
  Search, 
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import { toast } from "sonner";
import { 
  createWebsiteAction, 
  addWebsiteSourceAction, 
  updateIndexNowSettingsAction, 
  verifyIndexNowKeyAction, 
  updateBingApiKeyAction, 
  updateAutomationSettingsAction, 
  runFirstSyncAction 
} from "@/app/(dashboard)/actions";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";


export default function NewSiteFlow() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [websiteId, setWebsiteId] = useState<string | null>(null);

  // Step 1 State
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [sitemapUrl, setSitemapUrl] = useState("");

  // Step 2 State
  const [sources, setSources] = useState<{ url: string; type: string }[]>([]);
  const [newSourceUrl, setNewSourceUrl] = useState("");
  const [newSourceType, setNewSourceType] = useState("sitemap");

  // Step 3 State
  const [indexNowKey, setIndexNowKey] = useState("");
  const [indexNowKeyLocation, setIndexNowKeyLocation] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  // Step 4 State
  const [bingApiKey, setBingApiKey] = useState("");

  // Step 5 State
  const [autoIndexing, setAutoIndexing] = useState(true);
  const [pingsEnabled, setPingsEnabled] = useState(true);

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const step1Submit = async () => {
    if (!name || !url) {
      toast.error("Please fill in the required fields.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("url", url);
    formData.append("sitemapUrl", sitemapUrl);

    const res = await createWebsiteAction({ status: "idle", message: "" }, formData);
    if (res.status === "success" && res.data) {
      setWebsiteId(res.data as string);
      handleNext();
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  };

  const step2Submit = async () => {
    if (sources.length === 0) {
      handleNext();
      return;
    }
    setLoading(true);
    // Sources are added one by one, but let's make sure they are saved
    handleNext();
    setLoading(false);
  };

  const addSource = async () => {
    if (!newSourceUrl || !websiteId) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("websiteId", websiteId);
    formData.append("url", newSourceUrl);
    formData.append("type", newSourceType);

    const res = await addWebsiteSourceAction({ status: "idle", message: "" }, formData);
    if (res.status === "success") {
      setSources([...sources, { url: newSourceUrl, type: newSourceType }]);
      setNewSourceUrl("");
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  };

  const verifyKey = async () => {
    if (!websiteId || !indexNowKey || !indexNowKeyLocation) return;
    setLoading(true);
    
    const settingsFormData = new FormData();
    settingsFormData.append("websiteId", websiteId);
    settingsFormData.append("indexNowKey", indexNowKey);
    settingsFormData.append("indexNowKeyLocation", indexNowKeyLocation);
    await updateIndexNowSettingsAction({ status: "idle", message: "" }, settingsFormData);

    const verifyFormData = new FormData();
    verifyFormData.append("websiteId", websiteId);
    const res = await verifyIndexNowKeyAction({ status: "idle", message: "" }, verifyFormData);
    
    if (res.status === "success") {
      setIsVerified(true);
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  };

  const step4Submit = async () => {
    if (!websiteId) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("websiteId", websiteId);
    formData.append("bingApiKey", bingApiKey);
    await updateBingApiKeyAction({ status: "idle", message: "" }, formData);
    handleNext();
    setLoading(false);
  };

  const step5Submit = async () => {
    if (!websiteId) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("websiteId", websiteId);
    if (autoIndexing) formData.append("autoIndexingEnabled", "on");
    if (pingsEnabled) formData.append("pingsEnabled", "on");
    
    await updateAutomationSettingsAction({ status: "idle", message: "" }, formData);
    handleNext();
    setLoading(false);
  };

  const runFirstSync = async () => {
    if (!websiteId) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("websiteId", websiteId);
    const res = await runFirstSyncAction({ status: "idle", message: "" }, formData);
    if (res.status === "success") {
      toast.success(res.message);
      router.push("/dashboard");
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      {/* Progress Bar */}
      <div className="mb-8 flex justify-between gap-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div 
            key={i} 
            className={cn(
              "h-1.5 flex-1 rounded-full transition-all duration-500",
              step >= i ? "bg-primary" : "bg-muted"
            )} 
          />
        ))}
      </div>

      {step === 1 && (
        <Card className="rounded-[32px] border-border/50 bg-card shadow-2xl">
          <CardHeader className="space-y-1 p-8 pb-4 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Globe className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-bold">Add your website</CardTitle>
            <CardDescription>
              IndexFast needs your website and sitemap so it can find URLs to submit.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-8 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Website name</Label>
              <Input 
                id="name" 
                placeholder="My Blog" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">Website URL</Label>
              <Input 
                id="url" 
                placeholder="https://example.com" 
                value={url} 
                onChange={(e) => setUrl(e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sitemap">Primary sitemap URL</Label>
              <Input 
                id="sitemap" 
                placeholder="https://example.com/sitemap.xml" 
                value={sitemapUrl} 
                onChange={(e) => setSitemapUrl(e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>
            <Button onClick={step1Submit} disabled={loading} className="w-full h-12 rounded-xl font-bold">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Continue"}
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card className="rounded-[32px] border-border/50 bg-card shadow-2xl">
          <CardHeader className="space-y-1 p-8 pb-4 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Layers className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-bold">Add sitemap or feed sources</CardTitle>
            <CardDescription>
              IndexFast will check these sources and find new URLs automatically.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-8 pt-4">
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1 space-y-2">
                  <Input 
                    placeholder="https://example.com/feed.xml" 
                    value={newSourceUrl} 
                    onChange={(e) => setNewSourceUrl(e.target.value)}
                    className="h-12 rounded-xl"
                  />
                </div>
                <Button onClick={addSource} disabled={loading || !newSourceUrl} className="h-12 rounded-xl font-bold px-4">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {sources.map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50">
                    <span className="text-sm font-medium truncate flex-1 mr-2">{s.url}</span>
                    <Badge variant="outline" className="mr-2 uppercase text-[10px]">{s.type}</Badge>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleBack} variant="outline" className="flex-1 h-12 rounded-xl font-bold">
                Back
              </Button>
              <Button onClick={step2Submit} className="flex-[2] h-12 rounded-xl font-bold">
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card className="rounded-[32px] border-border/50 bg-card shadow-2xl">
          <CardHeader className="space-y-1 p-8 pb-4 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Key className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-bold">Set up IndexNow</CardTitle>
            <CardDescription>
              IndexNow proves that you own this website and allows IndexFast to submit URLs to search engines.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-8 pt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="inkey">IndexNow key</Label>
                <Input 
                  id="inkey" 
                  placeholder="abc123xyz" 
                  value={indexNowKey} 
                  onChange={(e) => setIndexNowKey(e.target.value)}
                  className="h-12 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inkeyloc">IndexNow key TXT URL</Label>
                <Input 
                  id="inkeyloc" 
                  placeholder="https://example.com/abc123xyz.txt" 
                  value={indexNowKeyLocation} 
                  onChange={(e) => setIndexNowKeyLocation(e.target.value)}
                  className="h-12 rounded-xl"
                />
              </div>
              <p className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg border border-border/50">
                Create a text file with your IndexNow key and upload it to your website root. 
                <Link href="/docs/indexnow-key" target="_blank" className="text-primary hover:underline ml-1">
                  How to create an IndexNow key
                </Link>
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleBack} variant="outline" className="flex-1 h-12 rounded-xl font-bold">
                Back
              </Button>
              <Button 
                onClick={isVerified ? handleNext : verifyKey} 
                disabled={loading || !indexNowKey || !indexNowKeyLocation}
                className={cn("flex-[2] h-12 rounded-xl font-bold", isVerified && "bg-green-600 hover:bg-green-700")}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : isVerified ? "Continue" : "Verify key"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 4 && (
        <Card className="rounded-[32px] border-border/50 bg-card shadow-2xl">
          <CardHeader className="space-y-1 p-8 pb-4 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Search className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-bold">Add Bing API key</CardTitle>
            <CardDescription>
              Optional. Add your Bing Webmaster API key to submit URLs directly to Bing every day.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-8 pt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bing">Bing Webmaster API key</Label>
                <Input 
                  id="bing" 
                  type="password"
                  placeholder="••••••••••••••••" 
                  value={bingApiKey} 
                  onChange={(e) => setBingApiKey(e.target.value)}
                  className="h-12 rounded-xl"
                />
              </div>
              <p className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg border border-border/50">
                You can skip this and still use IndexNow. 
                <Link href="/docs/bing-api-key" target="_blank" className="text-primary hover:underline ml-1">
                  How to get Bing Webmaster API key
                </Link>
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleBack} variant="outline" className="flex-1 h-12 rounded-xl font-bold">
                Back
              </Button>
              <Button onClick={step4Submit} disabled={loading} className="flex-[2] h-12 rounded-xl font-bold">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save and continue"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 5 && (
        <Card className="rounded-[32px] border-border/50 bg-card shadow-2xl">
          <CardHeader className="space-y-1 p-8 pb-4 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Settings2 className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-bold">Enable automation</CardTitle>
            <CardDescription>
              IndexFast will check your sitemap or feed and submit new URLs automatically.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-8 pt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold">Auto-submit new URLs daily</Label>
                  <p className="text-xs text-muted-foreground">IndexFast will scan your sources once every 24 hours.</p>
                </div>
                <Switch checked={autoIndexing} onCheckedChange={setAutoIndexing} />
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold">Send search engine pings</Label>
                  <p className="text-xs text-muted-foreground">Notify search engines about sitemap updates.</p>
                </div>
                <Switch checked={pingsEnabled} onCheckedChange={setPingsEnabled} />
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleBack} variant="outline" className="flex-1 h-12 rounded-xl font-bold">
                Back
              </Button>
              <Button onClick={step5Submit} disabled={loading} className="flex-[2] h-12 rounded-xl font-bold">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Finish setup"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 6 && (
        <Card className="rounded-[32px] border-border/50 bg-card shadow-2xl">
          <CardHeader className="space-y-1 p-8 pb-4 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-green-500">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <CardTitle className="text-3xl font-bold">Website added</CardTitle>
            <CardDescription>
              Your website is now configured and ready for auto indexing.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-8 pt-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-muted/30 border border-border/50">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Website</p>
                <p className="text-sm font-bold truncate">{name}</p>
              </div>
              <div className="p-4 rounded-2xl bg-muted/30 border border-border/50">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Sources</p>
                <p className="text-sm font-bold">{sources.length}</p>
              </div>
              <div className="p-4 rounded-2xl bg-muted/30 border border-border/50">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">IndexNow</p>
                <p className="text-sm font-bold text-green-600">Verified</p>
              </div>
              <div className="p-4 rounded-2xl bg-muted/30 border border-border/50">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Bing API</p>
                <p className="text-sm font-bold">{bingApiKey ? "Connected" : "Skipped"}</p>
              </div>
            </div>
            
            <div className="space-y-3 pt-4">
              <Button onClick={runFirstSync} disabled={loading} className="w-full h-12 rounded-xl font-bold bg-primary shadow-lg shadow-primary/20">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Run first sync now"}
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button asChild variant="outline" className="h-12 rounded-xl font-bold">
                  <Link href="/toolbox">Open toolbox</Link>
                </Button>
                <Button asChild variant="ghost" className="h-12 rounded-xl font-bold">
                  <Link href="/dashboard">Go to dashboard</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

