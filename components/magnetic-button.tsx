"use client";

import { useRef, type ReactNode } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useReducedMotion } from "@/lib/use-media-query";

const PULL_RADIUS = 80;
const PULL_STRENGTH = 0.35;

export function MagneticButton({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 200, damping: 15, mass: 0.3 });

  if (reducedMotion) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distance = Math.hypot(event.clientX - centerX, event.clientY - centerY);

    if (distance < PULL_RADIUS) {
      x.set((event.clientX - centerX) * PULL_STRENGTH);
      y.set((event.clientY - centerY) * PULL_STRENGTH);
    } else {
      x.set(0);
      y.set(0);
    }
  };

  const handlePointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      className={className}
      style={{ x: springX, y: springY }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {children}
    </motion.a>
  );
}
