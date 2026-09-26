import { flagshipProjects } from "@/lib/projects";

export interface FanCard {
  key: string;
  kind: "project" | "photo";
  label: string;
  scrollTargetId: string;
}

const [first, ...rest] = flagshipProjects;

export const fanCards: FanCard[] = [
  {
    key: first.slug,
    kind: "project",
    label: first.name,
    scrollTargetId: `work-${first.slug}`,
  },
  {
    key: "photo",
    kind: "photo",
    label: "Nidesh Kaarthik",
    scrollTargetId: "about",
  },
  ...rest.map((project) => ({
    key: project.slug,
    kind: "project" as const,
    label: project.name,
    scrollTargetId: `work-${project.slug}`,
  })),
];
