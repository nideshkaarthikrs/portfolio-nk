import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { flagshipProjects } from "@/lib/projects";
import { getCaseStudySource } from "@/lib/work";
import { StatusTag } from "@/components/status-tag";
import { mdxComponents } from "@/components/case-study/mdx-components";

export function generateStaticParams() {
  return flagshipProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = flagshipProjects.find((item) => item.slug === slug);
  const caseStudy = getCaseStudySource(slug);

  if (!project) return {};

  const title = caseStudy?.frontmatter.title ?? project.name;
  const description = caseStudy?.frontmatter.oneLiner ?? project.oneLiner;

  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { title, description },
  };
}

export default async function WorkCaseStudy({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = flagshipProjects.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  const caseStudy = getCaseStudySource(slug);
  const currentIndex = flagshipProjects.findIndex((item) => item.slug === slug);
  const nextProject = flagshipProjects[(currentIndex + 1) % flagshipProjects.length];

  if (!caseStudy) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-6 py-24">
        <StatusTag status={project.status} />
        <h1 className="font-display text-3xl text-bone">{project.name}</h1>
        <p className="max-w-[60ch] text-fog">{project.oneLiner}</p>
        <p className="text-sm text-fog">Full case study coming in a later build phase.</p>
        <Link href="/#work" className="text-sm text-signal hover:opacity-80">
          ← Back to work
        </Link>
      </div>
    );
  }

  const { frontmatter, content } = caseStudy;

  return (
    <article className="mx-auto max-w-3xl px-6 py-24">
      <header className="flex flex-col gap-4 border-b border-white/10 pb-10">
        <StatusTag status={frontmatter.status} />
        <h1 className="font-display text-4xl text-bone">{frontmatter.title}</h1>
        <p className="max-w-[65ch] text-lg text-fog">{frontmatter.oneLiner}</p>

        <dl className="mt-2 flex flex-wrap gap-x-10 gap-y-3 text-sm">
          <div>
            <dt className="text-fog">Role</dt>
            <dd className="text-bone">{frontmatter.role}</dd>
          </div>
          <div>
            <dt className="text-fog">Timeline</dt>
            <dd className="text-bone">{frontmatter.timeline}</dd>
          </div>
        </dl>

        <ul className="flex flex-wrap gap-2">
          {frontmatter.stack.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-white/15 px-3 py-1 font-mono text-xs text-fog"
            >
              {tech}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-5 text-sm">
          {frontmatter.links.github && (
            <Link href={frontmatter.links.github} className="text-signal hover:opacity-80">
              GitHub →
            </Link>
          )}
          {frontmatter.links.live && (
            <Link href={frontmatter.links.live} className="text-signal hover:opacity-80">
              Live →
            </Link>
          )}
          {frontmatter.links.video && (
            <Link href={frontmatter.links.video} className="text-signal hover:opacity-80">
              Video →
            </Link>
          )}
        </div>
      </header>

      <div className="pb-4">
        <MDXRemote source={content} components={mdxComponents} />
      </div>

      <div className="mt-16 flex flex-col gap-2 border-t border-white/10 pt-10">
        <p className="text-sm text-fog">Next project</p>
        <Link
          href={`/work/${nextProject.slug}`}
          className="font-display text-2xl text-bone hover:text-signal"
        >
          {nextProject.name} →
        </Link>
      </div>
    </article>
  );
}
