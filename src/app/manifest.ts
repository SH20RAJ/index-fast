import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "IndexFast - Automated SEO Indexing",
    short_name: "IndexFast",
    description:
      "Automate sitemap discovery and URL submissions to IndexNow and Bing in one workflow.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f6f8ff",
    theme_color: "#0b1020",
    orientation: "portrait",
    lang: "en-US",
    categories: ["business", "productivity", "developer"],
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
    shortcuts: [
      {
        name: "SEO Tools",
        short_name: "Tools",
        description: "Open the free SEO tools directory",
        url: "/tools",
      },
      {
        name: "Blog",
        short_name: "Blog",
        description: "Read SEO and GEO guides",
        url: "/blog",
      },
    ],
    screenshots: [
      {
        src: "/opengraph-image.png",
        sizes: "1200x630",
        type: "image/png",
        form_factor: "wide",
        label: "IndexFast platform preview",
      },
      {
        src: "/twitter-image.png",
        sizes: "1200x630",
        type: "image/png",
        label: "IndexFast social preview image",
      },
    ],
  };
}