"use client";

import type { ReactNode } from "react";
import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "@/lib/use-media-query";

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();

  return (
    <ReactLenis
      root
      options={{
        lerp: reducedMotion ? 1 : 0.1,
        smoothWheel: !reducedMotion,
        syncTouch: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
