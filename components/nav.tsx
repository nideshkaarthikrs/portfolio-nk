"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLenis } from "lenis/react";

const links = [
  { id: "work", label: "Work" },
  { id: "client-work", label: "Client work" },
  { id: "ventures", label: "Ventures" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export function Nav() {
  const progressRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState<string | null>(null);

  useLenis(({ progress }) => {
    if (progressRef.current) {
      progressRef.current.style.transform = `scaleX(${Number.isFinite(progress) ? progress : 0})`;
    }
  });

  useEffect(() => {
    const sections = links
      .map((link) => document.getElementById(link.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="sticky top-4 z-50 px-4">
      <nav className="glass-panel relative mx-auto flex max-w-5xl items-center justify-between overflow-hidden rounded-lg border border-white/10 px-6 py-3 shadow-lg shadow-black/30">
        <Link href="/" className="flex items-center gap-2 font-display text-lg text-bone">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-signal shadow-[0_0_8px_#57d9ff]" />
          Nidesh Kaarthik
        </Link>
        <ul className="hidden items-center gap-6 text-sm text-fog sm:flex">
          {links.map((link) => {
            const isActive = active === link.id;
            return (
              <li key={link.id}>
                <Link
                  href={`/#${link.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative transition-colors hover:text-bone ${isActive ? "text-bone" : ""}`}
                >
                  {link.label}
                  <span
                    aria-hidden
                    className={`absolute -bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-signal transition-opacity duration-300 ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
        <span
          ref={progressRef}
          aria-hidden
          className="absolute bottom-0 left-0 h-px w-full origin-left bg-gradient-to-r from-signal/40 via-signal to-signal"
          style={{ transform: "scaleX(0)" }}
        />
      </nav>
    </header>
  );
}
