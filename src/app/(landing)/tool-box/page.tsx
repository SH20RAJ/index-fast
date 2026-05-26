import React from "react";
import ToolboxView from "./ToolboxView";
import { Metadata } from "next";

const title = "SEO Toolbox - Best Directories & Communities for Growth";
const description = "A curated list of 50+ directories, communities, and tech stack tools to get traction, backlinks, and go viral. The ultimate growth stack for modern SEOs.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "SEO toolbox",
    "startup directories",
    "backlink sources",
    "growth tools",
    "indie hacker communities",
    "product hunt alternatives",
    "SaaS marketing stack",
    "tech stack for SEO",
  ],
  openGraph: {
    title,
    description,
    type: "website",
    url: "/tool-box",
    images: [
      {
        url: "/logo/og2.png",
        width: 1200,
        height: 630,
        alt: "IndexFast SEO Toolbox",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/logo/og2.png"],
  },
};

export default function ToolboxPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://indexfast.co";

  const toolboxJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url: `${siteUrl}/tool-box`,
    publisher: {
      "@type": "Organization",
      name: "IndexFast",
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Launch Platforms",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Growth Communities",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "SEO Directories",
        },
        {
          "@type": "ListItem",
          position: 4,
          name: "Technical Tech Stack",
        }
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolboxJsonLd) }}
      />
      <ToolboxView />
    </>
  );
}
