import { Metadata } from "next";
import { LANDING_FAQS } from "@/lib/landing-faq";
import {
  LANDING_TESTIMONIALS,
  TRUSTED_COMPANIES,
} from "@/lib/landing-testimonials";
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
  { name: "Toolbox", path: "/tool-box" },
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
      isPartOf: { "@id": `${siteUrl}/#website` },
      inLanguage: "en-US",
      breadcrumb: { "@id": `${siteUrl}/#breadcrumb` },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(landingJsonLd) }}
      />

      {/* Above the fold: Hero + Engine logos */}
      <Hero />
      <SupportedEngines />

      {/* Problem & solution flow */}
      <PainSection />
      <DifferentiationSection />

      {/* How it works & feature details */}
      <HowItWorks />
      <Features />

      {/* Social proof */}
      <AnimatedTestimonials
        title="Trusted by Modern Publishers & pSEO"
        subtitle="See how teams are dropping their indexing times from days to minutes with IndexFast."
        badgeText="Real Case Studies"
        testimonials={[...LANDING_TESTIMONIALS]}
        trustedCompanies={[...TRUSTED_COMPANIES]}
        trustedCompaniesTitle="Used by high-velocity content teams"
      />

      {/* Pricing & closing */}
      <Pricing />
      <FAQ />
      <FinalCTA />
      <ChatBot />
    </>
  );
}
