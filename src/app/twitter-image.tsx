import { ImageResponse } from "next/og";

export const alt = "IndexFast SEO indexing platform social preview";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function TwitterImage() {
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
          background: "linear-gradient(150deg, #060914 0%, #16264d 60%, #3862cf 100%)",
          color: "#f4f8ff",
        }}
      >
        <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: -0.5 }}>IndexFast</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 940 }}>
          <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
            Faster Indexing, Better SEO
          </div>
          <div style={{ fontSize: 34, opacity: 0.92, lineHeight: 1.24 }}>
            Built for creators, SEO operators, and agencies shipping pages at scale.
          </div>
        </div>

        <div style={{ fontSize: 28, opacity: 0.84 }}>Submit. Track. Scale.</div>
      </div>
    ),
    {
      ...size,
    },
  );
}