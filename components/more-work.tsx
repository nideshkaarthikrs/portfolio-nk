import Link from "next/link";
import { moreWorkProjects } from "@/lib/projects";

export function MoreWork() {
  return (
    <section id="more-work" className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="font-display text-3xl text-bone">More work</h2>
      <ul className="mt-10 flex flex-col divide-y divide-white/5 border-t border-b border-white/5">
        {moreWorkProjects.map((project) => (
          <li key={project.slug} className="group">
            <Link
              href={project.githubUrl}
              className="flex flex-col gap-2 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
            >
              <div className="flex flex-col gap-1 sm:max-w-xl">
                <span className="font-display text-lg text-bone group-hover:text-signal">
                  {project.name}
                </span>
                <span className="max-w-[60ch] text-sm text-fog">{project.oneLiner}</span>
              </div>
              <span className="text-sm text-signal opacity-70 group-hover:opacity-100">
                GitHub →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
