"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { HeroCardFan } from "@/components/hero-card-fan/hero-card-fan";
import { MagneticButton } from "@/components/magnetic-button";
import { ScrambleText } from "@/components/scramble-heading";
import { useReducedMotion } from "@/lib/use-media-query";
import { socialLinks } from "@/lib/projects";

const EASE = [0.22, 1, 0.36, 1] as const;
const HEADLINE = [
  { word: "Founder", accent: false },
  { word: "who", accent: false },
  { word: "builds.", accent: true },
];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const rise = (delay: number) =>
    reducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: 0.8, ease: EASE },
        };

  return (
    <section
      ref={sectionRef}
      className="mx-auto grid max-w-6xl gap-12 px-6 pt-16 pb-24 sm:pt-24 sm:pb-32 lg:grid-cols-2 lg:items-center"
    >
      <div className="flex flex-col gap-6">
        <p className="font-mono text-xs tracking-[0.25em] text-signal">
          <ScrambleText text="NIDESH KAARTHIK" />
        </p>
        <h1
          aria-label="Founder who builds."
          className="font-display text-5xl leading-[1.05] text-bone sm:text-6xl"
        >
          {HEADLINE.map(({ word, accent }, i) => (
            <motion.span
              key={word}
              aria-hidden
              className={`mr-[0.25em] inline-block ${accent ? "text-signal" : ""}`}
              {...(reducedMotion
                ? {}
                : {
                    initial: { opacity: 0, y: 28, filter: "blur(10px)" },
                    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
                    transition: { delay: 0.3 + i * 0.14, duration: 0.9, ease: EASE },
                  })}
            >
              {word}
            </motion.span>
          ))}
        </h1>
        <motion.p className="max-w-[60ch] text-lg text-fog" {...rise(0.8)}>
          I design and ship AI products end to end, from agent architecture to the pitch deck.
          Currently building CSN and Flavoland.
        </motion.p>
        <motion.div className="flex flex-wrap items-center gap-4 pt-2" {...rise(0.95)}>
          <MagneticButton
            href={socialLinks.bookACall}
            className="cta-shine inline-block rounded bg-signal px-6 py-3 text-sm font-medium text-midnight transition-opacity hover:opacity-90"
          >
            Book a call
          </MagneticButton>
          <Link
            href={socialLinks.email}
            className="rounded border border-white/15 px-6 py-3 text-sm font-medium text-bone transition-colors hover:border-signal hover:text-signal"
          >
            Email me
          </Link>
        </motion.div>
        <motion.div className="flex gap-5 pt-4 text-sm text-fog" {...rise(1.1)}>
          <Link href={socialLinks.linkedin} className="hover:text-bone">
            LinkedIn
          </Link>
          <Link href={socialLinks.github} className="hover:text-bone">
            GitHub
          </Link>
          <Link href={socialLinks.instagram} className="hover:text-bone">
            Instagram
          </Link>
        </motion.div>
      </div>
      <HeroCardFan sectionRef={sectionRef} />
    </section>
  );
}
