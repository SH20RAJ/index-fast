import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 36,
          background: "linear-gradient(140deg, #0b1020 0%, #2e4aa5 65%, #78a6ff 100%)",
          color: "#ffffff",
          fontSize: 74,
          fontWeight: 800,
          letterSpacing: -2,
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