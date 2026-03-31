import { ImageResponse } from "next/og";

export const alt = "IndexFast automates SEO indexing workflows";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 64px",
          background:
            "radial-gradient(circle at 20% 20%, #4f7dff 0%, #1b2b57 45%, #090d1a 100%)",
          color: "#f8fbff",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 44,
            fontWeight: 800,
            letterSpacing: -0.5,
          }}
        >
          IndexFast
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 960 }}>
          <div style={{ fontSize: 74, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
            Automated SEO Indexing
          </div>
          <div style={{ fontSize: 34, opacity: 0.92, lineHeight: 1.25 }}>
            Submit URLs to IndexNow and Bing, monitor sitemap changes, and accelerate discovery.
          </div>
        </div>

        <div style={{ fontSize: 28, opacity: 0.84 }}>indexfast.net</div>
      </div>
    ),
    {
      ...size,
    },
  );
}