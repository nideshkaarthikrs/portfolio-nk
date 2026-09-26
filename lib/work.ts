import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { ProjectStatus } from "@/lib/projects";

export interface CaseStudyLinks {
  github?: string;
  live?: string;
  video?: string;
}

export interface CaseStudyFrontmatter {
  title: string;
  oneLiner: string;
  status: ProjectStatus;
  role: string;
  timeline: string;
  stack: string[];
  links: CaseStudyLinks;
}

export interface CaseStudySource {
  frontmatter: CaseStudyFrontmatter;
  content: string;
}

const WORK_DIR = path.join(process.cwd(), "content", "work");

export function getCaseStudySlugs(): string[] {
  if (!fs.existsSync(WORK_DIR)) return [];
  return fs
    .readdirSync(WORK_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getCaseStudySource(slug: string): CaseStudySource | null {
  const filePath = path.join(WORK_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { content, data } = matter(raw);

  return { content, frontmatter: data as CaseStudyFrontmatter };
}
