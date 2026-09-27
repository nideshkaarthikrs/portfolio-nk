"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/use-media-query";

const CYAN = "87,217,255";
const WHITE = "255,255,255";
const LINK_DISTANCE = 130;
const CURSOR_RADIUS = 170;
const WARP_MS = 900;
const WARP_KEY = "nk-warp-played";

interface Star {
  x: number;
  y: number;
  r: number;
  phase: number;
  depth: number;
}

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  phase: number;
}

interface Shockwave {
  x: number;
  y: number;
  r: number;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

function shouldPlayWarp() {
  try {
    if (sessionStorage.getItem(WARP_KEY)) return false;
    sessionStorage.setItem(WARP_KEY, "1");
    return true;
  } catch {
    return false;
  }
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export function AmbientStarfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let width = 0;
    let height = 0;
    let far: Star[] = [];
    let near: Star[] = [];
    let nodes: Node[] = [];
    const shockwaves: Shockwave[] = [];
    const shooting: ShootingStar[] = [];
    const pointer = { x: -9999, y: -9999, active: false };

    let raf = 0;
    let running = true;
    let lastScroll = window.scrollY;
    let nextShootingAt = performance.now() + 4000;
    let warpStart = shouldPlayWarp() ? performance.now() : -Infinity;

    const wrap = (v: number, max: number) => ((v % max) + max) % max;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const mobile = width < 768;
      far = Array.from({ length: mobile ? 90 : 200 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 0.8 + 0.2,
        phase: Math.random() * Math.PI * 2,
        depth: 0.04 + Math.random() * 0.04,
      }));
      near = Array.from({ length: mobile ? 6 : 14 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.1 + 1,
        phase: Math.random() * Math.PI * 2,
        depth: 0.35 + Math.random() * 0.15,
      }));
      nodes = Array.from({ length: mobile ? 32 : 70 }, () => {
        const vx = (Math.random() - 0.5) * 0.12;
        const vy = (Math.random() - 0.5) * 0.08;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx,
          vy,
          baseVx: vx,
          baseVy: vy,
          phase: Math.random() * Math.PI * 2,
        };
      });
    };

    const spawnShootingStar = () => {
      const fromLeft = Math.random() < 0.5;
      const speed = 9 + Math.random() * 5;
      const angle = (Math.PI / 180) * (20 + Math.random() * 20);
      shooting.push({
        x: fromLeft ? Math.random() * width * 0.5 : width * 0.5 + Math.random() * width * 0.5,
        y: Math.random() * height * 0.35,
        vx: (fromLeft ? 1 : -1) * Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
      });
    };

    const drawWarp = (t: number) => {
      const e = easeOutCubic(t);
      const cx = width / 2;
      const cy = height / 2;
      ctx.lineCap = "round";
      for (const s of [...far, ...near]) {
        const k1 = 0.05 + 0.95 * e;
        const k0 = k1 * 0.55;
        ctx.beginPath();
        ctx.moveTo(cx + (s.x - cx) * k0, cy + (s.y - cy) * k0);
        ctx.lineTo(cx + (s.x - cx) * k1, cy + (s.y - cy) * k1);
        ctx.strokeStyle = `rgba(${s.depth > 0.2 ? CYAN : WHITE},${(0.25 + 0.6 * (1 - t)).toFixed(3)})`;
        ctx.lineWidth = s.r;
        ctx.stroke();
      }
    };

    const tick = (time: number) => {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);

      const scrollY = window.scrollY;
      const dScroll = scrollY - lastScroll;
      lastScroll = scrollY;

      const warpT = (time - warpStart) / WARP_MS;
      if (warpT >= 0 && warpT < 1) {
        drawWarp(warpT);
        raf = requestAnimationFrame(tick);
        return;
      }
      const fadeIn = warpT >= 1 && warpT < 1.6 ? (warpT - 1) / 0.6 : 1;

      for (const s of far) {
        s.y = wrap(s.y - dScroll * s.depth, height);
        const twinkle = 0.5 + 0.5 * Math.sin(time * 0.0012 + s.phase);
        ctx.fillStyle = `rgba(${WHITE},${((0.15 + 0.5 * twinkle) * fadeIn).toFixed(3)})`;
        ctx.fillRect(s.x, s.y, s.r * 2, s.r * 2);
      }

      for (const n of nodes) {
        n.y = wrap(n.y - dScroll * 0.15, height);

        if (pointer.active) {
          const dx = pointer.x - n.x;
          const dy = pointer.y - n.y;
          const d = Math.hypot(dx, dy);
          if (d < CURSOR_RADIUS && d > 1) {
            n.vx += (dx / d) * 0.012;
            n.vy += (dy / d) * 0.012;
          }
        }

        n.vx += (n.baseVx - n.vx) * 0.02;
        n.vy += (n.baseVy - n.vy) * 0.02;
        n.x = wrap(n.x + n.vx, width);
        n.y = wrap(n.y + n.vy, height);
      }

      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const w = shockwaves[i];
        w.r += 7;
        const life = 1 - w.r / 320;
        if (life <= 0) {
          shockwaves.splice(i, 1);
          continue;
        }
        for (const n of nodes) {
          const dx = n.x - w.x;
          const dy = n.y - w.y;
          const d = Math.hypot(dx, dy);
          if (d > 1 && Math.abs(d - w.r) < 28) {
            n.vx += (dx / d) * 1.1 * life;
            n.vy += (dy / d) * 1.1 * life;
          }
        }
        ctx.beginPath();
        ctx.arc(w.x, w.y, w.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${CYAN},${(0.5 * life).toFixed(3)})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK_DISTANCE) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${CYAN},${(0.16 * (1 - d / LINK_DISTANCE) * fadeIn).toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      if (pointer.active) {
        for (const n of nodes) {
          const d = Math.hypot(pointer.x - n.x, pointer.y - n.y);
          if (d < CURSOR_RADIUS) {
            ctx.beginPath();
            ctx.moveTo(pointer.x, pointer.y);
            ctx.lineTo(n.x, n.y);
            ctx.strokeStyle = `rgba(${CYAN},${(0.4 * (1 - d / CURSOR_RADIUS)).toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        const twinkle = 0.5 + 0.5 * Math.sin(time * 0.0006 + n.phase);
        ctx.fillStyle = `rgba(${CYAN},${((0.35 + 0.45 * twinkle) * fadeIn).toFixed(3)})`;
        ctx.fillRect(n.x - 1, n.y - 1, 2, 2);
      }

      for (const s of near) {
        s.y = wrap(s.y - dScroll * s.depth, height);
        const twinkle = 0.6 + 0.4 * Math.sin(time * 0.0009 + s.phase);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${CYAN},${(0.06 * twinkle * fadeIn).toFixed(3)})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${WHITE},${(0.85 * twinkle * fadeIn).toFixed(3)})`;
        ctx.fill();
      }

      if (time > nextShootingAt) {
        spawnShootingStar();
        nextShootingAt = time + 6000 + Math.random() * 6000;
      }
      for (let i = shooting.length - 1; i >= 0; i--) {
        const s = shooting[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life -= 0.012;
        if (s.life <= 0 || s.x < -200 || s.x > width + 200 || s.y > height + 200) {
          shooting.splice(i, 1);
          continue;
        }
        const tailX = s.x - s.vx * 12;
        const tailY = s.y - s.vy * 12;
        const gradient = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        gradient.addColorStop(0, `rgba(${CYAN},0)`);
        gradient.addColorStop(1, `rgba(${WHITE},${(0.9 * s.life).toFixed(3)})`);
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.lineCap = "round";
        ctx.stroke();
      }

      raf = requestAnimationFrame(tick);
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = event.pointerType === "mouse";
    };
    const handlePointerLeave = () => {
      pointer.active = false;
    };
    const handlePointerDown = (event: PointerEvent) => {
      shockwaves.push({ x: event.clientX, y: event.clientY, r: 0 });
    };
    const handleVisibility = () => {
      running = document.visibilityState === "visible";
      cancelAnimationFrame(raf);
      if (running) {
        lastScroll = window.scrollY;
        warpStart = -Infinity;
        raf = requestAnimationFrame(tick);
      }
    };

    resize();
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    document.documentElement.addEventListener("pointerleave", handlePointerLeave);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      document.documentElement.removeEventListener("pointerleave", handlePointerLeave);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.06] [background-image:radial-gradient(rgba(87,217,255,0.6)_1px,transparent_1px)] [background-size:48px_48px]"
      />
    );
  }

  return (
    <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 -z-10" />
  );
}
