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

export interface ExternalResourceCategory {
  id: string;
  title: string;
  description: string;
}

export interface ExternalResourceLink {
  title: string;
  url: string;
  description: string;
  categoryId: string;
}

export const EXTERNAL_RESOURCE_CATEGORIES: ExternalResourceCategory[] = [
  {
    id: "bing-webmaster",
    title: "Bing Webmaster",
    description: "Core Bing Webmaster and IndexNow resources for setup, validation, and submissions.",
  },
  {
    id: "google-search-console",
    title: "Google Search Console",
    description: "Official Google Search Console entry points and documentation.",
  },
  {
    id: "ahrefs-alternatives",
    title: "Ahrefs Alternatives",
    description: "Alternative SEO suites and backlink/keyword platforms to compare with Ahrefs.",
  },
  {
    id: "semrush-alternatives",
    title: "SEMrush Alternatives",
    description: "Alternative platforms for research, rank tracking, and content workflows.",
  },
  {
    id: "ubersuggest-alternatives",
    title: "Ubersuggest Alternatives",
    description: "Alternative options for keyword discovery and lightweight SEO operations.",
  },
];

export const EXTERNAL_RESOURCE_LINKS: ExternalResourceLink[] = [
  {
    title: "Bing Webmaster Tools",
    url: "https://www.bing.com/webmasters/about",
    description: "Main portal for site management, diagnostics, and indexing workflows on Bing.",
    categoryId: "bing-webmaster",
  },
  {
    title: "Bing IndexNow Dashboard",
    url: "https://www.bing.com/webmasters/indexnow",
    description: "Manage and monitor IndexNow submissions directly from Bing Webmaster.",
    categoryId: "bing-webmaster",
  },
  {
    title: "IndexNow Protocol Docs",
    url: "https://www.indexnow.org/documentation",
    description: "Official protocol documentation for implementation and endpoint behavior.",
    categoryId: "bing-webmaster",
  },
  {
    title: "Google Search Console",
    url: "https://search.google.com/search-console",
    description: "Direct access to properties, performance reports, and index status.",
    categoryId: "google-search-console",
  },
  {
    title: "GSC Help Center",
    url: "https://support.google.com/webmasters",
    description: "Official support docs for verification, sitemaps, and issue troubleshooting.",
    categoryId: "google-search-console",
  },
  {
    title: "URL Inspection Docs",
    url: "https://support.google.com/webmasters/answer/9012289",
    description: "Understand indexing state and request indexing with URL Inspection guidance.",
    categoryId: "google-search-console",
  },
  {
    title: "SE Ranking",
    url: "https://seranking.com/",
    description: "Rank tracking and audit suite often used as an Ahrefs alternative.",
    categoryId: "ahrefs-alternatives",
  },
  {
    title: "Moz Pro",
    url: "https://moz.com/products/pro",
    description: "Keyword research, link metrics, and site crawl workflows.",
    categoryId: "ahrefs-alternatives",
  },
  {
    title: "Mangools",
    url: "https://mangools.com/",
    description: "Lightweight SEO suite for keyword and SERP analysis.",
    categoryId: "ahrefs-alternatives",
  },
  {
    title: "Ahrefs",
    url: "https://ahrefs.com/",
    description: "Baseline reference platform for backlink and competitive research.",
    categoryId: "ahrefs-alternatives",
  },
  {
    title: "Similarweb",
    url: "https://www.similarweb.com/",
    description: "Traffic intelligence and competitive analytics alternative to SEMrush.",
    categoryId: "semrush-alternatives",
  },
  {
    title: "SpyFu",
    url: "https://www.spyfu.com/",
    description: "Competitor keyword and PPC visibility data.",
    categoryId: "semrush-alternatives",
  },
  {
    title: "Serpstat",
    url: "https://serpstat.com/",
    description: "All-in-one platform for keyword, audit, and competitor insights.",
    categoryId: "semrush-alternatives",
  },
  {
    title: "SEMrush",
    url: "https://www.semrush.com/",
    description: "Primary suite for search visibility, content, and advertising workflows.",
    categoryId: "semrush-alternatives",
  },
  {
    title: "KeywordTool.io",
    url: "https://keywordtool.io/",
    description: "Keyword suggestion platform with multilingual coverage.",
    categoryId: "ubersuggest-alternatives",
  },
  {
    title: "LowFruits",
    url: "https://lowfruits.io/",
    description: "Find low-competition keyword opportunities for faster wins.",
    categoryId: "ubersuggest-alternatives",
  },
  {
    title: "AnswerThePublic",
    url: "https://answerthepublic.com/",
    description: "Question-led topic discovery and content ideation.",
    categoryId: "ubersuggest-alternatives",
  },
  {
    title: "Ubersuggest",
    url: "https://neilpatel.com/ubersuggest/",
    description: "Reference keyword and SEO suggestion platform.",
    categoryId: "ubersuggest-alternatives",
  },
];

const RESEARCHED_QUERY_MODIFIERS = [
  "free",
  "online",
  "tool",
  "checker",
  "analyzer",
  "generator",
  "validator",
  "audit",
  "for seo",
] as const;

const CATEGORY_QUERY_SUFFIX: Record<string, string> = {
  "indexing-crawl": "indexing and crawl",
  "keyword-research": "keyword research",
  "backlink-analysis": "backlink analysis",
  "domain-authority": "domain authority",
  "metadata-snippets": "metadata optimization",
};

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

function toKeywordStem(tool: ToolDefinition): string {
  return tool.title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function uniqueKeywords(keywords: string[], limit: number): string[] {
  const seen = new Set<string>();
  const normalized: string[] = [];

  for (const keyword of keywords) {
    const value = keyword.trim().toLowerCase().replace(/\s+/g, " ");

    if (!value || seen.has(value)) {
      continue;
    }

    seen.add(value);
    normalized.push(value);

    if (normalized.length >= limit) {
      break;
    }
  }

  return normalized;
}

export function getToolKeywordTargets(tool: ToolDefinition, limit = 12): string[] {
  const stem = toKeywordStem(tool);
  const categorySuffix = CATEGORY_QUERY_SUFFIX[tool.categoryId] ?? "seo";

  const derivedKeywords = [
    `${stem} free`,
    `${stem} online`,
    `${stem} tool`,
    `best ${stem}`,
    `${stem} for ${categorySuffix}`,
    `${stem} for website`,
    ...RESEARCHED_QUERY_MODIFIERS.map((modifier) => `${stem} ${modifier}`),
  ];

  return uniqueKeywords(
    [tool.primaryKeyword, ...tool.intentKeywords, ...derivedKeywords],
    limit,
  );
}

export function getCategoryKeywordTargets(categoryId: string): string[] {
  const tools = getToolsByCategory(categoryId);
  const allKeywords = tools.flatMap((tool) => getToolKeywordTargets(tool, 8));
  return uniqueKeywords(allKeywords, 24);
}

export function getExternalResourceCategoryById(categoryId: string): ExternalResourceCategory | undefined {
  return EXTERNAL_RESOURCE_CATEGORIES.find((category) => category.id === categoryId);
}

export function getExternalResourcesByCategory(categoryId: string): ExternalResourceLink[] {
  return EXTERNAL_RESOURCE_LINKS.filter((link) => link.categoryId === categoryId);
}

// ─────────────────────────────────────────────────────────────
// FREE TOOLS DIRECTORY — 60+ external tools with embed support
// ─────────────────────────────────────────────────────────────

export type FreeToolTag = "free" | "freemium" | "limited-free";

export interface FreeTool {
  id: string;            // URL-safe slug, used for /tools/ext/[id]
  title: string;
  description: string;
  url: string;           // canonical external URL
  categoryId: string;    // matches FreeToolCategory.id
  tags: string[];        // searchable tags
  tier: FreeToolTag;
  canEmbed: boolean;     // whether the tool allows iframe embedding
}

export interface FreeToolCategory {
  id: string;
  title: string;
  description: string;
  emoji: string;
}

export const FREE_TOOL_CATEGORIES: FreeToolCategory[] = [
  {
    id: "ping-indexing",
    title: "Ping & Indexing",
    description: "Notify search engines and directories about new or updated content instantly.",
    emoji: "⚡",
  },
  {
    id: "backlinks",
    title: "Backlink Analysis",
    description: "Audit your link profile, find toxic links, and discover link opportunities.",
    emoji: "🔗",
  },
  {
    id: "keyword-research",
    title: "Keyword Research",
    description: "Find high-intent keywords, estimate search volume, and map content strategy.",
    emoji: "🔍",
  },
  {
    id: "technical-seo",
    title: "Technical SEO",
    description: "Diagnose site speed, crawlability, structured data, and Core Web Vitals.",
    emoji: "⚙️",
  },
  {
    id: "domain-authority",
    title: "Domain & Authority",
    description: "Check domain age, authority scores, WHOIS info, and hosting details.",
    emoji: "🏛️",
  },
  {
    id: "content-onpage",
    title: "Content & On-Page SEO",
    description: "Audit on-page SEO, check duplicate content, and optimize readability.",
    emoji: "📝",
  },
  {
    id: "serp-rank",
    title: "SERP & Rank Tracking",
    description: "Track keyword rankings and monitor your SERP performance over time.",
    emoji: "📈",
  },
  {
    id: "schema-structured",
    title: "Schema & Structured Data",
    description: "Generate and validate JSON-LD schema markup for rich search results.",
    emoji: "🧩",
  },
  {
    id: "social-og",
    title: "Social & Open Graph",
    description: "Preview and validate social share cards for Twitter, Facebook, and LinkedIn.",
    emoji: "🌐",
  },
  {
    id: "speed-image",
    title: "Speed & Image Optimization",
    description: "Compress images, audit page speed, and improve Core Web Vitals scores.",
    emoji: "🚀",
  },
];

export const FREE_TOOLS: FreeTool[] = [
  // ── Ping & Indexing ──────────────────────────────────────────────────────
  {
    id: "ping-o-matic",
    title: "Ping-O-Matic",
    description: "Ping 20+ blog and content directories simultaneously to notify them of new or updated posts. One of the original free indexing ping services.",
    url: "https://pingomatic.com/",
    categoryId: "ping-indexing",
    tags: ["ping", "indexing", "blog", "ping-o-matic", "notify", "directories"],
    tier: "free",
    canEmbed: true,
  },
  {
    id: "pingler",
    title: "Pingler",
    description: "Automated pinging tool that submits your pages to hundreds of search engines, blog directories, and RSS aggregators to speed up indexing.",
    url: "https://pingler.com/",
    categoryId: "ping-indexing",
    tags: ["ping", "indexing", "rss", "pingler", "search engines", "submission"],
    tier: "freemium",
    canEmbed: true,
  },
  {
    id: "indexnow-submit",
    title: "IndexNow URL Submitter",
    description: "Submit URLs directly to IndexNow-compatible search engines (Bing, Yandex, Naver) with a simple POST request. The fastest path to fresh indexing.",
    url: "https://www.indexnow.org/indexnow",
    categoryId: "ping-indexing",
    tags: ["indexnow", "bing", "url submit", "instant indexing", "protocol"],
    tier: "free",
    canEmbed: true,
  },
  {
    id: "google-search-console",
    title: "Google Search Console",
    description: "Official Google tool to monitor, maintain, and troubleshoot your site's presence in Google Search results. Includes URL inspection, coverage reports, and sitemaps.",
    url: "https://search.google.com/search-console",
    categoryId: "ping-indexing",
    tags: ["google", "search console", "indexing", "sitemap", "url inspection", "coverage"],
    tier: "free",
    canEmbed: false,
  },
  {
    id: "bing-webmaster-tools",
    title: "Bing Webmaster Tools",
    description: "Bing's official webmaster hub for site submission, indexing diagnostics, SEO reports, and IndexNow management.",
    url: "https://www.bing.com/webmasters",
    categoryId: "ping-indexing",
    tags: ["bing", "webmaster", "indexing", "sitemap", "indexnow", "seo"],
    tier: "free",
    canEmbed: false,
  },
  {
    id: "xml-sitemaps-com",
    title: "XML-Sitemaps.com",
    description: "Generate a complete XML sitemap for any website — up to 500 pages free. Downloads instantly, supports images and priority settings.",
    url: "https://www.xml-sitemaps.com/",
    categoryId: "ping-indexing",
    tags: ["sitemap", "xml", "generator", "seo", "crawl"],
    tier: "freemium",
    canEmbed: true,
  },
  {
    id: "google-indexing-api",
    title: "Google Indexing API Tester",
    description: "Test the Google Indexing API for job posting and livestream URLs — the fastest official path to Google indexing for eligible content types.",
    url: "https://developers.google.com/search/apis/indexing-api/v3/quickstart",
    categoryId: "ping-indexing",
    tags: ["google", "indexing api", "job posting", "livestream", "instant indexing"],
    tier: "free",
    canEmbed: false,
  },

  // ── Backlink Analysis ─────────────────────────────────────────────────────
  {
    id: "ahrefs-backlink-checker",
    title: "Ahrefs Free Backlink Checker",
    description: "Check the top 100 backlinks to any website or URL for free. Shows referring domains, anchor text, and domain rating — no account required.",
    url: "https://ahrefs.com/backlink-checker",
    categoryId: "backlinks",
    tags: ["backlinks", "ahrefs", "domain rating", "referring domains", "anchor text"],
    tier: "limited-free",
    canEmbed: true,
  },
  {
    id: "moz-link-explorer",
    title: "Moz Link Explorer",
    description: "Explore the full backlink profile of any site, compare link metrics, and find link building opportunities. Free limited queries per month.",
    url: "https://moz.com/link-explorer",
    categoryId: "backlinks",
    tags: ["moz", "backlinks", "domain authority", "link explorer", "da pa"],
    tier: "limited-free",
    canEmbed: true,
  },
  {
    id: "smallseotools-backlink-checker",
    title: "Small SEO Tools Backlink Checker",
    description: "Completely free backlink checker for any domain or URL. Shows total backlinks, referring domains, and top linking pages — no login required.",
    url: "https://smallseotools.com/backlink-checker/",
    categoryId: "backlinks",
    tags: ["smallseotools", "backlinks", "free", "referring domains", "checker"],
    tier: "free",
    canEmbed: true,
  },
  {
    id: "ubersuggest-backlinks",
    title: "Neil Patel Backlink Checker",
    description: "Free backlink tool by Neil Patel. View top backlinks, anchor text distribution, and referring domains with basic daily limits on free tier.",
    url: "https://neilpatel.com/backlinks/",
    categoryId: "backlinks",
    tags: ["neil patel", "ubersuggest", "backlinks", "anchor text", "domain score"],
    tier: "limited-free",
    canEmbed: true,
  },
  {
    id: "semrush-backlink-analytics",
    title: "SEMrush Backlink Analytics",
    description: "Audit your backlink portfolio, find toxic links, and benchmark against competitors. 10 free reports per day with account.",
    url: "https://www.semrush.com/analytics/backlinks/",
    categoryId: "backlinks",
    tags: ["semrush", "backlinks", "toxic links", "authority score", "referring domains"],
    tier: "limited-free",
    canEmbed: true,
  },
  {
    id: "majestic-seo",
    title: "Majestic SEO",
    description: "One of the largest link intelligence databases. Check Trust Flow, Citation Flow, and backlink history. Free site explorer available.",
    url: "https://majestic.com/",
    categoryId: "backlinks",
    tags: ["majestic", "trust flow", "citation flow", "link intelligence", "backlinks"],
    tier: "limited-free",
    canEmbed: true,
  },
  {
    id: "openlinkprofiler",
    title: "OpenLinkProfiler",
    description: "Free tool to analyze up to 200,000 backlinks per domain. Filter by industry, link type, country, and anchor text. No account needed.",
    url: "https://openlinkprofiler.org/",
    categoryId: "backlinks",
    tags: ["backlinks", "link profile", "anchor text", "industry filter", "free"],
    tier: "free",
    canEmbed: true,
  },

  // ── Keyword Research ──────────────────────────────────────────────────────
  {
    id: "google-keyword-planner",
    title: "Google Keyword Planner",
    description: "Google's official free keyword research tool built into Google Ads. Find search volume estimates, competition levels, and related keyword ideas.",
    url: "https://ads.google.com/home/tools/keyword-planner/",
    categoryId: "keyword-research",
    tags: ["google", "keyword planner", "search volume", "keywords", "google ads"],
    tier: "free",
    canEmbed: false,
  },
  {
    id: "ahrefs-keyword-generator",
    title: "Ahrefs Free Keyword Generator",
    description: "Generate hundreds of keyword ideas for Google, Bing, YouTube, and Amazon from a single seed keyword. Shows volume, difficulty, and related questions.",
    url: "https://ahrefs.com/keyword-generator",
    categoryId: "keyword-research",
    tags: ["ahrefs", "keywords", "keyword ideas", "volume", "difficulty", "questions"],
    tier: "limited-free",
    canEmbed: true,
  },
  {
    id: "ubersuggest-keywords",
    title: "Ubersuggest Keyword Tool",
    description: "Free keyword research by Neil Patel. See search volume, CPC, and SEO difficulty for any keyword across countries and languages.",
    url: "https://neilpatel.com/ubersuggest/",
    categoryId: "keyword-research",
    tags: ["ubersuggest", "keyword research", "cpc", "difficulty", "neil patel"],
    tier: "limited-free",
    canEmbed: true,
  },
  {
    id: "answerthepublic",
    title: "AnswerThePublic",
    description: "Visualize search questions and autocomplete data for any keyword. Great for content ideation and finding long-tail question-based queries.",
    url: "https://answerthepublic.com/",
    categoryId: "keyword-research",
    tags: ["questions", "keyword ideas", "answerthepublic", "content ideas", "long-tail"],
    tier: "limited-free",
    canEmbed: true,
  },
  {
    id: "google-trends",
    title: "Google Trends",
    description: "Explore keyword interest over time, by region, and compare up to 5 search terms. Essential for seasonal content planning and trend discovery.",
    url: "https://trends.google.com/",
    categoryId: "keyword-research",
    tags: ["google trends", "trending", "seasonal", "interest over time", "compare keywords"],
    tier: "free",
    canEmbed: true,
  },
  {
    id: "keywordtool-io",
    title: "KeywordTool.io",
    description: "Generate 750+ long-tail keyword suggestions from Google Autocomplete, YouTube, Bing, Amazon, eBay, and App Stores — free without account.",
    url: "https://keywordtool.io/",
    categoryId: "keyword-research",
    tags: ["keywordtool", "autocomplete", "youtube keywords", "amazon keywords", "long-tail"],
    tier: "limited-free",
    canEmbed: true,
  },
  {
    id: "wordstream-keyword-tool",
    title: "WordStream Free Keyword Tool",
    description: "Free keyword tool with 30 searches per day. Get keyword suggestions, competition data, and estimated CPC for any niche.",
    url: "https://www.wordstream.com/keywords",
    categoryId: "keyword-research",
    tags: ["wordstream", "keywords", "cpc", "competition", "keyword research"],
    tier: "limited-free",
    canEmbed: true,
  },
  {
    id: "soovle",
    title: "Soovle — Multi-Platform Keyword Tool",
    description: "Simultaneously pull autocomplete suggestions from Google, YouTube, Wikipedia, Amazon, Bing, and Yahoo in one interface. Completely free.",
    url: "https://soovle.com/",
    categoryId: "keyword-research",
    tags: ["soovle", "autocomplete", "multi-platform", "youtube", "amazon", "bing"],
    tier: "free",
    canEmbed: true,
  },
  {
    id: "questiondb",
    title: "QuestionDB",
    description: "Find real questions people are asking about any topic, sourced from Reddit and other communities. Perfect for topical authority content.",
    url: "https://questiondb.io/",
    categoryId: "keyword-research",
    tags: ["questions", "reddit", "topical authority", "content ideas", "questiondb"],
    tier: "free",
    canEmbed: true,
  },

  // ── Technical SEO ─────────────────────────────────────────────────────────
  {
    id: "google-pagespeed-insights",
    title: "Google PageSpeed Insights",
    description: "Analyze your page's Core Web Vitals and performance metrics for both mobile and desktop. Powered by Lighthouse with real-world CrUX data.",
    url: "https://pagespeed.web.dev/",
    categoryId: "technical-seo",
    tags: ["pagespeed", "core web vitals", "lighthouse", "lcp", "cls", "fid", "performance"],
    tier: "free",
    canEmbed: true,
  },
  {
    id: "gtmetrix",
    title: "GTmetrix",
    description: "In-depth page performance analysis with waterfall charts, video capture, and actionable recommendations. Free tier allows multiple tests per day.",
    url: "https://gtmetrix.com/",
    categoryId: "technical-seo",
    tags: ["gtmetrix", "page speed", "waterfall chart", "performance", "web vitals"],
    tier: "freemium",
    canEmbed: true,
  },
  {
    id: "webpagetest",
    title: "WebPageTest",
    description: "Advanced website performance testing with global server locations, connection throttling, and filmstrip screenshots. Widely used by engineers.",
    url: "https://www.webpagetest.org/",
    categoryId: "technical-seo",
    tags: ["webpagetest", "performance", "ttfb", "filmstrip", "advanced", "network simulation"],
    tier: "free",
    canEmbed: true,
  },
  {
    id: "google-mobile-friendly",
    title: "Google Mobile-Friendly Test",
    description: "Check whether your page is mobile-friendly according to Google standards. Get instant pass/fail with resource loading diagnostics.",
    url: "https://search.google.com/test/mobile-friendly",
    categoryId: "technical-seo",
    tags: ["mobile-friendly", "google", "mobile usability", "responsive", "viewport"],
    tier: "free",
    canEmbed: true,
  },
  {
    id: "google-rich-results-test",
    title: "Google Rich Results Test",
    description: "Validate structured data on your page and see which rich result types are eligible. Supports Article, FAQ, Recipe, Product, and more.",
    url: "https://search.google.com/test/rich-results",
    categoryId: "technical-seo",
    tags: ["rich results", "structured data", "schema", "google", "json-ld", "faq"],
    tier: "free",
    canEmbed: true,
  },
  {
    id: "screaming-frog-seo-spider",
    title: "Screaming Frog SEO Spider",
    description: "Desktop crawler that audits up to 500 URLs for free. Finds broken links, duplicate content, missing meta tags, redirect chains, and more.",
    url: "https://www.screamingfrog.co.uk/seo-spider/",
    categoryId: "technical-seo",
    tags: ["screaming frog", "crawl", "audit", "broken links", "redirect chains", "meta tags"],
    tier: "limited-free",
    canEmbed: false,
  },
  {
    id: "robots-txt-generator",
    title: "Robots.txt Generator",
    description: "Generate a properly formatted robots.txt file for your website. Set crawl rules per bot, disallow paths, and set sitemap location.",
    url: "https://www.seoptimer.com/robots-txt-generator",
    categoryId: "technical-seo",
    tags: ["robots.txt", "generator", "crawl rules", "noindex", "disallow", "sitemap"],
    tier: "free",
    canEmbed: true,
  },
  {
    id: "ssl-labs-test",
    title: "SSL Labs Server Test",
    description: "Deep analysis of any SSL/TLS web server configuration. Grades your HTTPS setup from A+ to F with detailed vulnerability and cipher reporting.",
    url: "https://www.ssllabs.com/ssltest/",
    categoryId: "technical-seo",
    tags: ["ssl", "https", "tls", "security", "certificate", "cipher", "vulnerability"],
    tier: "free",
    canEmbed: true,
  },
  {
    id: "seobility-seo-checker",
    title: "Seobility Free SEO Checker",
    description: "Full on-page SEO analysis for any URL — checks technical SEO, structure, links, and content quality with an overall SEO score.",
    url: "https://www.seobility.net/en/seocheck/",
    categoryId: "technical-seo",
    tags: ["seobility", "seo audit", "on-page", "technical", "seo score", "checker"],
    tier: "freemium",
    canEmbed: true,
  },

  // ── Domain & Authority ─────────────────────────────────────────────────────
  {
    id: "moz-domain-analysis",
    title: "Moz Domain Analysis",
    description: "Get Domain Authority, Page Authority, Spam Score, and top linking domains for any website. 10 free searches per month without sign-in.",
    url: "https://moz.com/domain-analysis",
    categoryId: "domain-authority",
    tags: ["moz", "domain authority", "da", "pa", "spam score", "authority"],
    tier: "limited-free",
    canEmbed: true,
  },
  {
    id: "ahrefs-website-authority-checker",
    title: "Ahrefs Website Authority Checker",
    description: "Check Ahrefs Domain Rating (DR) and number of linking websites for any domain in seconds. No account needed.",
    url: "https://ahrefs.com/website-authority-checker",
    categoryId: "domain-authority",
    tags: ["ahrefs", "domain rating", "dr", "authority", "referring domains"],
    tier: "free",
    canEmbed: true,
  },
  {
    id: "whois-lookup",
    title: "ICANN WHOIS Lookup",
    description: "Look up domain registration data, registrar info, creation date, expiry date, and nameservers via the official ICANN WHOIS service.",
    url: "https://lookup.icann.org/",
    categoryId: "domain-authority",
    tags: ["whois", "domain lookup", "registration date", "registrar", "nameservers", "icann"],
    tier: "free",
    canEmbed: true,
  },
  {
    id: "smallseotools-domain-authority",
    title: "Small SEO Tools DA Checker",
    description: "Check Domain Authority and Page Authority for up to 10 domains at once. Free, fast, and requires no login.",
    url: "https://smallseotools.com/domain-authority-checker/",
    categoryId: "domain-authority",
    tags: ["smallseotools", "domain authority", "da checker", "bulk", "free"],
    tier: "free",
    canEmbed: true,
  },
  {
    id: "age-of-domain",
    title: "Domain Age Checker",
    description: "Instantly find out how old any domain is — creation date, updated date, and expiry date. Useful for evaluating trust and purchasing decisions.",
    url: "https://smallseotools.com/domain-age-checker/",
    categoryId: "domain-authority",
    tags: ["domain age", "registration date", "trust", "backlink prospecting", "expired domains"],
    tier: "free",
    canEmbed: true,
  },
  {
    id: "dnschecker",
    title: "DNS Checker",
    description: "Check DNS propagation in real time across 100+ global locations. Supports A, AAAA, CNAME, MX, NS, TXT, and SOA records.",
    url: "https://dnschecker.org/",
    categoryId: "domain-authority",
    tags: ["dns", "propagation", "dns records", "nameserver", "mx record", "global"],
    tier: "free",
    canEmbed: true,
  },

  // ── Content & On-Page SEO ─────────────────────────────────────────────────
  {
    id: "smallseotools-plagiarism",
    title: "Small SEO Tools Plagiarism Checker",
    description: "Check content for duplicate text against billions of web pages. Free with up to 1,000 words per search — useful for content teams and writers.",
    url: "https://smallseotools.com/plagiarism-checker/",
    categoryId: "content-onpage",
    tags: ["plagiarism", "duplicate content", "smallseotools", "content check", "free"],
    tier: "free",
    canEmbed: true,
  },
  {
    id: "copyscape",
    title: "Copyscape Plagiarism Checker",
    description: "The gold standard for duplicate content detection. Search for copies of your page online or compare two texts for similarity.",
    url: "https://www.copyscape.com/",
    categoryId: "content-onpage",
    tags: ["copyscape", "plagiarism", "duplicate content", "copyright", "content theft"],
    tier: "limited-free",
    canEmbed: true,
  },
  {
    id: "hemingway-app",
    title: "Hemingway Editor",
    description: "Paste your content to get readability scores, highlight complex sentences, passive voice, and adverb overuse. Targets Grade 6–10 reading level.",
    url: "https://hemingwayapp.com/",
    categoryId: "content-onpage",
    tags: ["readability", "hemingway", "content", "passive voice", "grade level", "writing"],
    tier: "free",
    canEmbed: true,
  },
  {
    id: "seoptimer-seo-audit",
    title: "SEOptimer Free Website Audit",
    description: "Run a comprehensive SEO audit in seconds — covers on-page, performance, social, usability, and backlinks with a letter grade.",
    url: "https://www.seoptimer.com/",
    categoryId: "content-onpage",
    tags: ["seo audit", "seoptimer", "on-page", "performance", "social", "grade"],
    tier: "freemium",
    canEmbed: true,
  },
  {
    id: "woorank",
    title: "WooRank Website SEO Analysis",
    description: "Instant website review covering SEO, usability, mobile, technologies, and social signals. Free quick scan with a full breakdown.",
    url: "https://www.woorank.com/",
    categoryId: "content-onpage",
    tags: ["woorank", "seo review", "site analysis", "usability", "mobile", "technologies"],
    tier: "limited-free",
    canEmbed: true,
  },
  {
    id: "sitechecker-pro",
    title: "Sitechecker On-Page SEO Checker",
    description: "Analyze any URL for on-page SEO factors — title, meta description, headings, images, internal links, and page speed signals.",
    url: "https://sitechecker.pro/",
    categoryId: "content-onpage",
    tags: ["sitechecker", "on-page", "headings", "images", "internal links", "meta"],
    tier: "freemium",
    canEmbed: true,
  },
  {
    id: "smallseotools-article-rewriter",
    title: "Small SEO Tools — Word Counter",
    description: "Count words, characters, sentences, and paragraphs in any text. Useful for hitting content length targets and metadata character limits.",
    url: "https://smallseotools.com/word-counter/",
    categoryId: "content-onpage",
    tags: ["word counter", "character count", "content length", "smallseotools", "meta description"],
    tier: "free",
    canEmbed: true,
  },

  // ── SERP & Rank Tracking ──────────────────────────────────────────────────
  {
    id: "serprobot",
    title: "SERPRobot Free Rank Checker",
    description: "Check your keyword ranking positions on Google instantly. Free rank checker with live SERP data — no account required.",
    url: "https://www.serprobot.com/",
    categoryId: "serp-rank",
    tags: ["serp", "rank checker", "keyword position", "google ranking", "free"],
    tier: "free",
    canEmbed: true,
  },
  {
    id: "mangools-serpchecker",
    title: "Mangools SERPChecker",
    description: "Analyze live Google SERPs for any keyword. See competitor metrics, SERP features, and difficulty scores. 10 free daily lookups.",
    url: "https://mangools.com/serpchecker",
    categoryId: "serp-rank",
    tags: ["mangools", "serp", "competitor analysis", "serp features", "difficulty"],
    tier: "limited-free",
    canEmbed: true,
  },
  {
    id: "smallseotools-rank-checker",
    title: "Small SEO Tools Rank Checker",
    description: "Check your website's ranking position for any keyword in Google, Bing, and Yahoo. Free, instant, no login.",
    url: "https://smallseotools.com/keyword-position-checker/",
    categoryId: "serp-rank",
    tags: ["rank checker", "keyword position", "google", "bing", "smallseotools"],
    tier: "free",
    canEmbed: true,
  },
  {
    id: "google-search-operators",
    title: "Google Advanced Search",
    description: "Use Google's advanced search operators to check indexed pages, find competitors, research backlinks, and run SERP audits manually.",
    url: "https://www.google.com/advanced_search",
    categoryId: "serp-rank",
    tags: ["google search", "advanced operators", "site:", "indexed pages", "competitors"],
    tier: "free",
    canEmbed: true,
  },
  {
    id: "ahrefs-serp-checker",
    title: "Ahrefs SERP Checker",
    description: "See the top 10 Google results for any keyword with full SEO metrics — backlinks, domain rating, traffic, and word count for each result.",
    url: "https://ahrefs.com/serp-checker",
    categoryId: "serp-rank",
    tags: ["ahrefs", "serp checker", "top 10", "keyword", "backlinks", "traffic"],
    tier: "limited-free",
    canEmbed: true,
  },

  // ── Schema & Structured Data ──────────────────────────────────────────────
  {
    id: "schema-markup-generator",
    title: "Technical SEO Schema Markup Generator",
    description: "Generate JSON-LD structured data markup for Article, Breadcrumb, FAQ, HowTo, Product, Local Business, and 20+ other schema types.",
    url: "https://technicalseo.com/tools/schema-markup-generator/",
    categoryId: "schema-structured",
    tags: ["schema", "json-ld", "structured data", "markup generator", "article", "faq", "product"],
    tier: "free",
    canEmbed: true,
  },
  {
    id: "schema-validator",
    title: "Schema.org Validator",
    description: "Official schema.org validator to test structured data markup — microdata, JSON-LD, and RDFa. Checks for errors and warnings.",
    url: "https://validator.schema.org/",
    categoryId: "schema-structured",
    tags: ["schema", "validator", "microdata", "json-ld", "rdfa", "structured data"],
    tier: "free",
    canEmbed: true,
  },
  {
    id: "json-ld-playground",
    title: "JSON-LD Playground",
    description: "Interactive JSON-LD editor and validator. Visualize compacted, expanded, flattened, and framed representations of your structured data.",
    url: "https://json-ld.org/playground/",
    categoryId: "schema-structured",
    tags: ["json-ld", "playground", "structured data", "editor", "validator", "linked data"],
    tier: "free",
    canEmbed: true,
  },
  {
    id: "faq-schema-generator",
    title: "FAQ Schema Generator",
    description: "Generate FAQ schema (JSON-LD) markup instantly. Paste your questions and answers, get copy-paste ready structured data for rich results.",
    url: "https://toolbox.seobility.net/en/faqschema/",
    categoryId: "schema-structured",
    tags: ["faq schema", "json-ld", "rich results", "generator", "structured data"],
    tier: "free",
    canEmbed: true,
  },

  // ── Social & Open Graph ───────────────────────────────────────────────────
  {
    id: "opengraph-xyz",
    title: "OpenGraph.xyz Preview Tool",
    description: "Preview exactly how your page will look when shared on Facebook, Twitter, LinkedIn, and Slack. Validates all OG and Twitter card tags.",
    url: "https://www.opengraph.xyz/",
    categoryId: "social-og",
    tags: ["open graph", "og tags", "preview", "social cards", "facebook", "twitter", "linkedin"],
    tier: "free",
    canEmbed: true,
  },
  {
    id: "twitter-card-validator",
    title: "Twitter Card Validator",
    description: "Preview and validate Twitter card markup for any URL. Checks summary, summary_large_image, app, and player card types.",
    url: "https://cards-dev.twitter.com/validator",
    categoryId: "social-og",
    tags: ["twitter card", "twitter", "open graph", "social preview", "x", "validator"],
    tier: "free",
    canEmbed: false,
  },
  {
    id: "linkedin-post-inspector",
    title: "LinkedIn Post Inspector",
    description: "Preview how URLs render when shared on LinkedIn. Force a re-scrape of cached OG data and diagnose sharing issues.",
    url: "https://www.linkedin.com/post-inspector/",
    categoryId: "social-og",
    tags: ["linkedin", "open graph", "social preview", "og tags", "share card"],
    tier: "free",
    canEmbed: false,
  },
  {
    id: "metatags-io",
    title: "Metatags.io",
    description: "Preview and generate social-ready meta tags for Google, Facebook, Twitter, Slack, and WhatsApp. Visual editor with live preview.",
    url: "https://metatags.io/",
    categoryId: "social-og",
    tags: ["meta tags", "open graph", "preview", "google", "facebook", "twitter", "slack"],
    tier: "free",
    canEmbed: true,
  },

  // ── Speed & Image Optimization ────────────────────────────────────────────
  {
    id: "tinypng",
    title: "TinyPNG — Image Compressor",
    description: "Compress PNG and JPEG images up to 80% in size without visible quality loss. Essential for reducing page weight and improving LCP scores.",
    url: "https://tinypng.com/",
    categoryId: "speed-image",
    tags: ["image compression", "png", "jpeg", "tinypng", "webp", "lcp", "page speed"],
    tier: "freemium",
    canEmbed: true,
  },
  {
    id: "squoosh-app",
    title: "Squoosh — Google Image Optimizer",
    description: "Browser-based image optimizer by Google. Supports WebP, AVIF, MozJPEG, and more with side-by-side comparison and advanced compression settings.",
    url: "https://squoosh.app/",
    categoryId: "speed-image",
    tags: ["squoosh", "webp", "avif", "image optimization", "google", "compression"],
    tier: "free",
    canEmbed: true,
  },
  {
    id: "cloudinary-image-analysis",
    title: "Cloudinary Image Analysis Tool",
    description: "Analyze image quality scores, detect format inefficiencies, and get recommendations for better compression ratios.",
    url: "https://webspeedtest.cloudinary.com/",
    categoryId: "speed-image",
    tags: ["cloudinary", "image analysis", "web speed", "optimization", "format"],
    tier: "free",
    canEmbed: true,
  },
  {
    id: "pingdom-speed-test",
    title: "Pingdom Website Speed Test",
    description: "Test website load time from multiple locations globally. Get breakdown by file type, performance grade, and actionable optimization tips.",
    url: "https://tools.pingdom.com/",
    categoryId: "speed-image",
    tags: ["pingdom", "speed test", "page speed", "performance", "global", "load time"],
    tier: "freemium",
    canEmbed: true,
  },
];

export function getFreeToolById(id: string): FreeTool | undefined {
  return FREE_TOOLS.find((t) => t.id === id);
}

export function getFreeToolsByCategory(categoryId: string): FreeTool[] {
  return FREE_TOOLS.filter((t) => t.categoryId === categoryId);
}

export function getFreeTierLabel(tier: FreeToolTag): string {
  switch (tier) {
    case "free": return "100% Free";
    case "freemium": return "Freemium";
    case "limited-free": return "Free (limited)";
  }
}

// Additional categories for the expanded tool set
// Append these after FREE_TOOL_CATEGORIES definition is used — the renderer
// merges FREE_TOOL_CATEGORIES_EXTRA into FREE_TOOL_CATEGORIES at runtime.
export const FREE_TOOL_CATEGORIES_EXTRA: FreeToolCategory[] = [
  {
    id: "seo-platforms",
    title: "SEO Platforms & Suites",
    description: "All-in-one SEO platforms for research, audits, rank tracking, and content workflows.",
    emoji: "🛠️",
  },
  {
    id: "analytics-ai",
    title: "Analytics & AI Tools",
    description: "Track performance with analytics, build dashboards, and leverage AI for SEO content and automation.",
    emoji: "🤖",
  },
];

// Extra tools from the recommended list (those not already in FREE_TOOLS above)
export const FREE_TOOLS_EXTRA: FreeTool[] = [
  // ── SEO Platforms & Suites ──────────────────────────────────────────────
  {
    id: "ahrefs",
    title: "Ahrefs",
    description: "Industry-leading SEO platform for competitor analysis, backlink research, site audits, keyword explorer, and rank tracking. Best-in-class data.",
    url: "https://ahrefs.com/",
    categoryId: "seo-platforms",
    tags: ["ahrefs", "backlinks", "keyword explorer", "site audit", "rank tracker", "competitor"],
    tier: "limited-free",
    canEmbed: true,
  },
  {
    id: "semrush",
    title: "Semrush",
    description: "All-in-one SEO management suite covering keyword research, competitor analysis, site auditing, rank tracking, and content marketing workflows.",
    url: "https://www.semrush.com/",
    categoryId: "seo-platforms",
    tags: ["semrush", "all-in-one", "keyword research", "rank tracking", "site audit", "competitor"],
    tier: "limited-free",
    canEmbed: true,
  },
  {
    id: "surfer-seo",
    title: "Surfer SEO",
    description: "Content optimization platform that scores your content against top-ranking pages using 500+ signals. Best tool for improving NLP and topical relevance.",
    url: "https://surferseo.com/",
    categoryId: "seo-platforms",
    tags: ["surfer seo", "content optimization", "nlp", "serp analysis", "content score", "on-page"],
    tier: "freemium",
    canEmbed: true,
  },
  {
    id: "se-ranking",
    title: "SE Ranking",
    description: "Affordable all-in-one SEO platform with accurate rank tracking, comprehensive site audits, backlink monitoring, and competitor analysis at lower price points.",
    url: "https://seranking.com/",
    categoryId: "seo-platforms",
    tags: ["se ranking", "rank tracking", "site audit", "backlinks", "affordable", "white label"],
    tier: "freemium",
    canEmbed: true,
  },
  {
    id: "keysearch",
    title: "KeySearch",
    description: "Budget-friendly keyword research tool with difficulty scoring, competitor analysis, SERP preview, and rank tracking. Best value for solo bloggers and small teams.",
    url: "https://www.keysearch.co/",
    categoryId: "seo-platforms",
    tags: ["keysearch", "keyword research", "difficulty score", "affordable", "rank tracking", "blogger"],
    tier: "freemium",
    canEmbed: true,
  },
  {
    id: "similarweb",
    title: "SimilarWeb",
    description: "Analyze competitor traffic sources, top pages, audience demographics, engagement metrics, and keyword gaps. Free tier shows limited but valuable insights.",
    url: "https://www.similarweb.com/",
    categoryId: "seo-platforms",
    tags: ["similarweb", "competitor traffic", "traffic analysis", "audience", "market intelligence"],
    tier: "limited-free",
    canEmbed: true,
  },
  {
    id: "nightwatch",
    title: "Nightwatch",
    description: "Precise rank tracking platform with local and global SERP monitoring, white-label reporting, and Google Data Studio integration. Best for local SEO teams.",
    url: "https://nightwatch.io/",
    categoryId: "seo-platforms",
    tags: ["nightwatch", "rank tracking", "local seo", "serp", "white label", "reporting"],
    tier: "freemium",
    canEmbed: true,
  },
  {
    id: "clearscope",
    title: "Clearscope",
    description: "AI-powered content scoring and optimization platform. Analyzes top-ranking content to give you keyword and topic recommendations for comprehensive coverage.",
    url: "https://www.clearscope.io/",
    categoryId: "seo-platforms",
    tags: ["clearscope", "content scoring", "topic coverage", "ai content", "optimization", "nlp"],
    tier: "limited-free",
    canEmbed: true,
  },
  {
    id: "keywords-everywhere",
    title: "Keywords Everywhere",
    description: "Browser extension (Chrome/Firefox) that shows search volume, CPC, and competition data directly in Google SERPs and 15+ other websites. Pay-as-you-go credits.",
    url: "https://keywordseverywhere.com/",
    categoryId: "seo-platforms",
    tags: ["keywords everywhere", "chrome extension", "serp metrics", "cpc", "search volume", "browser"],
    tier: "freemium",
    canEmbed: false,
  },

  // ── Analytics & AI Tools ──────────────────────────────────────────────────
  {
    id: "google-analytics-4",
    title: "Google Analytics 4",
    description: "Google's free web and app analytics platform. Track organic traffic, user behavior, conversions, and build custom exploration reports for SEO insights.",
    url: "https://analytics.google.com/",
    categoryId: "analytics-ai",
    tags: ["google analytics", "ga4", "analytics", "organic traffic", "conversions", "user behavior"],
    tier: "free",
    canEmbed: false,
  },
  {
    id: "looker-studio",
    title: "Looker Studio (Google Data Studio)",
    description: "Free data visualization and reporting tool. Connect GSC, GA4, and other SEO data sources to build fully custom, shareable client dashboards.",
    url: "https://lookerstudio.google.com/",
    categoryId: "analytics-ai",
    tags: ["looker studio", "data studio", "seo dashboard", "reporting", "visualization", "client reports"],
    tier: "free",
    canEmbed: false,
  },
  {
    id: "gumloop",
    title: "Gumloop",
    description: "No-code AI automation platform for building SEO workflows — automate content briefs, SERP scraping, internal linking, and data pipelines without code.",
    url: "https://www.gumloop.com/",
    categoryId: "analytics-ai",
    tags: ["gumloop", "seo automation", "no-code", "workflow", "ai", "automation", "content briefs"],
    tier: "freemium",
    canEmbed: true,
  },
  {
    id: "airops",
    title: "AirOps",
    description: "AI-powered workflow platform for SEO content operations. Build scalable pipelines for title generation, meta descriptions, content briefs, and bulk rewrites.",
    url: "https://www.airops.com/",
    categoryId: "analytics-ai",
    tags: ["airops", "ai workflows", "content operations", "meta descriptions", "bulk", "seo automation"],
    tier: "freemium",
    canEmbed: true,
  },
  {
    id: "claude-ai",
    title: "Claude by Anthropic",
    description: "Advanced AI assistant by Anthropic. Excellent for SEO content proofreading, improving readability, rewriting for clarity, and generating structured content outlines.",
    url: "https://claude.ai/",
    categoryId: "analytics-ai",
    tags: ["claude", "anthropic", "ai writing", "proofreading", "content", "readability", "rewrite"],
    tier: "limited-free",
    canEmbed: false,
  },
  {
    id: "productrank-ai",
    title: "ProductRank.ai",
    description: "Track how your brand and products are mentioned and ranked in AI-generated answers from ChatGPT, Perplexity, Gemini, and other AI search engines.",
    url: "https://www.productrank.ai/",
    categoryId: "analytics-ai",
    tags: ["productrank", "ai search", "brand tracking", "chatgpt", "perplexity", "geo", "llm ranking"],
    tier: "freemium",
    canEmbed: true,
  },
  {
    id: "alsoasked",
    title: "AlsoAsked",
    description: "Visualize the full People Also Ask tree for any keyword. Perfect for structuring H2s, building FAQ sections, and achieving PAA rich result placements.",
    url: "https://alsoasked.com/",
    categoryId: "analytics-ai",
    tags: ["alsoasked", "people also ask", "paa", "h2 ideas", "faq", "rich results", "question research"],
    tier: "limited-free",
    canEmbed: true,
  },
  {
    id: "google-autocomplete",
    title: "Google Autocomplete Research",
    description: "Manually mine Google Autocomplete and Related Searches to uncover real search intent. Combine with modifiers (A-Z, questions, prepositions) for long-tail discovery.",
    url: "https://www.google.com/search",
    categoryId: "analytics-ai",
    tags: ["google autocomplete", "related searches", "search intent", "long-tail", "modifiers", "free"],
    tier: "free",
    canEmbed: true,
  },
  {
    id: "webflow",
    title: "Webflow",
    description: "Visual website builder with clean, semantic HTML output and built-in SEO controls — custom meta tags, Open Graph, 301 redirects, sitemap.xml, and schema markup.",
    url: "https://webflow.com/",
    categoryId: "analytics-ai",
    tags: ["webflow", "website builder", "seo-friendly", "semantic html", "no-code", "cms", "structured data"],
    tier: "freemium",
    canEmbed: true,
  },
];

// Merged full list (used by the /tools page and search)
export const ALL_FREE_TOOL_CATEGORIES: FreeToolCategory[] = [
  ...FREE_TOOL_CATEGORIES,
  ...FREE_TOOL_CATEGORIES_EXTRA,
];

export const ALL_FREE_TOOLS: FreeTool[] = [
  ...FREE_TOOLS,
  ...FREE_TOOLS_EXTRA,
];

export function getAllFreeToolById(id: string): FreeTool | undefined {
  return ALL_FREE_TOOLS.find((t) => t.id === id);
}

export function getAllFreeToolsByCategory(categoryId: string): FreeTool[] {
  return ALL_FREE_TOOLS.filter((t) => t.categoryId === categoryId);
}
