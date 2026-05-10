import { getUserApiKey } from "@/app/(dashboard)/actions";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Copy, ShieldCheck, Terminal, Zap, CheckCircle2, Info, ExternalLink, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CopyButton from "./CopyButton";

export default async function McpPage() {
  const keyRes = await getUserApiKey();
  const apiKey = keyRes.data || "idx_your_api_key_here";

  const claudeConfig = JSON.stringify({
    mcpServers: {
      indexfast: {
        command: "npx",
        args: [
          "-y",
          "mcp-remote",
          `https://www.indexfast.co/api/mcp?key=${apiKey}`
        ]
      }
    }
  }, null, 2);

  const directCurlCommand = `curl -s -X POST https://www.indexfast.co/api/mcp \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","method":"tools/list","params":{},"id":1}'`;

  return (
    <div className="max-w-5xl space-y-8 pb-20">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Page header is now handled by DashboardTopBar */}
        <div className="flex-1" />
        <Badge variant="secondary" className="w-fit bg-primary/10 text-primary border-none py-1 px-3">
          <Zap className="mr-1.5 h-3 w-3 fill-current" />
          Protocol v1.0
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_350px]">
        <div className="space-y-6">
          {/* API Key Section */}
          <Card className="rounded-[2rem] border-primary/20 bg-primary/[0.02] shadow-2xl shadow-primary/5">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">Your API Key</CardTitle>
                  <CardDescription>Use this key to authenticate your AI agents.</CardDescription>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input 
                    value={apiKey} 
                    readOnly 
                    className="h-12 rounded-xl bg-background font-mono text-xs pr-24 border-primary/20 focus-visible:ring-primary/20"
                  />
                  <div className="absolute right-1 top-1 bottom-1">
                    <CopyButton text={apiKey} />
                  </div>
                </div>
              </div>
              <p className="mt-4 text-[10px] text-muted-foreground flex items-center gap-1.5">
                <Info className="h-3 w-3" />
                Never share your API key. It grants full access to your indexing dashboard.
              </p>
            </CardContent>
          </Card>

          {/* Setup Guide */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground px-1">Setup Instructions</h3>
            
            <Card className="rounded-3xl border-border/60">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white dark:bg-white dark:text-zinc-950">
                    <Terminal className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-base font-bold">Claude Desktop</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Add the following configuration to your <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono text-foreground">claude_desktop_config.json</code> file.
                </p>
                <div className="relative group">
                  <pre className="p-5 rounded-2xl bg-zinc-950 text-zinc-300 font-mono text-[11px] leading-relaxed overflow-x-auto border border-white/5 shadow-2xl">
                    {claudeConfig}
                  </pre>
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <CopyButton text={claudeConfig} size="sm" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-border/60">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Bot className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-base font-bold">Cursor / Windsurf</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Go to <span className="font-bold text-foreground">Settings {">"} MCP</span> and add a new server:
                </p>
                <ul className="space-y-3">
                  {[
                    "Type: POST",
                    "URL: https://www.indexfast.co/api/mcp",
                    `Header: Authorization: Bearer ${apiKey}`
                  ].map((step, i) => (
                    <li key={i} className="flex items-center gap-3 text-xs font-medium">
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                        {i + 1}
                      </div>
                      {step}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar Features */}
        <div className="space-y-6">
          <Card className="rounded-3xl border-border/60 bg-muted/10 p-6 space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest">Available Tools</h3>
            <div className="space-y-4">
              {[
                { name: "submit_url", desc: "Index any page from chat." },
                { name: "seo_audit", desc: "Run instant SEO audits." },
                { name: "get_usage", desc: "Check indexing limits." },
                { name: "list_websites", desc: "View all connected sites." }
              ].map((tool) => (
                <div key={tool.name} className="space-y-1">
                  <code className="text-[11px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded">{tool.name}</code>
                  <p className="text-[11px] text-muted-foreground leading-relaxed pl-1">{tool.desc}</p>
                </div>
              ))}
            </div>
            <div className="pt-2">
              <Button asChild variant="outline" size="sm" className="w-full rounded-xl text-xs font-bold gap-2">
                <a href="https://modelcontextprotocol.io/" target="_blank">
                  Learn about MCP
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
          </Card>

          <Card className="rounded-3xl border-primary/10 bg-primary/5 p-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(244,63,94,0.1),transparent_70%)]" />
            <div className="relative space-y-3">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Magic moment
              </h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                "Index this page for me" — Say this to your agent after configuring IndexFast MCP, and watch your content go live instantly.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
