import { ImageResponse } from "next/og";
import { flagshipProjects } from "@/lib/projects";
import { getCaseStudySource } from "@/lib/work";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return flagshipProjects.map((project) => ({ slug: project.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = flagshipProjects.find((item) => item.slug === slug);
  const caseStudy = getCaseStudySource(slug);

  const title = caseStudy?.frontmatter.title ?? project?.name ?? "Nidesh Kaarthik";
  const oneLiner = caseStudy?.frontmatter.oneLiner ?? project?.oneLiner ?? "";

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
            "radial-gradient(120% 100% at 20% 0%, #0a0a0a 0%, #000000 55%, #000000 100%)",
        }}
      >
        <div style={{ display: "flex", color: "#9a9a9a", fontSize: 28 }}>Nidesh Kaarthik</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 72,
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.05,
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: 30, color: "#bdbdbd", maxWidth: 900 }}>{oneLiner}</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
