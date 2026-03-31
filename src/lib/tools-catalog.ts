export interface ToolCategory {
  id: string;
  title: string;
  description: string;
  badge: string;
}

export interface ToolDefinition {
  slug: string;
  title: string;
  categoryId: string;
  primaryKeyword: string;
  description: string;
  intentKeywords: string[];
}

export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    id: "indexing-crawl",
    title: "Indexing and Crawl Tools",
    description: "Fix crawl, indexability, and submission bottlenecks before they hurt rankings.",
    badge: "Crawl and Indexing",
  },
  {
    id: "keyword-research",
    title: "Keyword Research Tools",
    description: "Discover long-tail opportunities and prioritize terms your site can win.",
    badge: "Keyword Research",
  },
  {
    id: "backlink-analysis",
    title: "Backlink Analysis Tools",
    description: "Audit link profile signals and detect opportunities or risks quickly.",
    badge: "Backlink Analysis",
  },
  {
    id: "domain-authority",
    title: "Domain and Authority Tools",
    description: "Review domain trust and technical authority metrics in one place.",
    badge: "Domain Authority",
  },
  {
    id: "metadata-snippets",
    title: "Metadata and Snippet Tools",
    description: "Improve metadata quality for stronger search snippets and social previews.",
    badge: "Metadata Optimization",
  },
];

export const SEO_TOOLS: ToolDefinition[] = [
  {
    slug: "indexability-checker",
    title: "URL Indexability Checker",
    categoryId: "indexing-crawl",
    primaryKeyword: "free url indexability checker",
    description: "Check if a URL can be crawled and indexed, including noindex, canonical, and robots issues.",
    intentKeywords: ["free url indexability checker", "check if page is indexable", "noindex checker"],
  },
  {
    slug: "sitemap-health-checker",
    title: "Sitemap Health Checker",
    categoryId: "indexing-crawl",
    primaryKeyword: "free sitemap health checker",
    description: "Validate XML sitemap URLs and detect redirect, noindex, and status code issues before submission.",
    intentKeywords: ["free sitemap health checker", "xml sitemap validator online", "sitemap broken links checker"],
  },
  {
    slug: "robots-txt-tester",
    title: "Robots.txt Tester",
    categoryId: "indexing-crawl",
    primaryKeyword: "free robots txt tester",
    description: "Test robots.txt directives and verify whether important URLs are blocked for crawlers.",
    intentKeywords: ["free robots txt tester", "is my url blocked by robots", "robots txt checker online"],
  },
  {
    slug: "indexnow-key-validator",
    title: "IndexNow Key Validator",
    categoryId: "indexing-crawl",
    primaryKeyword: "indexnow key validator free",
    description: "Verify key file setup and host alignment before sending IndexNow URL notifications.",
    intentKeywords: ["indexnow key validator free", "indexnow key file checker", "verify indexnow setup"],
  },
  {
    slug: "bing-batch-request-builder",
    title: "Bing Batch Request Builder",
    categoryId: "indexing-crawl",
    primaryKeyword: "bing submiturlbatch request builder",
    description: "Generate clean Bing SubmitUrlBatch payloads for faster and more reliable URL submission.",
    intentKeywords: ["bing submiturlbatch request builder", "bing batch url submission payload", "submit url batch bing example"],
  },
  {
    slug: "redirect-checker",
    title: "Redirect Checker",
    categoryId: "indexing-crawl",
    primaryKeyword: "free redirect checker",
    description: "Trace redirect chains and detect loops that waste crawl budget and slow indexing.",
    intentKeywords: ["free redirect checker", "redirect chain checker", "http redirect test"],
  },
  {
    slug: "google-index-checker",
    title: "Google Index Checker",
    categoryId: "indexing-crawl",
    primaryKeyword: "google index checker tool",
    description: "Check whether pages appear in Google index and identify likely indexing gaps.",
    intentKeywords: ["google index checker tool", "is page indexed in google", "check google index status"],
  },
  {
    slug: "google-cache-checker",
    title: "Google Cache Checker",
    categoryId: "indexing-crawl",
    primaryKeyword: "google cache checker",
    description: "Inspect last cached page snapshots to estimate recrawl recency and freshness.",
    intentKeywords: ["google cache checker", "last cached page checker", "google cached version test"],
  },
  {
    slug: "server-status-checker",
    title: "Server Status Checker",
    categoryId: "indexing-crawl",
    primaryKeyword: "website server status checker",
    description: "Monitor HTTP uptime and response behavior to catch crawl interruptions early.",
    intentKeywords: ["website server status checker", "check server status online", "http uptime checker"],
  },
  {
    slug: "broken-link-checker",
    title: "Broken Link Checker",
    categoryId: "indexing-crawl",
    primaryKeyword: "website broken link checker",
    description: "Find broken internal and external links that degrade UX and crawl efficiency.",
    intentKeywords: ["website broken link checker", "find broken links on website", "dead link checker tool"],
  },
  {
    slug: "spider-simulator",
    title: "Spider Simulator",
    categoryId: "indexing-crawl",
    primaryKeyword: "search engine spider simulator",
    description: "Preview how a crawler interprets your page content and link structure.",
    intentKeywords: ["search engine spider simulator", "seo spider simulator", "crawler view checker"],
  },
  {
    slug: "keyword-position-checker",
    title: "Keyword Position Checker",
    categoryId: "keyword-research",
    primaryKeyword: "keyword position checker free",
    description: "Track current ranking positions for target keywords and benchmark movement.",
    intentKeywords: ["keyword position checker free", "google keyword rank checker", "seo rank checker"],
  },
  {
    slug: "keyword-density-checker",
    title: "Keyword Density Checker",
    categoryId: "keyword-research",
    primaryKeyword: "keyword density checker",
    description: "Analyze keyword distribution to avoid over-optimization and weak topical relevance.",
    intentKeywords: ["keyword density checker", "seo keyword density tool", "check keyword frequency"],
  },
  {
    slug: "keyword-research-tool",
    title: "Keyword Research Tool",
    categoryId: "keyword-research",
    primaryKeyword: "free keyword research tool",
    description: "Generate keyword ideas and map them by intent for content planning.",
    intentKeywords: ["free keyword research tool", "keyword ideas generator", "seo keyword finder"],
  },
  {
    slug: "keyword-competition-checker",
    title: "Keyword Competition Checker",
    categoryId: "keyword-research",
    primaryKeyword: "keyword competition checker",
    description: "Estimate SERP competition to choose terms with realistic ranking potential.",
    intentKeywords: ["keyword competition checker", "seo keyword competition analysis", "keyword difficulty alternative"],
  },
  {
    slug: "long-tail-keyword-generator",
    title: "Long Tail Keyword Generator",
    categoryId: "keyword-research",
    primaryKeyword: "long tail keyword generator",
    description: "Find low-competition long-tail variants to capture high-intent traffic.",
    intentKeywords: ["long tail keyword generator", "long tail seo keywords", "find low competition keywords"],
  },
  {
    slug: "keyword-difficulty-checker",
    title: "Keyword Difficulty Checker",
    categoryId: "keyword-research",
    primaryKeyword: "keyword difficulty checker free",
    description: "Estimate ranking difficulty and prioritize terms your domain can realistically win.",
    intentKeywords: ["keyword difficulty checker free", "keyword difficulty score", "easy keywords finder"],
  },
  {
    slug: "backlink-checker",
    title: "Backlink Checker",
    categoryId: "backlink-analysis",
    primaryKeyword: "free backlink checker",
    description: "Analyze backlink sources and anchor signals to improve off-page SEO strategy.",
    intentKeywords: ["free backlink checker", "check backlinks to website", "backlink analysis tool"],
  },
  {
    slug: "website-link-analyzer",
    title: "Website Link Analyzer",
    categoryId: "backlink-analysis",
    primaryKeyword: "website link analyzer",
    description: "Audit internal and external link patterns for structure and authority flow.",
    intentKeywords: ["website link analyzer", "link analysis tool", "internal external link audit"],
  },
  {
    slug: "website-link-count-checker",
    title: "Website Link Count Checker",
    categoryId: "backlink-analysis",
    primaryKeyword: "website link count checker",
    description: "Count links on a page to identify link bloat and optimize crawl focus.",
    intentKeywords: ["website link count checker", "count links on webpage", "seo link count tool"],
  },
  {
    slug: "domain-age-checker",
    title: "Domain Age Checker",
    categoryId: "domain-authority",
    primaryKeyword: "domain age checker free",
    description: "Check domain registration age for trust benchmarking and competitor research.",
    intentKeywords: ["domain age checker free", "check website domain age", "domain registration date checker"],
  },
  {
    slug: "domain-authority-checker",
    title: "Domain Authority Checker",
    categoryId: "domain-authority",
    primaryKeyword: "domain authority checker",
    description: "Review domain authority metrics to benchmark your site against competitors.",
    intentKeywords: ["domain authority checker", "check domain authority score", "website authority checker"],
  },
  {
    slug: "domain-hosting-checker",
    title: "Domain Hosting Checker",
    categoryId: "domain-authority",
    primaryKeyword: "domain hosting checker",
    description: "Identify hosting infrastructure behind a domain for diagnostics and migrations.",
    intentKeywords: ["domain hosting checker", "who hosts this website", "website hosting lookup"],
  },
  {
    slug: "domain-spam-score-checker",
    title: "Domain Spam Score Checker",
    categoryId: "domain-authority",
    primaryKeyword: "domain spam score checker",
    description: "Check domain risk signals to avoid low-quality linking and partnership targets.",
    intentKeywords: ["domain spam score checker", "website spam score checker", "domain toxicity checker"],
  },
  {
    slug: "meta-tags-analyzer",
    title: "Meta Tags Analyzer",
    categoryId: "metadata-snippets",
    primaryKeyword: "meta tags analyzer",
    description: "Analyze title and meta tag quality for stronger CTR and SERP relevance.",
    intentKeywords: ["meta tags analyzer", "analyze meta tags online", "seo meta checker"],
  },
  {
    slug: "meta-tag-generator",
    title: "Meta Tag Generator",
    categoryId: "metadata-snippets",
    primaryKeyword: "meta tag generator",
    description: "Generate optimized page title and meta description tags with best-practice length.",
    intentKeywords: ["meta tag generator", "seo meta description generator", "html meta tags generator"],
  },
  {
    slug: "open-graph-checker",
    title: "Open Graph Checker",
    categoryId: "metadata-snippets",
    primaryKeyword: "open graph checker",
    description: "Validate Open Graph tags to improve social link previews across platforms.",
    intentKeywords: ["open graph checker", "check og tags", "social preview checker"],
  },
  {
    slug: "open-graph-generator",
    title: "Open Graph Generator",
    categoryId: "metadata-snippets",
    primaryKeyword: "open graph generator",
    description: "Generate Open Graph tags quickly to control social title, image, and description output.",
    intentKeywords: ["open graph generator", "og tags generator", "facebook meta tag generator"],
  },
  {
    slug: "twitter-card-generator",
    title: "Twitter Card Generator",
    categoryId: "metadata-snippets",
    primaryKeyword: "twitter card generator",
    description: "Create and test Twitter card metadata for better shared-link visibility.",
    intentKeywords: ["twitter card generator", "twitter meta tags generator", "x card validator"],
  },
  {
    slug: "website-seo-score-checker",
    title: "Website SEO Score Checker",
    categoryId: "metadata-snippets",
    primaryKeyword: "website seo score checker",
    description: "Get a quick SEO score snapshot and prioritized fixes for better organic performance.",
    intentKeywords: ["website seo score checker", "seo score tool", "website seo audit score"],
  },
  {
    slug: "xml-sitemap-generator",
    title: "XML Sitemap Generator",
    categoryId: "indexing-crawl",
    primaryKeyword: "xml sitemap generator",
    description: "Generate XML sitemaps with clean URL structures for better discovery and crawling.",
    intentKeywords: ["xml sitemap generator", "create sitemap xml", "seo sitemap generator"],
  },
];

const CATEGORY_STEPS: Record<string, string[]> = {
  "indexing-crawl": [
    "Enter your URL, domain, or sitemap and run the check.",
    "Review crawl, indexability, and technical warning signals.",
    "Create a free account to save reports and automate recurring checks.",
  ],
  "keyword-research": [
    "Input your seed topic or target keyword.",
    "Analyze relevance, competition, and ranking opportunity.",
    "Sign up to save keyword clusters and track SEO execution over time.",
  ],
  "backlink-analysis": [
    "Add a domain or page URL for analysis.",
    "Review link metrics and quality or risk patterns.",
    "Create an account to monitor link profile changes continuously.",
  ],
  "domain-authority": [
    "Enter the domain you want to evaluate.",
    "Inspect authority and trust-related SEO signals.",
    "Register to track domain benchmarks and growth trends.",
  ],
  "metadata-snippets": [
    "Paste your URL or content inputs.",
    "Generate and validate metadata for search and social previews.",
    "Create a free account to store templates and deploy faster.",
  ],
};

const CATEGORY_FAQS: Record<string, Array<{ question: string; answer: string }>> = {
  "indexing-crawl": [
    {
      question: "Why start with crawl and indexing tools?",
      answer:
        "Indexing issues can block rankings entirely. Fixing crawl and submission signals first creates faster SEO wins.",
    },
    {
      question: "Who should use these tools?",
      answer:
        "Bloggers, SaaS teams, affiliate sites, and agencies that need quick diagnostics before publishing or scaling pages.",
    },
    {
      question: "What is the upgrade path after free usage?",
      answer:
        "Paid plans unlock saved reports, project-level monitoring, and automated submission workflows.",
    },
  ],
  "keyword-research": [
    {
      question: "How do these keyword tools help with rankings?",
      answer:
        "They help prioritize terms by intent and difficulty so content effort maps to realistic ranking outcomes.",
    },
    {
      question: "Can beginners use these tools?",
      answer:
        "Yes. Each tool is designed for fast input and action-focused output, not complex dashboards.",
    },
    {
      question: "What do paid plans add?",
      answer:
        "Pro plans add saved keyword lists, project organization, and recurring tracking.",
    },
  ],
  "backlink-analysis": [
    {
      question: "Why monitor backlinks regularly?",
      answer:
        "Link profile quality changes over time and can influence authority, rankings, and risk.",
    },
    {
      question: "Are these tools useful for audits?",
      answer:
        "Yes. They are useful for quick audits before deeper link cleanups or outreach campaigns.",
    },
    {
      question: "What paid features improve this workflow?",
      answer:
        "Saved history, recurring checks, and alerts when key link metrics change.",
    },
  ],
  "domain-authority": [
    {
      question: "Why do domain metrics matter?",
      answer:
        "They help benchmark trust and competitiveness, especially when selecting targets or evaluating partnerships.",
    },
    {
      question: "Can I compare multiple domains?",
      answer:
        "Yes. The workflow supports repeated checks, and account users can store historical comparisons.",
    },
    {
      question: "What unlocks with paid plans?",
      answer:
        "Project tracking, higher check limits, and scheduled monitoring.",
    },
  ],
  "metadata-snippets": [
    {
      question: "Why optimize metadata and preview tags?",
      answer:
        "Strong metadata improves click-through rate and ensures better social card rendering.",
    },
    {
      question: "Are these tools helpful for content teams?",
      answer:
        "Yes. They speed up publish workflows and reduce metadata inconsistencies across pages.",
    },
    {
      question: "How does subscription improve metadata workflow?",
      answer:
        "Teams can save templates, reuse presets, and monitor metadata changes over time.",
    },
  ],
};

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return SEO_TOOLS.find((tool) => tool.slug === slug);
}

export function getCategoryById(categoryId: string): ToolCategory | undefined {
  return TOOL_CATEGORIES.find((category) => category.id === categoryId);
}

export function getToolsByCategory(categoryId: string): ToolDefinition[] {
  return SEO_TOOLS.filter((tool) => tool.categoryId === categoryId);
}

export function getToolSteps(categoryId: string): string[] {
  return CATEGORY_STEPS[categoryId] ?? CATEGORY_STEPS["indexing-crawl"];
}

export function getToolFaqs(categoryId: string): Array<{ question: string; answer: string }> {
  return CATEGORY_FAQS[categoryId] ?? CATEGORY_FAQS["indexing-crawl"];
}
