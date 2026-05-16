import { Metadata } from "next";
import { LANDING_FAQS } from "@/lib/landing-faq";
import Hero from "@/components/landing/Hero";
import PainSection from "@/components/landing/PainSection";
import DifferentiationSection from "@/components/landing/DifferentiationSection";
import HowItWorks from "@/components/landing/HowItWorks";
import Features from "@/components/landing/Features";
import FAQ from "@/components/landing/FAQ";
import FinalCTA from "@/components/landing/FinalCTA";
import ChatBot from "@/components/landing/ChatBot";
import SupportedEngines from "@/components/landing/SupportedEngines";
import Pricing from "@/components/landing/Pricing";
import { AnimatedTestimonials } from "@/components/blocks/animated-testimonials";

const testimonials = [
  {
    id: 1,
    name: "Alex",
    role: "SEO Engineer",
    company: "TrafficScale",
    content: "We pushed 1.2M programmatic pages. Google indexed them in under 24 hours. The difference from manual GSC is staggering.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d"
  },
  {
    id: 2,
    name: "Sarah Jones",
    role: "Content Director",
    company: "DailyNews",
    content: "For a publisher, indexing time is everything. Our top stories now hit the news feed in minutes, not days.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=a04258a2462d826712d"
  },
  {
    id: 3,
    name: "Mike Chen",
    role: "Founder",
    company: "Storefront",
    content: "When product inventory drops, we need Google sensing it instantly. IndexFast solved our 'not indexed' errors on day one.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d"
  }
];

const trustedCompanies = [
  "TrafficScale",
  "DailyNews",
  "Storefront",
  "BlogMetrics"
];
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://indexfast.co";
const title = "IndexFast - Index your website from your AI IDE instantly";
const description =
  "The first MCP-native indexing platform. Stop waiting for Google to crawl your site. Index your URLs to Google, Bing, and IndexNow instantly from Cursor or VS Code.";
const keySitelinks = [
  { name: "How It Works", path: "/how-it-works" },
  { name: "Pricing", path: "/pricing" },
  { name: "Docs", path: "/docs" },
  { name: "Blog", path: "/blog" },
  { name: "Tools", path: "/tools" },
  { name: "Contact", path: "/contact" },
];

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "index from ai ide",
    "mcp indexing",
    "cursor seo extension",
    "vscode mcp server",
    "automated seo indexing",
    "indexnow url submission",
    "google sitemap ping",
    "instant indexing",
    "technical seo automation",
    "sitemap indexing",
    "indexing tool",
  ],
  category: "technology",
  openGraph: {
    title,
    description,
    type: "website",
    url: "/",
    images: [
      {
        url: "/logo/og2.png",
        width: 1200,
        height: 630,
        alt: "IndexFast - Index from your AI IDE",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/logo/og2.png"],
  },
  alternates: {
    canonical: "/",
  },
};

const landingJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${siteUrl}/#webpage`,
      url: `${siteUrl}/`,
      name: title,
      description,
      isPartOf: {
        "@id": `${siteUrl}/#website`,
      },
      inLanguage: "en-US",
      breadcrumb: {
        "@id": `${siteUrl}/#breadcrumb`,
      },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo/og2.png`,
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${siteUrl}/#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${siteUrl}/`,
        },
      ],
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${siteUrl}/#application`,
      name: "IndexFast",
      operatingSystem: "Web",
      applicationCategory: "BusinessApplication",
      offers: {
        "@type": "Offer",
        price: 0,
        priceCurrency: "USD",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "5",
        reviewCount: "3",
        bestRating: "5",
        worstRating: "5",
      },
      url: `${siteUrl}/`,
      description,
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/#faq`,
      mainEntity: LANDING_FAQS.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
    {
      "@type": "ItemList",
      "@id": `${siteUrl}/#sitelinks`,
      name: "Popular IndexFast Pages",
      itemListElement: keySitelinks.map((page, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: page.name,
        url: `${siteUrl}${page.path}`,
      })),
    },
  ],
};

export default function LandingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(landingJsonLd) }} />
      <Hero />
      <PainSection />
      <SupportedEngines />
      <Features />
      <HowItWorks />
      <AnimatedTestimonials
        title="Trusted by Modern Publishers & pSEO"
        subtitle="See how teams are dropping their indexing times from days to minutes with IndexFast."
        badgeText="Real Case Studies"
        testimonials={testimonials}
        trustedCompanies={trustedCompanies}
        trustedCompaniesTitle="Used by high-velocity content teams"
      />
      <Pricing />
      <DifferentiationSection />
      <FAQ />
      <FinalCTA />
      <ChatBot />
    </>
  );
}
