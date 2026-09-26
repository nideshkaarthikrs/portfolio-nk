"use client";

import { useRef, type RefObject } from "react";
import { useLenis } from "lenis/react";

/**
 * Tracks how far the hero section has scrolled past the top of the
 * viewport, as a 0–1 progress value, without triggering React re-renders
 * (consumed inside an R3F useFrame loop and direct DOM style writes).
 */
export function useHeroDealProgress(
  sectionRef: RefObject<HTMLElement | null>,
  onChange?: (progress: number) => void,
) {
  const progressRef = useRef(0);

  useLenis(() => {
    const el = sectionRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const raw = -rect.top / rect.height;
    const progress = Math.min(1, Math.max(0, raw));

    progressRef.current = progress;
    onChange?.(progress);
  });

  return progressRef;
}
