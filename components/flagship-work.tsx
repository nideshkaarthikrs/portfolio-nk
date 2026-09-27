import { ScrambleHeading } from "@/components/scramble-heading";
import { FlagshipPanel } from "@/components/flagship-panel";
import { flagshipProjects } from "@/lib/projects";

export function FlagshipWork() {
  return (
    <section id="work" className="mx-auto max-w-6xl px-6 py-24">
      <ScrambleHeading index="01" text="Work" />
      <div className="mt-12 flex flex-col gap-20">
        {flagshipProjects.map((project, index) => (
          <FlagshipPanel
            key={project.slug}
            project={project}
            index={index}
            reversed={index % 2 === 1}
          />
        ))}
      </div>
    </section>
  );
}
