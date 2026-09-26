"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function randomPointsInVolume(count: number) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const radius = 2.6 + Math.random() * 2.1;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.55;
    positions[i * 3 + 2] = radius * Math.cos(phi) * 0.5 - 0.8;
  }
  return positions;
}

function ParticleLayer({
  count,
  color,
  size,
  speed,
  opacity,
}: {
  count: number;
  color: string;
  size: number;
  speed: number;
  opacity: number;
}) {
  const positions = useMemo(() => randomPointsInVolume(count), [count]);
  const ref = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * speed;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={color}
        size={size}
        sizeAttenuation
        depthWrite={false}
        opacity={opacity}
      />
    </Points>
  );
}

export function ParticleField({ density = 1 }: { density?: number }) {
  return (
    <>
      <ParticleLayer
        count={Math.round(90 * density)}
        color="#c8a45e"
        size={0.05}
        speed={0.025}
        opacity={0.55}
      />
      <ParticleLayer
        count={Math.round(60 * density)}
        color="#c98a52"
        size={0.032}
        speed={-0.018}
        opacity={0.5}
      />
      <ParticleLayer
        count={Math.round(50 * density)}
        color="#f2e9dd"
        size={0.022}
        speed={0.014}
        opacity={0.4}
      />
    </>
  );
}
