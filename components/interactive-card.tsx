"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useMediaQuery, useReducedMotion } from "@/lib/use-media-query";

const BORDER_MASK = {
  WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  WebkitMaskComposite: "xor",
  maskComposite: "exclude",
} as const;

export function InteractiveCard({
  children,
  className = "",
  maxTilt = 6,
}: {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
}) {
  const reducedMotion = useReducedMotion();
  const finePointer = useMediaQuery("(pointer: fine)");
  const ref = useRef<HTMLDivElement>(null);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 180, damping: 18 });
  const springY = useSpring(rotateY, { stiffness: 180, damping: 18 });

  // Always render the same element: swapping element types after hydration
  // would remount children and orphan any refs/observers they hold.
  const enabled = !reducedMotion && finePointer;

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!enabled || !el) return;
    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
    rotateY.set((px - 0.5) * 2 * maxTilt);
    rotateX.set(-(py - 0.5) * 2 * maxTilt);
  };

  const handlePointerLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ rotateX: springX, rotateY: springY, transformPerspective: 1000 }}
      className={`group/card relative ${className}`}
    >
      {enabled && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
          style={{
            background:
              "radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(87,217,255,0.10), transparent 65%)",
          }}
        />
      )}
      {enabled && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] p-px opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
          style={{
            background:
              "radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), rgba(87,217,255,0.9), transparent 60%)",
            ...BORDER_MASK,
          }}
        />
      )}
      {children}
    </motion.div>
  );
}
