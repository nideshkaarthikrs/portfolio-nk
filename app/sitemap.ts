import type { MetadataRoute } from "next";
import { flagshipProjects } from "@/lib/projects";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const workPages = flagshipProjects.map((project) => ({
    url: `${SITE_URL}/work/${project.slug}`,
    lastModified: new Date(),
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
    },
    ...workPages,
  ];
}
