import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackClientApp } from "@/stack/client";
import ThemeRegistry from "@/components/ThemeRegistry";
import PwaRegister from "@/components/pwa/PwaRegister";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://indexfast.net";
const siteName = "IndexFast";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "IndexFast | Automated SEO Indexing",
    template: "%s | IndexFast",
  },
  description:
    "Automated indexing workflows for modern teams. Submit URLs faster to Bing and IndexNow, monitor sitemap changes, and improve organic discovery.",
  applicationName: siteName,
  keywords: [
    "SEO indexing",
    "IndexNow",
    "Bing indexing",
    "technical SEO",
    "sitemap indexing",
    "URL submission",
    "SEO tools",
    "generative engine optimization",
  ],
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    url: "/",
    siteName,
    title: "IndexFast | Automated SEO Indexing",
    description:
      "Automated indexing workflows for modern teams. Submit URLs faster to Bing and IndexNow, monitor sitemap changes, and improve organic discovery.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "IndexFast automated SEO indexing platform preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IndexFast | Automated SEO Indexing",
    description:
      "Automated indexing workflows for modern teams. Submit URLs faster to Bing and IndexNow, monitor sitemap changes, and improve organic discovery.",
    images: ["/twitter-image.png"],
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
      logo: `${siteUrl}/icon.png`,
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: siteName,
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteUrl}/tools`,
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

const stackTheme = {
  radius: "0.85rem",
  light: {
    background: "#f8fafc",
    foreground: "#0f172a",
    card: "#ffffff",
    cardForeground: "#0f172a",
    popover: "#ffffff",
    popoverForeground: "#0f172a",
    primary: "#0ea5e9",
    primaryForeground: "#ffffff",
    secondary: "#e2e8f0",
    secondaryForeground: "#0f172a",
    muted: "#f1f5f9",
    mutedForeground: "#475569",
    accent: "#ecfeff",
    accentForeground: "#0f172a",
    destructive: "#dc2626",
    destructiveForeground: "#ffffff",
    border: "#cbd5e1",
    input: "#e2e8f0",
    ring: "#0ea5e9",
  },
  dark: {
    background: "#020617",
    foreground: "#e2e8f0",
    card: "#0f172a",
    cardForeground: "#f8fafc",
    popover: "#0f172a",
    popoverForeground: "#f8fafc",
    primary: "#38bdf8",
    primaryForeground: "#082f49",
    secondary: "#1e293b",
    secondaryForeground: "#e2e8f0",
    muted: "#1e293b",
    mutedForeground: "#94a3b8",
    accent: "#0f172a",
    accentForeground: "#e2e8f0",
    destructive: "#ef4444",
    destructiveForeground: "#ffffff",
    border: "#334155",
    input: "#1e293b",
    ring: "#38bdf8",
  },
} as const;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={cn("font-sans", inter.variable)}>
      <body>
        <PwaRegister />
        <StackProvider app={stackClientApp}>
          <StackTheme theme={stackTheme}>
            <ThemeRegistry>{children}</ThemeRegistry>
          </StackTheme>
        </StackProvider>
        <Script
          id="website-jsonld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </body>
    </html>
  );
}
