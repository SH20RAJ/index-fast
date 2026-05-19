"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { upsertBlogPost, deleteBlogPost } from "../actions";
import { type BlogPost, type BlogSection, type BlogFaq } from "@/lib/db/schema";
import { Plus, Trash, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface BlogFormProps {
  initialData?: BlogPost | null;
}

export function BlogForm({ initialData }: BlogFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<BlogPost>>(
    initialData || {
      slug: "",
      title: "",
      description: "",
      primaryKeyword: "",
      keywords: [],
      author: "IndexFast Editorial Team",
      readingMinutes: 5,
      hero: "",
      sections: [{ heading: "", paragraphs: [""], bullets: [] }],
      faqs: [{ question: "", answer: "" }],
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await upsertBlogPost(formData as any);
      toast.success("Blog post saved successfully!");
      router.push("/blog/mcp");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save blog post.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData?.slug || !confirm("Are you sure you want to delete this post?")) return;
    setLoading(true);
    try {
      await deleteBlogPost(initialData.slug);
      toast.success("Blog post deleted.");
      router.push("/blog/mcp");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete blog post.");
    } finally {
      setLoading(false);
    }
  };

  const addSection = () => {
    const sections = [...(formData.sections || []), { heading: "", paragraphs: [""], bullets: [] }];
    setFormData({ ...formData, sections });
  };

  const updateSection = (index: number, field: keyof BlogSection, value: any) => {
    const sections = [...(formData.sections || [])];
    sections[index] = { ...sections[index], [field]: value };
    setFormData({ ...formData, sections });
  };

  const removeSection = (index: number) => {
    const sections = (formData.sections || []).filter((_, i) => i !== index);
    setFormData({ ...formData, sections });
  };

  const addFaq = () => {
    const faqs = [...(formData.faqs || []), { question: "", answer: "" }];
    setFormData({ ...formData, faqs });
  };

  const updateFaq = (index: number, field: keyof BlogFaq, value: string) => {
    const faqs = [...(formData.faqs || [])];
    faqs[index] = { ...faqs[index], [field]: value };
    setFormData({ ...formData, faqs });
  };

  const removeFaq = (index: number) => {
    const faqs = (formData.faqs || []).filter((_, i) => i !== index);
    setFormData({ ...formData, faqs });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <Button variant="ghost" asChild>
          <Link href="/blog/mcp">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Link>
        </Button>
        <div className="flex gap-2">
          {initialData && (
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={loading}>
              <Trash className="mr-2 h-4 w-4" /> Delete
            </Button>
          )}
          <Button type="submit" disabled={loading}>
            <Save className="mr-2 h-4 w-4" /> {loading ? "Saving..." : "Save Post"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="slug">Slug (URL path)</Label>
            <Input
              id="slug"
              value={formData.slug ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, slug: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Meta Description</Label>
            <Textarea
              id="description"
              value={formData.description ?? ""}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={formData.author ?? ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, author: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="readingMinutes">Reading Minutes</Label>
              <Input
                id="readingMinutes"
                type="number"
                value={formData.readingMinutes ?? 0}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, readingMinutes: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="primaryKeyword">Primary Keyword</Label>
            <Input
              id="primaryKeyword"
              value={formData.primaryKeyword ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, primaryKeyword: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="keywords">Keywords (comma separated)</Label>
            <Input
              id="keywords"
              value={formData.keywords?.join(", ") ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, keywords: e.target.value.split(",").map((s: string) => s.trim()) })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="hero">Hero / Introduction Text</Label>
            <Textarea
              id="hero"
              value={formData.hero ?? ""}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, hero: e.target.value })}
              className="h-32"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Content Sections</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addSection}>
            <Plus className="h-4 w-4 mr-2" /> Add Section
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {formData.sections?.map((section, idx) => (
            <div key={idx} className="p-4 border rounded-lg space-y-4 relative">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => removeSection(idx)}
              >
                <Trash className="h-4 w-4 text-destructive" />
              </Button>
              <div className="grid gap-2">
                <Label>Section Heading</Label>
                <Input
                  value={section.heading ?? ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSection(idx, "heading", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Paragraphs (One per line)</Label>
                <Textarea
                  value={section.paragraphs.join("\n")}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateSection(idx, "paragraphs", e.target.value.split("\n"))}
                  className="h-32"
                />
              </div>
              <div className="grid gap-2">
                <Label>Bullets (One per line, optional)</Label>
                <Textarea
                  value={section.bullets?.join("\n") || ""}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateSection(idx, "bullets", e.target.value.split("\n").filter(Boolean))}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>FAQs</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addFaq}>
            <Plus className="h-4 w-4 mr-2" /> Add FAQ
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {formData.faqs?.map((faq, idx) => (
            <div key={idx} className="p-4 border rounded-lg space-y-4 relative">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => removeFaq(idx)}
              >
                <Trash className="h-4 w-4 text-destructive" />
              </Button>
              <div className="grid gap-2">
                <Label>Question</Label>
                <Input
                  value={faq.question ?? ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFaq(idx, "question", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Answer</Label>
                <Textarea
                  value={faq.answer ?? ""}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateFaq(idx, "answer", e.target.value)}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </form>
  );
}
