import { Metadata } from "next";
import { LANDING_FAQS } from "@/lib/landing-faq";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Features from "@/components/landing/Features";
import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";
import FinalCTA from "@/components/landing/FinalCTA";
import ChatBot from "@/components/landing/ChatBot";
import SocialProof from "@/components/landing/SocialProof";
import Testimonials from "@/components/landing/Testimonials";
import { LogoCloud } from "@/components/ui/logo-cloud-2";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.indexfast.co";
const title = "IndexFast - Automated SEO Indexing & URL Submission";
const description =
  "Stop waiting for Google to crawl your site. IndexFast submits your URLs to Google, Bing, and IndexNow instantly for faster ranking and better SEO.";
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
    "automated seo indexing",
    "indexnow url submission",
    "bing url submission",
    "google indexing speed",
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
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "IndexFast landing page preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/twitter-image.png"],
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
        url: `${siteUrl}/opengraph-image.png`,
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
        price: "0",
        priceCurrency: "USD",
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
      <Hero />
      <SocialProof />
      <Testimonials />
      <HowItWorks />
      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-3 pb-6">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Search Engine Reach</p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Popular search engines impacted by your indexing workflow
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">
            This cloud includes globally popular search engines and regional leaders. Direct engines can receive IndexNow signals, while others are influenced by stronger crawl and freshness signals.
          </p>
        </div>
        <LogoCloud />
      </section>
      <Features />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <ChatBot />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(landingJsonLd) }} />
    </>
  );
}
