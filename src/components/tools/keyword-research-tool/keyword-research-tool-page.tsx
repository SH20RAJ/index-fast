import ToolPageShell from "@/app/(tools)/tools/_components/ToolPageShell";
import {
  getCategoryById,
  getToolBySlug,
  getToolFaqs,
  getToolKeywordTargets,
  getToolsByCategory,
  getToolSteps,
} from "@/lib/tools-catalog";
import KeywordResearchTool from "./KeywordResearchTool";

export default function KeywordResearchToolPageContent() {
  const slug = "keyword-research-tool";
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
    url: `https://indexfast.co/tools/${tool.slug}`,
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
        slug={slug}
        badge={category?.badge ?? "SEO Tool"}
        title={`Free ${tool.title}`}
        description={tool.description}
        intentKeywords={keywordTargets}
        steps={getToolSteps(tool.categoryId)}
        faqs={faqs}
        categoryTitle={category?.title}
        relatedTools={relatedTools}
      >
        <div className="mt-10 mb-16">
          <KeywordResearchTool />
        </div>
      </ToolPageShell>
    </>
  );
}
