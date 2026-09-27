import Link from "next/link";
import { MagneticButton } from "@/components/magnetic-button";
import { OrbitStage } from "@/components/orbit-ring";
import { ScrambleHeading } from "@/components/scramble-heading";
import { socialLinks } from "@/lib/projects";

export function Contact() {
  return (
    <section id="contact" className="overflow-x-clip">
      <div className="mx-auto max-w-6xl px-6 py-40 text-center">
        <OrbitStage>
          <ScrambleHeading
            index="07"
            text="Let's build something."
            align="center"
            className="font-display text-4xl text-bone sm:text-5xl"
          />
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <MagneticButton
              href={socialLinks.bookACall}
              className="cta-shine inline-block rounded bg-signal px-6 py-3 text-sm font-medium text-midnight transition-opacity hover:opacity-90"
            >
              Book a call
            </MagneticButton>
            <Link
              href={socialLinks.email}
              className="rounded border border-white/15 bg-midnight/60 px-6 py-3 text-sm font-medium text-bone transition-colors hover:border-signal hover:text-signal"
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
        </OrbitStage>
      </div>
    </section>
  );
}
