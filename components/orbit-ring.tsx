"use client";

import { useEffect, useRef, type PointerEvent, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/use-media-query";

const CYAN = "87,217,255";
const SIZE = 640;
const RINGS = [
  { rx: 300, tilt: 0.32, count: 22, speed: 0.00012 },
  { rx: 230, tilt: 0.42, count: 16, speed: -0.00018 },
  { rx: 160, tilt: 0.28, count: 11, speed: 0.00026 },
];

export function OrbitStage({ children }: { children: ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boostRef = useRef(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let raf = 0;
    let angle = 0;
    let speedMultiplier = 1;
    let last = performance.now();
    let visible = true;

    const draw = () => {
      ctx.clearRect(0, 0, SIZE, SIZE);
      const cx = SIZE / 2;
      const cy = SIZE / 2;

      for (const ring of RINGS) {
        const ry = ring.rx * ring.tilt;
        ctx.beginPath();
        ctx.ellipse(cx, cy, ring.rx, ry, -0.2, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${CYAN},0.08)`;
        ctx.lineWidth = 1;
        ctx.stroke();

        for (let i = 0; i < ring.count; i++) {
          const a = (i / ring.count) * Math.PI * 2 + angle * ring.speed * 1000;
          const px = Math.cos(a) * ring.rx;
          const py = Math.sin(a) * ry;
          const rot = -0.2;
          const x = cx + px * Math.cos(rot) - py * Math.sin(rot);
          const y = cy + px * Math.sin(rot) + py * Math.cos(rot);
          const depth = (Math.sin(a) + 1) / 2;
          ctx.beginPath();
          ctx.arc(x, y, 0.8 + depth * 1.6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${CYAN},${(0.15 + depth * 0.7).toFixed(3)})`;
          ctx.fill();
        }
      }
    };

    if (reducedMotion) {
      draw();
      return;
    }

    const tick = (time: number) => {
      const dt = time - last;
      last = time;
      speedMultiplier += ((boostRef.current ? 5 : 1) - speedMultiplier) * 0.05;
      angle += dt * speedMultiplier;
      draw();
      if (visible) raf = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    });
    observer.observe(canvas);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [reducedMotion]);

  const handlePointerOver = (event: PointerEvent<HTMLDivElement>) => {
    boostRef.current = Boolean((event.target as Element).closest("a, button"));
  };

  return (
    <div
      className="relative"
      onPointerOver={handlePointerOver}
      onPointerLeave={() => {
        boostRef.current = false;
      }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[min(640px,100vw)] w-[min(640px,100vw)] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-80"
      />
      {children}
    </div>
  );
}
