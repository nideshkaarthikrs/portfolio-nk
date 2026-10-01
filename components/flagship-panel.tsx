"use client";

import Image from "next/image";
import Link from "next/link";
import { CsnVisual } from "@/components/csn-visual";
import { InteractiveCard } from "@/components/interactive-card";
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

  return (
    <InteractiveCard maxTilt={2.5} className="rounded-lg">
      <Link
        ref={ref}
        id={`work-${project.slug}`}
        href={`/work/${project.slug}`}
        style={{ transitionDelay: revealed ? `${index * 100}ms` : "0ms" }}
        className={`group relative grid scroll-mt-24 gap-8 rounded-lg border border-white/5 p-6 transition-all duration-700 ease-out lg:grid-cols-2 lg:items-center lg:gap-12 ${
          revealed ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <div className={`relative flex flex-col gap-4 ${reversed ? "lg:order-2" : ""}`}>
          <span className="font-mono text-xs tracking-[0.2em] text-fog/70">
            {String(index + 1).padStart(2, "0")} — FLAGSHIP
          </span>
          <StatusTag status={project.status} />
          <h3 className="font-display text-2xl text-bone transition-colors group-hover:text-signal">
            {project.name}
          </h3>
          <p className="max-w-[60ch] text-fog">{project.oneLiner}</p>
          <span className="text-sm text-signal opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
            View project →
          </span>
        </div>
        {project.visual === "csn-network" ? (
          <CsnVisual
            className={`relative aspect-video w-full ${reversed ? "lg:order-1" : ""}`}
          />
        ) : project.image ? (
          <div
            className={`relative aspect-video w-full overflow-hidden rounded-lg border border-white/10 ${
              reversed ? "lg:order-1" : ""
            }`}
          >
            <Image
              src={project.image}
              alt={`${project.name} screenshot`}
              fill
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover object-top"
            />
          </div>
        ) : (
          <PlaceholderVisual
            label={`${project.name} — visual coming soon`}
            className={`relative aspect-video w-full ${reversed ? "lg:order-1" : ""}`}
          />
        )}
      </Link>
    </InteractiveCard>
  );
}
