"use client";

import { ArrowUpRight, Users, Rocket, Building2, Wrench } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EXTERNAL_RESOURCES, RESOURCE_CATEGORIES, getResourcesByCategory } from "@/lib/external-resources";
import { useStackApp } from "@stackframe/stack";

const categoryIcons = {
  launch: Rocket,
  directories: Building2,
  tools: Wrench,
  community: Users,
};

export default function ExternalResourcesSection() {
  const stack = useStackApp();

  return (
    <section className="border-t border-border/70 py-14 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 space-y-4">
          <Badge variant="outline" className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.14em]">
            External Resources Library
          </Badge>
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
            30+ directories, tools & communities
            <span className="block text-muted-foreground">for discovery and growth</span>
          </h2>
          <p className="max-w-3xl text-base text-muted-foreground sm:text-lg">
            Curated collection of the best platforms for product launches, software discovery, technical SEO, and performance optimization. HandPicked for conversion potential.
          </p>
        </div>

        {/* Resource Categories */}
        <div className="space-y-12">
          {RESOURCE_CATEGORIES.map((category) => {
            const Icon = categoryIcons[category.id as keyof typeof categoryIcons];
            const resources = getResourcesByCategory(category.id);

            return (
              <div key={category.id} className="space-y-6">
                {/* Category Header */}
                <div className="flex items-start gap-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg border border-border/70 bg-background/90">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-black tracking-tight">{category.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
                    <Badge variant="outline" className="mt-2">
                      {resources.length} resources
                    </Badge>
                  </div>
                </div>

                {/* Resource Cards Grid */}
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {resources.map((resource) => (
                    <Card
                      key={resource.name}
                      className="group border-border/70 bg-card/70 transition-colors hover:border-orange-500/40"
                    >
                      <CardHeader className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <CardTitle className="text-lg leading-tight">{resource.name}</CardTitle>
                            <CardDescription className="text-xs font-medium uppercase tracking-wide mt-2">
                              {resource.impact} impact
                            </CardDescription>
                          </div>
                          <Badge
                            variant="secondary"
                            className={`shrink-0 ${
                              resource.impact === "Very High"
                                ? "bg-green-100 text-green-900 hover:bg-green-100"
                                : resource.impact === "High"
                                  ? "bg-pink-100 text-pink-900 hover:bg-pink-100"
                                  : resource.impact === "Medium"
                                    ? "bg-yellow-100 text-yellow-900 hover:bg-yellow-100"
                                    : "bg-gray-100 text-gray-900 hover:bg-gray-100"
                            }`}
                          >
                            {resource.impact}
                          </Badge>
                        </div>
                        <p className="text-sm leading-relaxed text-muted-foreground">{resource.description}</p>
                      </CardHeader>
                      <CardContent>
                        <Button asChild className="w-full justify-center">
                          <a href={resource.url} target="_blank" rel="noopener noreferrer">
                            Visit <ArrowUpRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 rounded-xl border border-border/70 bg-gradient-to-r from-primary/5 to-secondary/5 p-8 text-center">
          <h3 className="text-2xl font-black tracking-tight">Want all 47+ directories and tools in one place?</h3>
          <p className="mt-2 text-muted-foreground">
            Access the complete curated database of launch platforms, software directories, and exclusive SEO tools inside the toolbox.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button onClick={() => stack.redirectToSignUp()} size="lg">
              Get Free Access to Toolbox
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/toolbox">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
