"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import { PlaceholderVisual } from "@/components/placeholder-visual";
import { StatusTag } from "@/components/status-tag";
import { useInView } from "@/lib/use-in-view";
import { useReducedMotion } from "@/lib/use-media-query";
import { FlagshipProject } from "@/lib/projects";

export function FlagshipPanel({
  project,
  index,
  reversed,
}: {
  project: FlagshipProject;
  index: number;
  reversed: boolean;
}) {
  const reducedMotion = useReducedMotion();
  const { ref, inView } = useInView<HTMLAnchorElement>({ threshold: 0.25 });
  const revealed = reducedMotion || inView;

  const handleMouseMove = (event: MouseEvent<HTMLAnchorElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    event.currentTarget.style.setProperty("--spotlight-x", `${x}%`);
    event.currentTarget.style.setProperty("--spotlight-y", `${y}%`);
  };

  return (
    <Link
      ref={ref}
      id={`work-${project.slug}`}
      href={`/work/${project.slug}`}
      onMouseMove={handleMouseMove}
      style={{ transitionDelay: revealed ? `${index * 100}ms` : "0ms" }}
      className={`group relative grid scroll-mt-24 gap-8 overflow-hidden rounded-2xl transition-all duration-700 ease-out lg:grid-cols-2 lg:items-center lg:gap-12 ${
        revealed ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(400px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), rgba(201, 138, 82, 0.12), transparent 70%)",
        }}
      />
      <div className={`relative flex flex-col gap-4 ${reversed ? "lg:order-2" : ""}`}>
        <StatusTag status={project.status} />
        <h3 className="font-display text-2xl text-bone group-hover:text-signal">
          {project.name}
        </h3>
        <p className="max-w-[60ch] text-fog">{project.oneLiner}</p>
        <span className="text-sm text-signal opacity-0 transition-opacity group-hover:opacity-100">
          View project →
        </span>
      </div>
      <PlaceholderVisual
        label={`${project.name} — visual coming soon`}
        className={`relative aspect-video w-full ${reversed ? "lg:order-1" : ""}`}
      />
    </Link>
  );
}
