import Link from "next/link";
import { MagneticButton } from "@/components/magnetic-button";
import { socialLinks } from "@/lib/projects";

export function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 py-32 text-center">
      <h2 className="font-display text-4xl text-bone">Let&apos;s build something.</h2>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <MagneticButton
          href={socialLinks.bookACall}
          className="inline-block rounded bg-signal px-6 py-3 text-sm font-medium text-midnight transition-opacity hover:opacity-90"
        >
          Book a call
        </MagneticButton>
        <Link
          href={socialLinks.email}
          className="rounded border border-white/15 px-6 py-3 text-sm font-medium text-bone transition-colors hover:border-signal hover:text-signal"
        >
          Email
        </Link>
      </div>
      <div className="mt-8 flex justify-center gap-6 text-sm text-fog">
        <Link href={socialLinks.linkedin} className="hover:text-bone">
          LinkedIn
        </Link>
        <Link href={socialLinks.instagram} className="hover:text-bone">
          Instagram
        </Link>
        <Link href={socialLinks.github} className="hover:text-bone">
          GitHub
        </Link>
      </div>
    </section>
  );
}
