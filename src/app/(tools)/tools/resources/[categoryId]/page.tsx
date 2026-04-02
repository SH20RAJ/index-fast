import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  EXTERNAL_RESOURCE_CATEGORIES,
  getExternalResourceCategoryById,
  getExternalResourcesByCategory,
} from "@/lib/tools-catalog";

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
    <div className="bg-background py-10 md:py-14">
      <div className="container mx-auto max-w-4xl space-y-6 px-4">
        <div className="space-y-2">
          <Badge variant="secondary">External SEO resource hub</Badge>
          <h1 className="text-3xl font-semibold tracking-tight">{category.title}</h1>
          <p className="text-muted-foreground">{category.description}</p>
        </div>

        <div className="space-y-3">
          {resources.map((resource) => (
            <Card key={resource.title}>
              <CardHeader>
                <CardTitle className="text-xl">{resource.title}</CardTitle>
                <CardDescription>{resource.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Button asChild>
                  <a href={resource.url} target="_blank" rel="noopener noreferrer">
                    Open resource
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/tools">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to tools
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
