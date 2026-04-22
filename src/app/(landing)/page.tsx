import { Metadata } from "next";
import { LANDING_FAQS } from "@/lib/landing-faq";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Features from "@/components/landing/Features";
import FAQ from "@/components/landing/FAQ";
import FinalCTA from "@/components/landing/FinalCTA";
import ChatBot from "@/components/landing/ChatBot";
import { LogoCloud } from "@/components/ui/logo-cloud-2";
import Pricing from "@/components/landing/Pricing";
import { AnimatedTestimonials } from "@/components/blocks/animated-testimonials";

const testimonials = [
  {
    id: 1,
    name: "Alex",
    role: "SEO Engineer",
    company: "TrafficScale",
    content: "IndexFast pushed our programmatic SEO pages and ranked them within hours. The difference from manual GSC is staggering.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d"
  },
  {
    id: 2,
    name: "Sarah Jones",
    role: "Content Director",
    company: "DailyNews",
    content: "For a publisher, indexing time is everything. We immediately saw a boost in top stories placement once we automated our IndexNow pings.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=a04258a2462d826712d"
  },
  {
    id: 3,
    name: "Mike Chen",
    role: "Founder",
    company: "Storefront",
    content: "When product inventory drops, we need Google sensing it instantly. IndexFast solved our stale cache issues on the first day.",
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
      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-3 pb-6">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Supported Search Engines</p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Get your site noticed on Google, Bing, and more
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">
            We submit your pages directly to top search engines so they show up in search results faster.
          </p>
        </div>
        <LogoCloud />
      </section>
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
      <FAQ />
      <FinalCTA />
      <ChatBot />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(landingJsonLd) }} />
    </>
  );
}
