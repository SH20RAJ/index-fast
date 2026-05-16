import type { Metadata, Viewport } from "next";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackClientApp } from "@/stack/client";
import ThemeRegistry from "@/components/ThemeRegistry";
import PwaRegister from "@/components/pwa/PwaRegister";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";
import { Playfair_Display, Source_Sans_3, Fira_Code } from "next/font/google";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/next"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://indexfast.co";
const siteName = "IndexFast";
const siteDescription =
  "Index your website from your AI IDE instantly. Automated indexing workflows for modern teams — submit URLs to Bing, IndexNow, and Google with one click from Cursor or VS Code.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "IndexFast | Index from your AI IDE",
    template: "%s | IndexFast",
  },
  description: siteDescription,
  applicationName: siteName,
  referrer: "origin-when-cross-origin",
  creator: siteName,
  publisher: siteName,
  category: "technology",
  classification: "SEO, indexing automation, SaaS, MCP",
  authors: [{ name: siteName, url: siteUrl }],
  keywords: [
    "SEO indexing",
    "IndexNow",
    "Bing indexing",
    "MCP server",
    "Cursor indexing",
    "VS Code SEO",
    "technical SEO",
    "sitemap indexing",
    "URL submission",
    "SEO tools",
  ],
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
      en: "/",
    },
    types: {
      "application/opensearchdescription+xml": `${siteUrl}/opensearch.xml`,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_SITE_VERIFICATION,
    yahoo: process.env.NEXT_PUBLIC_YAHOO_SITE_VERIFICATION,
    other: {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ?? "",
    },
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/icon.png", color: "#7C3AED" },
    ],
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName,
    title: "IndexFast | Index from your AI IDE",
    description: siteDescription,
    locale: "en_US",
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
    title: "IndexFast | Index from your AI IDE",
    description: siteDescription,
    images: ["/logo/og2.png"],
    creator: "@indexfast",
    site: "@indexfast",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: siteName,
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  other: {
    "apple-mobile-web-app-title": siteName,
    "msapplication-TileColor": "#0b1020",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b1020",
  colorScheme: "light dark",
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: siteName,
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/icon.png`,
        width: 512,
        height: 512,
      },
      sameAs: [
        "https://twitter.com/indexfast",
        "https://github.com/indexfast",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: siteName,
      description: siteDescription,
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteUrl}/blog?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "SiteNavigationElement",
      name: "How It Works",
      url: `${siteUrl}/how-it-works`,
    },
    {
      "@type": "SiteNavigationElement",
      name: "Docs",
      url: `${siteUrl}/docs`,
    },
    {
      "@type": "SiteNavigationElement",
      name: "Pricing",
      url: `${siteUrl}/pricing`,
    },
    {
      "@type": "SiteNavigationElement",
      name: "Blog",
      url: `${siteUrl}/blog`,
    },
    {
      "@type": "SiteNavigationElement",
      name: "Tools",
      url: `${siteUrl}/tools`,
    },
    {
      "@type": "SiteNavigationElement",
      name: "Contact",
      url: `${siteUrl}/contact`,
    },
  ],
};

const stackTheme = {
  radius: "0.5rem",
  light: {
    background: "#FAFAF9",
    foreground: "#1C1917",
    card: "#F5F5F4",
    cardForeground: "#1C1917",
    popover: "#F5F5F4",
    popoverForeground: "#1C1917",
    primary: "#C2410C",
    primaryForeground: "#FAFAF9",
    secondary: "#E7E5E4",
    secondaryForeground: "#57534E",
    muted: "#F5F5F4",
    mutedForeground: "#78716C",
    accent: "#F59E0B",
    accentForeground: "#1C1917",
    destructive: "#DC2626",
    destructiveForeground: "#FAFAF9",
    border: "#D6D3D1",
    input: "#F5F5F4",
    ring: "#C2410C",
  },
  dark: {
    background: "#1C1917",
    foreground: "#FAFAF9",
    card: "#262220",
    cardForeground: "#FAFAF9",
    popover: "#262220",
    popoverForeground: "#FAFAF9",
    primary: "#EA580C",
    primaryForeground: "#1C1917",
    secondary: "#44403C",
    secondaryForeground: "#D6D3D1",
    muted: "#262220",
    mutedForeground: "#A8A29E",
    accent: "#F59E0B",
    accentForeground: "#1C1917",
    destructive: "#EF4444",
    destructiveForeground: "#FAFAF9",
    border: "#44403C",
    input: "#262220",
    ring: "#EA580C",
  },
} as const;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={cn("font-sans", sourceSans.variable, playfair.variable, firaCode.variable)}>
      <body>
        <PwaRegister />
        <StackProvider app={stackClientApp}>
          <StackTheme theme={stackTheme}>
            <ThemeRegistry>
              <TooltipProvider>{children}</TooltipProvider>
            </ThemeRegistry>
          </StackTheme>
        </StackProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <Analytics />
      </body>
    </html>
  );
}
