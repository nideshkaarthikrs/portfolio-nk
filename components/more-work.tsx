import Link from "next/link";
import { ScrambleHeading } from "@/components/scramble-heading";
import { moreWorkProjects } from "@/lib/projects";

function RowLink({
  href,
  className,
  children,
}: {
  href?: string;
  className: string;
  children: React.ReactNode;
}) {
  return href ? (
    <Link href={href} className={className}>
      {children}
    </Link>
  ) : (
    <div className={className}>{children}</div>
  );
}

export function MoreWork() {
  return (
    <section id="more-work" className="mx-auto max-w-6xl px-6 py-24">
      <ScrambleHeading index="02" text="More work" />
      <ul className="mt-10 flex flex-col divide-y divide-white/5 border-t border-b border-white/5">
        {moreWorkProjects.map((project, index) => (
          <li key={project.slug} className="group relative">
            <RowLink
              href={project.githubUrl}
              className="relative flex flex-col gap-2 py-6 transition-[padding] duration-300 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:group-hover:pl-3"
            >
              <div className="flex items-start gap-5 sm:max-w-2xl">
                <span className="pt-1 font-mono text-xs text-fog/50 transition-colors group-hover:text-signal">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-col gap-1">
                  <span className="font-display text-lg text-bone transition-colors group-hover:text-signal">
                    {project.name}
                  </span>
                  <span className="max-w-[60ch] text-sm text-fog">{project.oneLiner}</span>
                </div>
              </div>
              {project.githubUrl && (
                <span className="text-sm text-signal opacity-70 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                  GitHub →
                </span>
              )}
            </RowLink>
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-signal via-signal/60 to-transparent transition-transform duration-500 ease-out group-hover:scale-x-100"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
