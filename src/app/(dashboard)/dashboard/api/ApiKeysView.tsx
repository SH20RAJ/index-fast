"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Key, Copy, RefreshCw, Terminal, Code2, BookOpen, Check, ShieldCheck, Zap } from "lucide-react";
import { getUserApiKey, rotateApiKeyAction } from "@/app/(dashboard)/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function ApiKeysView() {
  const [apiKey, setApiKey] = useState<string>("");
  const [showKey, setShowKey] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadKey();
  }, []);

  async function loadKey() {
    const res = await getUserApiKey();
    if (res.status === "success" && res.data) {
      setApiKey(res.data);
    }
  }

  async function handleRotate() {
    if (!confirm("Are you sure? Your existing API key will stop working immediately.")) return;
    
    setRotating(true);
    const res = await rotateApiKeyAction();
    if (res.status === "success" && res.data) {
      setApiKey(res.data);
      toast.success("API key rotated.");
    } else {
      toast.error(res.message || "Failed to rotate key.");
    }
    setRotating(false);
  }

  function handleCopy() {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    toast.success("API key copied to clipboard.");
    setTimeout(() => setCopied(false), 2000);
  }

  const docs = [
    {
      title: "Authentication",
      description: "Use your API key as a Bearer token in the Authorization header.",
      code: `curl -X POST https://www.indexfast.co/api/v1/submit \\
  -H "Authorization: Bearer ${apiKey || 'YOUR_API_KEY'}" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com"}'`,
      language: "bash"
    },
    {
      title: "Javascript Example",
      description: "Integrate indexing into your existing publishing workflow.",
      code: `const response = await fetch('https://www.indexfast.co/api/v1/submit', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ${apiKey || 'YOUR_API_KEY'}',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ url: 'https://example.com' })
});

const data = await response.json();
console.log(data);`,
      language: "javascript"
    }
  ];

  return (
    <div className="space-y-10 pb-32 max-w-5xl">
      <PageHeader
        title="Developer API"
        description="Programmatically index your content and automate your SEO workflow with our developer-first API."
      />

      <section className="grid gap-8">
        <Card className="rounded-[40px] border-zinc-100 dark:border-white/5 bg-white dark:bg-zinc-900/40 p-8 shadow-xl shadow-black/5 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <Key className="w-32 h-32" />
          </div>
          <div className="relative space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500">Your Private API Key</span>
              <p className="text-sm text-zinc-500 font-light">Every account is limited to one active secret key. Use this key to authenticate your requests.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 group">
                <Input
                  type={(showKey ? "text" : "password") as any}
                  value={apiKey}
                  readOnly
                  className="h-14 rounded-2xl bg-zinc-50 border-zinc-100 font-mono text-sm px-6 pr-24 dark:bg-white/5 dark:border-white/10"
                />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-2 top-1/2 -tranzinc-y-1/2 h-10 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-rose-500"
                >
                  {showKey ? "Hide" : "Reveal"}
                </Button>
              </div>
              
              <div className="flex gap-3">
                <Button onClick={handleCopy} variant="outline" className="h-14 w-14 rounded-2xl border-zinc-100 dark:border-white/10 shrink-0">
                  {copied ? <Check className="h-5 w-5 text-pink-500" /> : <Copy className="h-5 w-5" />}
                </Button>
                <Button onClick={handleRotate} disabled={rotating} variant="outline" className="h-14 px-6 rounded-2xl border-zinc-100 dark:border-white/10 font-bold uppercase tracking-widest text-[11px] gap-2">
                  <RefreshCw className={cn("h-4 w-4", rotating && "animate-spin")} />
                  Rotate Key
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-6 pt-4 border-t border-zinc-50 dark:border-white/5">
               <div className="flex items-center gap-2">
                 <ShieldCheck className="w-4 h-4 text-pink-500" />
                 <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">TLS 1.3 Secure</span>
               </div>
               <div className="flex items-center gap-2">
                 <Zap className="w-4 h-4 text-amber-500" />
                 <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">High Availability</span>
               </div>
            </div>
          </div>
        </Card>

        <div className="grid gap-6">
           <div className="flex items-center gap-3 px-2">
             <BookOpen className="w-5 h-5 text-rose-500" />
             <h3 className="text-xl font-bold tracking-tight italic">Documentation</h3>
           </div>

           <div className="grid gap-6">
             {docs.map((doc, i) => (
               <Card key={i} className="rounded-[32px] border-zinc-100 dark:border-white/5 overflow-hidden">
                 <CardHeader className="bg-zinc-50/50 dark:bg-white/[0.02] p-8 pb-4">
                    <CardTitle className="text-lg font-bold">{doc.title}</CardTitle>
                    <CardDescription className="font-light">{doc.description}</CardDescription>
                 </CardHeader>
                 <CardContent className="p-8 pt-4">
                    <div className="relative group">
                       <pre className="p-6 rounded-2xl bg-zinc-900 text-zinc-100 font-mono text-xs overflow-x-auto leading-relaxed border border-white/5">
                          {doc.code}
                       </pre>
                       <Button 
                         variant="ghost" 
                         size="sm" 
                         className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 hover:text-white"
                         onClick={() => {
                           navigator.clipboard.writeText(doc.code);
                           toast.success("Snippet copied!");
                         }}
                       >
                         <Copy className="h-3.5 w-3.5" />
                       </Button>
                    </div>
                 </CardContent>
               </Card>
             ))}
           </div>
        </div>

        <Card className="rounded-[40px] border-rose-500/20 bg-rose-500/[0.02] p-8 border-2 border-dashed">
           <div className="flex items-start gap-6">
             <div className="h-12 w-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-rose-500/20">
                <Terminal className="w-6 h-6" />
             </div>
             <div className="space-y-1">
               <h4 className="text-lg font-bold italic">Need more endpoints?</h4>
               <p className="text-sm text-zinc-500 font-light leading-relaxed">
                 We are rapidly expanding our API to cover bulk sitemap extraction, Wayback machine automation, and live indexing status monitoring. 
                 Want something specific? Contact support for early access to beta endpoints.
               </p>
             </div>
           </div>
        </Card>
      </section>
    </div>
  );
}
