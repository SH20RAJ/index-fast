"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Globe,
  Layers,
  Key,
  Search,
  Settings2,
  Check,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  createWebsiteAction,
  addWebsiteSourceAction,
  updateIndexNowSettingsAction,
  verifyIndexNowKeyAction,
  updateBingApiKeyAction,
  updateAutomationSettingsAction,
  runFirstSyncAction,
} from "@/app/(dashboard)/actions";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { cn } from "@/lib/utils";

const STEPS = [
  { label: "Website" },
  { label: "Sources" },
  { label: "IndexNow" },
  { label: "Bing API" },
  { label: "Automation" },
  { label: "Done" },
];

export default function NewSiteFlow() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [websiteId, setWebsiteId] = useState<string | null>(null);

  // Step 1
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [sitemapUrl, setSitemapUrl] = useState("");

  // Step 2
  const [sources, setSources] = useState<{ url: string; type: string }[]>([]);
  const [newSourceUrl, setNewSourceUrl] = useState("");
  const [newSourceType] = useState("sitemap");

  // Step 3
  const [indexNowKey, setIndexNowKey] = useState("");
  const [indexNowKeyLocation, setIndexNowKeyLocation] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  // Step 4
  const [bingApiKey, setBingApiKey] = useState("");

  // Step 5
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

    const res = await createWebsiteAction(
      { status: "idle", message: "" },
      formData
    );
    if (res.status === "success" && res.data) {
      setWebsiteId(res.data as string);
      handleNext();
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  };

  const step2Submit = () => {
    handleNext();
  };

  const addSource = async () => {
    if (!newSourceUrl || !websiteId) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("websiteId", websiteId);
    formData.append("url", newSourceUrl);
    formData.append("type", newSourceType);

    const res = await addWebsiteSourceAction(
      { status: "idle", message: "" },
      formData
    );
    if (res.status === "success") {
      setSources([...sources, { url: newSourceUrl, type: newSourceType }]);
      setNewSourceUrl("");
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  };

  const removeSource = (index: number) => {
    setSources(sources.filter((_, i) => i !== index));
  };

  const verifyKey = async () => {
    if (!websiteId || !indexNowKey || !indexNowKeyLocation) return;
    setLoading(true);

    const settingsFormData = new FormData();
    settingsFormData.append("websiteId", websiteId);
    settingsFormData.append("indexNowKey", indexNowKey);
    settingsFormData.append("indexNowKeyLocation", indexNowKeyLocation);
    await updateIndexNowSettingsAction(
      { status: "idle", message: "" },
      settingsFormData
    );

    const verifyFormData = new FormData();
    verifyFormData.append("websiteId", websiteId);
    const res = await verifyIndexNowKeyAction(
      { status: "idle", message: "" },
      verifyFormData
    );

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

    await updateAutomationSettingsAction(
      { status: "idle", message: "" },
      formData
    );
    handleNext();
    setLoading(false);
  };

  const runFirstSync = async () => {
    if (!websiteId) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("websiteId", websiteId);
    const res = await runFirstSyncAction(
      { status: "idle", message: "" },
      formData
    );
    if (res.status === "success") {
      toast.success(res.message);
      router.push("/dashboard");
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      {/* Step indicator */}
      <nav className="mb-8" aria-label="Setup progress">
        <ol className="flex items-center gap-1">
          {STEPS.map((s, i) => {
            const num = i + 1;
            const isActive = step === num;
            const isComplete = step > num;
            return (
              <li key={num} className="flex items-center flex-1">
                <div className="flex items-center gap-2 w-full">
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
                      isComplete
                        ? "border-primary bg-primary text-primary-foreground"
                        : isActive
                          ? "border-primary text-primary"
                          : "border-border text-muted-foreground"
                    )}
                  >
                    {isComplete ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      num
                    )}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-medium hidden sm:block",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {s.label}
                  </span>
                  {num < STEPS.length && (
                    <div
                      className={cn(
                        "h-px flex-1",
                        isComplete ? "bg-primary" : "bg-border"
                      )}
                    />
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Step 1: Website details */}
      {step === 1 && (
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Globe className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">
                Step 1
              </span>
            </div>
            <CardTitle className="text-lg">Add your website</CardTitle>
            <CardDescription>
              Enter your website URL and sitemap so IndexFast can discover pages.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Website name</Label>
              <Input
                id="name"
                placeholder="My Blog"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setName(e.target.value)
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="url">Website URL</Label>
              <Input
                id="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setUrl(e.target.value)
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sitemap">Sitemap URL</Label>
              <Input
                id="sitemap"
                placeholder="https://example.com/sitemap.xml"
                value={sitemapUrl}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSitemapUrl(e.target.value)
                }
              />
            </div>
            <Button
              onClick={step1Submit}
              disabled={loading}
              className="w-full mt-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Continue"
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Sources */}
      {step === 2 && (
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Layers className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">
                Step 2
              </span>
            </div>
            <CardTitle className="text-lg">Add sources</CardTitle>
            <CardDescription>
              Add sitemaps or feeds. IndexFast will check these for new URLs.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="https://example.com/feed.xml"
                value={newSourceUrl}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewSourceUrl(e.target.value)
                }
                className="flex-1"
              />
              <Button
                onClick={addSource}
                disabled={loading || !newSourceUrl}
                size="icon"
                variant="outline"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {sources.length > 0 && (
              <ul className="space-y-2">
                {sources.map((s, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between gap-2 px-3 py-2 rounded-md border border-border bg-background"
                  >
                    <span className="text-sm truncate flex-1">{s.url}</span>
                    <span className="text-xs text-muted-foreground uppercase shrink-0">
                      {s.type}
                    </span>
                    <button
                      onClick={() => removeSource(i)}
                      className="text-muted-foreground hover:text-destructive shrink-0"
                      aria-label="Remove source"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {sources.length === 0 && (
              <p className="text-xs text-muted-foreground">
                No sources added. You can skip this step and add them later.
              </p>
            )}
            <div className="flex gap-2 pt-2">
              <Button onClick={handleBack} variant="outline" className="flex-1">
                Back
              </Button>
              <Button onClick={step2Submit} className="flex-1">
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: IndexNow */}
      {step === 3 && (
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Key className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">
                Step 3
              </span>
            </div>
            <CardTitle className="text-lg">Set up IndexNow</CardTitle>
            <CardDescription>
              Prove ownership and allow IndexFast to submit URLs to search engines.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="inkey">IndexNow key</Label>
              <Input
                id="inkey"
                placeholder="abc123xyz"
                value={indexNowKey}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setIndexNowKey(e.target.value)
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="inkeyloc">Key TXT URL</Label>
              <Input
                id="inkeyloc"
                placeholder="https://example.com/abc123xyz.txt"
                value={indexNowKeyLocation}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setIndexNowKeyLocation(e.target.value)
                }
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Upload a text file with your key to your site root.{" "}
              <Link
                href="/docs/indexnow-key"
                className="text-primary underline underline-offset-2"
              >
                How to create a key
              </Link>
            </p>
            <div className="flex gap-2 pt-2">
              <Button onClick={handleBack} variant="outline" className="flex-1">
                Back
              </Button>
              <Button
                onClick={isVerified ? handleNext : verifyKey}
                disabled={loading || !indexNowKey || !indexNowKeyLocation}
                className="flex-1"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isVerified ? (
                  "Continue"
                ) : (
                  "Verify key"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Bing API */}
      {step === 4 && (
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Search className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">
                Step 4
              </span>
            </div>
            <CardTitle className="text-lg">Bing API key</CardTitle>
            <CardDescription>
              Optional. Submit URLs directly to Bing each day.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="bing">Bing Webmaster API key</Label>
              <Input
                id="bing"
                type="password"
                placeholder="Enter your API key"
                value={bingApiKey}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setBingApiKey(e.target.value)
                }
              />
            </div>
            <p className="text-xs text-muted-foreground">
              You can skip this and still use IndexNow.{" "}
              <Link
                href="/docs/bing-api-key"
                className="text-primary underline underline-offset-2"
              >
                How to get a key
              </Link>
            </p>
            <div className="flex gap-2 pt-2">
              <Button onClick={handleBack} variant="outline" className="flex-1">
                Back
              </Button>
              <Button
                onClick={step4Submit}
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Save and continue"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 5: Automation */}
      {step === 5 && (
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Settings2 className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">
                Step 5
              </span>
            </div>
            <CardTitle className="text-lg">Automation</CardTitle>
            <CardDescription>
              IndexFast will scan your sources and submit new URLs automatically.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">Auto-submit new URLs daily</Label>
                  <p className="text-xs text-muted-foreground">
                    Scan sources once every 24 hours.
                  </p>
                </div>
                <Switch
                  checked={autoIndexing}
                  onCheckedChange={setAutoIndexing}
                />
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">Send search engine pings</Label>
                  <p className="text-xs text-muted-foreground">
                    Notify search engines about sitemap updates.
                  </p>
                </div>
                <Switch
                  checked={pingsEnabled}
                  onCheckedChange={setPingsEnabled}
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={handleBack} variant="outline" className="flex-1">
                Back
              </Button>
              <Button
                onClick={step5Submit}
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Finish setup"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 6: Done */}
      {step === 6 && (
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center gap-2 text-primary mb-1">
              <Check className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">
                Complete
              </span>
            </div>
            <CardTitle className="text-lg">Website added</CardTitle>
            <CardDescription>
              Your website is configured and ready for auto indexing.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Website</dt>
                <dd className="font-medium truncate">{name}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Sources</dt>
                <dd className="font-medium">{sources.length}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">IndexNow</dt>
                <dd className="font-medium text-primary">Verified</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Bing API</dt>
                <dd className="font-medium">
                  {bingApiKey ? "Connected" : "Skipped"}
                </dd>
              </div>
            </dl>
            <div className="space-y-2 pt-2">
              <Button
                onClick={runFirstSync}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Run first sync"
                )}
              </Button>
              <div className="flex gap-2">
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/toolbox">Toolbox</Link>
                </Button>
                <Button asChild variant="ghost" className="flex-1">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
