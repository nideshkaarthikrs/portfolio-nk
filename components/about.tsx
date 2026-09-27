import { ScrambleHeading } from "@/components/scramble-heading";
import Image from "next/image";

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:items-start">
        <div className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-lg border border-white/10">
          <Image
            src="/images/about-candid.jpg"
            alt="Nidesh Kaarthik outdoors, looking off to the side"
            fill
            sizes="(min-width: 1024px) 384px, 100vw"
            className="object-cover"
            priority
          />
        </div>
        <div className="flex flex-col gap-5">
          <ScrambleHeading index="05" text="About" />
          <p className="max-w-[68ch] text-fog">
            I grew up in Madurai and started writing code because I wanted to make things other
            people could actually use, not just solve problems on paper. That pull toward
            shipping real products is still what drives me.
          </p>
          <p className="max-w-[68ch] text-fog">
            I&apos;m currently studying computer science at Scaler School of Technology in
            Bangalore, focused on AI/ML. Outside of coursework, I spend most of my time building
            — agent systems, developer tools, and the occasional business idea that refuses to
            leave me alone.
          </p>
          <p className="max-w-[68ch] text-fog">
            Right now that means CSN and AgentNegotiate: one gives creators a fair, automated way
            to split revenue on collaborative work, the other lets AI agents handle the tedious
            parts of B2B purchasing safely. Both are still early, both are real.
          </p>
          <p className="max-w-[68ch] text-fog">
            The goal is simple: build a company while I&apos;m still in college, not after.
          </p>
        </div>
      </div>
    </section>
  );
}
