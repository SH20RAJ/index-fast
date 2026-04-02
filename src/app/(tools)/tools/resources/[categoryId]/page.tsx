import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Globe, 
  ArrowLeft, 
  ExternalLink, 
  Sparkles,
  Search,
  BookOpen,
  ChevronRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  EXTERNAL_RESOURCE_CATEGORIES,
  getExternalResourceCategoryById,
  getExternalResourcesByCategory,
} from "@/lib/tools-catalog";
import Link from "next/link";

interface ResourceCategoryPageProps {
  params: Promise<{ categoryId: string }>;
}

export function generateStaticParams() {
  return EXTERNAL_RESOURCE_CATEGORIES.map((category) => ({ categoryId: category.id }));
}

export async function generateMetadata({ params }: ResourceCategoryPageProps): Promise<Metadata> {
  const { categoryId } = await params;
  const category = getExternalResourceCategoryById(categoryId);

  if (!category) {
    return {
      title: "Resource Category Not Found",
      description: "The requested external SEO resource category does not exist.",
    };
  }

  return {
    title: `${category.title} Resources | IndexFast Tools`,
    description: category.description,
    alternates: {
      canonical: `/tools/resources/${category.id}`,
    },
    openGraph: {
      title: `${category.title} Resources | IndexFast`,
      description: category.description,
      url: `/tools/resources/${category.id}`,
      type: "website",
    },
  };
}

export default async function ResourceCategoryPage({ params }: ResourceCategoryPageProps) {
  const { categoryId } = await params;
  const category = getExternalResourceCategoryById(categoryId);

  if (!category) {
    notFound();
  }

  const resources = getExternalResourcesByCategory(category.id);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/20 overflow-x-hidden">
      {/* Editorial Background */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      
      <main className="max-w-4xl mx-auto px-6 py-24 md:py-32 relative z-10">
        <div className="space-y-6 mb-16 animate-in fade-in slide-in-from-top-8 duration-700">
          <Link 
            href="/tools" 
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground/60 hover:text-primary transition-colors group"
          >
            <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" /> Back to Tools
          </Link>
          
          <div className="space-y-4">
            <Badge variant="outline" className="h-8 px-4 text-[10px] font-black uppercase tracking-[0.2em] border-primary/20 bg-primary/5 text-primary rounded-full">
              Resource Hub
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground leading-[0.85]">
              {category.title} <span className="text-primary italic font-hand inline-block -rotate-2 ml-2">Resources</span>
            </h1>
            
            <p className="text-xl font-medium text-muted-foreground/60 max-w-2xl leading-relaxed">
              {category.description}
            </p>
          </div>
        </div>

        <div className="grid gap-8">
          {resources.map((resource, idx) => (
            <Card key={idx} className="group overflow-hidden border-border/40 bg-card/30 backdrop-blur-xl hover:bg-card/50 transition-all duration-500 rounded-[32px] hover:shadow-2xl shadow-primary/5">
              <CardContent className="p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start">
                <div className="h-16 w-16 rounded-[24px] bg-muted flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500 border border-border/20">
                  <BookOpen className="h-7 w-7 text-primary" />
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                      {resource.title}
                    </h3>
                    <p className="text-lg font-medium text-muted-foreground/70 leading-relaxed">
                      {resource.description}
                    </p>
                  </div>
                  
                  <div className="pt-4 flex flex-wrap gap-4">
                    <Button asChild className="h-12 px-8 rounded-2xl bg-foreground text-background font-black tracking-tight hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10">
                      <a href={resource.url} target="_blank" rel="noopener noreferrer">
                        Access Resource <ExternalLink className="ml-2 h-4 w-4 opacity-50" />
                      </a>
                    </Button>
                    <Button variant="ghost" className="h-12 px-6 rounded-2xl font-bold tracking-tight text-muted-foreground hover:text-foreground">
                      Save to Dashboard
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {resources.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <Search className="h-12 w-12 text-muted-foreground/20 mx-auto" />
            <p className="text-xl font-medium text-muted-foreground/40">No resources found in this category yet.</p>
          </div>
        )}

        <div className="mt-24 p-12 rounded-[48px] bg-foreground text-background relative overflow-hidden group">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-[80px] translate-x-1/2 -translate-y-1/2" />
          </div>
          
          <div className="relative z-10 space-y-6 max-w-xl">
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter leading-none">
              Master your SEO workflow with <span className="text-primary/80">IndexFast.</span>
            </h2>
            <p className="text-lg font-medium text-background/60">
              Stop waiting for crawlers. Take control of your indexing schedule today.
            </p>
            <Button size="lg" asChild className="h-14 px-10 rounded-2xl bg-primary text-primary-foreground font-black tracking-tight text-lg hover:scale-105 transition-all shadow-2xl shadow-primary/40">
              <Link href="/auth">Get Started Free <ChevronRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Decorative Text */}
      <div className="fixed bottom-0 left-0 right-0 py-8 text-center opacity-[0.03] pointer-events-none -z-10 select-none">
        <span className="text-[180px] font-black tracking-[-0.12em] leading-none">RESOURCES</span>
      </div>
    </div>
  );
}
