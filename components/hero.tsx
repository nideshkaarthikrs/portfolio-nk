"use client";

import { useRef } from "react";
import Link from "next/link";
import { HeroCardFan } from "@/components/hero-card-fan/hero-card-fan";
import { MagneticButton } from "@/components/magnetic-button";
import { socialLinks } from "@/lib/projects";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      className="mx-auto grid max-w-6xl gap-12 px-6 pt-16 pb-24 sm:pt-24 sm:pb-32 lg:grid-cols-2 lg:items-center"
    >
      <div className="flex flex-col gap-6">
        <p className="text-fog">Nidesh Kaarthik</p>
        <h1 className="font-display text-5xl leading-[1.05] text-bone sm:text-6xl">
          Founder who builds.
        </h1>
        <p className="max-w-[60ch] text-lg text-fog">
          I design and ship AI products end to end, from agent architecture to the pitch deck.
          Currently building CSN and AgentNegotiate.
        </p>
        <div className="flex flex-wrap items-center gap-4 pt-2">
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
            Email me
          </Link>
        </div>
        <div className="flex gap-5 pt-4 text-sm text-fog">
          <Link href={socialLinks.linkedin} className="hover:text-bone">
            LinkedIn
          </Link>
          <Link href={socialLinks.github} className="hover:text-bone">
            GitHub
          </Link>
          <Link href={socialLinks.instagram} className="hover:text-bone">
            Instagram
          </Link>
        </div>
      </div>
      <HeroCardFan sectionRef={sectionRef} />
    </section>
  );
}
