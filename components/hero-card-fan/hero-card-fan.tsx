"use client";

import { useCallback, useMemo, useRef, useState, type RefObject } from "react";
import dynamic from "next/dynamic";
import { useMediaQuery, useReducedMotion } from "@/lib/use-media-query";
import { useHeroDealProgress } from "@/lib/use-hero-deal-progress";
import { scrollToTarget } from "@/lib/scroll-to-target";
import { PlaceholderVisual } from "@/components/placeholder-visual";
import { StaticFan } from "@/components/hero-card-fan/static-fan";
import { CanvasErrorBoundary } from "@/components/hero-card-fan/canvas-error-boundary";
import { fanCards } from "@/components/hero-card-fan/fan-cards";

const FanScene = dynamic(
  () => import("@/components/hero-card-fan/scene").then((mod) => mod.FanScene),
  {
    ssr: false,
    loading: () => <PlaceholderVisual label="Loading card fan…" className="h-full w-full" />,
  },
);

const FADE_START = 0.45;
const FADE_END = 0.9;

export function HeroCardFan({
  sectionRef,
}: {
  sectionRef: RefObject<HTMLElement | null>;
}) {
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 639px)");
  const cards = useMemo(() => (isMobile ? fanCards.slice(0, 3) : fanCards), [isMobile]);

  const [use3dFallback, setUse3dFallback] = useState(false);
  const handle3dFailure = useCallback(() => setUse3dFallback(true), []);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const handleProgressChange = useCallback((progress: number) => {
    if (!wrapperRef.current) return;
    const fadeT = Math.min(1, Math.max(0, (progress - FADE_START) / (FADE_END - FADE_START)));
    wrapperRef.current.style.opacity = String(1 - fadeT);
  }, []);
  const dealProgressRef = useHeroDealProgress(sectionRef, handleProgressChange);

  return (
    <div ref={wrapperRef} className="relative aspect-square w-full">
      {reducedMotion || use3dFallback ? (
        <StaticFan />
      ) : (
        <>
          <CanvasErrorBoundary fallback={<StaticFan />} onError={handle3dFailure}>
            <FanScene
              cards={cards}
              enableTilt={!isMobile}
              onContextLost={handle3dFailure}
              dealProgressRef={dealProgressRef}
            />
          </CanvasErrorBoundary>
          {/* The card fan is a WebGL canvas, not real DOM elements — this
              nav gives keyboard users the same navigation mouse users get
              from clicking a card. Each link is invisible until focused. */}
          <nav aria-label="Featured projects" className="absolute left-2 top-2 z-20">
            <ul className="flex flex-wrap gap-2">
              {cards.map((card) => (
                <li key={card.key}>
                  <a
                    href={`#${card.scrollTargetId}`}
                    onClick={(event) => {
                      event.preventDefault();
                      scrollToTarget(card.scrollTargetId);
                    }}
                    className="sr-only rounded bg-deep px-3 py-2 text-sm text-bone focus:not-sr-only focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal"
                  >
                    {card.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </>
      )}
    </div>
  );
}
