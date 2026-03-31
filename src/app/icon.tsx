import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0b1020 0%, #1c2c57 55%, #4c7df3 100%)",
          color: "#ffffff",
          fontSize: 220,
          fontWeight: 800,
          letterSpacing: -8,
        }}
      >
        IF
      </div>
    ),
    {
      ...size,
    },
  );
}