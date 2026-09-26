import { ImageResponse } from "next/og";
import { SITE_DESCRIPTION } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Nidesh Kaarthik — Founder who builds";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "radial-gradient(120% 100% at 20% 0%, #241a11 0%, #17120e 55%, #100b08 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            color: "#a6957f",
            fontSize: 28,
          }}
        >
          Nidesh Kaarthik
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 88,
              fontWeight: 700,
              color: "#f2e9dd",
              lineHeight: 1.05,
            }}
          >
            Founder who builds.
          </div>
          <div style={{ fontSize: 30, color: "#c7b7a4", maxWidth: 900 }}>{SITE_DESCRIPTION}</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
