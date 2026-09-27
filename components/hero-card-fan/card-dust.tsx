"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { sampleCardFace, type CardDustData, type CardFaceSpec } from "@/lib/card-face-sampler";

const vertexShader = /* glsl */ `
  uniform float uDissolve;
  uniform float uSide;
  uniform float uPointSize;
  uniform float uViewportHeight;
  attribute vec3 aColor;
  attribute vec3 aRandom;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    // Sweep from the card's exposed outer edge inward (top-down for the centre card).
    float edge = uSide > 0.5 ? (0.75 - position.x) / 1.5
               : uSide < -0.5 ? (position.x + 0.75) / 1.5
               : (1.05 - position.y) / 2.1;
    float delay = edge * 0.42 + aRandom.x * 0.2;
    float local = smoothstep(delay, delay + 0.36, uDissolve);
    float travel = pow(local, 1.6);

    float sideDir = abs(uSide) > 0.5 ? uSide : (aRandom.y - 0.5) * 2.0;
    vec3 drift = vec3(
      sideDir * (0.6 + aRandom.y * 1.4) + (aRandom.z - 0.5) * 0.8,
      0.9 + aRandom.z * 1.8,
      0.1 + aRandom.x * 0.5
    );
    float phase = aRandom.x * 40.0;
    vec3 swirl = vec3(
      sin(local * 6.0 + phase),
      cos(local * 5.0 + phase * 1.3),
      sin(local * 4.0 + phase * 0.7)
    ) * 0.22 * local;

    vec3 moved = position + drift * travel * 1.6 + swirl;
    vec4 mvPosition = modelViewMatrix * vec4(moved, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float worldToPx = projectionMatrix[1][1] * 0.5 * uViewportHeight / -mvPosition.z;
    gl_PointSize = max(1.0, uPointSize * worldToPx * (1.0 - local * 0.45));

    // Loose particles pick up a cyan glint as they leave.
    vColor = mix(aColor, vec3(0.34, 0.85, 1.0), local * 0.45);
    vAlpha = 1.0 - smoothstep(0.55, 1.0, local);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uAppear;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float soft = 1.0 - smoothstep(0.25, 0.5, d);
    gl_FragColor = vec4(vColor, soft * vAlpha * uAppear);
  }
`;

// Scroll window (in deal progress) over which cards disintegrate into dust.
// `order` 0 is the outermost card; each step in toward the portrait waits STAGGER longer.
const DISSOLVE_START = 0.12;
// On phones the fan sits below the hero copy, so it's only centred on screen later in the scroll.
export const DISSOLVE_START_MOBILE = 0.3;
const DISSOLVE_SPAN = 0.35;
const DISSOLVE_STAGGER = 0.05;

export function dissolveTarget(dealProgress: number, order: number, start = DISSOLVE_START) {
  return THREE.MathUtils.clamp(
    (dealProgress - start - order * DISSOLVE_STAGGER) / DISSOLVE_SPAN,
    0,
    1,
  );
}

/** How opaque the solid card is at a given dissolve value; the dust fades in as it fades out. */
export function solidOpacity(dissolve: number) {
  return 1 - THREE.MathUtils.smoothstep(dissolve, 0, 0.18);
}

interface CardDustProps extends CardFaceSpec {
  dissolveRef: RefObject<number>;
  z: number;
}

export function CardDust({ dissolveRef, z, ...spec }: CardDustProps) {
  const { kind, label, index, side, density } = spec;
  const [data, setData] = useState<CardDustData | null>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const size = useThree((state) => state.size);
  const dpr = useThree((state) => state.viewport.dpr);

  useEffect(() => {
    let cancelled = false;
    sampleCardFace({ kind, label, index, side, density })
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch(() => {
        // No dust: the solid card simply fades out, as before.
      });
    return () => {
      cancelled = true;
    };
  }, [kind, label, index, side, density]);

  const geometry = useMemo(() => {
    if (!data) return null;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(data.positions, 3));
    geo.setAttribute("aColor", new THREE.BufferAttribute(data.colors, 3));
    geo.setAttribute("aRandom", new THREE.BufferAttribute(data.randoms, 3));
    return geo;
  }, [data]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uDissolve: { value: 0 },
          uAppear: { value: 0 },
          uSide: { value: side },
          uPointSize: { value: 0.02 },
          uViewportHeight: { value: 1 },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [side],
  );

  useEffect(() => () => geometry?.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);

  useFrame(() => {
    const points = pointsRef.current;
    if (!points || !data) return;
    const dissolve = dissolveRef.current ?? 0;
    const appear = THREE.MathUtils.smoothstep(dissolve, 0, 0.12);
    // Nothing to draw while the card is whole.
    points.visible = appear > 0.001 && dissolve < 0.999;
    if (!points.visible) return;
    const { uniforms } = points.material as THREE.ShaderMaterial;
    uniforms.uDissolve.value = dissolve;
    uniforms.uAppear.value = appear;
    uniforms.uPointSize.value = data.spacing * 1.5;
    uniforms.uViewportHeight.value = size.height * dpr;
  });

  if (!geometry) return null;
  return (
    <points
      ref={pointsRef}
      geometry={geometry}
      material={material}
      position={[0, 0, z]}
      visible={false}
      frustumCulled={false}
      raycast={() => null}
    />
  );
}
