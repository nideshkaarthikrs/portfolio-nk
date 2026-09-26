import Link from "next/link";
import { socialLinks } from "@/lib/projects";

export function Footer() {
  return (
    <footer className="border-t border-white/5">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 text-sm text-fog sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Nidesh Kaarthik.</p>
        <div className="flex gap-5">
          <Link href={socialLinks.linkedin} className="hover:text-bone">
            LinkedIn
          </Link>
          <Link href={socialLinks.github} className="hover:text-bone">
            GitHub
          </Link>
          <Link href={socialLinks.instagram} className="hover:text-bone">
            Instagram
          </Link>
          <Link href={socialLinks.email} className="hover:text-bone">
            Email
          </Link>
        </div>
      </div>
    </footer>
  );
}
