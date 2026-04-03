/**
 * External SEO resources, launch directories, and professional tools
 * Curated list of the best platforms for visibility, discovery, and technical optimization
 */

export interface ExternalResource {
  name: string;
  url: string;
  category: "Launch" | "Community" | "Directory" | "Tools";
  description: string;
  impact: "Low" | "Medium" | "High" | "Very High";
}

// Top 60% of best-performing directories + external tools (30 resources)
export const EXTERNAL_RESOURCES: ExternalResource[] = [
  // Launch Platforms
  {
    name: "Product Hunt",
    url: "https://www.producthunt.com/",
    category: "Launch",
    impact: "Very High",
    description: "The best place to launch new products and get initial traction from 1M+ monthly visitors.",
  },
  {
    name: "Hacker News",
    url: "https://news.ycombinator.com/",
    category: "Launch",
    impact: "Very High",
    description: "If you hit the front page, expect massive traffic from tech-savvy audiences.",
  },
  {
    name: "Reddit Communities",
    url: "https://www.reddit.com/r/sideproject/",
    category: "Community",
    impact: "High",
    description: "r/sideproject and r/saas for showcasing your product and getting feedback.",
  },
  {
    name: "Indie Hackers",
    url: "https://www.indiehackers.com/",
    category: "Community",
    impact: "High",
    description: "Share your journey and get feedback from 100K+ builders and founders.",
  },
  {
    name: "Twitter / X",
    url: "https://x.com/",
    category: "Community",
    impact: "High",
    description: "Ship updates and build-in-public threads to collect early beta users.",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/",
    category: "Community",
    impact: "High",
    description: "Distribute B2B launch stories and attract enterprise customers.",
  },
  {
    name: "Microlaunch",
    url: "https://microlaunch.net/",
    category: "Launch",
    impact: "Medium",
    description: "Platform for launching micro-SaaS projects with low barrier to entry.",
  },

  // Major Directories
  {
    name: "G2",
    url: "https://www.g2.com/",
    category: "Directory",
    impact: "Very High",
    description: "High-intent software comparison traffic and review-driven buyer decisions.",
  },
  {
    name: "Capterra",
    url: "https://www.capterra.com/",
    category: "Directory",
    impact: "Very High",
    description: "SaaS marketplace with strong B2B conversion potential and enterprise reach.",
  },
  {
    name: "AlternativeTo",
    url: "https://alternativeto.net/",
    category: "Directory",
    impact: "High",
    description: "List your product in software alternatives pages for intent-driven traffic.",
  },
  {
    name: "Betalist",
    url: "https://betalist.com/",
    category: "Directory",
    impact: "High",
    description: "Get early adopters and beta testers for your upcoming startup.",
  },
  {
    name: "SaasHub",
    url: "https://www.saashub.com/",
    category: "Directory",
    impact: "Medium",
    description: "Independent software marketplace reaching buyers in your category.",
  },
  {
    name: "GetApp",
    url: "https://www.getapp.com/",
    category: "Directory",
    impact: "High",
    description: "Reach buyers searching category pages and software roundups.",
  },
  {
    name: "Futurepedia",
    url: "https://www.futurepedia.io/",
    category: "Directory",
    impact: "High",
    description: "Relevant listing source for AI-adjacent products with strong discoverability.",
  },
  {
    name: "1000 Tools",
    url: "https://1000.tools/",
    category: "Directory",
    impact: "Medium",
    description: "A curated list of tools for makers and developers with quality vetting.",
  },

  // SEO & Performance Tools
  {
    name: "Google PageSpeed Insights",
    url: "https://pagespeed.web.dev/",
    category: "Tools",
    impact: "Very High",
    description: "Core Web Vitals diagnostics linked to search performance and UX outcomes.",
  },
  {
    name: "Google Search Console",
    url: "https://search.google.com/search-console/",
    category: "Tools",
    impact: "Very High",
    description: "Official Google tool for search visibility, indexing, and click-through monitoring.",
  },
  {
    name: "Bing Webmaster Tools",
    url: "https://www.bing.com/webmasters/",
    category: "Tools",
    impact: "High",
    description: "Bing's official platform for crawl diagnostics, submit URLs, and search queries.",
  },
  {
    name: "Screaming Frog SEO Spider",
    url: "https://www.screamingfrog.co.uk/seo-spider/",
    category: "Tools",
    impact: "Very High",
    description: "Technical crawl workhorse for audits, redirects, canonicals, and metadata validation.",
  },
  {
    name: "Moz Pro",
    url: "https://moz.com/products/pro",
    category: "Tools",
    impact: "Very High",
    description: "Keyword and link intelligence platform with strong authority metrics.",
  },
  {
    name: "Ahrefs",
    url: "https://ahrefs.com/",
    category: "Tools",
    impact: "Very High",
    description: "Comprehensive backlink research, keyword analysis, and competitor tracking.",
  },
  {
    name: "SEMrush",
    url: "https://www.semrush.com/",
    category: "Tools",
    impact: "Very High",
    description: "All-in-one platform for SEO, SEM, content marketing, and competitor analysis.",
  },
  {
    name: "Sitebulb",
    url: "https://sitebulb.com/",
    category: "Tools",
    impact: "High",
    description: "Visual technical auditing with prioritized issues and actionable crawl insights.",
  },
  {
    name: "SE Ranking",
    url: "https://seranking.com/",
    category: "Tools",
    impact: "High",
    description: "AI visibility tracking, rank monitoring, site audits, and agency reporting.",
  },
  {
    name: "ContentKing",
    url: "https://www.contentkingapp.com/",
    category: "Tools",
    impact: "High",
    description: "24/7 SEO monitoring and alerting for sudden site changes affecting rankings.",
  },
  {
    name: "Similarweb",
    url: "https://www.similarweb.com/",
    category: "Tools",
    impact: "High",
    description: "Competitive traffic intelligence for benchmarking channels and market share.",
  },

  // Analytics & UX
  {
    name: "Microsoft Clarity",
    url: "https://clarity.microsoft.com/",
    category: "Tools",
    impact: "High",
    description: "Free behavior analytics and replay data for landing-page optimization.",
  },
  {
    name: "Hotjar",
    url: "https://www.hotjar.com/",
    category: "Tools",
    impact: "High",
    description: "Heatmaps and session recordings to diagnose UX friction hurting conversions.",
  },
  {
    name: "Peerlist",
    url: "https://peerlist.io/",
    category: "Community",
    impact: "Medium",
    description: "Builder-focused platform to launch products and collect daily feedback.",
  },
  {
    name: "Dev.to",
    url: "https://dev.to/",
    category: "Community",
    impact: "Medium",
    description: "Share engineering-focused launch stories and technical tutorials.",
  },
];

export const RESOURCE_CATEGORIES = [
  { id: "launch", title: "Launch Platforms", description: "Submit your product to high-intent audiences" },
  { id: "directories", title: "Software Directories", description: "Get listed where buyers are actively searching" },
  { id: "tools", title: "SEO & Performance Tools", description: "Professional platforms for SEO, indexing, and optimization" },
  { id: "community", title: "Communities", description: "Engage with builders and share your progress" },
];

export function getResourcesByCategory(categoryId: string): ExternalResource[] {
  const categoryMap: Record<string, "Launch" | "Community" | "Directory" | "Tools"> = {
    launch: "Launch",
    directories: "Directory",
    tools: "Tools",
    community: "Community",
  };
  const category = categoryMap[categoryId];
  return EXTERNAL_RESOURCES.filter((r) => r.category === category);
}
