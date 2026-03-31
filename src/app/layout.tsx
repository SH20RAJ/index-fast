import type { Metadata, Viewport } from "next";
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
        url: "/opengraph-image",
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
    images: ["/twitter-image"],
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
      logo: `${siteUrl}/icon`,
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body>
        <PwaRegister />
        <StackProvider app={stackClientApp}>
          <StackTheme>
            <ThemeRegistry>{children}</ThemeRegistry>
          </StackTheme>
        </StackProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </body>
    </html>
  );
}
