"use client";

import { useActionState, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Clock, 
  Settings, 
  Trash2, 
  Plus, 
  CheckCircle2, 
  Search, 
  Globe,
  Loader2
} from "lucide-react";
import { saveCronJobAction, deleteCronJobAction } from "@/app/(dashboard)/actions";
import { toast } from "sonner";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface CronJob {
  id: string;
  engine: "indexnow" | "bing" | "google";
  frequency: string;
  sourceMode: string;
  enabled: boolean;
  nextRunAt: string | null;
}

interface AutomationManagerProps {
  websiteId: string;
  cronJobs: CronJob[];
  onRefresh: () => Promise<void>;
}

export default function AutomationManager({ websiteId, cronJobs, onRefresh }: AutomationManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [engine, setEngine] = useState<"indexnow" | "bing" | "google">("indexnow");
  const [frequency, setFrequency] = useState("daily");
  const [sourceMode, setSourceMode] = useState("inventory");

  const [saveState, saveAction, isSaving] = useActionState(saveCronJobAction, { status: "idle", message: "" });
  const [delState, delAction, isDeleting] = useActionState(deleteCronJobAction, { status: "idle", message: "" });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("websiteId", websiteId);
    formData.append("engine", engine);
    formData.append("frequency", frequency);
    formData.append("sourceMode", sourceMode);
    formData.append("enabled", "true");
    
    await saveAction(formData);
    toast.success("Auto-run setup saved!");
    setIsAdding(false);
    await onRefresh();
  };

  const handleDelete = async (jobId: string) => {
    const formData = new FormData();
    formData.append("jobId", jobId);
    formData.append("websiteId", websiteId);
    await delAction(formData);
    toast.success("Auto-run task removed.");
    await onRefresh();
  };

  const getEngineName = (engine: string) => {
    if (engine === "indexnow") return "IndexNow (Fast)";
    if (engine === "bing") return "Bing API";
    if (engine === "google") return "Google Search";
    return engine;
  };

  const getSourceLabel = (mode: string) => {
    return mode === "inventory" ? "Only New Pages" : "Check All Pages";
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Auto-Run Settings</h2>
          <p className="text-sm text-muted-foreground italic">Let our robots handle your indexing automatically.</p>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} className="rounded-xl font-bold gap-2">
            <Plus className="h-4 w-4" /> Add Auto-Run
          </Button>
        )}
      </div>

      {isAdding && (
        <Card className="rounded-[2rem] border-primary/20 bg-primary/[0.02]">
          <CardHeader>
            <CardTitle className="text-lg">New Auto-Run Task</CardTitle>
            <CardDescription>Tell the robots how often to check your site.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Robot Type</label>
                  <Select value={engine} onValueChange={(v: any) => setEngine(v)}>
                    <SelectTrigger className="h-12 rounded-xl border-border/50 bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border/50">
                      <SelectItem value="indexnow">IndexNow (Instant)</SelectItem>
                      <SelectItem value="bing">Bing API (Daily)</SelectItem>
                      <SelectItem value="google">Google Ping</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">How Often?</label>
                  <Select value={frequency} onValueChange={setFrequency}>
                    <SelectTrigger className="h-12 rounded-xl border-border/50 bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border/50">
                      <SelectItem value="hourly">Every Hour</SelectItem>
                      <SelectItem value="daily">Every Day</SelectItem>
                      <SelectItem value="weekly">Every Week</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Which Pages?</label>
                  <Select value={sourceMode} onValueChange={setSourceMode}>
                    <SelectTrigger className="h-12 rounded-xl border-border/50 bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border/50">
                      <SelectItem value="inventory">Only New Pages</SelectItem>
                      <SelectItem value="sitemap">Check All Pages</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button type="submit" disabled={isSaving} className="rounded-xl font-bold px-8">
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Zap className="h-4 w-4 mr-2" />}
                  Save Task
                </Button>
                <Button variant="ghost" onClick={() => setIsAdding(false)} className="rounded-xl font-bold px-8">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {cronJobs.length === 0 && !isAdding ? (
        <Card className="rounded-[2.5rem] border-dashed border-2 bg-muted/5 p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center">
              <Clock className="h-8 w-8 text-muted-foreground/30" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold tracking-tight">No robots working yet</h3>
              <p className="text-sm text-muted-foreground">Add an auto-run task to keep your site indexed 24/7.</p>
            </div>
            <Button onClick={() => setIsAdding(true)} variant="outline" className="rounded-xl font-bold gap-2 mt-2">
              <Plus className="h-4 w-4" /> Setup First Robot
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6">
          {cronJobs.map((job) => (
            <Card key={job.id} className="rounded-[2rem] border-border/50 bg-card/50 overflow-hidden group">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row items-center justify-between p-6 sm:p-10 gap-8">
                  <div className="flex items-center gap-6">
                    <div className="h-14 w-14 rounded-2xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center shadow-xl shadow-zinc-900/10">
                      {job.engine === "indexnow" ? <Zap className="h-6 w-6" /> : 
                       job.engine === "bing" ? <Globe className="h-6 w-6" /> : 
                       <Search className="h-6 w-6" />}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h4 className="text-xl font-bold tracking-tight">{getEngineName(job.engine)}</h4>
                        <Badge variant="secondary" className="rounded-full bg-green-500/10 text-green-600 border-none px-3 text-[10px] font-bold">
                          Active
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Runs {job.frequency}</span>
                        <span className="text-border">|</span>
                        <span>{getSourceLabel(job.sourceMode)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="text-right hidden md:block mr-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">Next Run</p>
                      <p className="text-sm font-medium">
                        {job.nextRunAt ? new Date(job.nextRunAt).toLocaleDateString() + ' ' + new Date(job.nextRunAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Soon'}
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-12 w-12 rounded-xl text-muted-foreground/40 hover:text-red-500 hover:bg-red-50 transition-all"
                      onClick={() => handleDelete(job.id)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-5 w-5" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
