"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useMediaQuery, useReducedMotion } from "@/lib/use-media-query";

const INTERACTIVE_SELECTOR = "a, button, [data-interactive]";

export function CursorGlow() {
  const reducedMotion = useReducedMotion();
  const finePointer = useMediaQuery("(pointer: fine)");
  const enabled = finePointer && !reducedMotion;

  const x = useMotionValue(-500);
  const y = useMotionValue(-500);
  const glowX = useSpring(x, { stiffness: 120, damping: 20, mass: 0.6 });
  const glowY = useSpring(y, { stiffness: 120, damping: 20, mass: 0.6 });
  const ringX = useSpring(x, { stiffness: 500, damping: 35, mass: 0.3 });
  const ringY = useSpring(y, { stiffness: 500, damping: 35, mass: 0.3 });

  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const handleMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
    };
    const handleOver = (event: PointerEvent) => {
      const target = event.target as Element | null;
      setHovering(Boolean(target?.closest?.(INTERACTIVE_SELECTOR)));
    };
    const handleLeave = () => setVisible(false);

    window.addEventListener("pointermove", handleMove, { passive: true });
    document.addEventListener("pointerover", handleOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", handleLeave);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      document.removeEventListener("pointerover", handleOver);
      document.documentElement.removeEventListener("pointerleave", handleLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 -z-10 h-[520px] w-[520px] rounded-full"
        style={{
          x: glowX,
          y: glowY,
          translateX: "-50%",
          translateY: "-50%",
          background: "radial-gradient(circle, rgba(87,217,255,0.10), rgba(87,217,255,0) 65%)",
        }}
        animate={{ opacity: visible ? (hovering ? 1 : 0.7) : 0, scale: hovering ? 1.25 : 1 }}
        transition={{ duration: 0.4 }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[60] h-7 w-7 rounded-full border border-signal/60"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          opacity: visible ? 1 : 0,
          scale: hovering ? 1.8 : 1,
          backgroundColor: hovering ? "rgba(87,217,255,0.12)" : "rgba(87,217,255,0)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      />
    </>
  );
}
