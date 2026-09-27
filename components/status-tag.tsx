import { ProjectStatus, statusLabel } from "@/lib/projects";

const colorClass: Record<ProjectStatus, string> = {
  live: "text-status-live",
  prototype: "text-status-live",
  "in-development": "text-status-dev",
  concept: "text-status-concept",
};

export function StatusTag({ status }: { status: ProjectStatus }) {
  return (
    <span className={`text-sm ${colorClass[status]}`}>{statusLabel[status]}</span>
  );
}
