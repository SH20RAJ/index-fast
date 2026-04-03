export interface SeoToolLink {
  title: string;
  url: string;
  description: string;
  sectionId: string;
  badge: "Official" | "Free" | "Pro";
}

export interface SeoToolSection {
  id: string;
  title: string;
  description: string;
}

export const SEO_TOOL_SECTIONS: SeoToolSection[] = [
  { id: "indexing", title: "Indexing", description: "Submission, crawling, and index inspection tools." },
  { id: "performance", title: "Performance", description: "Speed, Core Web Vitals, and page experience checks." },
  { id: "research", title: "Research", description: "Keyword, market, and competitive intelligence tools." },
  { id: "audit", title: "Audit", description: "Technical crawling, monitoring, and content QA tools." },
  { id: "visibility", title: "Visibility", description: "Authority, backlinks, and SERP visibility platforms." },
];

export const SEO_TOOL_LINKS: SeoToolLink[] = [
  { title: "Google Search Console", url: "https://search.google.com/search-console/", description: "Official Google index, coverage, and performance reporting.", sectionId: "indexing", badge: "Official" },
  { title: "Bing Webmaster Tools", url: "https://www.bing.com/webmasters/", description: "Bing indexing, crawl stats, and URL submission.", sectionId: "indexing", badge: "Official" },
  { title: "IndexNow", url: "https://www.indexnow.org/", description: "Instant indexing protocol for supported search engines.", sectionId: "indexing", badge: "Official" },
  { title: "Rich Results Test", url: "https://search.google.com/test/rich-results", description: "Check schema and rich result eligibility.", sectionId: "indexing", badge: "Free" },
  { title: "PageSpeed Insights", url: "https://pagespeed.web.dev/", description: "Core Web Vitals and performance diagnostics.", sectionId: "performance", badge: "Free" },
  { title: "Lighthouse", url: "https://developer.chrome.com/docs/lighthouse/overview/", description: "Chrome performance, accessibility, and best-practices audits.", sectionId: "performance", badge: "Free" },
  { title: "WebPageTest", url: "https://www.webpagetest.org/", description: "Lab performance testing with filmstrip and waterfall data.", sectionId: "performance", badge: "Free" },
  { title: "GTmetrix", url: "https://gtmetrix.com/", description: "Speed and page experience testing with actionable fixes.", sectionId: "performance", badge: "Pro" },
  { title: "Ahrefs", url: "https://ahrefs.com/", description: "Backlink analysis, keyword research, and competitive tracking.", sectionId: "research", badge: "Pro" },
  { title: "Semrush", url: "https://www.semrush.com/", description: "All-in-one SEO research, content, and visibility suite.", sectionId: "research", badge: "Pro" },
  { title: "Moz Pro", url: "https://moz.com/products/pro", description: "Keyword, link, and domain authority workflows.", sectionId: "research", badge: "Pro" },
  { title: "Similarweb", url: "https://www.similarweb.com/", description: "Traffic and channel intelligence for competitors.", sectionId: "research", badge: "Pro" },
  { title: "Screaming Frog", url: "https://www.screamingfrog.co.uk/seo-spider/", description: "Technical crawl audits for large and small sites.", sectionId: "audit", badge: "Pro" },
  { title: "Sitebulb", url: "https://sitebulb.com/", description: "Visual auditing and issue prioritization.", sectionId: "audit", badge: "Pro" },
  { title: "ContentKing", url: "https://www.contentkingapp.com/", description: "24/7 change monitoring for SEO and content teams.", sectionId: "audit", badge: "Pro" },
  { title: "Microsoft Clarity", url: "https://clarity.microsoft.com/", description: "Free behavior analytics and session recordings.", sectionId: "audit", badge: "Free" },
  { title: "Google Trends", url: "https://trends.google.com/", description: "Trend tracking for topics, brands, and queries.", sectionId: "visibility", badge: "Free" },
  { title: "Open PageRank", url: "https://www.openpagerank.com/", description: "Quick domain authority snapshot for visibility checks.", sectionId: "visibility", badge: "Free" },
  { title: "SE Ranking", url: "https://seranking.com/", description: "Rank tracking, audits, and reporting.", sectionId: "visibility", badge: "Pro" },
  { title: "SpyFu", url: "https://www.spyfu.com/", description: "Competitor keywords and paid-search intelligence.", sectionId: "visibility", badge: "Pro" },
];

export function getSeoToolSectionById(sectionId: string): SeoToolSection | undefined {
  return SEO_TOOL_SECTIONS.find((section) => section.id === sectionId);
}

export function getSeoToolLinksBySection(sectionId: string): SeoToolLink[] {
  return SEO_TOOL_LINKS.filter((link) => link.sectionId === sectionId);
}
