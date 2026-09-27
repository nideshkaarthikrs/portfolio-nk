"use client";

import { useEffect, useState } from "react";
import { useInView } from "@/lib/use-in-view";
import { useReducedMotion } from "@/lib/use-media-query";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/";
const FRAME_MS = 32;
const DURATION_MS = 750;

function scrambleFrame(text: string, progress: number) {
  const revealed = Math.floor(text.length * progress);
  return text
    .split("")
    .map((char, i) => {
      if (i < revealed || char === " ") return char;
      return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    })
    .join("");
}

export function useScramble(text: string, active: boolean) {
  const reducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (!active || reducedMotion) return;
    const start = performance.now();
    const timer = setInterval(() => {
      const progress = Math.min(1, (performance.now() - start) / DURATION_MS);
      setDisplay(progress >= 1 ? text : scrambleFrame(text, progress));
      if (progress >= 1) clearInterval(timer);
    }, FRAME_MS);
    return () => clearInterval(timer);
  }, [active, reducedMotion, text]);

  return display;
}

export function ScrambleText({ text, className = "" }: { text: string; className?: string }) {
  const display = useScramble(text, true);
  return (
    <span aria-label={text} className={`relative inline-block ${className}`}>
      <span aria-hidden className="invisible">
        {text}
      </span>
      <span aria-hidden className="absolute inset-0 whitespace-nowrap">
        {display}
      </span>
    </span>
  );
}

export function ScrambleHeading({
  text,
  index,
  className = "font-display text-3xl text-bone",
  align = "left",
}: {
  text: string;
  index: string;
  className?: string;
  align?: "left" | "center";
}) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.6 });
  const display = useScramble(text, inView);

  return (
    <div
      ref={ref}
      className={`flex flex-col gap-3 ${align === "center" ? "items-center" : "items-start"}`}
    >
      <span className="flex items-center gap-3 font-mono text-xs tracking-[0.2em] text-signal">
        <span>{`// ${index}`}</span>
        <span
          aria-hidden
          className={`h-px bg-signal/50 transition-all duration-700 ease-out ${inView ? "w-16" : "w-0"}`}
        />
      </span>
      <h2 aria-label={text} className={`relative ${className}`}>
        <span aria-hidden className="invisible">
          {text}
        </span>
        <span aria-hidden className="absolute inset-0 whitespace-nowrap">
          {display}
        </span>
      </h2>
    </div>
  );
}
