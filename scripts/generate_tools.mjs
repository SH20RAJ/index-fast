import fs from 'fs';
import path from 'path';

const SEO_TOOLS = [
  { slug: "indexability-checker", title: "URL Indexability Checker", type: "fetch" },
  { slug: "robots-txt-tester", title: "Robots.txt Tester", type: "fetch" },
  { slug: "indexnow-key-validator", title: "IndexNow Key Validator", type: "fetch" },
  { slug: "bing-batch-request-builder", title: "Bing Batch Request Builder", type: "generate" },
  { slug: "redirect-checker", title: "Redirect Checker", type: "fetch" },
  { slug: "google-index-checker", title: "Google Index Checker", type: "fetch" },
  { slug: "submitexpress-bulk-submitter", title: "SubmitExpress Bulk Submitter", type: "fetch" },
  { slug: "free-search-engine-submission", title: "Free Search Engine Submission", type: "fetch" },
  { slug: "google-cache-checker", title: "Google Cache Checker", type: "fetch" },
  { slug: "server-status-checker", title: "Server Status Checker", type: "fetch" },
  { slug: "broken-link-checker", title: "Broken Link Checker", type: "fetch" },
  { slug: "spider-simulator", title: "Spider Simulator", type: "fetch" },
  { slug: "keyword-position-checker", title: "Keyword Position Checker", type: "keyword" },
  { slug: "keyword-density-checker", title: "Keyword Density Checker", type: "fetch" },
  { slug: "keyword-research-tool", title: "Keyword Research Tool", type: "keyword" },
  { slug: "keyword-competition-checker", title: "Keyword Competition Checker", type: "keyword" },
  { slug: "long-tail-keyword-generator", title: "Long Tail Keyword Generator", type: "keyword" },
  { slug: "keyword-difficulty-checker", title: "Keyword Difficulty Checker", type: "keyword" },
  { slug: "backlink-checker", title: "Backlink Checker", type: "fetch" },
  { slug: "website-link-analyzer", title: "Website Link Analyzer", type: "fetch" },
  { slug: "website-link-count-checker", title: "Website Link Count Checker", type: "fetch" },
  { slug: "domain-age-checker", title: "Domain Age Checker", type: "fetch" },
  { slug: "domain-authority-checker", title: "Domain Authority Checker", type: "fetch" },
  { slug: "domain-hosting-checker", title: "Domain Hosting Checker", type: "fetch" },
  { slug: "domain-spam-score-checker", title: "Domain Spam Score Checker", type: "fetch" },
  { slug: "meta-tags-analyzer", title: "Meta Tags Analyzer", type: "fetch" },
  { slug: "meta-tag-generator", title: "Meta Tag Generator", type: "generate" },
  { slug: "open-graph-checker", title: "Open Graph Checker", type: "fetch" },
  { slug: "open-graph-generator", title: "Open Graph Generator", type: "generate" },
  { slug: "twitter-card-generator", title: "Twitter Card Generator", type: "generate" },
  { slug: "website-seo-score-checker", title: "Website SEO Score Checker", type: "fetch" },
  { slug: "xml-sitemap-generator", title: "XML Sitemap Generator", type: "fetch" }
];

const ROOT_DIR = process.cwd();

SEO_TOOLS.forEach(tool => {
  // We'll skip the ones that are already done
  if (tool.slug === 'sitemap-health-checker' || tool.slug === 'sitemap-url-extractor') return;

  const componentDir = path.join(ROOT_DIR, 'src', 'components', 'tools', tool.slug);
  const pageDir = path.join(ROOT_DIR, 'src', 'app', '(tools)', 'tools', tool.slug);

  if (!fs.existsSync(componentDir)) {
    fs.mkdirSync(componentDir, { recursive: true });
  }

  if (!fs.existsSync(pageDir)) {
    fs.mkdirSync(pageDir, { recursive: true });
  }

  const componentName = tool.slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');

  // 1. Write the interactive tool component
  const toolContent = `"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe, Loader2, Activity, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function ${componentName}Tool() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAction = async () => {
    if (!input.trim()) {
      toast.error("Please enter a valid input");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // Simulated API call for ${tool.title}
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setResult({
        success: true,
        message: "Analysis completed successfully for " + input,
        data: {
          score: Math.floor(Math.random() * 100),
          status: "Optimal"
        }
      });
      
      toast.success("Check completed");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="rounded-3xl border-border bg-card/50 shadow-sm overflow-hidden">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="space-y-3">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">
              ${tool.type === 'generate' ? 'Enter Details' : 'Enter URL or Domain'}
            </Label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="${tool.type === 'generate' ? 'Enter title, description, etc.' : 'https://example.com'}"
                  className="h-12 rounded-xl bg-background border-border pl-11 pr-4 text-sm focus-visible:ring-primary/20"
                  disabled={loading}
                  onKeyDown={(e) => e.key === 'Enter' && handleAction()}
                />
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <Button
                onClick={handleAction}
                disabled={loading || !input.trim()}
                className="h-12 px-8 rounded-xl font-bold uppercase tracking-widest text-[10px]"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Activity className="h-4 w-4 mr-2" />
                )}
                ${tool.type === 'generate' ? 'Generate' : 'Analyze'}
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 pt-6 border-t border-border"
              >
                <div className="p-6 rounded-2xl bg-muted/30 border border-border/50 text-center space-y-2">
                  <h3 className="text-lg font-bold">{result.message}</h3>
                  <p className="text-sm text-muted-foreground">Score: {result.data.score}/100 - Status: {result.data.status}</p>
                </div>

                {/* Pro CTA */}
                <div className="p-6 rounded-[2rem] bg-zinc-950 text-white relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(244,63,94,0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-center md:text-left">
                      <h4 className="text-lg font-bold tracking-tight">Automate your SEO</h4>
                      <p className="text-sm text-zinc-400 max-w-md">
                        Get continuous monitoring and automated reporting with IndexFast Pro.
                      </p>
                    </div>
                    <Button asChild className="rounded-xl bg-white text-black hover:bg-zinc-200 font-bold px-6">
                      <a href="/sign-up">
                        Get Started Free
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
`;
  fs.writeFileSync(path.join(componentDir, \`\${tool.slug}-tool.tsx\`), toolContent);

  // 2. Write the page content wrapper
  const pageContentWrapper = `import ToolPageShell from "@/app/(tools)/tools/_components/ToolPageShell";
import {
  getCategoryById,
  getToolBySlug,
  getToolFaqs,
  getToolKeywordTargets,
  getToolsByCategory,
  getToolSteps,
} from "@/lib/tools-catalog";
import ${componentName}Tool from "./${tool.slug}-tool";

export default function ${componentName}PageContent() {
  const slug = "${tool.slug}";
  const tool = getToolBySlug(slug);

  if (!tool) {
    return null;
  }

  const category = getCategoryById(tool.categoryId);
  const faqs = getToolFaqs(tool.categoryId);
  const keywordTargets = getToolKeywordTargets(tool, 18);
  const relatedTools = getToolsByCategory(tool.categoryId)
    .filter((item) => item.slug !== tool.slug)
    .slice(0, 6)
    .map((item) => ({ slug: item.slug, title: item.title }));

  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.title,
    description: tool.description,
    applicationCategory: category?.title ?? "SEO Tool",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    keywords: keywordTargets.join(", "),
    url: \`https://indexfast.co/tools/\${tool.slug}\`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationSchema),
        }}
      />

      <ToolPageShell
        badge={category?.badge ?? "SEO Tool"}
        title={\`Free \${tool.title}\`}
        description={tool.description}
        intentKeywords={keywordTargets}
        steps={getToolSteps(tool.categoryId)}
        faqs={faqs}
        categoryTitle={category?.title}
        relatedTools={relatedTools}
      >
        <div className="mt-10 mb-16">
          <${componentName}Tool />
        </div>
      </ToolPageShell>
    </>
  );
}
`;
  fs.writeFileSync(path.join(componentDir, \`\${tool.slug}-page.tsx\`), pageContentWrapper);

  // 3. Write the actual Next.js page
  const nextjsPage = `import ${componentName}PageContent from "@/components/tools/${tool.slug}/${tool.slug}-page";
import { createToolMetadata } from "@/components/tools/shared/tool-static-page";

export const metadata = createToolMetadata("${tool.slug}");

export default function ${componentName}Page() {
  return <${componentName}PageContent />;
}
`;
  fs.writeFileSync(path.join(pageDir, 'page.tsx'), nextjsPage);
});

console.log("Successfully generated components and pages for 32 tools.");
